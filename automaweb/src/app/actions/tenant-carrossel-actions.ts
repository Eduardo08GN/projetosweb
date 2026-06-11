"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { MAX_TEXTO_SLIDE, type EdicaoSlide } from "@/lib/carrossel-edicao";
import { notifyMasters } from "@/lib/email";
import { emailInterno } from "@/lib/email-templates";

function revalidateAll() {
  revalidatePath("/tenant/carrossel");
  revalidatePath("/tenant");
  revalidatePath("/master/pipeline");
  revalidatePath("/master");
}

async function getOwnCarrossel(carrosselId: string) {
  const session = await getSession();
  if (!session?.tenantId) return { error: "Nao autorizado" as const };

  const carrossel = await db.carrossel.findUnique({
    where: { id: carrosselId },
    include: { tenant: { include: { metaConnection: true } } },
  });

  if (!carrossel || carrossel.tenantId !== session.tenantId) {
    return { error: "Carrossel nao encontrado" as const };
  }
  return { carrossel };
}

/**
 * Aprovar sem mexer em nada.
 * Com Instagram conectado e data marcada, ja entra na fila de publicacao
 * automatica (AGENDADO). Sem conexao, fica APROVADO e o cliente baixa
 * e publica por conta propria.
 */
export async function approveCarrossel(carrosselId: string) {
  const result = await getOwnCarrossel(carrosselId);
  if ("error" in result) return result;
  const { carrossel } = result;

  if (carrossel.status !== "APROVACAO") {
    return { error: "Este post nao esta aguardando sua aprovacao" };
  }

  const conectado =
    carrossel.tenant.metaConnection?.status === "CONECTADO" &&
    !!carrossel.tenant.metaConnection.igUserId;

  const novoStatus =
    conectado && carrossel.agendadoPara ? "AGENDADO" : "APROVADO";

  await db.carrossel.update({
    where: { id: carrosselId },
    data: { status: novoStatus, feedbackCliente: null, ajustePedido: false },
  });

  const aviso = emailInterno({
    assunto: `${carrossel.tenant.name} aprovou um post`,
    titulo: "Cliente aprovou sem alteracoes",
    resumo: "O post foi aprovado direto e seguiu no fluxo.",
    linhas: [
      ["Cliente", carrossel.tenant.name],
      ["Post", carrossel.titulo],
      [
        "Situacao",
        novoStatus === "AGENDADO"
          ? "Agendado, publicacao automatica"
          : "Aprovado, aguardando agendamento",
      ],
    ],
  });
  after(() => notifyMasters(aviso.subject, aviso.html));

  revalidateAll();
  return { success: true, agendado: novoStatus === "AGENDADO" };
}

/**
 * Edicao unica do cliente: ou ele aprova direto, ou edita UMA vez e a
 * edicao ja vale como aprovacao. Nao existe segundo loop.
 *
 * O pedido fica em edicaoPendente ate a fabrica re-renderizar os slides;
 * a publicacao automatica so roda depois disso.
 */
export async function submitEdit(carrosselId: string, edits: EdicaoSlide[]) {
  const result = await getOwnCarrossel(carrosselId);
  if ("error" in result) return result;
  const { carrossel } = result;

  if (carrossel.status !== "APROVACAO") {
    return { error: "Este post nao esta aguardando sua aprovacao" };
  }
  if (carrossel.editadoPeloCliente) {
    return { error: "Este post ja foi editado uma vez. Fale com a gente se precisar de algo" };
  }

  const totalSlides = ((carrossel.slides as string[] | null) ?? []).length;
  const limpos: EdicaoSlide[] = [];

  for (const edit of edits) {
    const texto = edit.texto?.trim();
    const imagemUrl = edit.imagemUrl?.trim();
    if (!texto && !imagemUrl) continue;

    if (
      !Number.isInteger(edit.slide) ||
      edit.slide < 0 ||
      edit.slide >= totalSlides
    ) {
      return { error: "Slide invalido" };
    }
    if (texto && texto.length > MAX_TEXTO_SLIDE) {
      return {
        error: `O texto do slide ${edit.slide + 1} passou de ${MAX_TEXTO_SLIDE} caracteres`,
      };
    }
    if (imagemUrl && !imagemUrl.startsWith("http")) {
      return { error: "Imagem invalida" };
    }
    limpos.push({ slide: edit.slide, texto, imagemUrl });
  }

  if (limpos.length === 0) {
    return { error: "Nenhuma alteracao pra enviar" };
  }

  await db.carrossel.update({
    where: { id: carrosselId },
    data: {
      status: "APROVADO",
      edicaoPendente: JSON.parse(JSON.stringify(limpos)),
      editadoPeloCliente: true,
      feedbackCliente: null,
      ajustePedido: false,
    },
  });

  const aviso = emailInterno({
    assunto: `${carrossel.tenant.name} enviou ajustes em um post`,
    titulo: "Cliente editou e aprovou",
    resumo:
      "A edicao unica do cliente chegou. Rodar o fluxo de ajustes para re-renderizar os slides.",
    linhas: [
      ["Cliente", carrossel.tenant.name],
      ["Post", carrossel.titulo],
      ["Slides ajustados", String(limpos.length)],
    ],
    cta: { label: "Abrir o pipeline", url: `${process.env.NEXT_PUBLIC_URL ?? "https://automaweb.pro"}/master/pipeline` },
  });
  after(() => notifyMasters(aviso.subject, aviso.html));

  revalidateAll();
  return { success: true };
}
