"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifyMasters } from "@/lib/email";
import { emailInterno } from "@/lib/email-templates";
import { listSubscriptionPayments, type PagamentoAsaas } from "@/lib/asaas";

export type AccountActionState = { error?: string; success?: boolean } | undefined;

/** Historico de pagamentos do proprio cliente (pra baixar comprovante). */
export async function listarMeusPagamentos(): Promise<{
  pagamentos?: PagamentoAsaas[];
  error?: string;
}> {
  const session = await getSession();
  if (!session?.tenantId) return { error: "Nao autorizado" };

  const tenant = await db.tenant.findUnique({
    where: { id: session.tenantId },
    select: { asaasSubscriptionId: true },
  });
  if (!tenant?.asaasSubscriptionId) return { pagamentos: [] };

  try {
    return { pagamentos: await listSubscriptionPayments(tenant.asaasSubscriptionId) };
  } catch {
    return { error: "Nao consegui carregar agora. Tente de novo em instantes" };
  }
}

export async function updateProfile(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  const session = await getSession();
  if (!session) return { error: "Nao autorizado" };

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();

  if (!name || !email) return { error: "Nome e email sao obrigatorios" };
  if (!email.includes("@")) return { error: "Email invalido" };

  const emailEmUso = await db.user.findFirst({
    where: { email, id: { not: session.userId } },
  });
  if (emailEmUso) return { error: "Esse email ja esta em uso" };

  await db.user.update({
    where: { id: session.userId },
    data: { name, email },
  });

  if (session.tenantId) {
    await db.tenant.update({
      where: { id: session.tenantId },
      data: { phone: phone || null },
    });
  }

  revalidatePath("/tenant/conta");
  return { success: true };
}

export async function changePassword(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  const session = await getSession();
  if (!session) return { error: "Nao autorizado" };

  const atual = (formData.get("atual") as string) ?? "";
  const nova = (formData.get("nova") as string) ?? "";
  const confirmar = (formData.get("confirmar") as string) ?? "";

  if (nova.length < 8) return { error: "A nova senha precisa de pelo menos 8 caracteres" };
  if (nova !== confirmar) return { error: "As senhas nao conferem" };

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return { error: "Nao autorizado" };

  const confere = await bcrypt.compare(atual, user.password);
  if (!confere) return { error: "Senha atual incorreta" };

  await db.user.update({
    where: { id: session.userId },
    data: { password: await bcrypt.hash(nova, 10) },
  });

  return { success: true };
}

/**
 * Rota de upgrade: o cliente manifesta interesse num plano e a equipe
 * recebe o aviso na hora pra fechar por contato direto. Quando houver
 * cobranca online, este e o ponto que vira checkout.
 */
export async function requestPlanChange(
  planoDesejado: string
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (!session?.tenantId) return { error: "Nao autorizado" };

  const planoCatalogo = await db.planoCatalogo.findFirst({
    where: { nome: planoDesejado, ativo: true },
  });
  if (!planoCatalogo) return { error: "Plano invalido" };

  const tenant = await db.tenant.findUnique({
    where: { id: session.tenantId },
    select: { name: true, email: true, phone: true, plano: true },
  });
  if (!tenant) return { error: "Nao autorizado" };

  const aviso = emailInterno({
    assunto: `${tenant.name} tem interesse no plano ${planoDesejado}`,
    titulo: "Pedido de mudanca de plano",
    resumo:
      "O cliente clicou em um plano de continuidade no painel. Entrar em contato pra fechar.",
    linhas: [
      ["Cliente", tenant.name],
      ["Plano atual", tenant.plano ?? "A definir"],
      ["Plano desejado", planoDesejado],
      ["Contato", [tenant.email, tenant.phone].filter(Boolean).join(" / ") || "Sem contato cadastrado"],
    ],
  });
  after(() => notifyMasters(aviso.subject, aviso.html));

  return { success: true };
}
