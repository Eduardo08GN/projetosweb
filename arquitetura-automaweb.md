# Arquitetura AutomaWeb — Mapa Completo

> Plataforma multitenant de prestação de serviços de marketing digital.
> AutomaWeb OPERA o marketing do cliente. O cliente só aprova e acompanha.
> Documento definitivo: infra, dados, guias, tasklist.

---

## 1. Orquestração de infraestrutura

### Visão geral

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE                                │
│                                                                  │
│  Workers AI (FLUX)    R2 (storage)    DNS + SSL (domínios)       │
│  Gera imagens         Armazena PNGs   Roteia domínios custom     │
│  dos carrosséis       e assets        dos sites dos tenants      │
└──────────┬───────────────┬────────────────┬──────────────────────┘
           │               │                │
           ▼               ▼                ▼
┌──────────────────────────────────────────────────────────────────┐
│                     COOLIFY (VPS 159.195.12.135)                 │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   APP (Next.js)  │  │   PostgreSQL    │  │  Sites tenants  │  │
│  │                  │  │                 │  │                 │  │
│  │  Painel MASTER   │  │  Banco central  │  │  rodger.com     │  │
│  │  Painel TENANT   │  │  Todos os dados │  │  clinica.com    │  │
│  │  API Routes      │  │  Prisma ORM     │  │  loja.com       │  │
│  │  Scheduler       │  │                 │  │  (HTML estático)│  │
│  │  (node-cron)     │  │                 │  │                 │  │
│  └────────┬─────────┘  └────────┬────────┘  └─────────────────┘  │
│           │                     │                                 │
│           └─────────────────────┘                                 │
└──────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
│   META APIs       │ │  GOOGLE APIs      │ │  EVOLUTION API       │
│                   │ │                   │ │  (WhatsApp)          │
│  Graph API        │ │  Business Profile │ │                      │
│  (post, DM)       │ │  (GMB posts)      │ │  Self-hosted ou      │
│                   │ │                   │ │  cloud               │
│  Webhooks         │ │  Ads API          │ │                      │
│  (comentários)    │ │  (campanhas)      │ │  Multi-instância     │
│                   │ │                   │ │  (1 por tenant)      │
│  Marketing API    │ │  Analytics        │ │                      │
│  (Meta Ads)       │ │  (métricas site)  │ │                      │
└──────────────────┘ └──────────────────┘ └──────────────────────┘
```

### Stack definitiva

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Framework** | Next.js 14 (App Router) | Full-stack, SSR, API Routes, deploy simples |
| **Linguagem** | TypeScript | Tipagem, autocomplete, menos bugs |
| **Banco** | PostgreSQL | Relacional, robusto, grátis |
| **ORM** | Prisma | Migrations, type-safe, schema legível |
| **Auth** | JWT (jose) + magic link | Simples, sem dependência externa |
| **UI** | Tailwind + shadcn/ui | Componentes prontos, sem CSS manual |
| **Storage** | Cloudflare R2 | Já configurado, zero egress, upload nativo |
| **Imagens IA** | Cloudflare Workers AI (FLUX) | Já funciona, free tier |
| **Render** | Playwright | HTML → PNG, já funciona |
| **Deploy app** | Coolify (Docker) | Já temos servidor |
| **Deploy sites** | Coolify (estático) | Já funciona |
| **Cron/scheduler** | node-cron (in-process) | Sem Redis, sem fila. Suficiente pra 5-50 clientes |
| **WhatsApp** | Evolution API | Open source, multi-instância |
| **Instagram/FB** | Meta Graph API | App já criado, token permanente |
| **Google** | Business Profile + Ads API | Configurar quando necessário |
| **Email** | Resend (transacional) | Free tier 100/dia, API simples |

### O que NÃO usamos (e por quê)

| Tecnologia | Por que não |
|-----------|-------------|
| Redis | Sem concorrência real. node-cron resolve |
| BullMQ | Sem volume de jobs. Array sequencial resolve |
| PgBouncer | Menos de 50 conexões simultâneas |
| Docker Compose complexo | Um container Next.js + PostgreSQL basta |
| Vercel | Controle total no Coolify, sem vendor lock |
| MongoDB | Relacional faz mais sentido pra multi-tenant |

---

## 2. Modelo de dados (Prisma)

### Diagrama de relações

```
User ─────────────────── Tenant
 │                         │
 │ (auth, login)           ├── IdentidadeVisual (1:1)
 │                         ├── MemoriaTenant (1:1)
 │                         ├── RedeSocial[] (Instagram, FB, LinkedIn)
 │                         ├── Carrossel[]
 │                         ├── AgendaPost[]
 │                         ├── AutomacaoDM[]
 │                         ├── Lead[]
 │                         ├── Site[]
 │                         ├── Campanha[]
 │                         ├── WhatsAppConfig (1:1)
 │                         ├── GoogleBusinessConfig (1:1)
 │                         ├── Contrato (1:1)
 │                         ├── Fatura[]
 │                         └── Relatorio[]
 │
 └── AuditLog[] (quem fez o quê)
