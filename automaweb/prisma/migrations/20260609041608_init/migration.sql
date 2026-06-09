-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER', 'TENANT');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PROSPECT', 'ATIVO', 'PAUSADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('BACKLOG', 'EM_PRODUCAO', 'REVISAO_INTERNA', 'AGUARDANDO_CLIENTE', 'APROVADO', 'AGENDADO', 'PUBLICADO', 'AJUSTE_PEDIDO');

-- CreateEnum
CREATE TYPE "AgendaStatus" AS ENUM ('AGENDADO', 'PUBLICADO', 'FALHOU', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SiteFase" AS ENUM ('PRE_FECHAMENTO', 'POS_FECHAMENTO');

-- CreateEnum
CREATE TYPE "SiteStatus" AS ENUM ('RASCUNHO', 'EM_DESENVOLVIMENTO', 'REVISAO', 'PUBLICADO', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "MetaConnectionStatus" AS ENUM ('DESCONECTADO', 'CONECTADO', 'TOKEN_EXPIRADO', 'ERRO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TENANT',
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "status" "TenantStatus" NOT NULL DEFAULT 'PROSPECT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaConnection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "igUserId" TEXT,
    "igUsername" TEXT,
    "igProfilePic" TEXT,
    "pageId" TEXT,
    "pageName" TEXT,
    "accessToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "connectedAt" TIMESTAMP(3),
    "status" "MetaConnectionStatus" NOT NULL DEFAULT 'DESCONECTADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetaConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carrossel" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "status" "PipelineStatus" NOT NULL DEFAULT 'BACKLOG',
    "angulo" TEXT,
    "slides" JSONB,
    "legendaBody" TEXT,
    "hashtags" TEXT,
    "operador" TEXT,
    "agendadoPara" TIMESTAMP(3),
    "publicadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrossel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaPost" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "carrosselId" TEXT,
    "plataforma" TEXT NOT NULL,
    "agendadoPara" TIMESTAMP(3) NOT NULL,
    "publicadoEm" TIMESTAMP(3),
    "status" "AgendaStatus" NOT NULL DEFAULT 'AGENDADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgendaPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomacaoDM" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "resposta" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "disparos" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomacaoDM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteracaoDM" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "igUserId" TEXT NOT NULL,
    "igUsername" TEXT,
    "keyword" TEXT NOT NULL,
    "respondido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteracaoDM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dominio" TEXT,
    "urlPreview" TEXT,
    "fase" "SiteFase" NOT NULL DEFAULT 'PRE_FECHAMENTO',
    "status" "SiteStatus" NOT NULL DEFAULT 'RASCUNHO',
    "stack" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MetaConnection_tenantId_key" ON "MetaConnection"("tenantId");

-- CreateIndex
CREATE INDEX "Carrossel_tenantId_idx" ON "Carrossel"("tenantId");

-- CreateIndex
CREATE INDEX "Carrossel_status_idx" ON "Carrossel"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AgendaPost_carrosselId_key" ON "AgendaPost"("carrosselId");

-- CreateIndex
CREATE INDEX "AgendaPost_tenantId_idx" ON "AgendaPost"("tenantId");

-- CreateIndex
CREATE INDEX "AgendaPost_agendadoPara_idx" ON "AgendaPost"("agendadoPara");

-- CreateIndex
CREATE INDEX "AutomacaoDM_tenantId_idx" ON "AutomacaoDM"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "AutomacaoDM_tenantId_keyword_key" ON "AutomacaoDM"("tenantId", "keyword");

-- CreateIndex
CREATE INDEX "InteracaoDM_tenantId_idx" ON "InteracaoDM"("tenantId");

-- CreateIndex
CREATE INDEX "InteracaoDM_createdAt_idx" ON "InteracaoDM"("createdAt");

-- CreateIndex
CREATE INDEX "Site_tenantId_idx" ON "Site"("tenantId");

-- CreateIndex
CREATE INDEX "Site_fase_idx" ON "Site"("fase");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaConnection" ADD CONSTRAINT "MetaConnection_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrossel" ADD CONSTRAINT "Carrossel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaPost" ADD CONSTRAINT "AgendaPost_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaPost" ADD CONSTRAINT "AgendaPost_carrosselId_fkey" FOREIGN KEY ("carrosselId") REFERENCES "Carrossel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomacaoDM" ADD CONSTRAINT "AutomacaoDM_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteracaoDM" ADD CONSTRAINT "InteracaoDM_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
