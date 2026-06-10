// Cria um carrossel no banco da AutomaWeb (status PRODUZIR).
// Uso: node scripts/create-carrossel-db.js "<titulo>" "<angulo>" [tenantId]

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

const titulo = process.argv[2];
const angulo = process.argv[3] || null;
const tenantId = process.argv[4] || "tenant-profrodger";

if (!titulo) {
  console.error('Uso: node scripts/create-carrossel-db.js "<titulo>" "<angulo>" [tenantId]');
  process.exit(1);
}

p.query(
  `INSERT INTO "Carrossel" (id, titulo, angulo, status, "tenantId", "createdAt", "updatedAt")
   VALUES (gen_random_uuid(), $1, $2, 'PRODUZIR', $3, NOW(), NOW())
   RETURNING id, titulo, status`,
  [titulo, angulo, tenantId]
).then(r => {
  console.log(JSON.stringify(r.rows[0]));
  p.end();
}).catch(e => { console.error(e.message); p.end(); process.exit(1); });
