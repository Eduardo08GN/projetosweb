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

- `AutomacaoDM.gatilho` (COMENTARIO | STORY_RESPOSTA | STORY_MENCAO |
  LIVE_COMENTARIO | DM | INICIO_CONVERSA) + `postId` opcional pra limitar a
  um post especifico — hoje a keyword nao tem origem nem escopo.
  Mencao em story (cliente marcado por alguem) e comentario em live sao
  gatilhos distintos da resposta a story; INICIO_CONVERSA e o botao de
  "ice breaker" que aparece quando alguem abre o chat pela primeira vez
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
- Keyword "EU QUERO" esta batida: o Instagram reconhece o padrao e isso pode
  degradar a entrega. Cada tenant deve usar keyword propria do nicho (ex.:
  SORRISO, AGENDA) — vale ja HOJE nos CTAs dos carrosseis da fabrica
- A primeira DM automatica cai em "Solicitacoes" se a pessoa nunca conversou
  com o perfil; a resposta publica ao comentario deve avisar ("confere nas
  solicitacoes") pra mensagem nao morrer invisivel

**v2 da fase 2 (depois do webhook basico no ar) — sequencia de reengajamento:**
entrega de conteudo em gotas (apos X min/horas/dias) pra quem interagiu, tipo
"dica 1 em 3min, dica 2 em 1 dia". Regras de entrega da Meta: sem interacao
do usuario, mensagens com mais de ~7 dias de intervalo podem simplesmente nao
chegar — sequencias curtas, sempre ancoradas na ultima interacao. Modelagem:
tabela SequenciaDM (passos com offset de tempo) + job no scheduler que ja existe.

Fora de escopo (e do nosso produto): CRM completo do ManyChat — tags, campos
customizados, segmentos, broadcast, caixa de entrada omnichannel. InteracaoDM
ja registra igUserId/username; visao de contatos pode derivar disso depois.

**Pre-requisito extra do tenant (so pra DM, nao pra publicacao)** — fonte:
ebook de chatbot Instagram, auditoria 12/06/2026:

- Alem de conta profissional + Pagina vinculada, o cliente precisa LIGAR
  manualmente no app: Instagram > Config > Privacidade > Mensagens >
  "Permitir acesso a mensagens" (toggle pra apps externos gerenciarem DM).
- Cilada silenciosa: sem o toggle, o OAuth conecta com "sucesso" mas as
  automacoes de DM nao disparam e NADA da erro. Suporte vai apanhar nisso.
- Quando a guia Mensagens sair do "Em breve", o card de automacao precisa
  de um aviso desse toggle (disclosure curto, igual ao da pagina do FB no
  card do Instagram), e idealmente um teste de conexao que detecte se as
  DMs estao acessiveis antes de o cliente confiar na automacao.

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

- `META_APP_ID` e `META_APP_SECRET` — FEITO (12/06/2026, setadas no
  Coolify e deploy rodado; valores vieram do app "AutomaWeb Carrossel",
  ID 1672945567264311)

Para WhatsApp (futuro):

- `WHATSAPP_BUSINESS_ACCOUNT_ID`
- `WHATSAPP_BUSINESS_PHONE_NUMBER_ID`
- `WHATSAPP_API_TOKEN`

### 4. Aprovacao da Meta

- **Fase 1** (Instagram publishing, 4 permissoes) — pronta pra submeter. Guia em `docs/guia-aprovacao-meta.md`
- **Fase 2** (DM + messaging, 4 permissoes adicionais) — submeter so depois do webhook (item 1) estar construido e testado

### 5. Melhoria futura — Instagram Login sem Pagina do Facebook

O fluxo atual (Instagram Graph API via Facebook Login) exige de TODO
tenant: conta profissional + Pagina do Facebook + vinculo entre os dois +
quem conecta ser admin da Pagina. E o maior atrito do onboarding.

A Meta tem uma trilha mais nova, **"Instagram API with Instagram Login"**,
que elimina a Pagina: o cliente loga direto com a conta do Instagram e
pronto. Permissoes proprias (`instagram_business_basic`,
`instagram_business_content_publish`, `instagram_business_manage_messages`,
`instagram_business_manage_comments`).

Custo de migrar: reescrever OAuth (/api/meta/auth e callback), trocar os
endpoints de publicacao (graph.instagram.com em vez de graph.facebook.com)
e refazer o App Review nessa trilha. Limitacao conhecida: essa trilha nao
cobre Facebook Messenger (`pages_messaging`) — se a automacao de DM do
Facebook for requisito, a Pagina volta a ser necessaria pra essa parte.

**Decisao:** nao trocar agora. Fase 1 e 2 seguem na trilha atual, que ja
esta implementada e a caminho da aprovacao. Reavaliar quando o atrito de
onboarding virar problema real (clientes travando no pre-requisito da
Pagina) ou quando a fase 2 estiver aprovada e estavel.

---

## Ordem sugerida

1. Submeter fase 1 (publicacao Instagram) na Meta App Review
2. Configurar `META_APP_ID` e `META_APP_SECRET` no Coolify apos aprovacao
3. Construir webhook handler de Instagram
4. Testar automacao DM end-to-end
5. Submeter fase 2
6. Construir modulo WhatsApp Business
