# Pendencias — Integracao Meta Multi-Tenant

Status atual e o que falta para o fluxo "one click" onde cada cliente conecta sua propria conta Meta direto pelo painel.

---

## Pronto

- **OAuth multi-tenant** — fluxo `/api/meta/auth` → `/api/meta/callback` com `tenantId` no state JWT, troca de token curto por longo (~60 dias), isolamento por tenant
- **Modelo de dados** — tabela `MetaConnection` com `igUserId`, `pageId`, `accessToken`, `tokenExpiresAt`, status (CONECTADO / DESCONECTADO / TOKEN_EXPIRADO / ERRO), FK pro tenant
- **Scheduler de tokens** — roda a cada hora, detecta tokens perto de expirar e marca status automaticamente
- **Publicacao agendada** — a cada minuto verifica carrosseis com `agendadoPara` e publica via Graph API v21.0
- **UI do tenant** — painel de integracoes com card de conexao, status animado, botao conectar/reconectar
- **Automacao DM (dados + UI)** — tabelas `AutomacaoDM` e `InteracaoDM` criadas, tela do tenant implementada

---

## Pendente

### 1. Webhook handler para Instagram

Rota que recebe eventos da Meta (comentarios em posts) e dispara DM automatica conforme as regras do tenant.

- Criar `/api/meta/webhooks/instagram/route.ts`
- Verificacao de assinatura (`X-Hub-Signature-256`)
- Matching de keyword no comentario contra tabela `AutomacaoDM`
- Envio de DM via `instagram_manage_messages`
- Deduplicacao (1 mensagem por usuario por keyword)

**Requisitos absorvidos do benchmark ManyChat (auditoria 12/06/2026)** —
lacunas do schema atual que precisam entrar junto com o webhook:

- `AutomacaoDM.gatilho` (COMENTARIO | STORY | DM) + `postId` opcional pra
  limitar a um post especifico — hoje a keyword nao tem origem nem escopo
- `AutomacaoDM.respostasPublicas` (Json, ~5 variacoes): quando o gatilho e
  comentario, responder o comentario publicamente com variacao sorteada
  ("Te mandei no direct" etc.) — resposta identica em massa = risco de bloqueio
- Fluxo de confirmacao em 2 etapas: primeira DM pede confirmacao com botao
  ("Toca aqui que te mando"), o clique libera o conteudo. Compliance da Meta:
  o usuario interage antes de receber o link. Conta na aprovacao da fase 2
- DM final com botao estruturado (`linkUrl` + `linkLabel`), nao link cru no texto
- Matching case-insensitive + aceitar singular/plural da keyword
- Pequeno delay com jitter antes de responder (parecer organico, respeitar rate limit)
- Respeitar a janela de 24h da Meta pra mensagens de follow-up

Fora de escopo (e do nosso produto): CRM completo do ManyChat — tags, campos
customizados, segmentos, broadcast, caixa de entrada omnichannel. InteracaoDM
ja registra igUserId/username; visao de contatos pode derivar disso depois.

**Depende de:** aprovacao fase 2 na Meta (permissoes `instagram_manage_comments`, `instagram_manage_messages`, `pages_manage_metadata`)

### 2. WhatsApp Business Integration

Modulo inteiro — nao existe nada no codigo hoje.

- Tabela `WhatsAppConnection` no schema (phone number ID, business account ID, token)
- Embedded Signup flow (diferente do OAuth padrao do Instagram)
- Rotas de envio e recebimento de mensagens
- Tabela de conversas / historico
- Tracking de status de entrega

**Depende de:** aprovacao separada da Meta para WhatsApp Business Platform

### 3. Variaveis de ambiente em producao

Configurar no Coolify quando a aprovacao da Meta sair:

- `META_APP_ID`
- `META_APP_SECRET`

Para WhatsApp (futuro):

- `WHATSAPP_BUSINESS_ACCOUNT_ID`
- `WHATSAPP_BUSINESS_PHONE_NUMBER_ID`
- `WHATSAPP_API_TOKEN`

### 4. Aprovacao da Meta

- **Fase 1** (Instagram publishing, 4 permissoes) — pronta pra submeter. Guia em `docs/guia-aprovacao-meta.md`
- **Fase 2** (DM + messaging, 4 permissoes adicionais) — submeter so depois do webhook (item 1) estar construido e testado

---

## Ordem sugerida

1. Submeter fase 1 (publicacao Instagram) na Meta App Review
2. Configurar `META_APP_ID` e `META_APP_SECRET` no Coolify apos aprovacao
3. Construir webhook handler de Instagram
4. Testar automacao DM end-to-end
5. Submeter fase 2
6. Construir modulo WhatsApp Business
