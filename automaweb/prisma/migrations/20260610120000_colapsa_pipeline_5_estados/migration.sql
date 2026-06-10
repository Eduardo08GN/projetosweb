-- Colapsa o pipeline de 8 pra 5 estados e adiciona campos do robo de publicacao.
-- Mapeamento: BACKLOG/EM_PRODUCAO/REVISAO_INTERNA/AJUSTE_PEDIDO -> PRODUZIR
--             AGUARDANDO_CLIENTE -> APROVACAO
--             APROVADO/AGENDADO/PUBLICADO -> inalterados

-- Campos novos
ALTER TABLE "Carrossel" ADD COLUMN "ajustePedido" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Carrossel" ADD COLUMN "postId" TEXT;
ALTER TABLE "Carrossel" ADD COLUMN "erroPublicacao" TEXT;
ALTER TABLE "Carrossel" ADD COLUMN "tentativasPublicacao" INTEGER NOT NULL DEFAULT 0;

-- Preserva a informacao de ajuste pedido antes de remapear o enum
UPDATE "Carrossel" SET "ajustePedido" = true WHERE "status" = 'AJUSTE_PEDIDO';

-- Troca do enum
ALTER TYPE "PipelineStatus" RENAME TO "PipelineStatus_old";
CREATE TYPE "PipelineStatus" AS ENUM ('PRODUZIR', 'APROVACAO', 'APROVADO', 'AGENDADO', 'PUBLICADO');

ALTER TABLE "Carrossel" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Carrossel" ALTER COLUMN "status" TYPE "PipelineStatus" USING (
  CASE "status"::text
    WHEN 'BACKLOG' THEN 'PRODUZIR'
    WHEN 'EM_PRODUCAO' THEN 'PRODUZIR'
    WHEN 'REVISAO_INTERNA' THEN 'PRODUZIR'
    WHEN 'AJUSTE_PEDIDO' THEN 'PRODUZIR'
    WHEN 'AGUARDANDO_CLIENTE' THEN 'APROVACAO'
    ELSE "status"::text
  END
)::"PipelineStatus";
ALTER TABLE "Carrossel" ALTER COLUMN "status" SET DEFAULT 'PRODUZIR';

DROP TYPE "PipelineStatus_old";