```

### Modelos completos

```prisma
// ===== AUTH =====

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  nome          String
  senhaHash     String?
  role          Role      @default(OPERADOR)
  tenantId      String?
  tenant        Tenant?   @relation(fields: [tenantId], references: [id])
  criadoEm      DateTime  @default(now())
  auditLogs     AuditLog[]
}

enum Role {
  MASTER        // Eduardo, Lucas — vê tudo
  OPERADOR      // Funcionário — vê clientes atribuídos
  CLIENTE       // Tenant — só vê o próprio painel
}

// ===== TENANT =====

model Tenant {
  id            String    @id @default(cuid())
  nome          String
  slug          String    @unique
  nicho         String?   // "educação", "odontologia", "gastronomia"
  contato       String?   // WhatsApp principal
  plano         Plano     @default(BASICO)
  status        StatusTenant @default(ONBOARDING)
  criadoEm      DateTime  @default(now())
  deletedAt     DateTime? // soft delete

  // Relações
  identidade    IdentidadeVisual?
  memoria       MemoriaTenant?
  redesSociais  RedeSocial[]
  carrosseis    Carrossel[]
  agenda        AgendaPost[]
  automacoesDM  AutomacaoDM[]
  leads         Lead[]
  sites         Site[]
  campanhas     Campanha[]
  whatsapp      WhatsAppConfig?
  googleBiz     GoogleBusinessConfig?
  contrato      Contrato?
  faturas       Fatura[]
  relatorios    Relatorio[]
  usuarios      User[]
  onboarding    OnboardingChecklist?
}

enum Plano {
  BASICO        // Site + carrossel
  PRO           // + Google Meu Negócio + ManyChat
  PREMIUM       // + Tráfego pago + WhatsApp automation
}

enum StatusTenant {
  LEAD          // Prospecto, ainda não fechou
  ONBOARDING    // Fechou, configurando
  ATIVO         // Operando normalmente
  PAUSADO       // Cliente pediu pausa
  CANCELADO     // Encerrou contrato
}

// ===== IDENTIDADE E MEMÓRIA =====

model IdentidadeVisual {
  id            String    @id @default(cuid())
  tenantId      String    @unique
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  cores         Json      // { primaria, secundaria, destaque, fundo }
  fontes        Json      // { heading, body }
  logoUrl       String?
  avatarUrl     String?
  designGuide   String    @db.Text // markdown completo
}

model MemoriaTenant {
  id            String    @id @default(cuid())
  tenantId      String    @unique
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  empresa       String    @db.Text // quem é, o que faz
  preferencias  String    @db.Text // tom de voz, estilo
  estrategia    String    @db.Text // foco atual, metas
}

// ===== REDES SOCIAIS =====

model RedeSocial {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  plataforma    Plataforma
  accessToken   String    @db.Text
  pageId        String?
  igUserId      String?
  username      String?
  tokenExpira   DateTime?
  status        StatusConexao @default(ATIVO)

  automacoesDM  AutomacaoDM[]
}

enum Plataforma {
  INSTAGRAM
  FACEBOOK
  LINKEDIN
}

enum StatusConexao {
  ATIVO
  EXPIRADO
  ERRO
  DESCONECTADO
}

// ===== CARROSSEL =====

