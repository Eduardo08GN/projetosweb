const fs = require("fs");
const path = require("path");

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const MODEL = "@cf/black-forest-labs/flux-1-schnell";

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

  const data = await res.json();

  if (!data.success || !data.result) {
    throw new Error(`Cloudflare API: ${JSON.stringify(data.errors || data)}`);
  }

  const base64 = data.result.image;
  if (!base64) {
    throw new Error("Resposta sem imagem. Resultado: " + JSON.stringify(data.result).slice(0, 200));
  }

  const buffer = Buffer.from(base64, "base64");

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
