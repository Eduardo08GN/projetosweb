const { Pool } = require("pg");
const p = new Pool({ connectionString: "postgresql://automaweb:Automaweb2026Prod@159.195.12.135:5433/automaweb" });

const titulo = process.argv[2] || "O sequestro do Alfredo";
const angulo = process.argv[3] || "Historia";
const tenantId = process.argv[4] || "tenant-profrodger";

p.query(
  `INSERT INTO "Carrossel" (id, titulo, angulo, status, "tenantId", "createdAt", "updatedAt")
   VALUES (gen_random_uuid(), $1, $2, 'EM_PRODUCAO', $3, NOW(), NOW())
   RETURNING id, titulo, status`,
  [titulo, angulo, tenantId]
).then(r => {
  console.log(JSON.stringify(r.rows[0]));
  p.end();
}).catch(e => { console.error(e.message); p.end(); });
