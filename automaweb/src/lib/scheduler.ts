import cron from "node-cron";
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { db } from "./db";
import { publishToInstagram } from "./instagram";
import { r2Delete, r2KeyFromUrl } from "./r2";
import { notifyMasters, notifyTenant } from "./email";
import {
  emailConexaoVencendo,
  emailConexaoVencida,
  emailContaPausada,
  emailInterno,
  emailPlanoVencendo,
  emailPlanoVencido,
  emailPostPublicado,
} from "./email-templates";

const MAX_TENTATIVAS = 3;

let publicando = false;

/**
 * Rotina PUBLICAR — roda a cada minuto.
 * Pega carrosseis AGENDADO com hora vencida e publica no Instagram do tenant.
 */
async function publicarAgendados() {
  if (publicando) return;
  publicando = true;

  try {
    const vencidos = await db.carrossel.findMany({
      where: {
        status: "AGENDADO",
        agendadoPara: { lte: new Date() },
        tentativasPublicacao: { lt: MAX_TENTATIVAS },
        // conta pausada ou cancelada nao publica
        tenant: { status: "ATIVO" },
      },
      include: { tenant: { include: { metaConnection: true } } },
    });

    for (const carrossel of vencidos) {
      // Edicao do cliente ainda nao foi aplicada pela fabrica: segura a
      // publicacao ate os slides serem re-renderizados.
      if (carrossel.edicaoPendente !== null) continue;

      const conn = carrossel.tenant.metaConnection;
      const slides = ((carrossel.slides as string[] | null) ?? []).filter(
        (s) => typeof s === "string" && s.startsWith("http")
      );

      try {
        if (!conn?.accessToken || !conn.igUserId || conn.status !== "CONECTADO") {
          throw new Error(
            `O Instagram de ${carrossel.tenant.name} nao esta conectado`
          );
        }
        if (slides.length === 0) {
          throw new Error("O carrossel nao tem slides prontos (URLs)");
        }

        const caption = [carrossel.legendaBody, carrossel.hashtags]
          .filter(Boolean)
          .join("\n\n");

        const postId = await publishToInstagram({
          igUserId: conn.igUserId,
          accessToken: conn.accessToken,
          slideUrls: slides,
          caption,
        });

        await db.carrossel.update({
          where: { id: carrossel.id },
          data: {
            status: "PUBLICADO",
            publicadoEm: new Date(),
            postId,
            erroPublicacao: null,
            slides: [],
          },
        });

        console.log(
          `[robo] Publicou "${carrossel.titulo}" no Instagram de ${carrossel.tenant.name}`
        );

        const noAr = emailPostPublicado({ titulo: carrossel.titulo });
        await notifyTenant(carrossel.tenantId, noAr.subject, noAr.html);

        // Publicou: os slides saem do R2 (o acervo fica no repositorio).
        // Falha aqui nao desfaz a publicacao, so loga.
        for (const url of slides) {
          const key = r2KeyFromUrl(url);
          if (!key) continue;
          try {
            await r2Delete(key);
          } catch (err) {
            console.error(
              `[robo] Nao consegui apagar ${key} do R2:`,
              err instanceof Error ? err.message : err
            );
          }
        }
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : "Erro desconhecido";
        await db.carrossel.update({
          where: { id: carrossel.id },
          data: {
            tentativasPublicacao: { increment: 1 },
            erroPublicacao: mensagem,
          },
        });
        console.error(
          `[robo] Nao conseguiu publicar "${carrossel.titulo}" (${carrossel.tenant.name}): ${mensagem}`
        );

        // esgotou as tentativas: vira pendencia da equipe
        if (carrossel.tentativasPublicacao + 1 >= MAX_TENTATIVAS) {
          const alerta = emailInterno({
            assunto: `Publicacao falhou: ${carrossel.tenant.name}`,
            titulo: "Publicacao automatica falhou",
            resumo: `O post esgotou as ${MAX_TENTATIVAS} tentativas de publicacao e precisa de acao manual.`,
            linhas: [
              ["Cliente", carrossel.tenant.name],
              ["Post", carrossel.titulo],
              ["Erro", mensagem],
            ],
          });
          await notifyMasters(alerta.subject, alerta.html);
        }
      }
    }
  } finally {
    publicando = false;
  }
}

/**
 * Rotina VIGIAR — roda a cada hora.
 * Marca tokens vencidos e avisa dos que estao perto de vencer.
 */
