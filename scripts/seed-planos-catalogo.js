// Popula o catalogo de planos de continuidade (idempotente).
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
for (const file of [path.join(ROOT, ".env"), path.join(ROOT, "automaweb", ".env")]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const { Pool } = require("pg");
const p = new Pool({ connectionString: process.env.DATABASE_URL });

const planos = [
  {
    nome: "Conteudo",
    valor: 120,
    descricao: "4 carrosseis por semana, publicados direto no seu Instagram",
    destaque: false,
    ordem: 1,
  },
  {
    nome: "Conteudo + Mensagens",
    valor: 215,
    descricao: "Tudo do plano Conteudo, mais respostas automaticas no seu Direct",
    destaque: true,
    ordem: 2,
  },
];

async function main() {
  for (const plano of planos) {
    await p.query(
      `INSERT INTO "PlanoCatalogo" (id, nome, valor, descricao, destaque, ordem, ativo, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW())
       ON CONFLICT (nome) DO NOTHING`,
      [plano.nome, plano.valor, plano.descricao, plano.destaque, plano.ordem]
    );
  }
  const r = await p.query('SELECT nome, valor, destaque FROM "PlanoCatalogo" ORDER BY ordem');
  console.table(r.rows);
  await p.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