model Carrossel {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  tema          String
  angulo        String?
  tipo          TipoCarrossel @default(CONVERSAO)
  status        StatusCarrossel @default(BACKLOG)
  operadorId    String?   // quem tá produzindo

  // Conteúdo
  copyMd        String?   @db.Text
  htmlUrl       String?   // URL no R2
  slidesUrls    Json?     // ["https://r2.dev/slide-01.png", ...]
  legendaMd     String?   @db.Text
  keyword       String?
  fontesDados   Json?     // estudos/estatísticas usados como lastro

  // Aprovação
  feedbackCliente String? @db.Text // "muda a foto do slide 3"
  aprovadoEm    DateTime?

  // Publicação
  postId        String?   // ID do post no Instagram
  publicadoEm   DateTime?

  criadoEm      DateTime  @default(now())
  atualizadoEm  DateTime  @updatedAt
}

enum TipoCarrossel {
  CONVERSAO
  EDUCACIONAL
  HIBRIDO
}

enum StatusCarrossel {
  BACKLOG             // Tema definido, não começou
  EM_PRODUCAO         // Operador trabalhando
  REVISAO_INTERNA     // Pronto, equipe validando
  AGUARDANDO_CLIENTE  // Enviou pro cliente
  APROVADO            // Cliente aprovou
  AGENDADO            // Data/hora definidos
  PUBLICADO           // No ar
  AJUSTE_PEDIDO       // Cliente pediu mudança
}

// ===== AGENDAMENTO =====

model AgendaPost {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  carrosselId   String?
  tipo          String    // "carrossel", "story", "reels", "gmb_post"
  plataforma    Plataforma
  agendadoPara  DateTime
  status        StatusAgenda @default(PENDENTE)
  postId        String?   // ID retornado pela API após publicação
  erro          String?   // mensagem de erro se falhou
  executadoEm   DateTime?
}

enum StatusAgenda {
  PENDENTE
  PUBLICADO
  FALHOU
  CANCELADO
}

// ===== AUTOMAÇÃO DE DM =====

model AutomacaoDM {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  redeSocialId  String
  redeSocial    RedeSocial @relation(fields: [redeSocialId], references: [id])
  keyword       String    // "SOTAQUE", "AGENDA"
  mensagemDM    String    @db.Text
  materialUrl   String?   // link do material enviado
  ativo         Boolean   @default(true)
  interacoes    InteracaoDM[]
}

model InteracaoDM {
  id            String    @id @default(cuid())
  automacaoId   String
  automacao     AutomacaoDM @relation(fields: [automacaoId], references: [id])
  userId        String    // ID do usuário no Instagram
  username      String
  comentario    String?
  dmEnviada     Boolean   @default(false)
  criadoEm      DateTime  @default(now())

  @@unique([automacaoId, userId]) // não responder 2x
}

// ===== LEADS =====

model Lead {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  nome          String?
  telefone      String?
  email         String?
  canal         CanalLead
  keyword       String?   // qual keyword usou
  status        StatusLead @default(NOVO)
  notas         String?   @db.Text
  criadoEm      DateTime  @default(now())
}

enum CanalLead {
  DM_INSTAGRAM
  DM_FACEBOOK
  WHATSAPP
  SITE_FORMULARIO
  GOOGLE_MEU_NEGOCIO
}

enum StatusLead {
  NOVO
  CONTATADO
  EM_NEGOCIACAO
  CONVERTEU
  PERDEU
}

// ===== SITES =====

model Site {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  dominio       String?
  dominioVerificado Boolean @default(false)
  deployUrl     String?   // URL no Coolify
  coolifyAppId  String?   // UUID do app no Coolify
  status        StatusSite @default(RASCUNHO)
  criadoEm      DateTime  @default(now())
}

enum StatusSite {
  RASCUNHO
  PUBLICADO
  MANUTENCAO
  OFFLINE
}

// ===== CAMPANHAS =====

model Campanha {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  plataforma    PlataformaAds
  nome          String
  objetivo      String?
  orcamento     Int       // centavos
  gastoAtual    Int       @default(0)
  status        StatusCampanha @default(RASCUNHO)
  metricas      Json?     // { impressoes, cliques, ctr, cpa, leads }
  externalId    String?   // ID na plataforma de ads
  criadoEm      DateTime  @default(now())
  atualizadoEm  DateTime  @updatedAt
}

enum PlataformaAds {
  GOOGLE_ADS
  META_ADS
}

