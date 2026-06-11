-- Lei do loop unico: o cliente edita no maximo uma vez.
-- edicaoPendente guarda o pedido (texto/imagem por slide) ate a fabrica
-- re-renderizar; editadoPeloCliente trava novas edicoes pra sempre.
ALTER TABLE "Carrossel" ADD COLUMN "edicaoPendente" JSONB;
ALTER TABLE "Carrossel" ADD COLUMN "editadoPeloCliente" BOOLEAN NOT NULL DEFAULT false;
