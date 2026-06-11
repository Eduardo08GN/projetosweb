// Inspeciona o estado dos carrosseis da Dra. Camila e planos dos tenants.
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

async function main() {
  const carrosseis = await p.query(`
    SELECT id, titulo, status, "agendadoPara", "publicadoEm", "postId",
      jsonb_array_length(COALESCE(slides, '[]'::jsonb)) AS nslides,
      length(COALESCE("legendaBody", '')) AS nlegenda,
      length(COALESCE(hashtags, '')) AS nhash
    FROM "Carrossel" WHERE "tenantId" = 'tenant-dracamila'
    ORDER BY "createdAt" DESC`);
  console.log("CARROSSEIS CAMILA:");
  console.table(carrosseis.rows);

  const tenants = await p.query(`
    SELECT id, name, plano, "planoInicio", "planoValidoAte", "planoMensalidade"
    FROM "Tenant" ORDER BY "createdAt"`);
  console.log("TENANTS/PLANOS:");
  console.table(tenants.rows);
  await p.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