enum StatusCampanha {
  RASCUNHO
  ATIVA
  PAUSADA
  ENCERRADA
}

// ===== WHATSAPP =====

model WhatsAppConfig {
  id            String    @id @default(cuid())
  tenantId      String    @unique
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  instanciaId   String?   // Evolution API instance ID
  numero        String
  apiUrl        String?
  status        StatusConexao @default(DESCONECTADO)
}

// ===== GOOGLE MEU NEGÓCIO =====

model GoogleBusinessConfig {
  id            String    @id @default(cuid())
  tenantId      String    @unique
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  accountId     String?
  locationId    String?
  accessToken   String?   @db.Text
  refreshToken  String?   @db.Text
}

// ===== FINANCEIRO =====

model Contrato {
  id            String    @id @default(cuid())
  tenantId      String    @unique
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  valorMensal   Int       // centavos
  diaVencimento Int       @default(10)
  inicioEm      DateTime
  fimEm         DateTime?
  renovacao     Boolean   @default(true) // auto-renovar
  servicos      Json      // ["site", "carrossel", "gmb", "manychat"]
}

model Fatura {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  valor         Int       // centavos
  referencia    String    // "2026-06"
  status        StatusFatura @default(PENDENTE)
  vencimento    DateTime
  pagoEm        DateTime?
}

enum StatusFatura {
  PENDENTE
  PAGA
  ATRASADA
  CANCELADA
}

// ===== RELATÓRIOS =====

model Relatorio {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  referencia    String    // "2026-06"
  dados         Json      // métricas consolidadas do mês
  pdfUrl        String?   // URL no R2
  enviadoEm     DateTime?
  criadoEm      DateTime  @default(now())
}

// ===== ONBOARDING =====

model OnboardingChecklist {
  id            String    @id @default(cuid())
  tenantId      String    @unique
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  logo          Boolean   @default(false)
  cores         Boolean   @default(false)
  instagram     Boolean   @default(false)
  facebook      Boolean   @default(false)
  whatsapp      Boolean   @default(false)
  googleBiz     Boolean   @default(false)
  empresa       Boolean   @default(false) // empresa.md preenchido
  preferencias  Boolean   @default(false) // preferencias.md preenchido
  estrategia    Boolean   @default(false) // estrategia.md preenchido
  designGuide   Boolean   @default(false)
  siteDeployed  Boolean   @default(false)
  primeiroLote  Boolean   @default(false) // primeiro batch de conteúdo
}

// ===== AUDITORIA =====

model AuditLog {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  tenantId      String?
  acao          String    // "CARROSSEL_PUBLICADO", "DM_ENVIADA", "SITE_DEPLOYED"
  detalhes      Json?
  criadoEm      DateTime  @default(now())
}
```

---

## 3. Guias da plataforma

### MASTER (12 guias)

```
SIDEBAR MASTER

 1. DASHBOARD
    Visão do dia. O operador abre e sabe o que fazer.
    ├── Hoje: posts agendados, aprovações pendentes
    ├── Saúde: tokens OK/expirados, automações ativas/com erro
    ├── Semana: posts publicados, leads gerados, DMs enviadas
    └── Alertas: inadimplência, contrato vencendo, token expirando

 2. PIPELINE
    Kanban de produção. O CORAÇÃO da operação.
    ├── BACKLOG
    ├── EM PRODUÇÃO
    ├── REVISÃO INTERNA
    ├── AGUARDANDO CLIENTE
    ├── APROVADO
    ├── AGENDADO
    └── PUBLICADO
    Card: tenant, tema, operador, dias na coluna.
    Filtro: tenant, operador, tipo.

 3. CALENDÁRIO
    Grade mensal de publicações. Todos os tenants.
    ├── Cor por tenant
    ├── Arrastar pra reagendar
    ├── Clicar pra ver preview
    └── Gaps visíveis (dias sem conteúdo)

 4. CLIENTES
    CRM + gestão de tenants.
    ├── Lista: lead → onboarding → ativo → pausado → cancelado
    ├── Lead: nome, contato, origem, follow-up, proposta
    └── Tenant: perfil, identidade, memória, conexões,
        checklist, conteúdo, leads, financeiro

 5. LEADS
    CRM dos clientes dos nossos clientes.
    ├── Lista unificada (todos os tenants)
    ├── Filtro: tenant, canal, status
    ├── Atribuir: operador ou repassar pro cliente
    └── Histórico de mensagens

 6. AUTOMAÇÕES
    Saúde de todas as automações.
    ├── DM: keyword → mensagem (ativas, logs, erros)
    ├── WhatsApp: instâncias, auto-respostas, status
    └── Monitor: última execução, falhas

 7. CAMPANHAS
    Tráfego pago centralizado.
    ├── Visão geral: gasto total, ROAS, leads
    ├── Por tenant: campanhas, métricas, orçamento
    └── Alertas: CPA alto, orçamento acabando

 8. SITES
    Gestão de sites dos clientes.
    ├── Lista: domínio, status, deploy
    ├── Métricas: visitas, conversões
    └── Tickets de alteração

 9. FINANCEIRO
    ├── Receita por cliente, total mensal
    ├── Custos: ads, ferramentas, infra
    ├── Margem por cliente
    ├── Contratos: vigência, renovação
    └── Faturas: emitidas, pagas, atrasadas

