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
let refImagePath = null;
let strength = 0.65;

function extractFlag(flag) {
  const i = args.findIndex((a) => a === flag);
  if (i !== -1 && args[i + 1]) {
    const val = args[i + 1];
    args.splice(i, 2);
    return val;
  }
  return null;
}

const modelVal = extractFlag("--model") || extractFlag("-m");
if (modelVal) modelKey = modelVal;

const refVal = extractFlag("--ref");
if (refVal) refImagePath = refVal;

const strVal = extractFlag("--strength");
if (strVal) strength = parseFloat(strVal);

const prompt = args[0];
const outputPath = args[1];

if (!prompt || !outputPath) {
  console.error("Uso: node gerar-imagem-cf.js <prompt> <output.jpg> [opcoes]");
  console.error("");
  console.error("Opcoes:");
  console.error("  --model schnell|klein4b|klein9b|dev  (default: schnell)");
  console.error("  --ref <imagem.jpg>                   Imagem de referencia (img2img)");
  console.error("  --strength 0.0-1.0                   Forca da transformacao (default: 0.65)");
  console.error("");
  console.error("Modelos:");
  console.error("  schnell  — FLUX 1 Schnell (rapido, text-to-image)");
  console.error("  klein4b  — FLUX 2 Klein 4B (rapido, melhor qualidade)");
  console.error("  klein9b  — FLUX 2 Klein 9B (multi-reference, img2img)");
  console.error("  dev      — FLUX 2 Dev (maxima qualidade, img2img)");
  console.error("");
  console.error('Ex: node gerar-imagem-cf.js "waves" out.jpg');
  console.error('Ex: node gerar-imagem-cf.js "same character teaching" out.jpg --model klein9b --ref avatar.jpg');
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
  if (refImagePath && !MULTIPART_MODELS.has(modelKey)) {
    console.log("--ref requer modelo FLUX 2. Trocando pra klein9b.");
    modelKey = "klein9b";
  }

  const MODEL_FINAL = refImagePath ? MODELS[modelKey] : MODEL;
  console.log(`Modelo: ${modelKey} (${MODEL_FINAL})`);
  console.log(`Prompt: ${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}`);
  if (refImagePath) {
    console.log(`Referencia: ${refImagePath} (strength: ${strength})`);
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL_FINAL}`;
  const steps = STEPS[modelKey] || 4;
  const start = Date.now();

  let res;

  if (MULTIPART_MODELS.has(modelKey)) {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("num_steps", String(steps));
    form.append("width", "1024");
    form.append("height", "1024");

    if (refImagePath) {
      const imgBuffer = fs.readFileSync(refImagePath);
      const ext = path.extname(refImagePath).toLowerCase();
      const mime = ext === ".png" ? "image/png" : "image/jpeg";
      const blob = new Blob([imgBuffer], { type: mime });
      form.append("image", blob, path.basename(refImagePath));
      form.append("strength", String(strength));
    }

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
