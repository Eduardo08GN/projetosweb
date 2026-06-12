"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifyMasters } from "@/lib/email";
import { emailInterno } from "@/lib/email-templates";
import {
  cancelAsaasSubscription,
  createAsaasSubscription,
  ensureAsaasCustomer,
  getInvoiceUrl,
} from "@/lib/asaas";

/**
 * Liga a cobranca recorrente do cliente: cria (ou acha) o cliente no
 * Asaas, cria a assinatura mensal com a mensalidade definida e devolve
 * o link da primeira fatura pra mandar pro cliente.
 * A primeira cobranca vence quando o periodo incluso termina.
 */
export async function criarAssinatura(
  tenantId: string
): Promise<{ error?: string; success?: boolean; linkFatura?: string | null }> {
  const session = await getSession();
  if (session?.role !== "MASTER") return { error: "Nao autorizado" };

  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return { error: "Cliente nao encontrado" };
  if (tenant.asaasSubscriptionId) return { error: "Este cliente ja tem assinatura ativa" };
  if (!tenant.planoMensalidade || tenant.planoMensalidade <= 0) {
    return { error: "Defina a mensalidade antes de gerar a assinatura" };
  }
  if (!tenant.documento?.replace(/\D/g, "")) {
    return { error: "Preencha o CPF ou CNPJ do cliente (coluna Contato)" };
  }

  try {
    const customerId = await ensureAsaasCustomer({
      nome: tenant.name,
      email: tenant.email,
      telefone: tenant.phone,
      documento: tenant.documento,
      referencia: tenant.id,
    });

    const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const primeiroVencimento =
      tenant.planoValidoAte && tenant.planoValidoAte > amanha
        ? tenant.planoValidoAte
        : amanha;

    const subscriptionId = await createAsaasSubscription({
      customerId,
      valor: tenant.planoMensalidade,
      primeiroVencimento,
      descricao: `AutomaWeb - plano mensal de conteudo`,
      referencia: tenant.id,
    });

    // grava o vinculo so se ainda nao existe assinatura: dois cliques
    // simultaneos nao podem criar duas cobrancas pro mesmo cliente
    const vinculo = await db.tenant.updateMany({
      where: { id: tenantId, asaasSubscriptionId: null },
      data: { asaasCustomerId: customerId, asaasSubscriptionId: subscriptionId },
    });
    if (vinculo.count === 0) {
      try {
        await cancelAsaasSubscription(subscriptionId);
      } catch (err) {
        // compensacao falhou: assinatura orfa cobrando no gateway.
        // Nao pode falhar em silencio — vira pendencia da equipe
        console.error(
          `[asaas] Nao cancelei a assinatura duplicada ${subscriptionId}:`,
          err instanceof Error ? err.message : err
        );
        const alerta = emailInterno({
          assunto: `Assinatura duplicada no Asaas: ${tenant.name}`,
          titulo: "Cancele uma assinatura manualmente no Asaas",
          resumo:
            "Dois cliques simultaneos criaram duas assinaturas e o cancelamento automatico da segunda falhou. Cancele no painel do Asaas pra nao cobrar o cliente duas vezes.",
          linhas: [
            ["Cliente", tenant.name],
            ["Assinatura a cancelar", subscriptionId],
          ],
        });
        after(() => notifyMasters(alerta.subject, alerta.html));
      }
      return { error: "Este cliente ja tem assinatura ativa" };
    }

    const linkFatura = await getInvoiceUrl(subscriptionId).catch(() => null);

    revalidatePath("/master/clientes");
    return { success: true, linkFatura };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao criar assinatura" };
  }
}

/** Copia o link da fatura em aberto de uma assinatura existente. */
export async function linkFaturaAssinatura(
  tenantId: string
): Promise<{ error?: string; linkFatura?: string | null }> {
  const session = await getSession();
  if (session?.role !== "MASTER") return { error: "Nao autorizado" };

  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    select: { asaasSubscriptionId: true },
  });
  if (!tenant?.asaasSubscriptionId) return { error: "Sem assinatura ativa" };

  try {
    return { linkFatura: await getInvoiceUrl(tenant.asaasSubscriptionId) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao buscar fatura" };
  }
}

export async function cancelarAssinatura(
  tenantId: string
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (session?.role !== "MASTER") return { error: "Nao autorizado" };

  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant?.asaasSubscriptionId) return { error: "Sem assinatura ativa" };

  try {
    await cancelAsaasSubscription(tenant.asaasSubscriptionId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao cancelar" };
  }

  await db.tenant.update({
    where: { id: tenantId },
    data: { asaasSubscriptionId: null },
  });

  revalidatePath("/master/clientes");
  return { success: true };
}
