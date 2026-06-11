# Pendencia — Caixa de email contato@automaweb.pro

Status atual e tasklist pra resolver a caixa de email da marca. Hoje a
plataforma **envia** emails autenticados como `no_reply@automaweb.pro`
(Brevo, SPF + DKIM + DMARC configurados), mas ninguem **recebe** em
`contato@automaweb.pro` — a caixa nao existe.

---

## Contexto

- **Envio (resolvido):** avisos transacionais saem pelo Brevo como
  `no_reply@automaweb.pro`, dominio autenticado, entrega na inbox
- **Recebimento (pendente):** `contato@automaweb.pro` aparece na landing
  e no rodape dos emails, mas quem responder nao chega em ninguem
- **Avisos internos (paliativo aplicado):** o usuario master logava com
  `admin@automaweb.com.br` (caixa inexistente, alertas quicavam). Em
  11/06/2026 o login do master mudou pra `atm.eduardopaypal@gmail.com`
  (caixa real). Quando a caixa da marca existir, migrar de novo
- **API da Hostinger nao cria caixa de email** (verificado: so cobre
  dominios, DNS e VPS). Criacao de caixa e manual

## Decisao tomada

**Rota escolhida: Zoho Mail Forever Free** (5 caixas, 1 dominio, R$ 0).
Limite aceito: acesso so por webmail e app do Zoho (sem IMAP no plano
gratuito). Quem envia em volume e o Brevo; o Zoho so recebe e responde.

Alternativa descartada por ora: Hostinger Business Email (~R$ 9/mes),
fica como plano B se o Zoho gratuito deixar de atender.

---

## Tasklist

### Eduardo (~5 min)
- [ ] Criar conta no plano gratuito do Zoho Mail
      (`zoho.com/mail/zohomail-pricing.html`, secao "Forever Free Plan")
- [ ] Adicionar o dominio `automaweb.pro` na organizacao
- [ ] Copiar o codigo de verificacao TXT (`zoho-verification=zb...`) e
      mandar pro Claude no chat
- [ ] Na criacao do primeiro usuario, escolher **contato** (vira o super
      admin e nao da pra mudar depois)

### Claude (~2 min, via API da Hostinger)
- [ ] Adicionar TXT de verificacao do Zoho no DNS
- [ ] Adicionar os 3 MX: `mx.zoho.com` (10), `mx2.zoho.com` (20),
      `mx3.zoho.com` (50)
- [ ] **Fundir o SPF** num registro unico:
      `v=spf1 include:spf.brevo.com include:zohomail.com ~all`
      (atencao: NUNCA criar segundo registro SPF — quebra Brevo e Zoho)
- [ ] Adicionar o DKIM do Zoho (host + valor que o painel mostrar)
- [ ] Testar recebimento (enviar email externo pra contato@)

### Depois da caixa funcionando
- [ ] Trocar o login do master de `atm.eduardopaypal@gmail.com` pra
      `contato@automaweb.pro` (com confirmacao do Eduardo — muda o login)
- [ ] Conferir se os avisos internos chegam na caixa nova
- [ ] Opcional: criar caixas extras (ate 5 no total), ex. `lucas@`

---

## Registros DNS atuais relevantes (nao mexer sem entender)

| Tipo | Nome | Valor | Dono |
|------|------|-------|------|
| TXT | `@` | `brevo-code:...` | Brevo (verificacao) |
| TXT | `@` | `v=spf1 include:spf.brevo.com ~all` | Brevo (SPF — sera fundido com Zoho) |
| CNAME | `brevo1._domainkey` | `b1.automaweb-pro.dkim.brevo.com` | Brevo (DKIM) |
| CNAME | `brevo2._domainkey` | `b2.automaweb-pro.dkim.brevo.com` | Brevo (DKIM) |
| TXT | `_dmarc` | `v=DMARC1; p=none; ...` | DMARC |
