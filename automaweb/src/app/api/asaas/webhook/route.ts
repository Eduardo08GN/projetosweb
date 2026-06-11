import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { notifyMasters } from "@/lib/email";
import { emailInterno } from "@/lib/email-templates";

export const runtime = "nodejs";

/* ── Webhook Asaas ──
   Quem vigia pagamento e o gateway, nao a equipe. Pagamento confirmado
   estende a validade do plano e reativa a conta; o resto (avisos de
   vencimento, carencia, pausa) continua com a regua diaria local.
   Idempotente: evento repetido pelo Asaas nao processa duas vezes. */

type AsaasWebhookBody = {
  id?: string;
  event?: string;
  payment?: {
    id: string;
    customer: string;
    subscription?: string;
    value: number;
  };
};

export async function POST(request: NextRequest) {
  const esperado = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!esperado) {
    // fail closed: sem token configurado, nenhum webhook e aceito
    console.error("[asaas] ASAAS_WEBHOOK_TOKEN ausente, webhook recusado");
    return NextResponse.json({ error: "Nao configurado" }, { status: 500 });
  }
  if (request.headers.get("asaas-access-token") !== esperado) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as AsaasWebhookBody | null;
  if (!body?.event) {
    return NextResponse.json({ error: "Evento invalido" }, { status: 400 });
  }

  const eventoId = body.id ?? `${body.event}:${body.payment?.id ?? "sem-id"}`;

  // idempotencia: ja processado responde 200 sem efeito
  try {
    await db.asaasEvento.create({ data: { id: eventoId, evento: body.event } });
  } catch {
    return NextResponse.json({ received: true, duplicado: true });
  }

  if (
    (body.event === "PAYMENT_CONFIRMED" || body.event === "PAYMENT_RECEIVED") &&
    body.payment
  ) {
    const tenant = await db.tenant.findFirst({
      where: {
        OR: [
          { asaasSubscriptionId: body.payment.subscription ?? "__nunca__" },
          { asaasCustomerId: body.payment.customer },
        ],
      },
    });

    if (tenant) {
      // estende a partir do que for maior: hoje ou a validade atual
      const base =
        tenant.planoValidoAte && tenant.planoValidoAte > new Date()
          ? new Date(tenant.planoValidoAte)
          : new Date();
      base.setMonth(base.getMonth() + 1);

      await db.tenant.update({
        where: { id: tenant.id },
        data: {
          planoValidoAte: base,
          planoAvisoDias: null,
          ...(tenant.status === "PAUSADO" ? { status: "ATIVO" } : {}),
        },
      });

      revalidatePath("/master/clientes");
      revalidatePath("/tenant/conta");

      console.log(
        `[asaas] Pagamento de ${tenant.name} confirmado, plano valido ate ${base.toISOString().slice(0, 10)}`
      );
      const aviso = emailInterno({
        assunto: `Pagamento recebido: ${tenant.name}`,
        titulo: "Pagamento da recorrencia confirmado",
        resumo: "A validade do plano foi estendida automaticamente.",
        linhas: [
          ["Cliente", tenant.name],
          ["Valor", `R$ ${body.payment.value}`],
          ["Valido ate", base.toLocaleDateString("pt-BR")],
        ],
      });
      await notifyMasters(aviso.subject, aviso.html);
    } else {
      console.warn(
        `[asaas] Pagamento sem tenant vinculado (customer ${body.payment.customer})`
      );
    }
  } else if (body.event === "PAYMENT_OVERDUE" && body.payment) {
    const tenant = await db.tenant.findFirst({
      where: { asaasCustomerId: body.payment.customer },
      select: { name: true },
    });
    const aviso = emailInterno({
      assunto: `Pagamento atrasado: ${tenant?.name ?? "cliente sem vinculo"}`,
      titulo: "Cobranca da recorrencia atrasou",
      resumo:
        "O Asaas segue cobrando o cliente. Se nao regularizar, a regua local pausa a conta sozinha apos a carencia.",
      linhas: [
        ["Cliente", tenant?.name ?? body.payment.customer],
        ["Valor", `R$ ${body.payment.value}`],
      ],
    });
    await notifyMasters(aviso.subject, aviso.html);
  }

  return NextResponse.json({ received: true });
}