10. RELATÓRIOS
    ├── Gerar (seleciona tenant → puxa métricas)
    ├── Preview antes de enviar
    ├── Enviar (email, WhatsApp, link)
    └── Histórico

11. EQUIPE
    ├── Operadores e clientes atribuídos
    ├── Carga de trabalho
    └── Log de ações

12. CONFIGURAÇÕES
    ├── APIs globais (Cloudflare, Meta, Google, Evolution)
    ├── Planos de serviço
    ├── Templates (propostas, contratos, relatórios)
    └── Sistema (backups, logs)
```

### TENANT (6 guias)

```
SIDEBAR TENANT

1. INÍCIO
   ├── "Publicamos X posts e geramos Y contatos este mês"
   ├── Próximo post agendado (preview)
   └── Notificação: "Conteúdo novo pra aprovar"

2. APROVAR CONTEÚDO
   ├── Pendentes (preview visual → aprovar / pedir ajuste)
   ├── Aprovados (aguardando publicação)
   └── Publicados (com métricas simples)

3. CONTATOS
   ├── Leads que chegaram (DM, WhatsApp, site)
   ├── Status: novo / atendi / virou cliente
   └── "X contatos novos este mês"

4. MEU SITE
   ├── Abrir site / status
   ├── Visitas do mês
   └── Solicitar alteração

5. RELATÓRIOS
   ├── Mês atual + histórico
   ├── Download PDF
   └── Linguagem simples

6. MINHA CONTA
   ├── Dados do negócio
   ├── Plano e serviços
   ├── Faturas
   └── Falar com AutomaWeb
```

---

## 4. Fluxos do scheduler (node-cron)

```
Scheduler roda a cada 1 minuto dentro do processo Next.js.

CICLO:
  1. Busca AgendaPost WHERE agendadoPara <= NOW AND status = PENDENTE
  2. Pra cada:
     a. Carrega tenant → token da rede social
     b. Carrega carrossel → slidesUrls, legendaMd
     c. Chama postar-instagram.js (ou GMB, ou Facebook)
     d. Se sucesso:
        - AgendaPost.status = PUBLICADO
        - AgendaPost.postId = retorno da API
        - Carrossel.status = PUBLICADO
        - Carrossel.publicadoEm = NOW
     e. Se falha:
        - AgendaPost.status = FALHOU
        - AgendaPost.erro = mensagem
        - Alerta no dashboard MASTER
  3. Busca tokens WHERE tokenExpira <= NOW + 7 dias
     → Alerta no dashboard: "Token do [tenant] expira em X dias"
  4. Busca faturas WHERE vencimento <= NOW AND status = PENDENTE
     → Atualiza status pra ATRASADA
     → Alerta no dashboard
```

---

## 5. Fluxo webhook DM (ManyChat próprio)

```
Meta envia webhook → POST /api/webhooks/instagram

1. Valida assinatura (app secret)
2. Extrai: postId, userId, username, texto do comentário
3. Busca AutomacaoDM WHERE keyword match AND ativo = true
4. Busca InteracaoDM WHERE automacaoId + userId
   → Se já existe: ignora (não responder 2x)
