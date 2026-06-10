# Guia de aprovacao do app Meta (Facebook/Instagram)

> Para: Lucas (socio operacional)
> Contexto: O app AutomaWeb ja existe no Meta for Developers, tem OAuth funcionando em modo de desenvolvimento. Precisamos sair do modo dev pra que clientes reais (tenants) conectem seus Instagrams.
> Tempo estimado: 2-5 dias uteis pra submeter, 3-10 dias uteis pra Meta revisar.

---

## O que esse guia destrava (mapa rapido)

O objetivo final e a **conexao de um clique**: o cliente clica "Conectar
Instagram" na plataforma, autoriza, e a gente ganha capacidade permanente
de operar a conta dele. Hoje isso so funciona com contas NOSSAS (modo dev).
A aprovacao acontece em DUAS rodadas:

**RODADA 1 — este guia inteiro (fazer agora):**
Business Verification + Advanced Access nas 4 permissoes que ja estao no
codigo (`instagram_basic`, `instagram_content_publish`, `pages_show_list`,
`pages_read_engagement`). Quando aprovar:
- Qualquer cliente conecta o Instagram com 1 clique
- Publicamos carrossel/reels na conta dele (manual e agendado)
- Lemos perfil e engajamento pros relatorios

**RODADA 2 — automacao de DM (depois, nao agora):**
As 4 permissoes de mensagem (`instagram_manage_comments`,
`instagram_manage_messages`, `pages_manage_metadata`, `pages_messaging`)
destravam o "ManyChat proprio" (comentou keyword → recebe DM). Fica pra
segunda submissao porque a Meta exige mostrar a funcionalidade FUNCIONANDO
no video, e o backend de webhook ainda nao foi construido. Submeter agora
seria rejeicao garantida. Quando o Eduardo terminar o webhook, repetimos
os Passos 5-7 so pra essas 4.

Ou seja: ao final da Rodada 1, o OAuth de 1 clique ja libera o acesso as
contas dos clientes pra TUDO de publicacao. So a automacao de DM espera.

---

## O que o app faz (pra voce explicar na submissao)

A AutomaWeb e uma plataforma de marketing digital multitenant. Cada cliente (dentista, professor, loja) conecta o Instagram e Facebook deles, e nos:

1. Publicamos carrosseis no Instagram do cliente (agendado)
2. Respondemos automaticamente no Direct quando alguem comenta uma palavra-chave
3. Capturamos leads vindos de comentarios e DMs

O cliente so aprova o conteudo. A operacao e nossa.

---

## PASSO 1 — Verificacao de negocio (Business Verification)

Isso e pre-requisito. Sem isso a Meta nem aceita o pedido de permissoes.

### O que fazer

