// Remove os dados ficticios do seed de desenvolvimento que ainda
// poluem o banco de producao. Tudo apagado por ID explicito.
//
// NAO toca nos registros da Dra. Camila: clareamento e lentes foram
// produzidos de verdade (arte + legenda no R2) e a escova esta em
// producao real. Os 5 do Rodger sao cascas vazias (0 slides, 0 legenda);
// os reais dele ("O sequestro do Alfredo", "Seu sotaque te entrega")
// usam UUID e ficam.
//
// Rodar de dentro de automaweb/: node ../scripts/limpar-seeds-ficticios.js

require("dotenv").config();
const { Client } = require("pg");

const SEED_CARROSSEIS_RODGER = [
  "cmq64pbxq0001i8ueiyn2l0z5", // 5 erros que travam seu ingles (PUBLICADO falso, sem conteudo)
  "cmq64pc1h0002i8ueh3s0nu7p", // Phrasal verbs do dia a dia (AGENDADO 15/06 sem slides — robo ia falhar)
  "cmq64pc560003i8ueim89xyeo", // Como pensar em ingles (vazio)
  "cmq64pc9p0004i8uef4vxb84l", // Listening: serie vs podcast (vazio)
  "cmq64pcde0005i8ueg6831r8f", // Pronuncia que brasileiros erram (vazio)
];

// automacoes de DM inventadas (EBOOK/AULA/PRECO com links que nao existem)
const SEED_AUTOMACOES = [
  "cmq64pcvr0009i8ue2kp3h16k",
  "cmq64pcvr000ai8uefo5opxmq",
  "cmq64pcvr000bi8ue8nvhcvu9",
];

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();

  // conexao Meta falsa do seed: marcada CONECTADO sem token nenhum
  const conn = await c.query(
    `DELETE FROM "MetaConnection"
     WHERE "tenantId" = 'tenant-profrodger'
       AND "igUserId" = '17841400000000001'
       AND "accessToken" IS NULL`
  );
  console.log(`MetaConnection falsa: ${conn.rowCount} removida(s)`);

  // interacoes de DM inventadas (aluno_1 ... aluno_15)
  const dms = await c.query(
    `DELETE FROM "InteracaoDM"
     WHERE "tenantId" = 'tenant-profrodger' AND "igUsername" LIKE 'aluno_%'`
  );
  console.log(`InteracaoDM falsas: ${dms.rowCount} removida(s)`);

  const autos = await c.query(
    `DELETE FROM "AutomacaoDM" WHERE id = ANY($1)`,
    [SEED_AUTOMACOES]
  );
  console.log(`AutomacaoDM falsas: ${autos.rowCount} removida(s)`);

  const cars = await c.query(
    `DELETE FROM "Carrossel" WHERE id = ANY($1)`,
    [SEED_CARROSSEIS_RODGER]
  );
  console.log(`Carrosseis vazios do Rodger: ${cars.rowCount} removido(s)`);

  const restantes = await c.query(
    `SELECT t.name AS cliente, c.titulo, c.status,
       jsonb_array_length(COALESCE(c.slides,'[]'::jsonb)) AS nslides
     FROM "Carrossel" c JOIN "Tenant" t ON t.id = c."tenantId"
     ORDER BY t.name, c."createdAt"`
  );
  console.log("Carrosseis que ficaram:");
  for (const r of restantes.rows)
    console.log(` - [${r.cliente}] ${r.titulo} [${r.status}] (${r.nslides} slides)`);

  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
