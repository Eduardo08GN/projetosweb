import { db } from "./db";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

function timeAgo(date: Date) {
  return formatDistanceToNow(date, { addSuffix: false, locale: ptBR });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

// ── MASTER ──

export async function getMasterMetrics() {
  const [tenantCount, inProductionCount, scheduledCount, automationCount] =
    await Promise.all([
      db.tenant.count({ where: { status: "ATIVO" } }),
      db.carrossel.count({
        where: { status: "PRODUZIR" },
      }),
      db.carrossel.count({ where: { status: "AGENDADO" } }),
      db.automacaoDM.count({ where: { ativo: true } }),
    ]);

  return {
    clientesAtivos: tenantCount,
    emProducao: inProductionCount,
    agendados: scheduledCount,
    automacoesAtivas: automationCount,
  };
}

export async function getRecentActivity() {
  const carrosseis = await db.carrossel.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: { tenant: { select: { name: true } } },
  });

  return carrosseis.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    tenant: c.tenant.name,
    status: c.status,
    operador: c.operador ?? "Equipe",
    updatedAt: timeAgo(c.updatedAt),
  }));
}

export async function getUpcomingPosts() {
  const posts = await db.carrossel.findMany({
    where: {
      status: "AGENDADO",
      agendadoPara: { not: null },
    },
    orderBy: { agendadoPara: "asc" },
    take: 5,
    include: { tenant: { select: { name: true } } },
  });

  return posts.map((p) => ({
    id: p.id,
    titulo: p.titulo,
    tenant: p.tenant.name,
    plataforma: "Instagram",
    data: formatShortDate(p.agendadoPara!),
    hora: p.agendadoPara!.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
}

export async function getClientes() {
  const tenants = await db.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { carrosseis: true } },
    },
  });

  return tenants.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    email: t.email ?? "",
    phone: t.phone ?? "",
    documento: t.documento ?? "",
    status: t.status,
    plano: t.plano ?? "",
    planoValidoAte: t.planoValidoAte
      ? t.planoValidoAte.toISOString().slice(0, 10)
      : "",
    planoMensalidade: t.planoMensalidade,
    assinaturaAtiva: !!t.asaasSubscriptionId,
    carrosseis: t._count.carrosseis,
  }));
}

