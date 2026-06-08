const fs = require("fs");
const path = require("path");

const ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const IG_USER_ID = process.env.META_IG_USER_ID;
const API_VERSION = "v21.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

if (!ACCESS_TOKEN || !IG_USER_ID) {
  console.error("Faltando META_PAGE_ACCESS_TOKEN ou META_IG_USER_ID no .env");
  process.exit(1);
}

const carouselDir = process.argv[2];

if (!carouselDir) {
  console.error("Uso: node postar-instagram.js <pasta-do-angulo>");
  console.error("Ex: node postar-instagram.js marketing/conteudo/carrossel-tema-2026-06-08/angulo-1");
  console.error("\nA pasta deve conter:");
  console.error("  instagram/urls.json  (URLs publicas dos slides)");
  console.error("  legenda.md           (caption do post)");
  process.exit(1);
}

async function metaApi(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  const body = { access_token: ACCESS_TOKEN, ...params };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(`Meta API: ${data.error.message} (code ${data.error.code})`);
  }

  return data;
}

async function postCarousel(carouselDir) {
  const absDir = path.resolve(carouselDir);

  const urlsPath = path.join(absDir, "instagram", "urls.json");
  if (!fs.existsSync(urlsPath)) {
    throw new Error(`urls.json nao encontrado em ${urlsPath}. Rode upload-r2.js primeiro.`);
  }

  const urls = JSON.parse(fs.readFileSync(urlsPath, "utf-8"));
  const slideUrls = Object.entries(urls)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);

  if (slideUrls.length < 2) {
    throw new Error(`Carrossel precisa de no minimo 2 slides, encontrado ${slideUrls.length}`);
  }

  if (slideUrls.length > 10) {
    throw new Error(`Instagram permite max 10 slides, encontrado ${slideUrls.length}`);
  }

  const legendaPath = path.join(absDir, "legenda.md");
  let caption = "";
  if (fs.existsSync(legendaPath)) {
    caption = fs.readFileSync(legendaPath, "utf-8").trim();
  } else {
    console.warn("Aviso: legenda.md nao encontrada, postando sem caption");
  }

  console.log(`Criando containers pra ${slideUrls.length} slides...`);

  const childrenIds = [];
  for (let i = 0; i < slideUrls.length; i++) {
    const result = await metaApi(`/${IG_USER_ID}/media`, {
      image_url: slideUrls[i],
      is_carousel_item: true,
    });
    childrenIds.push(result.id);
    console.log(`  Slide ${i + 1}: container ${result.id}`);
  }

  console.log("Criando container do carrossel...");

  const carousel = await metaApi(`/${IG_USER_ID}/media`, {
    media_type: "CAROUSEL",
    children: childrenIds.join(","),
    caption,
  });

  console.log(`Container carrossel: ${carousel.id}`);

  await waitForContainer(carousel.id);

  console.log("Publicando...");

  const publish = await metaApi(`/${IG_USER_ID}/media_publish`, {
    creation_id: carousel.id,
  });

  const postUrl = `https://www.instagram.com/p/${publish.id}/`;
  console.log(`\nPublicado: ${postUrl}`);
  console.log(`Post ID: ${publish.id}`);

  return publish;
}

async function waitForContainer(containerId, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const url = `${BASE_URL}/${containerId}?fields=status_code,status&access_token=${ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status_code === "FINISHED") {
      return;
    }

    if (data.status_code === "ERROR") {
      throw new Error(`Container falhou: ${data.status || "erro desconhecido"}`);
    }

    console.log(`  Aguardando container... (${data.status_code || "processing"})`);
    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error("Timeout esperando container ficar pronto");
}

postCarousel(carouselDir).catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