5. Se novo:
   a. Envia DM via Instagram Messaging API
   b. Cria InteracaoDM (registro)
   c. Cria Lead (tenantId, nome, canal: DM_INSTAGRAM, keyword)
   d. Log no AuditLog
```

---

## 6. Rotas da API

```
/api/auth/
  POST /login              → email + senha → JWT
  POST /magic-link         → gera link → email
  GET  /me                 → sessão atual
  POST /logout             → limpa cookie

/api/tenants/
  GET    /                 → listar (MASTER: todos, OPERADOR: atribuídos)
  POST   /                 → criar tenant
  GET    /:id              → detalhe
  PATCH  /:id              → atualizar
  DELETE /:id              → soft delete

/api/tenants/:id/identidade   → CRUD identidade visual
/api/tenants/:id/memoria      → CRUD memória
/api/tenants/:id/redes        → CRUD redes sociais
/api/tenants/:id/onboarding   → GET/PATCH checklist

/api/carrosseis/
  GET    /                 → listar (filtro: tenant, status, operador)
  POST   /                 → criar (status: BACKLOG)
  GET    /:id              → detalhe + slides
  PATCH  /:id              → atualizar status/conteúdo
  POST   /:id/aprovar      → cliente aprova
  POST   /:id/ajuste       → cliente pede ajuste
  POST   /:id/agendar      → definir data/hora
  POST   /:id/publicar     → publicar agora

/api/agenda/
  GET    /                 → posts agendados (filtro: tenant, data)
  POST   /                 → agendar post
  PATCH  /:id              → reagendar
  DELETE /:id              → cancelar

/api/automacoes/
  GET    /                 → listar DMs ativas
  POST   /                 → criar automação
  PATCH  /:id              → ativar/desativar
  GET    /:id/interacoes   → histórico de DMs enviadas

/api/leads/
  GET    /                 → listar (filtro: tenant, canal, status)
  PATCH  /:id              → atualizar status/notas

/api/campanhas/
  GET    /                 → listar
  POST   /                 → criar
  PATCH  /:id              → atualizar métricas/status

/api/sites/
  GET    /                 → listar
  POST   /:id/deploy       → trigger deploy no Coolify
  POST   /:id/ticket       → solicitação de alteração

/api/financeiro/
  GET    /contratos        → listar contratos
  GET    /faturas          → listar faturas (filtro: status)
  POST   /faturas/:id/pagar → marcar como paga

/api/relatorios/
  POST   /gerar            → gera relatório do mês pra tenant
  GET    /:id              → visualizar
  POST   /:id/enviar       → envia pro cliente

/api/webhooks/
  POST   /instagram        → recebe comentários (ManyChat)
  POST   /whatsapp         → recebe mensagens (Evolution API)