export async function getKanbanData() {
  const carrosseis = await db.carrossel.findMany({
    // publicado no Instagram do cliente (tem postId) ja cumpriu o ciclo:
    // sai do kanban. O historico vive no painel do cliente e no calendario.
    where: { OR: [{ status: { not: "PUBLICADO" } }, { postId: null }] },
    include: { tenant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const grouped: Record<string, Array<{
    id: string;
    titulo: string;
    tenant: string;
    operador: string;
    dias: number;
    angulo: string | null;
    slides: string[];
    legendaBody: string;
    hashtags: string;
    edicaoPendente: Array<{
      slide: number;
      texto?: string;
      imagemUrl?: string;
    }> | null;
    editadoPeloCliente: boolean;
    agendadoParaLabel: string | null;
  }>> = {};

  for (const c of carrosseis) {
    const status = c.status;
    if (!grouped[status]) grouped[status] = [];
    const dias = Math.floor(
      (Date.now() - c.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    grouped[status].push({
      id: c.id,
      titulo: c.titulo,
      tenant: c.tenant.name,
      operador: c.operador ?? "Equipe",
      dias,
      angulo: c.angulo,
      slides: (c.slides as string[] | null) ?? [],
      legendaBody: c.legendaBody ?? "",
      hashtags: c.hashtags ?? "",
      edicaoPendente:
        (c.edicaoPendente as Array<{
          slide: number;
          texto?: string;
          imagemUrl?: string;
        }> | null) ?? null,
      editadoPeloCliente: c.editadoPeloCliente,
      agendadoParaLabel: c.agendadoPara ? formatDateTime(c.agendadoPara) : null,
    });
  }

  return grouped;
}

export async function getActiveTenants() {
  const tenants = await db.tenant.findMany({
    where: { status: "ATIVO" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return tenants;
}

// ── TENANT ──

export async function getTenantMetrics(tenantId: string) {
  const [total, publicados, emProducao, agendados] = await Promise.all([
    db.carrossel.count({ where: { tenantId } }),
    db.carrossel.count({ where: { tenantId, status: "PUBLICADO" } }),
    db.carrossel.count({
      where: { tenantId, status: "PRODUZIR" },
    }),
    db.carrossel.count({
      where: { tenantId, status: { in: ["AGENDADO", "APROVADO"] } },
    }),
  ]);

  return { total, publicados, emProducao, agendados };
}

export async function getTenantConnection(tenantId: string) {
  const conn = await db.metaConnection.findUnique({ where: { tenantId } });
  if (!conn) return null;

  return {
    status: conn.status,
    igUsername: conn.igUsername ?? undefined,
    igProfilePic: conn.igProfilePic ?? undefined,
    pageName: conn.pageName ?? undefined,
    connectedAt: conn.connectedAt?.toISOString(),
    tokenExpiresAt: conn.tokenExpiresAt?.toISOString(),
  };
}

export async function getTenantRecentCarousels(tenantId: string) {
  const carrosseis = await db.carrossel.findMany({
    where: { tenantId },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return carrosseis.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    status: c.status,
    operador: c.operador ?? "Equipe",
    updatedAt: timeAgo(c.updatedAt),
  }));
}

export async function getTenantNextPost(tenantId: string) {
  const next = await db.carrossel.findFirst({
    where: {
      tenantId,
      status: { in: ["AGENDADO", "APROVADO"] },
      agendadoPara: { not: null },
    },
    orderBy: { agendadoPara: "asc" },
  });

  if (!next) return null;

  const totalSteps = 5;
  const stepMap: Record<string, number> = {
    PRODUZIR: 1,
    APROVACAO: 2,
    APROVADO: 3,
    AGENDADO: 4,
    PUBLICADO: 5,
  };
  const progress = Math.round(
    ((stepMap[next.status] ?? 1) / totalSteps) * 100
  );

  return {
    titulo: next.titulo,
    data: next.agendadoPara!.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    hora: next.agendadoPara!.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    progress,
  };
}

export async function getTenantDmStats(tenantId: string) {
  const [automacoesAtivas, totalDms, totalRespondidas] = await Promise.all([
    db.automacaoDM.count({ where: { tenantId, ativo: true } }),
    db.interacaoDM.count({ where: { tenantId } }),
    db.interacaoDM.count({ where: { tenantId, respondido: true } }),
  ]);

  const taxa =
    totalDms > 0 ? Math.round((totalRespondidas / totalDms) * 100) : 0;

  return {
    automacoesAtivas,
    totalDms: totalRespondidas,
    taxa: `${taxa}%`,
  };
}

function formatDateTime(date: Date) {
  return `${date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })} as ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export async function getTenantCarousels(tenantId: string) {
  const [carrosseis, conn] = await Promise.all([
    db.carrossel.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    }),
    db.metaConnection.findUnique({ where: { tenantId } }),
  ]);

  const conectado = conn?.status === "CONECTADO";

  return carrosseis.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    angulo: c.angulo ?? "",
    status: c.status,
    slides: (c.slides as string[] | null) ?? [],
    legenda: c.legendaBody ?? "",
    operador: c.operador ?? "Equipe",
    updatedAt: timeAgo(c.updatedAt),
    agendadoParaLabel: c.agendadoPara ? formatDateTime(c.agendadoPara) : null,
    publicadoEmLabel: c.publicadoEm ? formatDateTime(c.publicadoEm) : null,
    editadoPeloCliente: c.editadoPeloCliente,
    temEdicaoPendente: c.edicaoPendente !== null,
    conectado,
  }));
}

export async function getTenantAutomations(tenantId: string) {
  return db.automacaoDM.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTenantRecentDms(tenantId: string) {
  const dms = await db.interacaoDM.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return dms.map((d) => ({
    id: d.id,
    username: d.igUsername ?? d.igUserId,
    keyword: d.keyword,
    respondido: d.respondido,
    createdAt: timeAgo(d.createdAt),
  }));
}

export async function getSites() {
  const sites = await db.site.findMany({
    include: { tenant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const pre = sites
    .filter((s) => s.fase === "PRE_FECHAMENTO")
    .map((s) => ({
      id: s.id,
      tenant: s.tenant.name,
      tenantId: s.tenantId,
      dominio: s.dominio,
      urlPreview: s.urlPreview,
      status: s.status,
      stack: s.stack ?? "",
      notas: s.notas ?? "",
    }));

  const pos = sites
    .filter((s) => s.fase === "POS_FECHAMENTO")
    .map((s) => ({
      id: s.id,
      tenant: s.tenant.name,
      tenantId: s.tenantId,
      dominio: s.dominio,
      urlPreview: s.urlPreview,
      status: s.status,
      stack: s.stack ?? "",
      notas: s.notas ?? "",
    }));

  return { pre, pos };
}

export async function getTenantDmMetrics(tenantId: string) {
  const [totalMensagens, totalRespondidas, contatos, automacoesAtivas] =
    await Promise.all([
      db.interacaoDM.count({ where: { tenantId } }),
      db.interacaoDM.count({ where: { tenantId, respondido: true } }),
      db.interacaoDM
        .groupBy({ by: ["igUserId"], where: { tenantId } })
        .then((g) => g.length),
      db.automacaoDM.count({ where: { tenantId, ativo: true } }),
    ]);

  const taxa =
    totalMensagens > 0
      ? Math.round((totalRespondidas / totalMensagens) * 100)
      : 0;

  return {
    totalMensagens,
    totalRespondidas,
    taxa: `${taxa}%`,
    contatos,
    automacoesAtivas,
  };
}

export async function getPlanosCatalogo() {
  return db.planoCatalogo.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
    select: {
      id: true,
      nome: true,
      valor: true,
      descricao: true,
      destaque: true,
    },
  });
}

export async function getTenantPlan(tenantId: string) {
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    select: {
      plano: true,
      planoInicio: true,
      planoValidoAte: true,
      planoMensalidade: true,
      createdAt: true,
    },
  });
  if (!tenant) return null;

  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

  return {
    plano: tenant.plano,
    inicioLabel: fmt(tenant.planoInicio ?? tenant.createdAt),
    validoAteLabel: tenant.planoValidoAte ? fmt(tenant.planoValidoAte) : null,
    mensalidade: tenant.planoMensalidade,
  };
}

export async function getTenantProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  if (!user) return null;

  return {
    name: user.name,
    email: user.email,
    phone: user.tenant?.phone ?? "",
    empresa: user.tenant?.name ?? "",
    initials:
      user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
  };
}
