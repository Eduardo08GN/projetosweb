const fs = require("fs");
const path = require("path");

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const MODEL = "@cf/black-forest-labs/FLUX-1-schnell";

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error("Faltando CLOUDFLARE_ACCOUNT_ID ou CLOUDFLARE_API_TOKEN no .env");
  process.exit(1);
}

const prompt = process.argv[2];
const outputPath = process.argv[3];

if (!prompt || !outputPath) {
  console.error("Uso: node gerar-imagem-cf.js <prompt> <output.png>");
  console.error('Ex: node gerar-imagem-cf.js "abstract blue waves" imagem.png');
  process.exit(1);
}

async function generateImage(prompt, outputPath) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      num_steps: 4,
      width: 1024,
      height: 1024,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudflare API ${res.status}: ${text}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  const dir = path.dirname(outputPath);
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Imagem salva: ${outputPath} (${(buffer.length / 1024).toFixed(0)}KB)`);
}

generateImage(prompt, outputPath).catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