/api/health                → status do sistema
```

---

## 7. Regras de frontend

### Tema e estilo

- **Tema claro** (light mode only, sem dark mode)
- **Protocolo 7 níveis** do UI/UX Pro Max pra todas as decisões visuais
- Tipografia e paleta definidas via design system antes de codar

### Botões

- Sempre **sólidos** (fundo preenchido + texto branco ou contrastante)
- Proibido: botões ghost, outlined, transparent
- Hierarquia: primário (cor principal), secundário (cinza neutro), destrutivo (vermelho)

### Tags e badges de status

- Fundo **sólido** com texto contrastante
- Proibido: badges escuras com dot indicator (tipo ● RASCUNHO em fundo dark)
- Proibido: borders finas com fundo transparente
- Exemplo correto: tag com fundo sólido claro (azul claro pra info, verde claro pra ativo, amarelo claro pra pendente)

### Proibições absolutas (anti-slop)

- Zero emojis em qualquer lugar da UI
- Zero hifens em copy (trocar por vírgula ou ponto)
- Zero cores neon (rgba(COR, 0.1) + rgba(COR, 0.2) proibido)
- Zero containers retangulares decorativos em volta de texto solto
  (permitido APENAS em cards e modais que agrupam conteúdo)
- Zero Inter/Roboto (fonte será definida no design system)
- Zero AOS genérico (transições intencionais, não lib de scroll animation)
- Zero ícones abaixo de Lucide (sem Font Awesome, sem emojis como ícone)

### Linguagem da interface

Todos os textos da plataforma (toasts, labels, mensagens de erro,
placeholders, tooltips, estados vazios, confirmações) seguem as
mesmas diretrizes do MazyOS: falar como pessoa, não como software.

**Público MASTER (operador):**
Sabe o que faz, mas não precisa de jargão técnico.
- Ruim: "Webhook de fulfillment processado com sucesso via Graph API"
- Bom: "Post publicado no Instagram do Rodger"
- Ruim: "Erro 403: insufficient permissions on endpoint /media_publish"
- Bom: "Não conseguiu postar. O token do Rodger pode ter expirado"
- Ruim: "Pipeline de renderização concluído. Assets uploadados ao R2"
- Bom: "Carrossel pronto. 7 slides salvos"

**Público TENANT (cliente):**
Não sabe nada de marketing digital. Falar como se fosse WhatsApp.
- Ruim: "Seu conteúdo foi aprovado e agendado para publicação"
- Bom: "Aprovado! Sai no seu Instagram amanhã às 10h"
- Ruim: "Nenhum lead capturado via automação de DM neste período"
- Bom: "Ninguém comentou a palavra-chave esse mês"
- Ruim: "Relatório de performance do período disponível para download"
- Bom: "Seu relatório de junho tá pronto"

**Regras gerais:**
- Máximo 1 frase por toast (sem parágrafos)
- Nunca exibir IDs, códigos de erro HTTP ou nomes de API pro usuário
- Erros devem dizer O QUE aconteceu + O QUE fazer, não o código técnico
- Estados vazios devem ser acolhedores, não técnicos
  - Ruim: "Nenhum registro encontrado na tabela de carrosséis"
  - Bom: "Nenhum carrossel ainda. Crie o primeiro"
- Confirmações de ação destrutiva: linguagem clara sobre consequência
  - Ruim: "Tem certeza que deseja executar a operação de exclusão?"
  - Bom: "Cancelar o contrato do Rodger? Ele perde acesso em 30 dias"

### Componentes base

- Cards: fundo branco, border sutil (gray-200), shadow-sm
- Modais: fundo branco, overlay semi-transparente
- Tabelas: sem zebra striping exagerado, headers sólidos
- Inputs: border visível, label sempre acima (nunca placeholder-only)
- Kanban: cards brancos, colunas com header sólido, drag visual claro

---

## 8. Tasklist de construção

### FASE 0 — Fundação (1-2 semanas)

```
[ ] Criar projeto Next.js 14 + TypeScript + Tailwind + shadcn/ui
[ ] Configurar Prisma + PostgreSQL no Coolify
[ ] Criar schema.prisma com todos os modelos acima
[ ] Rodar primeira migration
[ ] Configurar auth (JWT + middleware de proteção de rotas)
[ ] Criar seed com dados do Rodger (migrar _memoria/ e identidade/)
[ ] Estruturar pastas: /app/master/*, /app/tenant/*, /api/*
[ ] Deploy inicial no Coolify (container Docker)
```

### FASE 1 — MASTER funcional (2-3 semanas)

```
CLIENTES
[ ] Página /master/clientes — lista de tenants
[ ] Formulário criar tenant (nome, nicho, contato, plano)
[ ] Página detalhe do tenant (perfil, identidade, memória)
[ ] Checklist de onboarding visual (progresso %)
[ ] Formulário conectar rede social (Instagram token flow)

PIPELINE
[ ] Página /master/pipeline — kanban drag-and-drop
[ ] Criar carrossel (seleciona tenant, tema)
[ ] Mover entre colunas (BACKLOG → EM_PRODUCAO → ...)
[ ] Detalhe do card: copy, slides, legenda, feedback
[ ] Integrar pipeline MazyOS (gerar imagem, render, upload R2)

CALENDÁRIO
[ ] Página /master/calendario — grade mensal
[ ] Visualizar posts agendados por data
[ ] Agendar post (seleciona carrossel aprovado → data/hora)
[ ] Cor por tenant

DASHBOARD
[ ] Página /master/dashboard
[ ] Cards: posts hoje, aprovações pendentes, alertas
[ ] Saúde: status dos tokens, automações
[ ] Números da semana
```

### FASE 2 — TENANT + ManyChat (2-3 semanas)

```
PAINEL TENANT
[ ] Layout /tenant/* (sidebar simples, 6 guias)
[ ] Página /tenant/inicio — resumo do mês
[ ] Página /tenant/conteudo — galeria de carrosséis
[ ] Fluxo de aprovação (aprovar / pedir ajuste)
[ ] Página /tenant/contatos — leads recebidos
[ ] Página /tenant/site — status e solicitações
[ ] Página /tenant/relatorios — visualizar + download PDF
[ ] Página /tenant/conta — dados, plano, faturas

MANYCHAT (automação de DM)
[ ] Configurar webhook no Meta (comentários)
[ ] Rota POST /api/webhooks/instagram
[ ] Lógica: match keyword → enviar DM → registrar lead
[ ] Idempotência (não responder 2x mesmo usuário)
[ ] Página /master/automacoes — CRUD de keywords
[ ] Logs de interações (quem comentou, DM enviada, quando)

SCHEDULER
[ ] Implementar node-cron no processo Next.js
[ ] Job: publicar posts agendados
[ ] Job: alertar tokens expirando
[ ] Job: marcar faturas atrasadas
```

### FASE 3 — Financeiro + Relatórios (1-2 semanas)

```
FINANCEIRO
[ ] Página /master/financeiro
[ ] CRUD contratos (valor, vencimento, serviços)
[ ] Geração de faturas mensais (automática via cron)
[ ] Marcar como paga
[ ] Visão de margem por cliente (receita - custo ads)
[ ] Alertas de inadimplência

RELATÓRIOS
[ ] Página /master/relatorios
[ ] Geração automática: puxa métricas do Instagram + GMB + Ads
[ ] Template de relatório (HTML → PDF via Playwright)
[ ] Envio pro cliente (email ou link)
[ ] Histórico de relatórios enviados
```

### FASE 4 — Integrações externas (2-4 semanas)

```
WHATSAPP
[ ] Instalar Evolution API no Coolify
[ ] Conectar instância por tenant
[ ] Auto-respostas configuráveis
[ ] Página /master/automacoes — aba WhatsApp

GOOGLE MEU NEGÓCIO
[ ] OAuth flow pra conectar conta
[ ] Postar no GMB via API
[ ] Puxar métricas (visualizações, ligações, rotas)
[ ] Incluir no relatório mensal

TRÁFEGO PAGO
[ ] Meta Marketing API: criar/pausar campanhas
[ ] Google Ads API: criar/pausar campanhas
[ ] Puxar métricas em tempo real
[ ] Página /master/campanhas

SITES
[ ] Página /master/sites
[ ] Deploy via Coolify API
[ ] Monitorar uptime
[ ] Tickets de alteração (tenant → master)
```

### FASE 5 — Polimento (1-2 semanas)

```
[ ] Equipe: atribuição de operadores a tenants
[ ] Audit log: registrar todas as ações
[ ] Notificações: email/WhatsApp quando post é publicado
[ ] Configurações: templates de proposta, contrato
[ ] Soft delete em tudo (nunca perder dados)
[ ] Responsivo: painel TENANT funcional no celular
[ ] Testes E2E: fluxo de aprovação, postagem, DM
```

---

## 8. O que já existe e entra direto

| Componente | Arquivo atual | Entra como |
|-----------|--------------|-----------|
| Geração de imagem | scripts/gerar-imagem-cf.js | Chamado pelo pipeline no MASTER |
| Upload R2 | scripts/upload-r2.js | Chamado após render |
| Postagem Instagram | scripts/postar-instagram.js | Chamado pelo scheduler |
| Copy pipeline | _memoria/estrategias_de_copy.md | Lido do banco (MemoriaTenant) |
| Identidade visual | identidade/design-guide.md | Lido do banco (IdentidadeVisual) |
| Preferências | _memoria/preferencias.md | Lido do banco (MemoriaTenant) |
| Skill carrossel | .claude/skills/carrossel/SKILL.md | Regras pro agente seguir |
| Token Meta | .env META_PAGE_ACCESS_TOKEN | Armazenado em RedeSocial.accessToken |
| Token Cloudflare | .env CLOUDFLARE_* | Configs globais do sistema |
| Servidor Coolify | 159.195.12.135 | Hospeda tudo |
