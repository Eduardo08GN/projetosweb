#!/usr/bin/env node
/**
 * automaweb-sync.js -- a ponte entre a fabrica (MazyOS) e a plataforma (AutomaWeb).
 *
 * Comandos:
 *   node scripts/automaweb-sync.js fila
 *     Lista o que esta na coluna PRODUZIR, por cliente. E a fila de producao.
 *
 *   node scripts/automaweb-sync.js entregar <pasta> [carrosselId]
 *     Fim da producao de um carrossel:
 *       1. Acha os slide-*.png e a legenda.md na pasta (busca recursiva)
 *       2. Sobe os PNGs pro R2 (reusa scripts/upload-r2.js)
 *       3. Grava slides (URLs), legenda e hashtags no banco
 *       4. Move o status pra APROVACAO (vai pro cliente aprovar)
 *     Sem carrosselId, tenta casar a pasta com um carrossel em PRODUZIR
 *     e lista os candidatos se ficar em duvida.
 *
 * Env: le .env da raiz (Cloudflare/R2) e automaweb/.env (DATABASE_URL).
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

// -- env --

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    if (process.env[key] !== undefined) continue;
    process.env[key] = raw.replace(/^["']|["']$/g, "");
  }
}

loadEnvFile(path.join(ROOT, ".env"));
loadEnvFile(path.join(ROOT, "automaweb", ".env"));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL nao encontrada (esperada em automaweb/.env)");
  process.exit(1);
}

const { Client } = require("pg");

async function withDb(fn) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

// -- helpers --

function findFilesRecursive(dir, matcher, depth = 3) {
  if (depth < 0 || !fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findFilesRecursive(full, matcher, depth - 1));
    } else if (matcher(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function parseLegenda(legendaPath) {
  const raw = fs.readFileSync(legendaPath, "utf8").trim();
  const lines = raw.split(/\r?\n/);

  // hashtags: linhas do fim do arquivo compostas so de #tags
  const hashtagLines = [];
  while (lines.length > 0) {
    const last = lines[lines.length - 1].trim();
    if (last === "") {
      lines.pop();
      continue;
    }
    if (/^(#[\p{L}\p{N}_]+\s*)+$/u.test(last)) {
      hashtagLines.unshift(lines.pop().trim());
    } else {
      break;
    }
  }

  return {
    legendaBody: lines.join("\n").trim(),
    hashtags: hashtagLines.join(" ").trim() || null,
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// -- comando: fila --

async function fila() {
  const rows = await withDb((db) =>
    db
      .query(
        `SELECT c.id, c.titulo, c.angulo, c."ajustePedido", c."feedbackCliente",
                c."updatedAt", t.name AS tenant, t.slug
           FROM "Carrossel" c
           JOIN "Tenant" t ON t.id = c."tenantId"
          WHERE c.status = 'PRODUZIR'
          ORDER BY t.name, c."updatedAt" ASC`
      )
      .then((r) => r.rows)
  );

  if (rows.length === 0) {
    console.log("Fila vazia. Nenhum carrossel pra produzir.");
    return;
  }

  let tenantAtual = "";
  for (const row of rows) {
    if (row.tenant !== tenantAtual) {
      tenantAtual = row.tenant;
      console.log(`\n${row.tenant} (${row.slug})`);
    }
    const dias = Math.floor(
      (Date.now() - new Date(row.updatedAt).getTime()) / 86400000
    );
    const ajuste = row.ajustePedido
      ? `  [AJUSTE PEDIDO: ${row.feedbackCliente ?? "sem detalhe"}]`
      : "";
    console.log(
      `  - ${row.titulo}  (${row.angulo ?? "sem angulo"}, ${dias}d parado, id: ${row.id})${ajuste}`
    );
  }
  console.log(
    `\n${rows.length} carrossel(eis) na fila. Produza e rode: node scripts/automaweb-sync.js entregar <pasta> <id>`
  );
}

// -- comando: entregar --

async function entregar(pasta, carrosselId) {
  const absPasta = path.resolve(pasta);
  if (!fs.existsSync(absPasta)) {
    console.error(`Pasta nao encontrada: ${absPasta}`);
    process.exit(1);
  }

  // 1. achar slides e legenda
  const slidePaths = findFilesRecursive(absPasta, (n) =>
    /^slide-\d+\.png$/.test(n)
  ).sort((a, b) => path.basename(a).localeCompare(path.basename(b)));

  if (slidePaths.length === 0) {
    console.error(`Nenhum slide-*.png encontrado em ${absPasta}`);
    process.exit(1);
  }

  const legendaPaths = findFilesRecursive(absPasta, (n) => n === "legenda.md");
  const legenda = legendaPaths.length > 0 ? parseLegenda(legendaPaths[0]) : null;

  // 2. achar o carrossel no banco
  const candidatos = await withDb((db) =>
    db
      .query(
        `SELECT c.id, c.titulo, t.name AS tenant, t.slug
           FROM "Carrossel" c
           JOIN "Tenant" t ON t.id = c."tenantId"
          WHERE c.status = 'PRODUZIR'`
      )
      .then((r) => r.rows)
  );

  let alvo = null;
  if (carrosselId) {
    alvo = candidatos.find((c) => c.id === carrosselId);
    if (!alvo) {
      console.error(
        `Carrossel ${carrosselId} nao esta em PRODUZIR. Candidatos:\n` +
          candidatos.map((c) => `  ${c.id}  ${c.tenant} -- ${c.titulo}`).join("\n")
      );
      process.exit(1);
    }
  } else {
    // tenta casar o nome da pasta com o titulo
    const pastaSlug = slugify(path.basename(absPasta));
    const matches = candidatos.filter((c) => {
      const tituloSlug = slugify(c.titulo);
      return (
        pastaSlug.includes(tituloSlug) ||
        tituloSlug.includes(pastaSlug) ||
        tituloSlug
          .split("-")
          .filter((w) => w.length > 3)
          .filter((w) => pastaSlug.includes(w)).length >= 2
      );
    });
    if (matches.length === 1) {
      alvo = matches[0];
    } else {
      console.error(
        matches.length === 0
          ? "Nao consegui casar a pasta com nenhum carrossel em PRODUZIR."
          : "Mais de um carrossel casa com essa pasta."
      );
      console.error(
        "Passe o id: node scripts/automaweb-sync.js entregar <pasta> <id>\n\nEm PRODUZIR:\n" +
          candidatos.map((c) => `  ${c.id}  ${c.tenant} -- ${c.titulo}`).join("\n")
      );
      process.exit(1);
    }
  }

  console.log(`Entregando "${alvo.titulo}" (${alvo.tenant})`);
  console.log(`  ${slidePaths.length} slides, legenda: ${legenda ? "sim" : "NAO ACHEI"}`);

  // 3. upload pro R2 (reusa upload-r2.js: sobe a pasta dos slides)
  const slidesDir = path.dirname(slidePaths[0]);
  const prefix = `carrosseis/${alvo.slug}/${alvo.id}/`;
  execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", "upload-r2.js"), slidesDir, prefix],
    { stdio: "inherit" }
  );

  const urls = JSON.parse(
    fs.readFileSync(path.join(slidesDir, "urls.json"), "utf8")
  );
  const slideUrls = Object.keys(urls)
    .sort()
    .map((k) => urls[k]);

  // 4. gravar no banco e mover pra APROVACAO
  await withDb((db) =>
    db.query(
      `UPDATE "Carrossel"
          SET slides = $1::jsonb,
              "legendaBody" = COALESCE($2, "legendaBody"),
              hashtags = COALESCE($3, hashtags),
              status = 'APROVACAO',
              "ajustePedido" = false,
              "erroPublicacao" = NULL,
              "updatedAt" = NOW()
        WHERE id = $4`,
      [
        JSON.stringify(slideUrls),
        legenda?.legendaBody ?? null,
        legenda?.hashtags ?? null,
        alvo.id,
      ]
    )
  );

  console.log(
    `\nPronto. "${alvo.titulo}" foi pra aprovacao do cliente (${alvo.tenant}).`
  );
  console.log(`Slides no R2: ${slideUrls.length}`);
}

// -- main --

const [, , comando, ...args] = process.argv;

(async () => {
  if (comando === "fila") {
    await fila();
  } else if (comando === "entregar") {
    if (!args[0]) {
      console.error(
        "Uso: node scripts/automaweb-sync.js entregar <pasta> [carrosselId]"
      );
      process.exit(1);
    }
    await entregar(args[0], args[1]);
  } else {
    console.error(
      "Uso:\n  node scripts/automaweb-sync.js fila\n  node scripts/automaweb-sync.js entregar <pasta> [carrosselId]"
    );
    process.exit(1);
  }
})().catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
