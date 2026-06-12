"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { MAX_TEXTO_SLIDE, type EdicaoSlide } from "@/lib/carrossel-edicao";
import { notifyMasters } from "@/lib/email";
import { emailInterno } from "@/lib/email-templates";
import {
  deInputBR,
  dentroDoPrazo,
  proximaVagaAgendamento,
  LIMITE_EDICAO_MS,
} from "@/lib/agendamento";

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
  if (!dentroDoPrazo(carrossel.agendadoPara)) {
    return { error: "Este post esta perto de publicar e ja entrou na fila" };
  }

  const conectado =
    carrossel.tenant.metaConnection?.status === "CONECTADO" &&
    !!carrossel.tenant.metaConnection.igUserId;

  // aprovado sempre tem data: a marcada, ou a proxima vaga util do cliente
  const dataMarcada =
    carrossel.agendadoPara ?? (await proximaVagaAgendamento(carrossel.tenantId));
  const novoStatus = conectado ? "AGENDADO" : "APROVADO";

  await db.carrossel.update({
    where: { id: carrosselId },
    data: {
      status: novoStatus,
      agendadoPara: dataMarcada,
      feedbackCliente: null,
      ajustePedido: false,
    },
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
export async function submitEdit(
  carrosselId: string,
  edits: EdicaoSlide[],
  novaDataInput?: string
) {
  const result = await getOwnCarrossel(carrosselId);
  if ("error" in result) return result;
  const { carrossel } = result;

  if (carrossel.status !== "APROVACAO") {
    return { error: "Este post nao esta aguardando sua aprovacao" };
  }
  if (carrossel.editadoPeloCliente) {
    return { error: "Este post ja foi editado uma vez. Fale com a gente se precisar de algo" };
  }
  if (!dentroDoPrazo(carrossel.agendadoPara)) {
    return { error: "Este post esta perto de publicar e nao pode mais ser editado" };
  }

  // data nova e opcional; quando vem, sobrescreve a vaga padrao do sistema
  let novaData: Date | undefined;
  if (novaDataInput) {
    const data = deInputBR(novaDataInput);
    if (!data) return { error: "Data invalida" };
    if (data.getTime() < Date.now() + LIMITE_EDICAO_MS) {
      return { error: "Escolha um horario com pelo menos 4 horas de antecedencia" };
    }
    novaData = data;
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

  const temEdicao = limpos.length > 0;
  if (!temEdicao && !novaData) {
    return { error: "Nenhuma alteracao pra enviar" };
  }

  await db.carrossel.update({
    where: { id: carrosselId },
    data: {
      status: "APROVADO",
      feedbackCliente: null,
      ajustePedido: false,
      // edicao de conteudo gasta a edicao unica; mudar so a data nao
      ...(temEdicao
        ? {
            edicaoPendente: JSON.parse(JSON.stringify(limpos)),
            editadoPeloCliente: true,
          }
        : {}),
      ...(novaData ? { agendadoPara: novaData } : {}),
    },
  });

  const aviso = temEdicao
    ? emailInterno({
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
      })
    : emailInterno({
        assunto: `${carrossel.tenant.name} aprovou e remarcou um post`,
        titulo: "Cliente aprovou e escolheu a data",
        resumo: "O post foi aprovado sem ajuste de conteudo, com data definida pelo cliente.",
        linhas: [
          ["Cliente", carrossel.tenant.name],
          ["Post", carrossel.titulo],
        ],
      });
  after(() => notifyMasters(aviso.subject, aviso.html));

  revalidateAll();
  return { success: true };
}

/**
 * Reagendar: o cliente muda a data/hora da publicacao sem gastar a
 * edicao unica. Sobrescreve a vaga padrao do sistema. agendadoPara e a
 * mesma fonte do robo e do calendario do master.
 */
export async function reagendarCarrossel(
  carrosselId: string,
  novaDataInput: string
) {
  const result = await getOwnCarrossel(carrosselId);
  if ("error" in result) return result;
  const { carrossel } = result;

  if (carrossel.status === "PUBLICADO") {
    return { error: "Este post ja foi publicado" };
  }
  // post prestes a sair nao se mexe mais
  if (!dentroDoPrazo(carrossel.agendadoPara)) {
    return { error: "Este post esta perto de publicar e nao pode mais ser remarcado" };
  }

  const data = deInputBR(novaDataInput);
  if (!data) return { error: "Data invalida" };
  if (data.getTime() < Date.now() + LIMITE_EDICAO_MS) {
    return { error: "Escolha um horario com pelo menos 1 hora de antecedencia" };
  }

  await db.carrossel.update({
    where: { id: carrosselId },
    data: { agendadoPara: data },
  });

  revalidateAll();
  return { success: true };
}