1. Acesse [business.facebook.com/settings](https://business.facebook.com/settings)
2. No menu lateral: **Central de seguranca** (ou Security Center)
3. Clique **Iniciar verificacao**
4. A Meta vai pedir:
   - **Nome legal da empresa** (exatamente como esta no CNPJ)
   - **CNPJ** (ou documento fiscal equivalente)
   - **Endereco comercial** (tem que bater com o CNPJ)
   - **Telefone comercial** (vai receber um codigo)
   - **Dominio do site** (o dominio onde a plataforma roda)
   - **Documento:** envie UM dos seguintes:
     - Cartao CNPJ (PDF do site da Receita)
     - Conta de luz/telefone no nome da empresa
     - Extrato bancario com CNPJ

### Dicas

- O nome no Business Manager TEM que bater com o nome no CNPJ. Se tiver diferenca, a Meta rejeita
- Se estiver como pessoa fisica, primeiro abra um MEI/CNPJ. A Meta nao aprova permissoes avancadas pra PF
- A verificacao demora 1-3 dias. Faca isso PRIMEIRO, enquanto prepara o resto

### Verificacao de dominio

Na mesma tela de configuracoes:
1. Va em **Configuracoes do negocio > Seguranca da marca > Dominios**
2. Adicione o dominio da plataforma
3. Escolha o metodo de verificacao:
   - **Meta-tag HTML** (mais facil): a Meta da uma tag, voce me manda e eu coloco no `<head>` do site
   - **DNS TXT record**: adiciona um registro TXT no Cloudflare
4. Clique verificar

---

## PASSO 2 — Preparar o que a Meta exige ANTES de submeter

### 2.1 Politica de privacidade (obrigatorio)

A plataforma precisa de uma URL publica com politica de privacidade. Minimo que deve constar:

- Que dados coletamos (nome, email, token de acesso do Instagram, comentarios, DMs)
- Por que coletamos (publicar conteudo, responder mensagens automaticamente, capturar leads)
- Como armazenamos (banco PostgreSQL criptografado, servidor proprio)
- Como o usuario pode pedir exclusao dos dados
- Que nao vendemos dados pra terceiros

**Acao:** Me avisa quando a verificacao de negocio passar que eu gero a pagina de privacy policy e coloco no ar.

### 2.1.1 URL de exclusao de dados (obrigatorio)

Alem da privacy policy, a Meta exige um campo separado em
**Settings > Basic: "Data Deletion Instructions URL"**. E uma pagina
que explica como o usuario pede pra apagar os dados dele da plataforma
(pode ser uma secao da propria privacy policy com URL propria, ex:
`/privacidade#exclusao`). Sem esse campo preenchido, a submissao nem abre.

**Acao:** Eduardo gera junto com a privacy policy.

### 2.2 Termos de servico (recomendado)

Mesma logica. Uma pagina simples dizendo que a plataforma opera marketing pro cliente, que o cliente autoriza as acoes, e como cancelar.

### 2.3 URL do app funcionando

A Meta quer ver o app rodando. Pode ser a URL do Coolify. Nao precisa ser bonita, mas precisa:
- Ter pagina de login
- Ter HTTPS
- Estar acessivel (nao pode ser localhost)

### 2.4 Icone do app

No painel do Meta for Developers:
- Icone quadrado, minimo 1024x1024px
- Fundo solido (nao transparente)
- Sem texto "Facebook" ou "Instagram" no icone

---

## PASSO 3 — Configurar o app no Meta for Developers

Acesse [developers.facebook.com/apps](https://developers.facebook.com/apps) e entre no app da AutomaWeb.

### 3.1 Informacoes basicas (Settings > Basic)

Preencher:
- **Display Name:** AutomaWeb
- **App Domains:** o dominio da plataforma
- **Privacy Policy URL:** a URL da politica de privacidade
- **Data Deletion Instructions URL:** a URL de exclusao de dados (Passo 2.1.1)
- **Terms of Service URL:** URL dos termos
- **Category:** Business and Pages
- **App Icon:** o icone quadrado
- **Business Use:** selecione "Suporte a minha empresa ou organizacao" (Support my own business)

### 3.2 Adicionar produtos (Add Products)

Se ainda nao estiver, adicione:
- **Facebook Login**
- **Instagram Graph API** (nao confundir com "Instagram Basic Display API", que foi descontinuada)

### 3.3 Facebook Login > Settings

- **Valid OAuth Redirect URIs:** `https://[DOMINIO-DA-PLATAFORMA]/api/meta/callback`
- **Client OAuth Login:** ON
- **Web OAuth Login:** ON

---

## PASSO 4 — Pedir as permissoes (App Review)

Essa e a parte central. Va em **App Review > Permissions and Features**.

### Permissoes que precisamos pedir

**TODAS precisam de Advanced Access.** Nao se engane com o rotulo "Standard
Access" no painel: Standard so funciona pra contas que tem cargo no proprio
app ou no nosso Business Manager. Como os tenants sao empresas externas
(a conta do Instagram e DELES, nao nossa), toda permissao abaixo precisa
passar pelo App Review com Advanced Access.

| Permissao | Pra que usamos |
|-----------|---------------|
| `pages_show_list` | Listar as paginas do Facebook do cliente pra achar a conectada ao Instagram |
| `pages_read_engagement` | Ler comentarios nos posts (pra automacao de DM) |
| `instagram_basic` | Acessar perfil do Instagram Business (nome, foto, username) |
| `instagram_content_publish` | Publicar carrosseis no Instagram do cliente |
| `instagram_manage_comments` | Ler e responder comentarios nos posts do Instagram |
| `instagram_manage_messages` | Enviar DMs automaticas quando alguem comenta uma keyword |
| `pages_manage_metadata` | Assinar webhooks da pagina (receber notificacoes de comentarios) |
| `pages_messaging` | Enviar mensagens pela Page Inbox (Facebook Messenger) |

### Pre-requisito: chamadas de teste na API

A Meta **bloqueia o botao "Request Advanced Access"** ate o app fazer
chamadas de teste bem-sucedidas com cada permissao, usando o token do
proprio app em modo de desenvolvimento. Ou seja: antes de pedir qualquer
permissao, o Eduardo precisa conectar uma conta de teste (a nossa propria)
e executar o fluxo real — listar paginas, ler o perfil do Instagram,
publicar um post de teste. So depois disso o botao destrava.

**Acao:** avisar o Eduardo pra rodar o fluxo completo com a conta da
AutomaWeb antes de voce tentar submeter. Se o botao estiver cinza, e isso.

### Como pedir cada permissao

Pra cada uma, voce clica "Request" e a Meta pede:

1. **Descricao de uso** (texto livre, em ingles)
2. **Screencast** (video mostrando o fluxo no app)
3. **Instrucoes de teste** (credenciais pra eles entrarem na plataforma — ver Passo 7)

---

## PASSO 5 — Escrever as descricoes de uso

A Meta reprova se voce for generico. Seja especifico. Use os textos abaixo como base (em ingles porque a Meta exige):

### instagram_basic

> AutomaWeb is a multi-tenant digital marketing platform. Our clients (dentists, teachers, stores) connect their Instagram Business accounts so we can manage their content calendar. We use `instagram_basic` to retrieve the connected Instagram account's username, profile picture, and account ID. This information is displayed in our dashboard so the client can confirm the correct account is connected, and so our operators can identify which account they're managing content for.

### instagram_content_publish

> Our platform creates carousel posts (image carousels with educational/promotional content) for our clients. The client approves each carousel in our dashboard before it gets published. We use `instagram_content_publish` to schedule and publish these approved carousel posts to the client's Instagram Business account. Each post goes through a review pipeline: creation > internal review > client approval > scheduled > published. The client has full control and nothing is published without their explicit approval.

### instagram_manage_comments

> We monitor comments on our clients' Instagram posts to identify engagement opportunities. When a follower comments a specific keyword (e.g., "AGENDA" on a dentist's post), our system detects it and triggers an automated Direct Message with relevant information (e.g., appointment booking link). We use `instagram_manage_comments` to read incoming comments and match them against the client's configured keyword automations.

### instagram_manage_messages

> When our keyword detection system identifies a matching comment, we send a single automated Direct Message to that user with the information they requested (e.g., a booking link, a free resource, a course link). We use `instagram_manage_messages` to send this DM. Each user only receives ONE message per keyword (we deduplicate by user ID). The client configures which keywords trigger which messages in our dashboard. This is NOT bulk messaging — it's a targeted response to users who explicitly engaged with the post.

### pages_show_list

> When a client connects their Facebook account via OAuth, we need to identify which Facebook Page is linked to their Instagram Business account. We use `pages_show_list` to retrieve the list of Pages the user manages, then check which Page has a connected Instagram Business account. This is a one-time operation during the connection flow.

### pages_read_engagement

> We use `pages_read_engagement` to read comments and reactions on our clients' Facebook Page posts. This data feeds into our dashboard where operators can see engagement metrics and respond to comments. It also powers our automated DM system when comments contain configured keywords.

### pages_manage_metadata

> We use `pages_manage_metadata` to subscribe to webhook notifications for our clients' Facebook Pages. This allows us to receive real-time notifications when someone comments on a post, instead of polling the API. This is essential for our keyword-based DM automation to respond quickly.

### pages_messaging

> We use `pages_messaging` to send automated responses via Facebook Messenger when users interact with our clients' Page posts using configured keywords. Same logic as Instagram DMs: one message per user per keyword, triggered by explicit user engagement.

---

## PASSO 6 — Gravar os screencasts

A Meta exige um video curto (30s-2min) pra CADA permissao avancada mostrando:
1. O usuario fazendo login no app
2. O fluxo que usa aquela permissao especifica
3. Onde os dados aparecem no app

### Roteiro dos videos

**Video 1 — Publicacao de carrossel (pra `instagram_content_publish`)**
1. Abrir a plataforma, mostrar login
2. Ir no painel MASTER > Pipeline
3. Mostrar um carrossel no Kanban, abrir o detalhe
4. Mostrar os slides, a legenda
5. Mover pra "Aprovado"
6. Clicar "Agendar publicacao"
7. Mostrar o post aparecendo no calendario

**Video 2 — Conexao do Instagram (pra `instagram_basic` + `pages_show_list`)**
1. Entrar como tenant
2. Ir em "Integracoes"
3. Clicar "Conectar Instagram"
4. Mostrar o popup do Facebook pedindo permissoes
5. Autorizar
6. Mostrar o Instagram conectado no dashboard (username, foto)

**Video 3 — Automacao de DM (pra `instagram_manage_comments` + `instagram_manage_messages`)**
1. Entrar no painel do tenant
2. Ir em "Mensagens automaticas"
3. Mostrar a lista de keywords configuradas
4. Criar uma nova automacao (keyword + mensagem)
5. Explicar (pode ser legenda no video ou narrar): "When a user comments this keyword on a post, the system sends them this DM automatically"
6. Mostrar o log de interacoes (quem comentou, DM enviada)

### Ferramentas pra gravar

- **Windows:** Xbox Game Bar (Win+G) ou OBS Studio (gratis)
- **Formato:** MP4, maximo 2min por video
- **Resolucao:** 1280x720 minimo
- **Dica:** nao precisa ter audio. Legenda e suficiente. Mas se quiser narrar, narrar em ingles

---

## PASSO 7 — Submeter pra revisao

### 7.1 Credenciais de teste pro revisor (motivo nº 1 de rejeicao)

O revisor da Meta vai ENTRAR na plataforma e repetir cada fluxo dos
videos com as proprias maos. Se ele nao conseguir logar e reproduzir,
rejeita — esse e o motivo mais comum de reprovacao.

Antes de submeter, preparar:

1. **Um usuario de teste na plataforma** (email + senha que funcionem de
   verdade na URL publica). Criar um tenant de demonstracao com dados
   ficticios, ex: `revisor@automaweb.com.br` / senha dedicada
2. Esse tenant de teste precisa ter **conteudo de exemplo** (carrossel no
   pipeline, automacao de DM configurada) pra o revisor ver as telas dos videos
3. No formulario de submissao, preencher o campo de **instrucoes de teste**
   passo a passo, em ingles: "1. Go to [URL]. 2. Log in with the credentials
   provided. 3. Click Integracoes..."
4. **Nao usar conta pessoal** sua nem do Eduardo — a Meta proibe credenciais
   de conta pessoal nas instrucoes. Pra conta do Facebook/Instagram, o revisor
   usa as contas de teste deles

### 7.2 Submeter

1. Em **App Review > Permissions and Features**, cada permissao vai ter um botao "Submit for Review"
2. Confira que todos os campos estao preenchidos (descricao + video + instrucoes de teste)
3. Confira que a Business Verification esta aprovada (sem isso nao aceita)
4. Confira que o botao "Request Advanced Access" destravou (chamadas de teste feitas — ver Passo 4)
5. Submeta tudo junto (nao submeta um por um, e mais rapido revisar em lote)
6. Aguarde 3-10 dias uteis

---

## PASSO 8 — Se a Meta rejeitar

Acontece. Motivos comuns e como resolver:

| Motivo da rejeicao | O que fazer |
|---------------------|-------------|
| "We couldn't verify the use case" | Regravar o screencast mostrando o fluxo com mais clareza. Adicionar legendas explicando cada passo |
| "Missing privacy policy" | Verificar que a URL da privacy policy esta acessivel e contem todos os itens listados no Passo 2.1 |
| "Business verification incomplete" | Voltar no Business Manager e completar a verificacao |
| "Screencast doesn't show the permission in use" | O video TEM que mostrar o dado sendo usado. Ex: pra `instagram_basic`, mostrar o username aparecendo no dashboard |
| "We couldn't access your app" / revisor nao reproduziu | Credenciais de teste invalidas ou instrucoes incompletas. Testar o login do usuario demo numa aba anonima antes de resubmeter |
| "Platform policy violation" | Geralmente e por DM em massa. Enfatizar que e resposta a interacao do usuario, nao spam |

Quando rejeitar, a Meta diz exatamente qual permissao e qual motivo. Corrige so aquela, resubmete.

---

## Resumo de acoes (checklist)

```
PREPARACAO (fazer agora)
[ ] Iniciar Business Verification no Business Manager
[ ] Enviar documentos (CNPJ, comprovante)
[ ] Verificar dominio (DNS ou meta-tag)

ENQUANTO ESPERA VERIFICACAO (fazer em paralelo)
[ ] Pedir pro Eduardo gerar a pagina de privacy policy
[ ] Pedir pro Eduardo gerar a pagina de exclusao de dados (Data Deletion URL)
[ ] Pedir pro Eduardo gerar a pagina de termos de servico
[ ] Preencher Settings > Basic no Meta for Developers
[ ] Preparar icone 1024x1024 do app
[ ] Configurar OAuth Redirect URI correto
[ ] Eduardo: terminar o callback (salvar conexao no banco + state param)
[ ] Eduardo: rodar chamadas de teste com cada permissao (destrava o
    botao Request Advanced Access)

DEPOIS DA VERIFICACAO (so funciona depois)
[ ] Criar usuario de teste na plataforma (tenant demo com dados ficticios)
[ ] Gravar screencast 1: publicacao de carrossel
[ ] Gravar screencast 2: conexao Instagram
[ ] Gravar screencast 3: automacao de DM
[ ] Preencher descricao de uso de cada permissao
[ ] Preencher instrucoes de teste passo a passo (em ingles)
[ ] Submeter tudo pra App Review

POS-APROVACAO
[ ] Confirmar que as permissoes aparecem como "Advanced Access" no painel
[ ] Testar OAuth com um tenant real (conta que NAO tem cargo no app)
[ ] Verificar que tokens de longa duracao estao funcionando
```

---

## Bloqueio tecnico antes de gravar os videos (lado Eduardo)

O fluxo de conexao no codigo ainda **nao salva a conexao no banco** (o
trecho esta comentado como TODO no callback). Na pratica: o cliente autoriza,
mas a tela de Integracoes nao mostra a conta conectada de verdade.

Consequencia: o **Video 2 nao pode ser gravado** e o revisor nao vai
conseguir reproduzir o fluxo ate isso ser terminado. Tambem falta o
parametro `state` no OAuth (pra saber qual tenant iniciou a conexao e
proteger contra CSRF) e o codigo hoje pega sempre a primeira pagina do
Facebook do usuario, o que quebra se o cliente administrar mais de uma.

**Ordem certa:** Lucas toca a Business Verification e a preparacao
(Passos 1-3) em paralelo, Eduardo termina o callback, e SO ENTAO gravamos
os screencasts e submetemos.

---

## Scopes que estao no codigo vs. que precisamos adicionar

O app ja pede:
- `instagram_basic`
- `instagram_content_publish`
- `pages_show_list`
- `pages_read_engagement`

**Precisamos adicionar no codigo (Eduardo faz):**
- `instagram_manage_comments`
- `instagram_manage_messages`
- `pages_manage_metadata`
- `pages_messaging`

Nao precisa mexer nisso agora. Primeiro aprova o que ja tem, depois a gente adiciona os scopes de DM.

---

## Contato se travar

- Suporte Meta for Developers: [developers.facebook.com/support](https://developers.facebook.com/support)
- Bug reports: [developers.facebook.com/support/bugs](https://developers.facebook.com/support/bugs)
- Comunidade: [developers.facebook.com/community](https://developers.facebook.com/community)

Se travar na Business Verification e tiver MEI, tenta enviar o Cartao CNPJ + uma conta de luz. Dois documentos passam mais facil que um.
