import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Tenants
  const profRodger = await prisma.tenant.upsert({
    where: { slug: "prof-rodger" },
    update: {},
    create: {
      id: "tenant-profrodger",
      name: "Prof. Rodger Koller",
      slug: "prof-rodger",
      phone: "(51) 99999-0001",
      email: "rodger@profrodger.com.br",
      status: "ATIVO",
    },
  });

  const draCamila = await prisma.tenant.upsert({
    where: { slug: "dra-camila" },
    update: {},
    create: {
      id: "tenant-dracamila",
      name: "Dra. Camila Odonto",
      slug: "dra-camila",
      phone: "(11) 99999-0002",
      email: "camila@dracamilaodonto.com.br",
      status: "ATIVO",
    },
  });

  // Users
  const masterPass = await bcrypt.hash("admin123", 10);
  const rodgerPass = await bcrypt.hash("rodger123", 10);
  const camilaPass = await bcrypt.hash("camila123", 10);

  await prisma.user.upsert({
    where: { email: "admin@automaweb.com.br" },
    update: {},
    create: {
      id: "master-1",
      email: "admin@automaweb.com.br",
      name: "Eduardo",
      password: masterPass,
      role: "MASTER",
    },
  });

  await prisma.user.upsert({
    where: { email: "rodger@profrodger.com.br" },
    update: {},
    create: {
      id: "tenant-1",
      email: "rodger@profrodger.com.br",
      name: "Prof. Rodger Koller",
      password: rodgerPass,
      role: "TENANT",
      tenantId: profRodger.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "camila@dracamilaodonto.com.br" },
    update: {},
    create: {
      id: "tenant-2",
      email: "camila@dracamilaodonto.com.br",
      name: "Dra. Camila",
      password: camilaPass,
      role: "TENANT",
      tenantId: draCamila.id,
    },
  });

  // MetaConnection (Prof. Rodger connected)
  await prisma.metaConnection.upsert({
    where: { tenantId: profRodger.id },
    update: {},
    create: {
      tenantId: profRodger.id,
      igUserId: "17841400000000001",
      igUsername: "profrodgerkoller",
      pageId: "100000000000001",
      pageName: "Prof. Rodger Koller",
      status: "CONECTADO",
      connectedAt: new Date("2026-05-15"),
      tokenExpiresAt: new Date("2026-07-15"),
    },
  });

  // Carrosseis (Prof. Rodger)
  const carrosselData = [
    {
      tenantId: profRodger.id,
      titulo: "5 erros que travam seu ingles",
      status: "PUBLICADO" as const,
      angulo: "Erros comuns",
      operador: "Eduardo",
      publicadoEm: new Date("2026-06-01"),
    },
    {
      tenantId: profRodger.id,
      titulo: "Phrasal verbs do dia a dia",
      status: "APROVADO" as const,
      angulo: "Vocabulario pratico",
      operador: "Eduardo",
      agendadoPara: new Date("2026-06-10"),
    },
    {
      tenantId: profRodger.id,
      titulo: "Como pensar em ingles",
      status: "REVISAO_INTERNA" as const,
      angulo: "Mentalidade",
      operador: "Eduardo",
    },
    {
      tenantId: profRodger.id,
      titulo: "Listening: serie vs podcast",
      status: "EM_PRODUCAO" as const,
      angulo: "Comparativo",
      operador: "Eduardo",
    },
    {
      tenantId: profRodger.id,
      titulo: "Pronuncia que brasileiros erram",
      status: "BACKLOG" as const,
      angulo: "Pronuncia",
      operador: "Eduardo",
    },
  ];

  for (const c of carrosselData) {
    await prisma.carrossel.create({ data: c });
  }

  // Carrosseis (Dra. Camila)
  const camilaCarrosselData = [
    {
      tenantId: draCamila.id,
      titulo: "Clareamento dental: mitos e verdades",
      status: "PUBLICADO" as const,
      angulo: "Educativo",
      operador: "Eduardo",
      publicadoEm: new Date("2026-06-02"),
    },
    {
      tenantId: draCamila.id,
      titulo: "Quando trocar a escova de dente",
      status: "AGENDADO" as const,
      angulo: "Dica pratica",
      operador: "Eduardo",
      agendadoPara: new Date("2026-06-12"),
    },
    {
      tenantId: draCamila.id,
      titulo: "Lentes de contato dental",
      status: "EM_PRODUCAO" as const,
      angulo: "Procedimento",
      operador: "Eduardo",
    },
  ];

  for (const c of camilaCarrosselData) {
    await prisma.carrossel.create({ data: c });
  }

  // AutomacaoDM (Prof. Rodger)
  await prisma.automacaoDM.createMany({
    data: [
      {
        tenantId: profRodger.id,
        keyword: "EBOOK",
        resposta: "Opa! Aqui esta o link do seu ebook gratuito: https://profrodger.com.br/ebook",
        ativo: true,
        disparos: 234,
      },
      {
        tenantId: profRodger.id,
        keyword: "AULA",
        resposta: "Que bom que voce quer aprender! Assista a aula gratuita: https://profrodger.com.br/aula",
        ativo: true,
        disparos: 189,
      },
      {
        tenantId: profRodger.id,
        keyword: "PRECO",
        resposta: "Confira nossos planos aqui: https://profrodger.com.br/planos",
        ativo: false,
        disparos: 67,
      },
    ],
    skipDuplicates: true,
  });

  // InteracaoDM recent (Prof. Rodger)
  const now = new Date();
  const dmData = [];
  for (let i = 0; i < 15; i++) {
    const d = new Date(now);
    d.setHours(d.getHours() - i * 3);
    dmData.push({
      tenantId: profRodger.id,
      igUserId: `user_${1000 + i}`,
      igUsername: `aluno_${i + 1}`,
      keyword: i % 3 === 0 ? "EBOOK" : i % 3 === 1 ? "AULA" : "PRECO",
      respondido: true,
      createdAt: d,
    });
  }
  await prisma.interacaoDM.createMany({ data: dmData });

  // Sites
  await prisma.site.create({
    data: {
      tenantId: profRodger.id,
      dominio: "profrodgerkoller.com.br",
      urlPreview: "https://profrodgerkoller.com.br",
      fase: "POS_FECHAMENTO",
      status: "PUBLICADO",
      stack: "HTML + CSS + JS",
    },
  });

  await prisma.site.create({
    data: {
      tenantId: draCamila.id,
      fase: "PRE_FECHAMENTO",
      status: "RASCUNHO",
      notas: "Aguardando fechamento do contrato",
    },
  });

  console.log("Seed concluido com sucesso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