async function vigiarTokens() {
  const agora = new Date();
  const em7dias = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

  // venceu: marca, avisa o cliente e a equipe (uma unica vez, na virada de status)
  const expirados = await db.metaConnection.findMany({
    where: { status: "CONECTADO", tokenExpiresAt: { lte: agora } },
    include: { tenant: { select: { id: true, name: true } } },
  });
  if (expirados.length > 0) {
    await db.metaConnection.updateMany({
      where: { id: { in: expirados.map((c) => c.id) } },
      data: { status: "TOKEN_EXPIRADO" },
    });
    console.warn(`[robo] ${expirados.length} conexao(oes) com token vencido`);

    for (const conn of expirados) {
      const vencida = emailConexaoVencida();
      await notifyTenant(conn.tenant.id, vencida.subject, vencida.html);

      const alerta = emailInterno({
        assunto: `Conexao do Instagram venceu: ${conn.tenant.name}`,
        titulo: "Conexao com o Instagram venceu",
        resumo:
          "As publicacoes automaticas deste cliente estao pausadas ate ele renovar a conexao.",
        linhas: [
          ["Cliente", conn.tenant.name],
          ["Situacao", "Aguardando o cliente reconectar em Integracoes"],
        ],
      });
      await notifyMasters(alerta.subject, alerta.html);
    }
  }

  // perto de vencer: avisa o cliente nas faixas de 7, 3 e 1 dia, sem repetir
  const vencendo = await db.metaConnection.findMany({
    where: {
      status: "CONECTADO",
      tokenExpiresAt: { gt: agora, lte: em7dias },
    },
    include: { tenant: { select: { id: true, name: true } } },
  });
  for (const conn of vencendo) {
    const dias = Math.ceil(
      (conn.tokenExpiresAt!.getTime() - agora.getTime()) / (24 * 60 * 60 * 1000)
    );
    const faixa = dias <= 1 ? 1 : dias <= 3 ? 3 : 7;
    if (conn.ultimoAvisoDias !== null && conn.ultimoAvisoDias <= faixa) continue;

    console.warn(
      `[robo] O token do ${conn.tenant.name} expira em ${dias} dia(s). Avisando o cliente`
    );
    const aviso = emailConexaoVencendo({ dias });
    await notifyTenant(conn.tenant.id, aviso.subject, aviso.html);
    await db.metaConnection.update({
      where: { id: conn.id },
      data: { ultimoAvisoDias: faixa },
    });
  }
}

const CARENCIA_DIAS = 5;

/**
 * Rotina PLANOS — roda uma vez por dia.
 * Avisa o cliente em 7, 3 e 1 dia antes do plano vencer, avisa no dia
 * do vencimento e pausa a conta automaticamente apos a carencia.
 * Nenhum passo depende de olho humano; o master so e avisado.
 */
async function vigiarPlanos() {
  const agora = new Date();
  const em7dias = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
  const limiteCarencia = new Date(
    agora.getTime() - CARENCIA_DIAS * 24 * 60 * 60 * 1000
  );

  // 1. perto de vencer: faixas 7, 3 e 1 dia, sem repetir
  const vencendo = await db.tenant.findMany({
    where: {
      status: "ATIVO",
      planoValidoAte: { gt: agora, lte: em7dias },
    },
    select: { id: true, name: true, planoValidoAte: true, planoAvisoDias: true },
  });
  for (const tenant of vencendo) {
    const dias = Math.ceil(
      (tenant.planoValidoAte!.getTime() - agora.getTime()) / (24 * 60 * 60 * 1000)
    );
    const faixa = dias <= 1 ? 1 : dias <= 3 ? 3 : 7;
    if (tenant.planoAvisoDias !== null && tenant.planoAvisoDias <= faixa) continue;

    console.log(`[robo] Plano do ${tenant.name} vence em ${dias} dia(s). Avisando`);
    const aviso = emailPlanoVencendo({ dias });
    await notifyTenant(tenant.id, aviso.subject, aviso.html);
    await db.tenant.update({
      where: { id: tenant.id },
      data: { planoAvisoDias: faixa },
    });
  }

  // 2. venceu, dentro da carencia: um unico aviso de vencido
  const vencidos = await db.tenant.findMany({
    where: {
      status: "ATIVO",
      planoValidoAte: { lte: agora, gt: limiteCarencia },
    },
    select: { id: true, name: true, planoAvisoDias: true },
  });
  for (const tenant of vencidos) {
    if (tenant.planoAvisoDias !== null && tenant.planoAvisoDias <= 0) continue;

    console.warn(`[robo] Plano do ${tenant.name} venceu. Carencia de ${CARENCIA_DIAS} dias`);
    const aviso = emailPlanoVencido();
    await notifyTenant(tenant.id, aviso.subject, aviso.html);
    await db.tenant.update({
      where: { id: tenant.id },
      data: { planoAvisoDias: 0 },
    });

    const interno = emailInterno({
      assunto: `Plano vencido: ${tenant.name}`,
      titulo: "Plano de cliente venceu",
      resumo: `A carencia de ${CARENCIA_DIAS} dias comecou. Sem renovacao, a conta pausa sozinha.`,
      linhas: [
        ["Cliente", tenant.name],
        ["Carencia", `${CARENCIA_DIAS} dias`],
      ],
    });
    await notifyMasters(interno.subject, interno.html);
  }

  // 3. passou da carencia: pausa automatica
  const esgotados = await db.tenant.findMany({
    where: {
      status: "ATIVO",
      planoValidoAte: { lte: limiteCarencia },
    },
    select: { id: true, name: true },
  });
  for (const tenant of esgotados) {
    // re-checa na escrita: se um pagamento chegou entre a leitura e
    // agora (webhook estendeu a validade), nao pausa
    const pausou = await db.tenant.updateMany({
      where: {
        id: tenant.id,
        status: "ATIVO",
        planoValidoAte: { lte: limiteCarencia },
      },
      data: { status: "PAUSADO" },
    });
    if (pausou.count === 0) continue;

    console.warn(`[robo] Pausando ${tenant.name}: plano vencido alem da carencia`);

    const aviso = emailContaPausada();
    await notifyTenant(tenant.id, aviso.subject, aviso.html);

    const interno = emailInterno({
      assunto: `Conta pausada: ${tenant.name}`,
      titulo: "Conta pausada por vencimento",
      resumo:
        "Plano vencido alem da carencia. Publicacoes pausadas e acesso limitado ate regularizar.",
      linhas: [
        ["Cliente", tenant.name],
        ["Acao", "Reativar pela tabela de clientes ao confirmar pagamento"],
      ],
    });
    await notifyMasters(interno.subject, interno.html);
  }
}

