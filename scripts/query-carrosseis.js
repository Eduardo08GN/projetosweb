const { Pool } = require("pg");
const p = new Pool({ connectionString: "postgresql://automaweb:Automaweb2026Prod@159.195.12.135:5433/automaweb" });
p.query(`SELECT c.id, c.titulo, c.angulo, c.status, t.id as "tenantId", t.name, t.slug
  FROM "Carrossel" c JOIN "Tenant" t ON c."tenantId" = t.id
  ORDER BY c."createdAt" DESC`)
  .then(r => { console.log(JSON.stringify(r.rows, null, 2)); p.end(); })
  .catch(e => { console.error(e.message); p.end(); });
