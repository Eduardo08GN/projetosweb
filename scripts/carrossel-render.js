const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { Pool } = require("pg");

const DB_URL =
  "postgresql://automaweb:Automaweb2026Prod@159.195.12.135:5433/automaweb";

const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_MODEL = "@cf/black-forest-labs/flux-1-schnell";

// ── INPUT ──────────────────────────────────────────────
// Pass a JSON file as first argument:
//
// {
//   "carrosselId": "cmq64pcof0008i8uerjkzrckh",
//   "tenantSlug": "dra-camila-odonto",
//   "tema": "lentes-dental",
//   "slides": [
//     { "kicker": "Odontologia estética", "titulo": "99% de sucesso.\nCom quase zero desgaste.", "corpo": "" },
//     { "kicker": "O medo que trava", "titulo": "Você evita sorrir em fotos.", "corpo": "Cobre a boca..." },
//     ...
//   ],
//   "legendaBody": "...",
//   "hashtags": "#lentes #odonto ...",
//   "imagePrompts": ["prompt slide 1", "prompt slide 2", ..., null, null]
// }

const configPath = process.argv[2];
if (!configPath) {
  console.error("Uso: node --env-file=.env scripts/carrossel-render.js <config.json>");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// ── DESIGN GUIDE PARSER ────────────────────────────────
function loadDesignGuide(tenantSlug) {
  const guidePath = path.join(
    __dirname,
    "..",
    "identidade",
    "tenants",
    tenantSlug,
    "design-guide.md"
  );
  if (!fs.existsSync(guidePath)) {
    console.error(`Design guide nao encontrado: ${guidePath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(guidePath, "utf-8");

  function extract(label) {
    const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*\`?([^\`\\n]+)\`?`, "i");
    const m = raw.match(re);
    return m ? m[1].trim() : null;
  }

  return {
    fundoPrincipal: extract("Fundo principal") || "#1B3A4B",
    corDestaque: extract("Cor de destaque / CTA") || extract("Cor de destaque") || "#2E8B8B",
    corSecundaria: extract("Cor secundaria") || "#D4A574",
    textoPrincipal: extract("Texto principal") || "#FAFAF7",
    textoClaro: extract("Texto sobre fundo claro") || "#1A1A1A",
    fundoAlternativo: extract("Fundo alternativo") || "#F7F3EF",
    fontesTitulo: extract("Titulos")?.split("(")[0]?.trim() || "Playfair Display",
    fontesCorpo: extract("Corpo")?.split("(")[0]?.trim() || "Nunito Sans",
    tenantName: raw.match(/\*\*Nome:\*\*\s*(.+)/)?.[1]?.trim() || tenantSlug,
  };
}

// ── HTML GENERATOR ─────────────────────────────────────
function generateHTML(slides, dg, tenantSlug, imagePaths) {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${dg.fontesTitulo.replace(/ /g, "+")}:wght@500;600;700&family=${dg.fontesCorpo.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;

  const dark = dg.fundoPrincipal;
  const light = dg.fundoAlternativo;
  const accent = dg.corDestaque;
  const gold = dg.corSecundaria;
  const logoName = dg.tenantName.split(" ").slice(0, 2).join(" ");

  function hexLuminance(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  const lightIsDark = hexLuminance(light) < 0.35;
  const darkOverlayRgba = (() => {
    const c = dark.replace("#", "");
    return `${parseInt(c.substring(0, 2), 16)},${parseInt(c.substring(2, 4), 16)},${parseInt(c.substring(4, 6), 16)}`;
  })();
  const lightOverlayRgba = (() => {
    const c = light.replace("#", "");
    return `${parseInt(c.substring(0, 2), 16)},${parseInt(c.substring(2, 4), 16)},${parseInt(c.substring(4, 6), 16)}`;
  })();

  function slideBackground(i) {
    const imgPath = imagePaths[i];
    if (imgPath && fs.existsSync(imgPath)) {
      const absPath = path.resolve(imgPath).replace(/\\/g, "/");
      const overlay = (i % 2 === 0)
        ? `linear-gradient(rgba(${darkOverlayRgba},0.72), rgba(${darkOverlayRgba},0.88))`
        : `linear-gradient(rgba(${lightOverlayRgba},0.72), rgba(${lightOverlayRgba},0.88))`;
      return `background: ${overlay}, url('file:///${absPath}') center/cover no-repeat;`;
    }
    return `background: ${i % 2 === 0 ? dark : light};`;
  }

  function textColor(i) {
    if (i % 2 === 0) return "#FAFAF7";
    return lightIsDark ? "#FAFAF7" : dark;
  }

  function kickerColor(i) {
    return i % 2 === 0 ? (i === 0 ? accent : gold) : accent;
  }

  function corpoColor(i) {
    if (i % 2 === 0) return "rgba(255,255,255,0.85)";
    return lightIsDark ? "rgba(255,255,255,0.75)" : "#3A3A3A";
  }

  function logoColor(i) {
    if (i % 2 === 0) return "rgba(255,255,255,0.85)";
    return lightIsDark ? "rgba(255,255,255,0.75)" : dark;
  }

  function counterColor(i) {
    if (i % 2 === 0) return "rgba(255,255,255,0.4)";
    return lightIsDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)";
  }

  const total = slides.length;
  const lastIdx = total - 1;

  let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080">
<link href="${fontUrl}" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
.slide {
  width: 1080px; height: 1350px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center; padding: 80px 90px;
}
.logo {
  position: absolute; top: 50px; left: 70px;
  font-family: '${dg.fontesTitulo}', serif; font-weight: 600; font-size: 28px;
}
.counter {
  position: absolute; top: 54px; right: 70px;
  font-family: '${dg.fontesCorpo}', sans-serif; font-weight: 500; font-size: 16px; letter-spacing: 0.18em;
}
.kicker {
  font-family: '${dg.fontesCorpo}', sans-serif; font-weight: 700; font-size: 14px;
  text-transform: uppercase; letter-spacing: 0.28em;
}
.regua { width: 70px; height: 3px; background: ${accent}; margin: 24px 0; }
.titulo {
  font-family: '${dg.fontesTitulo}', serif; font-weight: 700;
  line-height: 1.02; letter-spacing: -0.03em;
}
.corpo {
  font-family: '${dg.fontesCorpo}', sans-serif; font-weight: 500;
  font-size: 28px; line-height: 1.55;
}
.handle {
  position: absolute; bottom: 50px; left: 70px;
  font-family: '${dg.fontesCorpo}', sans-serif; font-weight: 600; font-size: 18px;
}
</style>
</head>
<body>
`;

  slides.forEach((s, i) => {
    const num = String(i + 1).padStart(2, "0");
    const isCTA = i === lastIdx;

    if (isCTA) {
      html += `<div class="slide" style="background:${accent}; justify-content:center; align-items:center; text-align:center;">
  <div class="logo" style="color:rgba(255,255,255,0.9); left:50%; transform:translateX(-50%);">${logoName}</div>
  <div style="font-family:'${dg.fontesTitulo}',serif; font-weight:700; font-size:42px; color:#FAFAF7; margin-bottom:48px;">${dg.tenantName}</div>
  <div class="titulo" style="color:#FAFAF7; font-size:64px; max-width:800px; margin-bottom:40px;">${s.titulo}</div>
  <div style="display:inline-block; font-family:'${dg.fontesCorpo}',sans-serif; font-weight:700; font-size:32px; color:${dark}; background:#FAFAF7; padding:18px 56px; border-radius:12px; letter-spacing:0.06em; text-transform:uppercase;">${s.corpo || "COMENTA"}</div>
  <div class="handle" style="left:50%; transform:translateX(-50%); color:rgba(255,255,255,0.6);">@${tenantSlug.replace(/-/g, "")}</div>
</div>\n`;
    } else {
      html += `<div class="slide" style="${slideBackground(i)}">
  <div class="logo" style="color:${logoColor(i)};">${logoName}</div>
  <div class="counter" style="color:${counterColor(i)};">${num} / ${String(total).padStart(2, "0")}</div>
  <div class="kicker" style="color:${kickerColor(i)};">${s.kicker}</div>
  <div class="regua"></div>
  <div class="titulo" style="color:${textColor(i)}; font-size:${i === 0 ? 88 : 56}px; max-width:860px;${s.corpo ? " margin-bottom:28px;" : ""}">${s.titulo}</div>
  ${s.corpo ? `<div class="corpo" style="color:${corpoColor(i)}; max-width:860px;">${s.corpo}</div>` : ""}
  ${i === 0 ? `<div class="handle" style="color:rgba(255,255,255,0.5);">@${tenantSlug.replace(/-/g, "")}</div>` : ""}
</div>\n`;
    }
  });

  html += `</body>\n</html>`;
  return html;
}

// ── CLOUDFLARE IMAGE GEN ───────────────────────────────
async function generateImage(prompt, outputPath) {
  if (!CF_ACCOUNT || !CF_TOKEN) return false;
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/ai/run/${CF_MODEL}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${CF_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, num_steps: 4, width: 1024, height: 1024 }),
    });
    const data = await res.json();
    if (!data.success || !data.result?.image) {
      console.log(`  Imagem skip (${data.errors?.[0]?.message?.slice(0, 60) || "sem resultado"})`);
      return false;
    }
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, Buffer.from(data.result.image, "base64"));
    console.log(`  Imagem OK: ${path.basename(outputPath)}`);
    return true;
  } catch (e) {
    console.log(`  Imagem erro: ${e.message}`);
    return false;
  }
}

// ── PLAYWRIGHT RENDER ──────────────────────────────────
async function renderSlides(htmlPath, outDir) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const slides = await page.$$(".slide");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    const out = path.join(outDir, `slide-${num}.png`);
    await slides[i].screenshot({ path: out, type: "png" });
    console.log(`  Render: slide-${num}.png`);
  }
  await browser.close();
  return slides.length;
}

// ── DB UPDATE ──────────────────────────────────────────
async function updateDB(id, slides, legendaBody, hashtags) {
  const pool = new Pool({ connectionString: DB_URL });
  const textos = slides.map((s) => {
    const parts = [s.titulo];
    if (s.corpo) parts.push(s.corpo);
    return parts.join(". ");
  });
  await pool.query(
    'UPDATE "Carrossel" SET slides = $1::jsonb, "legendaBody" = $2, hashtags = $3 WHERE id = $4',
    [JSON.stringify(textos), legendaBody, hashtags, id]
  );
  await pool.end();
  console.log(`  DB atualizado: ${id}`);
}

// ── MAIN ───────────────────────────────────────────────
(async () => {
  const date = new Date().toISOString().slice(0, 10);
  const baseDir = path.join(
    __dirname, "..", "marketing", "conteudo",
    `carrossel-${config.tema}-${date}`, config.tenantSlug
  );
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const dg = loadDesignGuide(config.tenantSlug);
  console.log(`\nTenant: ${dg.tenantName} (${config.tenantSlug})`);
  console.log(`Tema: ${config.tema}`);
  console.log(`Slides: ${config.slides.length}\n`);

  // 1. Gerar imagens (se prompts fornecidos e Cloudflare disponivel)
  console.log("[1/4] Imagens (Cloudflare FLUX)...");
  const imagePaths = [];
  let cfAvailable = !!(CF_ACCOUNT && CF_TOKEN);
  for (let i = 0; i < config.slides.length; i++) {
    const prompt = config.imagePrompts?.[i];
    if (prompt && cfAvailable) {
      const imgPath = path.join(baseDir, `imagem-slide-${String(i + 1).padStart(2, "0")}.png`);
      const ok = await generateImage(prompt, imgPath);
      if (!ok) cfAvailable = false;
      imagePaths.push(ok ? imgPath : null);
    } else {
      imagePaths.push(null);
    }
  }

  // 2. Gerar HTML
  console.log("\n[2/4] HTML editorial...");
  const htmlContent = generateHTML(config.slides, dg, config.tenantSlug, imagePaths);
  const htmlPath = path.join(baseDir, "carrossel.html");
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`  HTML: ${htmlPath}`);

  // 3. Render PNGs
  console.log("\n[3/4] Render Playwright...");
  const igDir = path.join(baseDir, "instagram");
  const count = await renderSlides(htmlPath, igDir);
  console.log(`  ${count} slides renderizados`);

  // 4. Legenda + DB
  console.log("\n[4/4] Legenda + banco...");
  const legendaPath = path.join(baseDir, "legenda.md");
  fs.writeFileSync(legendaPath, `# Legenda Instagram\n\n${config.legendaBody}\n\n---\n\n${config.hashtags}\n`);
  console.log(`  Legenda: ${legendaPath}`);

  if (config.carrosselId) {
    await updateDB(config.carrosselId, config.slides, config.legendaBody, config.hashtags);
  }

  console.log(`\n✓ Carrossel pronto em: ${baseDir}`);
  console.log(`  PNGs: ${igDir}/`);
})().catch((e) => {
  console.error("Erro fatal:", e.message);
  process.exit(1);
});
