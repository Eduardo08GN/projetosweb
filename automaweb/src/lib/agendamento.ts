import { db } from "./db";

/* ── Agendamento ──
   Cadencia padrao: 5 posts por semana, um por dia util (seg-sex), as
   13h de Brasilia. agendadoPara e a fonte unica: alimenta o robo de
   publicacao e o calendario do master ao mesmo tempo.

   O servidor roda em UTC; Brasilia e UTC-3 fixo (sem horario de verao
   desde 2019). Toda hora-relogio do cliente e tratada como Brasilia. */

const BR_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC = Brasilia + 3h
export const HORA_PUBLICACAO_PADRAO = 13; // 13h BRT
export const LIMITE_EDICAO_HORAS = 4; // acoes do cliente travam 4h antes
export const LIMITE_EDICAO_MS = LIMITE_EDICAO_HORAS * 60 * 60 * 1000;

/** Instante UTC de uma hora-relogio de Brasilia (ano, mes 0-based, dia, hora). */
function instanteBR(ano: number, mes: number, dia: number, hora: number) {
  return new Date(Date.UTC(ano, mes, dia, hora, 0, 0) + BR_OFFSET_MS);
}

/** Date deslocado pra ler a hora-relogio de Brasilia via getUTC*. */
function relogioBR(date: Date) {
  return new Date(date.getTime() - BR_OFFSET_MS);
}

/** Date -> "YYYY-MM-DDTHH:mm" na hora-relogio de Brasilia (pro input). */
export function paraInputBR(date: Date): string {
  return relogioBR(date).toISOString().slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm" (hora de Brasilia) -> instante UTC. Null se invalido. */
export function deInputBR(valor: string): Date | null {
  const m = valor.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) return null;
  const [, a, mes, d, h, min] = m.map(Number);
  const date = new Date(Date.UTC(a, mes - 1, d, h, min) + BR_OFFSET_MS);
  return isNaN(date.getTime()) ? null : date;
}

/** Dia de Brasilia (YYYY-MM-DD) de um instante. */
function diaBR(date: Date): string {
  return relogioBR(date).toISOString().slice(0, 10);
}

/** Edicao/reagendamento so vale ate 1h antes da publicacao marcada. */
export function dentroDoPrazo(agendadoPara: Date | null): boolean {
  if (!agendadoPara) return true; // sem data marcada nao ha corrida
  return agendadoPara.getTime() - Date.now() > LIMITE_EDICAO_MS;
}

/**
 * Proxima vaga livre: proximo dia util as 13h BRT que ainda nao tenha
 * outro post deste cliente. Mantem a cadencia de um por dia util.
 */
export async function proximaVagaAgendamento(tenantId: string): Promise<Date> {
  const [ocupados, tenant] = await Promise.all([
    db.carrossel.findMany({
      where: {
        tenantId,
        agendadoPara: { gte: new Date() },
        status: { in: ["APROVACAO", "APROVADO", "AGENDADO"] },
      },
      select: { agendadoPara: true },
    }),
    db.tenant.findUnique({
      where: { id: tenantId },
      select: { horaPublicacaoPadrao: true },
    }),
  ]);

  // hora do cliente sobrescreve o padrao global, quando o master definiu
  const hora = tenant?.horaPublicacaoPadrao ?? HORA_PUBLICACAO_PADRAO;
  const diasTomados = new Set(
    ocupados.map((c) => diaBR(c.agendadoPara!)).filter(Boolean)
  );

  // comeca amanha (Brasilia), da folga de producao
  const base = relogioBR(new Date());
  for (let i = 1; i <= 90; i++) {
    const ano = base.getUTCFullYear();
    const mes = base.getUTCMonth();
    const dia = base.getUTCDate() + i;
    const slot = instanteBR(ano, mes, dia, hora);
    const diaSemana = relogioBR(slot).getUTCDay(); // 0 dom, 6 sab
    if (diaSemana === 0 || diaSemana === 6) continue;
    if (diasTomados.has(diaBR(slot))) continue;
    return slot;
  }
  // fallback defensivo: amanha na hora padrao do cliente
  return instanteBR(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + 1, hora);
}
