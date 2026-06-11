import { db } from "./db";

/* ── Transporte de email (Brevo) ──
   Canal unico de avisos transacionais da plataforma. Sem chave
   configurada a plataforma segue funcionando: o aviso vira log. */

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

type Destinatario = { email: string; name?: string };

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: Destinatario[];
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn(`[email] BREVO_API_KEY ausente, aviso nao enviado: ${subject}`);
    return false;
  }
  if (to.length === 0) return false;

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME ?? "AutomaWeb",
          email: process.env.BREVO_SENDER_EMAIL ?? "atm.eduardopaypal@gmail.com",
        },
        to,
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      console.error(`[email] Brevo recusou (${res.status}):`, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] envio falhou:", err instanceof Error ? err.message : err);
    return false;
  }
}

/** Avisa todos os usuarios MASTER (equipe interna). */
export async function notifyMasters(subject: string, html: string) {
  const masters = await db.user.findMany({
    where: { role: "MASTER" },
    select: { email: true, name: true },
  });
  return sendEmail({
    to: masters.map((m) => ({ email: m.email, name: m.name })),
    subject,
    html,
  });
}

/** Avisa o cliente: email do tenant + usuarios vinculados, sem duplicar. */
export async function notifyTenant(tenantId: string, subject: string, html: string) {
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    include: { users: { select: { email: true, name: true } } },
  });
  if (!tenant) return false;

  const destinatarios = new Map<string, Destinatario>();
  if (tenant.email) {
    destinatarios.set(tenant.email, { email: tenant.email, name: tenant.name });
  }
  for (const user of tenant.users) {
    destinatarios.set(user.email, { email: user.email, name: user.name });
  }

  return sendEmail({ to: [...destinatarios.values()], subject, html });
}
