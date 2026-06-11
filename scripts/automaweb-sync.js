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
 *   node scripts/automaweb-sync.js ajustes
 *     Lista as edicoes que clientes fizeram (texto/fundo por slide) e que
 *     a fabrica precisa aplicar. Processar = re-renderizar os slides
 *     editados, re-subir pro MESMO prefixo do R2 (URLs nao mudam) e rodar
 *     o comando ajustado.
 *
 *   node scripts/automaweb-sync.js ajustado <carrosselId>
 *     Marca a edicao como aplicada: limpa edicaoPendente e, se o tenant
 *     tem Instagram conectado e data marcada, move pra AGENDADO (o robo
 *     da plataforma publica sozinho na data).
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

// -- comando: ajustes --

async function ajustes() {
  const rows = await withDb((db) =>
    db
      .query(
        `SELECT c.id, c.titulo, c.status, c.slides, c."edicaoPendente",
                c."agendadoPara", t.name AS tenant, t.slug,
                mc.status AS conexao
           FROM "Carrossel" c
           JOIN "Tenant" t ON t.id = c."tenantId"
           LEFT JOIN "MetaConnection" mc ON mc."tenantId" = t.id
          WHERE c."edicaoPendente" IS NOT NULL
          ORDER BY c."updatedAt" ASC`
      )
      .then((r) => r.rows)
  );

  if (rows.length === 0) {
    console.log("Nenhuma edicao de cliente pendente.");
    return;
  }

  for (const row of rows) {
    console.log(`\n${row.titulo} (${row.tenant}, id: ${row.id})`);
    console.log(
      `  agendado: ${row.agendadoPara ?? "sem data"} | conexao: ${row.conexao ?? "sem conexao"}`
    );
    const slides = row.slides ?? [];
    for (const edit of row.edicaoPendente) {
      console.log(`  slide ${edit.slide + 1}:`);
      if (edit.texto) console.log(`    novo texto: "${edit.texto}"`);
      if (edit.imagemUrl) console.log(`    novo fundo: ${edit.imagemUrl}`);
      if (slides[edit.slide]) console.log(`    slide atual: ${slides[edit.slide]}`);
    }
  }
  console.log(
    `\n${rows.length} edicao(oes) pendente(s). Re-renderize os slides, re-suba pro MESMO prefixo do R2 e rode: node scripts/automaweb-sync.js ajustado <id>`
  );
}

// -- comando: ajustado --

async function ajustado(carrosselId) {
  const row = await withDb(async (db) => {
    const res = await db.query(
      `SELECT c.id, c.titulo, c.status, c."agendadoPara", c."edicaoPendente",
              t.name AS tenant, mc.status AS conexao
         FROM "Carrossel" c
         JOIN "Tenant" t ON t.id = c."tenantId"
         LEFT JOIN "MetaConnection" mc ON mc."tenantId" = t.id
        WHERE c.id = $1`,
      [carrosselId]
    );
    return res.rows[0];
  });

  if (!row) {
    console.error(`Carrossel ${carrosselId} nao encontrado.`);
    process.exit(1);
  }
  if (!row.edicaoPendente) {
    console.log(`"${row.titulo}" nao tem edicao pendente. Nada a fazer.`);
    return;
  }

  const agendar =
    row.conexao === "CONECTADO" && row.agendadoPara && row.status === "APROVADO";

  await withDb((db) =>
    db.query(
      `UPDATE "Carrossel"
          SET "edicaoPendente" = NULL,
              status = $1,
              "updatedAt" = NOW()
        WHERE id = $2`,
      [agendar ? "AGENDADO" : row.status, carrosselId]
    )
  );

  console.log(
    `Edicao de "${row.titulo}" (${row.tenant}) aplicada.` +
      (agendar
        ? ` Movido pra AGENDADO: o robo publica em ${row.agendadoPara}.`
        : ` Status mantido em ${row.status} (sem conexao ou sem data).`)
  );
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
  } else if (comando === "ajustes") {
    await ajustes();
  } else if (comando === "ajustado") {
    if (!args[0]) {
      console.error("Uso: node scripts/automaweb-sync.js ajustado <carrosselId>");
      process.exit(1);
    }
    await ajustado(args[0]);
  } else {
    console.error(
      "Uso:\n  node scripts/automaweb-sync.js fila\n  node scripts/automaweb-sync.js entregar <pasta> [carrosselId]\n  node scripts/automaweb-sync.js ajustes\n  node scripts/automaweb-sync.js ajustado <carrosselId>"
    );
    process.exit(1);
  }
})().catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
