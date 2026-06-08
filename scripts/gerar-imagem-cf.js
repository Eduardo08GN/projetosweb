const fs = require("fs");
const path = require("path");

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const MODELS = {
  schnell: "@cf/black-forest-labs/flux-1-schnell",
  klein4b: "@cf/black-forest-labs/flux-2-klein-4b",
  klein9b: "@cf/black-forest-labs/flux-2-klein-9b",
  dev: "@cf/black-forest-labs/flux-2-dev",
};

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error("Faltando CLOUDFLARE_ACCOUNT_ID ou CLOUDFLARE_API_TOKEN no .env");
  process.exit(1);
}

const args = process.argv.slice(2);
let modelKey = "schnell";
const modelFlag = args.findIndex((a) => a === "--model" || a === "-m");
if (modelFlag !== -1 && args[modelFlag + 1]) {
  modelKey = args[modelFlag + 1];
  args.splice(modelFlag, 2);
}

const prompt = args[0];
const outputPath = args[1];

if (!prompt || !outputPath) {
  console.error("Uso: node gerar-imagem-cf.js <prompt> <output.jpg> [--model schnell|klein4b|klein9b|dev]");
  console.error("");
  console.error("Modelos disponiveis:");
  console.error("  schnell  — FLUX 1 Schnell (rapido, 4 steps) [default]");
  console.error("  klein4b  — FLUX 2 Klein 4B (ultra-rapido, melhor qualidade)");
  console.error("  klein9b  — FLUX 2 Klein 9B (alta qualidade, multi-reference)");
  console.error("  dev      — FLUX 2 Dev (maxima qualidade, mais lento)");
  console.error("");
  console.error('Ex: node gerar-imagem-cf.js "abstract waves" imagem.jpg');
  console.error('Ex: node gerar-imagem-cf.js "cartoon character" avatar.jpg --model klein4b');
  process.exit(1);
}

const MODEL = MODELS[modelKey];
if (!MODEL) {
  console.error(`Modelo "${modelKey}" nao encontrado. Opcoes: ${Object.keys(MODELS).join(", ")}`);
  process.exit(1);
}

const STEPS = {
  schnell: 4,
  klein4b: 4,
  klein9b: 8,
  dev: 20,
};

const MULTIPART_MODELS = new Set(["klein4b", "klein9b", "dev"]);

async function generateImage(prompt, outputPath) {
  console.log(`Modelo: ${modelKey} (${MODEL})`);
  console.log(`Prompt: ${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}`);

  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`;
  const steps = STEPS[modelKey] || 4;
  const start = Date.now();

  let res;

  if (MULTIPART_MODELS.has(modelKey)) {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("num_steps", String(steps));
    form.append("width", "1024");
    form.append("height", "1024");

    res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      body: form,
    });
  } else {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        num_steps: steps,
        width: 1024,
        height: 1024,
      }),
    });
  }

  const data = await res.json();

  if (!data.success || !data.result) {
    throw new Error(`Cloudflare API: ${JSON.stringify(data.errors || data)}`);
  }

  const base64 = data.result.image;
  if (!base64) {
    throw new Error(
      "Resposta sem imagem. Resultado: " + JSON.stringify(data.result).slice(0, 200)
    );
  }

  const buffer = Buffer.from(base64, "base64");
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  const dir = path.dirname(outputPath);
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(
    `Imagem salva: ${outputPath} (${(buffer.length / 1024).toFixed(0)}KB) em ${elapsed}s`
  );
}

generateImage(prompt, outputPath).catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
