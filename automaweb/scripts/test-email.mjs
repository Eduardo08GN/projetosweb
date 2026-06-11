// Teste manual do template de email via Brevo.
// Uso: node scripts/test-email.mjs destino@email.com
import { readFileSync } from "node:fs";

const destino = process.argv[2];
if (!destino) {
  console.error("Informe o email de destino");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

process.env.NEXT_PUBLIC_URL = env.NEXT_PUBLIC_URL ?? "https://automaweb.pro";

const { emailBoasVindas, emailPostParaAprovar } = await import(
  "../src/lib/email-templates.ts"
);

const tpl = process.argv[3] === "aprovar"
  ? emailPostParaAprovar({ titulo: "O sequestro do Alfredo" })
  : emailBoasVindas({
      nome: "Eduardo Nogueira",
      email: destino,
      senha: "exemplo2026",
    });

const res = await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",
  headers: {
    "api-key": env.BREVO_API_KEY,
    "content-type": "application/json",
    accept: "application/json",
  },
  body: JSON.stringify({
    sender: { name: env.BREVO_SENDER_NAME, email: env.BREVO_SENDER_EMAIL },
    to: [{ email: destino }],
    subject: `[teste] ${tpl.subject}`,
    htmlContent: tpl.html,
  }),
});

console.log(res.status, await res.text());
