import cron from "node-cron";
import { db } from "./db";
import { publishToInstagram } from "./instagram";
import { r2Delete, r2KeyFromUrl } from "./r2";

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

  const expirados = await db.metaConnection.updateMany({
    where: { status: "CONECTADO", tokenExpiresAt: { lte: agora } },
    data: { status: "TOKEN_EXPIRADO" },
  });
  if (expirados.count > 0) {
    console.warn(`[robo] ${expirados.count} conexao(oes) com token vencido`);
  }

  const vencendo = await db.metaConnection.findMany({
    where: {
      status: "CONECTADO",
      tokenExpiresAt: { gt: agora, lte: em7dias },
    },
    include: { tenant: { select: { name: true } } },
  });
  for (const conn of vencendo) {
    const dias = Math.ceil(
      (conn.tokenExpiresAt!.getTime() - agora.getTime()) / (24 * 60 * 60 * 1000)
    );
    console.warn(
      `[robo] O token do ${conn.tenant.name} expira em ${dias} dia(s). Reconectar em Integracoes`
    );
  }
}

export function startScheduler() {
  const globalRef = globalThis as unknown as { __schedulerStarted?: boolean };
  if (globalRef.__schedulerStarted) return;
  globalRef.__schedulerStarted = true;

  cron.schedule("* * * * *", publicarAgendados);
  cron.schedule("0 * * * *", vigiarTokens);

  console.log("[robo] Scheduler ligado: publicar (1min) + vigiar tokens (1h)");
}
