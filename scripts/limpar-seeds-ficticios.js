// Remove os dados ficticios criados pelo seed de desenvolvimento que
// ainda estavam no banco de producao. Tudo apagado por ID explicito;
// conteudo real (criado pela fabrica de carrosseis) nao e tocado.
//
// Rodar de dentro de automaweb/: node ../scripts/limpar-seeds-ficticios.js

require("dotenv").config();
const { Client } = require("pg");

// carrosseis inventados pelo seed (titulos como "5 erros que travam seu
// ingles"); os reais usam UUID e ficam fora desta lista
const SEED_CARROSSEIS = [
  "cmq64pbxq0001i8ueiyn2l0z5", // 5 erros que travam seu ingles (PUBLICADO falso)
  "cmq64pc1h0002i8ueh3s0nu7p", // Phrasal verbs do dia a dia (AGENDADO 15/06 — o robo ia tentar publicar)
  "cmq64pc560003i8ueim89xyeo", // Como pensar em ingles
  "cmq64pc9p0004i8uef4vxb84l", // Listening: serie vs podcast
  "cmq64pcde0005i8ueg6831r8f", // Pronuncia que brasileiros erram
  "cmq64pch30006i8uebio39hn2", // Clareamento dental: mitos e verdades (PUBLICADO falso)
  "cmq64pckr0007i8ue8qkao70s", // Quando trocar a escova de dente (AGENDADO 16/06)
  "cmq64pcof0008i8uerjkzrckh", // Lentes de contato dental (duplicado do real em APROVACAO)
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
    [SEED_CARROSSEIS]
  );
  console.log(`Carrosseis de seed: ${cars.rowCount} removido(s)`);

  const restantes = await c.query(
    `SELECT titulo, status FROM "Carrossel" ORDER BY "createdAt"`
  );
  console.log("Carrosseis que ficaram (reais):");
  for (const r of restantes.rows) console.log(` - ${r.titulo} [${r.status}]`);

  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
