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
  emailInterno,
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

/* ── Orquestracao ──
   Com REDIS_URL (producao): BullMQ com jobs repetiveis. O agendamento
   vive no Redis, entao com 2+ replicas do app cada disparo roda UMA vez
   (quem pega o job e um worker so), sem post duplicado.
   Sem REDIS_URL (dev local): node-cron no proprio processo. */

async function rodarJob(nome: string) {
  if (nome === "publicar") await publicarAgendados();
  else if (nome === "vigiar-tokens") await vigiarTokens();
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
    console.log(
      "[robo] Scheduler ligado (cron local): publicar (1min) + vigiar tokens (1h)"
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

    const worker = new Worker("robo", async (job) => rodarJob(job.name), {
      connection,
    });
    worker.on("failed", (job, err) => {
      console.error(`[robo] Job ${job?.name} falhou:`, err.message);
    });

    globalRef.__schedulerQueue = queue;
    globalRef.__schedulerWorker = worker;
    console.log(
      "[robo] Scheduler ligado (BullMQ/Redis): publicar (1min) + vigiar tokens (1h)"
    );
  } catch (err) {
    // Redis fora do ar nao pode derrubar a plataforma: cai pro cron local
    console.error(
      "[robo] BullMQ indisponivel, caindo pro cron local:",
      err instanceof Error ? err.message : err
    );
    cron.schedule("* * * * *", publicarAgendados);
    cron.schedule("0 * * * *", vigiarTokens);
  }
}
