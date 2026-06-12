-- Hora de publicacao padrao por cliente: alguns tenants pedem horario
-- diferente. Null = usa o padrao global (13h Brasilia).
ALTER TABLE "Tenant" ADD COLUMN "horaPublicacaoPadrao" INTEGER;
