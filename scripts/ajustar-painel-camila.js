// Ajustes pontuais pro painel da Dra. Camila refletir o fluxo real.
// Uso: node scripts/ajustar-painel-camila.js <fase>   (pre | pos)
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
const fase = process.argv[2];

async function main() {
  if (fase === "pre") {
    // libera o clareamento pro fluxo de entrega (exige PRODUZIR)
    const r = await p.query(
      `UPDATE "Carrossel" SET status = 'PRODUZIR'
       WHERE id = 'cmq64pch30006i8uebio39hn2' RETURNING titulo, status`
    );
    console.log("pre:", JSON.stringify(r.rows[0]));
  } else if (fase === "publicado") {
    // clareamento produzido de verdade (arte + legenda no R2): volta ao
    // estado PUBLICADO que o registro ja tinha, agora com conteudo completo
    const r = await p.query(
      `UPDATE "Carrossel" SET status = 'PUBLICADO', "publicadoEm" = '2026-06-08T13:30:00Z'
       WHERE id = 'cmq64pch30006i8uebio39hn2' RETURNING titulo, status, "publicadoEm"`
    );
    console.log(JSON.stringify(r.rows[0]));
  } else if (fase === "agenda") {
    // a escova estava agendada pra data ja vencida: move pra frente
    const r = await p.query(
      `UPDATE "Carrossel" SET "agendadoPara" = '2026-06-16T13:00:00Z'
       WHERE id = 'cmq64pckr0007i8ue8qkao70s' RETURNING titulo, "agendadoPara"`
    );
    console.log(JSON.stringify(r.rows[0]));
  } else if (fase === "fila") {
    // proximo item real do calendario editorial da Camila entra na fila
    const r = await p.query(
      `INSERT INTO "Carrossel" (id, titulo, angulo, status, "tenantId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'Pos-clareamento: o que evitar nas primeiras 48 horas',
               'Cuidado pratico', 'PRODUZIR', 'tenant-dracamila', NOW(), NOW())
       RETURNING titulo, status`
    );
    console.log(JSON.stringify(r.rows[0]));
  } else if (fase === "planos") {
    // planos comerciais reais: Completo, 6 meses inclusos, recorrencia 215
    const r = await p.query(
      `UPDATE "Tenant" SET
         plano = 'Completo',
         "planoInicio" = COALESCE("planoInicio", "createdAt"),
         "planoValidoAte" = COALESCE("planoValidoAte", "createdAt" + interval '6 months'),
         "planoMensalidade" = COALESCE("planoMensalidade", 215)
       RETURNING name, plano, "planoValidoAte", "planoMensalidade"`
    );
    console.table(r.rows);
  } else if (fase === "pos") {
    // clareamento ja entregue: volta pro estado publicado com data real
    await p.query(
      `UPDATE "Carrossel" SET status = 'PUBLICADO', "publicadoEm" = '2026-06-08T13:30:00Z'
       WHERE id = 'cmq64pch30006i8uebio39hn2'`
    );
    // escova: agendamento futuro coerente
    await p.query(
      `UPDATE "Carrossel" SET "agendadoPara" = '2026-06-16T13:00:00Z'
       WHERE id = 'cmq64pckr0007i8ue8qkao70s'`
    );
    // fila de producao da Camila nao pode estar vazia
    await p.query(
      `INSERT INTO "Carrossel" (id, titulo, angulo, status, "tenantId", "createdAt", "updatedAt")
       SELECT gen_random_uuid(), 'Pos-clareamento: o que evitar nas primeiras 48 horas',
              'Cuidado pratico', 'PRODUZIR', 'tenant-dracamila', NOW(), NOW()
       WHERE NOT EXISTS (
         SELECT 1 FROM "Carrossel"
         WHERE "tenantId" = 'tenant-dracamila' AND status = 'PRODUZIR'
       )`
    );
    // planos: Completo com 6 meses inclusos pra todos os tenants ativos
    await p.query(
      `UPDATE "Tenant" SET
         plano = 'Completo',
         "planoInicio" = COALESCE("planoInicio", "createdAt"),
         "planoValidoAte" = COALESCE("planoValidoAte", "createdAt" + interval '6 months'),
         "planoMensalidade" = COALESCE("planoMensalidade", 215)`
    );
    const check = await p.query(
      `SELECT titulo, status, "agendadoPara", "publicadoEm",
        jsonb_array_length(COALESCE(slides,'[]'::jsonb)) AS nslides
       FROM "Carrossel" WHERE "tenantId" = 'tenant-dracamila' ORDER BY "createdAt"`
    );
    console.table(check.rows);
    const planos = await p.query(
      `SELECT name, plano, "planoValidoAte", "planoMensalidade" FROM "Tenant"`
    );
    console.table(planos.rows);
  } else {
    console.error("Uso: node scripts/ajustar-painel-camila.js <pre|pos>");
    process.exit(1);
  }
  await p.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
