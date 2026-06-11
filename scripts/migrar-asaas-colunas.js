// Migracao aditiva autorizada: colunas de cobranca Asaas + tabela de
// eventos. Somente ADD COLUMN / CREATE INDEX / CREATE TABLE — nada e
// alterado nem removido.
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

const ddl = [
  `ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "documento" TEXT`,
  `ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "asaasCustomerId" TEXT`,
  `ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "asaasSubscriptionId" TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_asaasCustomerId_key" ON "Tenant"("asaasCustomerId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_asaasSubscriptionId_key" ON "Tenant"("asaasSubscriptionId")`,
  `CREATE TABLE IF NOT EXISTS "AsaasEvento" (
     "id" TEXT PRIMARY KEY,
     "evento" TEXT NOT NULL,
     "processadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
   )`,
];

async function main() {
  for (const sql of ddl) {
    await p.query(sql);
    console.log("ok:", sql.split("\n")[0].trim());
  }
  await p.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
