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

const tpls = await import("../src/lib/email-templates.ts");

const exemplos = {
  boasvindas: () =>
    tpls.emailBoasVindas({ nome: "Eduardo Nogueira", email: destino, senha: "exemplo2026" }),
  aprovar: () => tpls.emailPostParaAprovar({ titulo: "O sequestro do Alfredo" }),
  publicado: () => tpls.emailPostPublicado({ titulo: "O sequestro do Alfredo" }),
  site: () => tpls.emailSitePublicado({ dominio: "drcamila.com.br" }),
  vencendo: () => tpls.emailConexaoVencendo({ dias: 3 }),
  vencida: () => tpls.emailConexaoVencida(),
  interno: () =>
    tpls.emailInterno({
      assunto: "Dra. Camila enviou ajustes em um post",
      titulo: "Cliente editou e aprovou",
      resumo: "A edicao unica do cliente chegou. Rodar o fluxo de ajustes para re-renderizar os slides.",
      linhas: [
        ["Cliente", "Dra. Camila"],
        ["Post", "O sequestro do Alfredo"],
        ["Slides ajustados", "2"],
      ],
    }),
};

const escolha = process.argv[3] ?? "boasvindas";
const nomes = escolha === "todos" ? Object.keys(exemplos) : [escolha];

for (const nome of nomes) {
  const tpl = exemplos[nome]();
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
  console.log(nome, res.status, await res.text());
}