/* ── Orquestracao ──
   Com REDIS_URL (producao): BullMQ com jobs repetiveis. O agendamento
   vive no Redis, entao com 2+ replicas do app cada disparo roda UMA vez
   (quem pega o job e um worker so), sem post duplicado.
   Sem REDIS_URL (dev local): node-cron no proprio processo. */

async function rodarJob(nome: string) {
  if (nome === "publicar") await publicarAgendados();
  else if (nome === "vigiar-tokens") await vigiarTokens();
  else if (nome === "vigiar-planos") await vigiarPlanos();
}

export async function startScheduler() {
  const globalRef = globalThis as unknown as {
    __schedulerStarted?: boolean;
    __schedulerQueue?: Queue;
    __schedulerWorker?: Worker;
  };
  if (globalRef.__schedulerStarted) return;
  globalRef.__schedulerStarted = true;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    cron.schedule("* * * * *", publicarAgendados);
    cron.schedule("0 * * * *", vigiarTokens);
    cron.schedule("0 12 * * *", vigiarPlanos);
    console.log(
      "[robo] Scheduler ligado (cron local): publicar (1min) + vigiar tokens (1h) + vigiar planos (1d)"
    );
    return;
  }

  try {
    const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
    const queue = new Queue("robo", { connection });

    await queue.upsertJobScheduler(
      "publicar",
      { pattern: "* * * * *" },
      { name: "publicar" }
    );
    await queue.upsertJobScheduler(
      "vigiar-tokens",
      { pattern: "0 * * * *" },
      { name: "vigiar-tokens" }
    );
    // 12:00 UTC = 09:00 em Brasilia
    await queue.upsertJobScheduler(
      "vigiar-planos",
      { pattern: "0 12 * * *" },
      { name: "vigiar-planos" }
    );

    const worker = new Worker("robo", async (job) => rodarJob(job.name), {
      connection,
    });
    worker.on("failed", (job, err) => {
      console.error(`[robo] Job ${job?.name} falhou:`, err.message);
    });

    globalRef.__schedulerQueue = queue;
    globalRef.__schedulerWorker = worker;
    console.log(
      "[robo] Scheduler ligado (BullMQ/Redis): publicar (1min) + vigiar tokens (1h) + vigiar planos (1d)"
    );
  } catch (err) {
    // Redis fora do ar nao pode derrubar a plataforma: cai pro cron local
    console.error(
      "[robo] BullMQ indisponivel, caindo pro cron local:",
      err instanceof Error ? err.message : err
    );
    cron.schedule("* * * * *", publicarAgendados);
    cron.schedule("0 * * * *", vigiarTokens);
    cron.schedule("0 12 * * *", vigiarPlanos);
  }
}
