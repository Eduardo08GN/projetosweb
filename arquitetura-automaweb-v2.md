# Arquitetura AutomaWeb v2 — Plataforma de operação, não de administração

> Revisão crítica da v1 cruzada com o workflow real de produção.
> Tese: a v1 modela uma agência genérica de 50 clientes. Nós somos 2 operadores
> com 5 clientes produzindo via Claude Code. A plataforma certa é outra.

---

## 1. Diagnóstico — por que a v1 parece vaga

A sensação de vagueza tem causa identificável. A v1 comete 4 erros:

### Erro 1: modela DADOS, não TRABALHO

A v1 tem 12 guias no master: Financeiro, Equipe, Campanhas, Relatórios,
Configurações... São guias de **administração de informação**. Nenhuma delas
responde a pergunta que o operador faz de manhã:

> "O que eu preciso fazer HOJE pra nenhum cliente ficar descoberto?"

Com 5 clientes, Financeiro é uma linha de planilha. Equipe somos eu e o Lucas.
Campanhas ainda não existem. Relatório mensal é um template. A v1 gasta 60%
do esforço de construção em guias que a gente abriria uma vez por mês.

### Erro 2: finge que a produção acontece dentro dela

A produção REAL acontece no MazyOS: skill carrossel 2.0, protocolo 7 níveis
pra sites, FLUX pra imagem, Playwright pra render. A plataforma v1 não produz
nada — ela só guarda o estado. Resultado prático já visível: os dois carrosséis
de ontem estão 100% prontos no disco e o banco ainda diz EM_PRODUCAO. A
plataforma virou um segundo lugar pra atualizar, ou seja, **trabalho extra**,
o oposto de facilitar a vida.

### Erro 3: kanban de 7 colunas pra um pipeline de 2 pessoas

BACKLOG → EM_PRODUCAO → REVISAO_INTERNA → AGUARDANDO_CLIENTE → APROVADO →
AGENDADO → PUBLICADO. Sete estados pra mover na mão. Três deles (backlog,
produção, revisão interna) são "coisa nossa" e mudam em horas. Mover card
virou burocracia. O cliente só se importa com 2 estados: "preciso aprovar"
e "já foi publicado".

### Erro 4: assume que o cliente vai logar num painel

Dentista, professor, dono de loja — esse público não loga em painel de
agência. Ele responde WhatsApp. Um painel tenant com 6 guias é um painel
que ninguém abre, e aí a aprovação trava e a gente cobra por WhatsApp do
mesmo jeito. O painel virou decoração.

E o quinto problema, o estratégico (da análise "ninguém quer um site"):
a v1 é uma plataforma pra entregar **conteúdo e site**. Mas o que retém
cliente é **sistema que gera dinheiro pra ele** (CRM, booking, retenção).
A v1 não tem onde plugar isso.

---

## 2. Teste de realidade — uma semana com 5 clientes

Antes de desenhar, simular a demanda real. 5 clientes, mix de serviços:

| Cliente | Conteúdo/semana | Setup one-time | Sistema (micro-SaaS) |
|---------|----------------|----------------|---------------------|
| Rodger (inglês) | 3 carrosséis/reels | feito | CRM alunos + retenção |
| Dra. Camila (odonto) | 3 carrosséis/reels | GMB + ManyChat | booking consultas |
| Cliente C (gastronomia) | 2 posts | site + GMB | cardápio/pedidos |
| Cliente D (serviços) | 2 posts | site + ManyChat | orçamentos |
| Cliente E (loja) | 2 posts | site + GMB + Meta | mini-CRM |

**Demanda semanal real:**
- ~12 conteúdos produzidos, aprovados e publicados (= ~36 movimentos de estado)
- ~12 aprovações de cliente pra caçar (o gargalo nº 1 de qualquer agência)
- 6-8 tarefas de setup em andamento (GMB, ManyChat, DNS, Meta connect)
- Leads pingando em 5 Instagrams + 5 WhatsApps + 5 sites
- 1-2 pedidos avulsos ("muda o telefone no site", "põe a promoção no ar")

**O que mata a operação nesse cenário:** esquecer cliente descoberto,
aprovação parada 4 dias sem ninguém cobrar, post aprovado que não foi
publicado porque alguém esqueceu, lead que chegou e ninguém viu.

**Conclusão:** a plataforma não precisa administrar uma agência. Precisa
garantir 4 coisas: nada esquecido, aprovação sem fricção, publicação sem
humano, valor provado pro cliente. Todo o resto é enfeite.

---

## O que a v1 acertou — e vira o núcleo da v2

Uma coisa da v1 é genuinamente valiosa e tudo na v2 se constrói em volta
dela: **a conexão de um clique**. O cliente clica "Conectar Instagram",
autoriza, e a partir dali temos capacidade operacional dentro da conta
dele — publicar carrossel, ler comentários, mandar DM, configurar
automação — sem nunca mais pedir senha, token ou print.

Esse é o único pedaço da plataforma que o MazyOS não substitui:

- A fábrica produz o carrossel, mas é a conexão que **autoriza injetar**
  na conta do cliente.
- A skill define a keyword da automação, mas é a conexão que **recebe o
  webhook** do comentário e **envia a DM** em nome dele.
- O robô agenda, mas é o token guardado pela conexão que **publica às 10h
  sem ninguém acordado**.

Em outras palavras: a plataforma é, na essência, **um cofre de autorizações
+ um robô que opera dentro delas**. As 5 guias do master e o link mágico
existem pra alimentar e supervisionar esse núcleo. É por isso que a
aprovação do app na Meta (guia do Lucas) não é burocracia paralela — é o
desbloqueio do produto inteiro: sem Advanced Access, a conexão de um clique
só funciona pra contas nossas; com ela, funciona pra qualquer cliente que
a gente fechar. O mesmo padrão se repete nas próximas conexões (Google Meu
Negócio via OAuth, WhatsApp via QR code da Evolution): **um clique do
cliente, capacidade permanente nossa.**

---

## 3. Princípios da v2

1. **MazyOS é a fábrica, a plataforma é a esteira.** A plataforma nunca
   tenta produzir. Ela recebe o que a fábrica produz (via script de sync),
   coordena aprovação, publica e mede. Uma fonte de verdade: o banco.
   O arquivo local é rascunho até o sync.

2. **Uma tela responde "o que fazer agora".** O operador abre a plataforma
   e em 5 segundos sabe o dia. Se precisar navegar pra descobrir trabalho
   pendente, falhou.

3. **O cliente aprova sem senha, sem app, sem painel.** Link mágico no
   WhatsApp → tela mobile com os slides → dois botões. Aprovar conteúdo
   tem que ser mais fácil que responder "ok" no WhatsApp.

4. **O painel do cliente existe pra provar valor e rodar o sistema dele.**
   Não é espelho da nossa operação. É o dashboard do negócio DELE: contatos
   que chegaram, agendamentos, alunos ativos. O micro-SaaS é o painel.

5. **Construir quando doer, não quando parecer profissional.** Financeiro,
   equipe, campanhas: entram quando a dor existir (10+ clientes), não antes.

---

## 4. Arquitetura em 3 camadas

```
┌─────────────────────────────────────────────────────────────────┐
│ CAMADA 1 — FÁBRICA (MazyOS / Claude Code)                       │
│                                                                  │
│  Skills: carrossel 2.0, sites 7 níveis, copy, GMB posts          │
│  Ferramentas: FLUX, Playwright, R2, Firecrawl                    │
│  Saída: artefatos prontos (PNGs, HTML, legendas, sites)          │
│                                                                  │
│            │  scripts/automaweb-sync.js (a PONTE)                │
│            │  push: artefatos → R2 + estado → banco              │
│            │  pull: fila de produção → contexto pro Claude       │
│            ▼                                                     │
├─────────────────────────────────────────────────────────────────┤
│ CAMADA 2 — OPERAÇÃO (painel master, 5 guias)                    │
│                                                                  │
│  HOJE        a fila do dia (tudo que precisa de ação)            │
│  CONTEÚDO    pipeline + calendário unificados                    │
│  CLIENTES    ficha viva por tenant (setup, serviços, sistema)    │
│  ENTRADA     leads e mensagens de todos os clientes              │
│  ROBÔ        scheduler: publica, cobra aprovação, alerta         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ CAMADA 3 — CLIENTE (2 superfícies, nenhuma exige senha)         │
│                                                                  │
│  APROVAÇÃO   link mágico via WhatsApp → aprova/pede ajuste       │
│  MEU NEGÓCIO o micro-SaaS dele: dashboard, CRM, booking,         │
│              contatos. Identidade visual DELE, não nossa         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Camada 2 — o painel master em 5 guias

### 5.1 HOJE (a guia que abre por padrão)

Uma lista única, ordenada por urgência, gerada automaticamente do estado
do banco. Não é configurável, não é kanban, não tem filtro. É a resposta.

```
HOJE — terça, 10 de junho

PUBLICAR (robô faz, você confere)
  10h00  Rodger — "Phrasal verbs do dia a dia"          [agendado, ok]
  14h00  Dra. Camila — "Quando trocar a escova"          [agendado, ok]

DESTRAVAR (ação sua)
  ! Dra. Camila não respondeu aprovação há 3 dias        [reenviar link]
  ! Token do Instagram do Rodger expira em 5 dias        [reconectar]

PRODUZIR (puxar pro MazyOS)
  Rodger — sem conteúdo aprovado pra depois de quinta    [2 no backlog]
  Cliente C — site parado em "aguardando DNS" há 6 dias  [cobrar]

CHEGOU (responder ou repassar)
  3 leads novos: 2 Dra. Camila (keyword AGENDA), 1 Rodger
```

A regra de ouro: **cada cliente tem que ter conteúdo aprovado cobrindo os
próximos 7 dias.** Quando a cobertura cai, o cliente aparece em PRODUZIR.
Isso elimina o "esqueci do cliente X" sem ninguém gerenciar nada.

### 5.2 CONTEÚDO (pipeline + calendário, uma guia só)

Kanban reduzido a **4 colunas** — só estados que importam pra coordenação:

```
PRODUZIR          APROVAÇÃO            AGENDADO           PUBLICADO
(backlog +        (esperando           (data marcada,     (últimos 30
 em produção,      cliente; mostra      robô publica)      dias, com
 vive no MazyOS)   há quantos dias)                        métricas)
```

- BACKLOG, EM_PRODUCAO e REVISAO_INTERNA da v1 viram UMA coluna. A distinção
  interna vive no MazyOS, onde a produção acontece de verdade.
- O card mostra: cliente, tema, preview do slide 1, dias parado.
- Embaixo do kanban, o calendário do mês (cor por cliente, gaps visíveis).
  Não é outra guia — é a mesma informação em outra projeção.
- Botão único por card em APROVAÇÃO: "reenviar link pro WhatsApp".

### 5.3 CLIENTES (a ficha viva)

Lista enxuta (5 linhas...) e a ficha de cada um com 4 abas:

1. **Serviços** — o que esse cliente contratou e o status de cada um:
   ```
   Conteúdo social     ATIVO      3 posts/semana, cobertura: 9 dias
   Site                NO AR      flytofluency.com.br, 412 visitas/mês
   Google Meu Negócio  PENDENTE   travado em: verificação por cartão postal
   ManyChat            ATIVO      2 keywords, 47 DMs enviadas
   Sistema (CRM)       PROPOSTO   módulo retenção de alunos
   ```
   Cada serviço pendente é um **checklist de setup** com dono e bloqueio
   explícito ("esperando código do correio", "esperando Lucas criar conta").
   Isso substitui o OnboardingChecklist genérico da v1 — setup não é uma
   fase que acaba, é um serviço que liga e desliga.

2. **Identidade** — design guide, cores, fontes, logo (o que a skill
   carrossel 2.0 consome via sync).

3. **Memória** — empresa/preferências/estratégia do cliente (idem).

4. **Conexões** — Instagram, Facebook, GMB, WhatsApp: status do token,
   botão reconectar, última sincronização.

### 5.4 ENTRADA (caixa única de leads e mensagens)

Tudo que chega de todos os clientes: DM por keyword, formulário do site,
WhatsApp. Uma lista, mais nova em cima, com 3 ações por item:
**responder** (abre o canal), **repassar pro cliente** (manda pro WhatsApp
dele com contexto), **marcar tratado**. Vira o histórico que alimenta o
número "X contatos gerados" do relatório. Sem CRM de estágios, sem funil —
isso é papel do micro-SaaS de cada cliente, não nosso.

### 5.5 ROBÔ (o scheduler com cara de gente)

A guia mais importante e a que não existia de verdade na v1. Um processo
(node-cron) que roda a cada minuto e executa 4 rotinas:

```
1. PUBLICAR    posts AGENDADO com hora vencida → Meta API → PUBLICADO
               falhou? → alerta no HOJE + retry 2x com backoff
2. COBRAR      conteúdo em APROVAÇÃO há 48h → reenvia link mágico
               no WhatsApp do cliente (Evolution API), máx 2 lembretes
3. VIGIAR      tokens expirando em 7 dias, site fora do ar (ping),
               cliente sem cobertura de conteúdo → alerta no HOJE
4. MEDIR       1x/dia puxa métricas dos posts publicados (alcance,
               likes) e visitas dos sites → alimenta painel do cliente
```

A guia em si só mostra o log humanizado: "Publicou o post do Rodger às
10h02", "Lembrete enviado pra Dra. Camila", "Site do Cliente C não
respondeu às 03h, voltou às 03h04".

**O item 2 é o que mais muda a vida.** Hoje caçar aprovação é trabalho
manual; na v2 o robô cobra sozinho e o HOJE só mostra quando nem isso
resolveu.

---

## 6. Camada 3 — o lado do cliente

### 6.1 Aprovação por link mágico (substitui o login pra 90% dos casos)

Fluxo completo:

```
1. Conteúdo entra em APROVAÇÃO (via sync do MazyOS)
2. Robô manda no WhatsApp do cliente:
   "Oi Camila! O post 'Quando trocar a escova de dente' tá pronto.
    Olha aqui e me diz se aprova: automaweb.app/a/x7Kp2"
3. Link abre direto (token de uso único, expira em 7 dias):
   - slides em carrossel deslizável (mobile-first)
   - legenda completa
   - dois botões: [Aprovar] [Quero mudar algo]
   - "mudar algo" abre um campo de texto livre, que cai no HOJE
4. Aprovou → status APROVADO → master agenda (ou auto-agenda no
   próximo slot do plano: ter/qui/sáb 10h)
```

Sem senha, sem cadastro, sem app. A fricção de aprovar cai pra ~10
segundos, e é nesse gargalo que agência pequena morre.

### 6.2 "Meu negócio" — o painel que é o produto

Quando o cliente loga (Google OAuth, já implementado), ele NÃO vê nossa
operação. Vê o negócio dele, com a identidade visual dele:

```
PADRÃO (todo cliente)                 MÓDULOS (por contrato)
─────────────────────                 ─────────────────────
Resumo do mês:                        CRM       (Rodger: alunos, nível,
 "Publicamos 12 posts.                           histórico de aulas)
  38 pessoas chamaram você.           BOOKING   (Camila: agenda de
  Seu site teve 412 visitas."                    avaliações, lembretes)
Contatos (a lista de leads dele,      RETENÇÃO  (lembrete automático:
 com botão de abrir no WhatsApp)                 aluno sumido, aniversário,
Conteúdo (aprovar pendentes +                    renovação)
 galeria do que já saiu)              VITRINE   (modo apresentação,
                                                 catálogo, cardápio)
```

Arquitetura dos módulos: cada um é um grupo de rotas `/tenant/m/[modulo]`
com tabelas próprias multi-tenant (`crm_contatos`, `bookings`, ...), ligado
ao tenant por uma tabela `ModuloAtivo`. Construímos o módulo UMA vez com
Claude Code, ativamos por cliente, tematizamos com a identidade dele.
É exatamente o modelo Emmanuel Diaz: custo marginal caindo por cliente,
valor percebido de sistema sob medida, churn perto de zero — cancelar a
assinatura significa perder o CRM onde estão os clientes dele.

**Consequência de pricing:** o plano deixa de ser "quantidade de posts"
e vira "operação de marketing + sistema do negócio". O conteúdo traz
cliente pro funil; o módulo prende.

### 6.3 Catálogo de módulos e como vender (modelo Emmanuel Diaz)

Referência de mercado: Emmanuel cobra ~$250/mês por site + sistema sob
medida, constrói cada sistema em ~1 semana com Claude Code, e o cliente
não cancela porque o sistema rende mais do que custa. Nossa stack faz
exatamente isso. O catálogo inicial, em ordem de construção:

| Módulo | O que faz | Nicho-alvo | Primeiro caso |
|--------|-----------|-----------|---------------|
| CRM + retenção | Perfil do cliente final, histórico, lembrete automático (sumiu, aniversário, renovação, próximo nível) | Qualquer serviço recorrente sem assinatura: professor, dentista, personal, barbearia, pet shop | Rodger (alunos) |
| Booking | Agendamento no site, confirmação e lembrete por WhatsApp | Clínicas, consultórios, estúdios | Dra. Camila |
| Vitrine / modo apresentação | Catálogo elegante sem preço, tela de boas-vindas com nome do cliente final, shareável no Instagram | Boutiques, fotografia, imóveis, gastronomia | prospecção |
| Compliance tracker | Documentos por pessoa, datas de renovação, alertas | Segurança, saúde, jurídico | prospecção |
| Funil de conteúdo | Lead magnet → sequência → oferta | Criadores, infoprodutores | Rodger (32K inscritos sem funil) |

**Regras de construção** (anti-HubSpot, direto do vídeo):
- Zero botões sobrando. O módulo faz exatamente o que o nicho precisa.
- Identidade visual do cliente, nunca UI genérica de software.
- Pedido novo do cliente ("precisa de mais um campo") = ajuste em horas.
  Essa responsividade É o produto.

**Go-to-market — demo antes do cliente:**
1. Construir o módulo pro cliente real (Rodger, Camila) e medir resultado
   ("alunos recorrentes subiram X%").
2. Clonar como demo com dados fictícios do MESMO nicho.
3. Prospecção fria com o sistema pronto na mão: "identifiquei que clínicas
   como a sua perdem paciente por falta de retorno automático. Construí
   isso aqui — olha funcionando". Nunca "faço seu site mais bonito".
4. O nicho "de graça" pra começar: negócios de booking recorrente que não
   conseguem fazer assinatura (o problema é idêntico em todos).

**Por que isso fortalece o núcleo (conexão de um clique):** o módulo usa
as mesmas autorizações — lembrete de retenção sai pelo WhatsApp conectado,
o lead da DM cai direto no CRM dele, o booking confirma pelo mesmo canal.
Quanto mais módulos ativos, mais valiosa a conexão, mais impensável o
cancelamento.

---

## 7. A ponte MazyOS ↔ plataforma (o que elimina o trabalho dobrado)

Um script só, `scripts/automaweb-sync.js`, com 3 comandos:

```bash
# 1. PUXAR — começo do dia ou início de produção
node automaweb-sync.js fila
#    → lista o que está em PRODUZIR por cliente, baixa identidade
#      e memória do tenant pra .tmp/contexto/ (a skill carrossel 2.0
#      passa a ler do banco, não de pastas locais desatualizadas)

# 2. ENTREGAR — fim da produção de um conteúdo
node automaweb-sync.js entregar marketing/conteudo/carrossel-X/
#    → sobe PNGs pro R2, grava slidesUrls + legenda no banco,
#      move status pra APROVAÇÃO, dispara o link mágico no WhatsApp
#    (uma chamada substitui: upload manual + update manual + card
#     manual + mensagem manual — o gap que deixou os 2 carrosséis
#     de ontem órfãos)

# 3. SITE — deploy de site de cliente
node automaweb-sync.js site <tenant> <pasta>
#    → deploy via Coolify API + registra URL/status na ficha
```

A skill carrossel 2.0 ganha um passo final: "rodar `entregar`". Pronto —
a plataforma fica atualizada como efeito colateral do trabalho, nunca
como tarefa separada.

---

## 8. Modelo de dados v2 (diff contra a v1)

**Mantém (já existe e serve):** User, Tenant, MetaConnection, Carrossel
(renomear conceito pra `Conteudo` — carrossel, reel, story, post GMB são
o mesmo fluxo), AgendaPost, AutomacaoDM, InteracaoDM, Site.

**Simplifica:**
- `StatusCarrossel`: 8 estados → 5 (`PRODUZIR`, `APROVACAO`, `APROVADO`,
  `AGENDADO`, `PUBLICADO`) + flag `ajustePedido` com texto do cliente.
- `OnboardingChecklist` (13 booleans fixos) → sai. Vira `Servico`.

**Entra:**
```prisma
model Servico {            // a unidade da ficha do cliente
  id        String  @id @default(cuid())
  tenantId  String
  tipo      TipoServico    // CONTEUDO, SITE, GMB, MANYCHAT, MODULO, ADS
  status    StatusServico  // PROPOSTO, SETUP, ATIVO, PAUSADO
  config    Json           // ex: { postsPorSemana: 3, slots: ["ter 10h"] }
  bloqueio  String?        // "esperando código do correio" — vai pro HOJE
  checklist Json?          // passos do setup com done/pendente
}

model Lead {               // a guia ENTRADA
  id        String   @id @default(cuid())
  tenantId  String
  canal     Canal          // DM_IG, WHATSAPP, SITE, GMB
  nome      String?
  contato   String?
  mensagem  String?
  keyword   String?
  tratado   Boolean  @default(false)
  criadoEm  DateTime @default(now())
}

model LinkAprovacao {      // o link mágico
  id         String   @id @default(cuid())
  conteudoId String
  token      String   @unique
  expiraEm   DateTime
  usadoEm    DateTime?
  lembretes  Int      @default(0)
}

model ModuloAtivo {        // micro-SaaS por tenant
  id        String @id @default(cuid())
  tenantId  String
  modulo    String         // "crm", "booking", "retencao", "vitrine"
  config    Json
}

model Metrica {            // alimenta "meu negócio" e o resumo do mês
  id        String   @id @default(cuid())
  tenantId  String
  tipo      String         // "post_alcance", "site_visitas", "dm_enviada"
  valor     Int
  referencia String        // "2026-06" ou postId
  coletadoEm DateTime @default(now())
}
```

**Adia (volta quando doer, ~10+ clientes):** Contrato, Fatura, Relatorio
(o resumo do mês no painel do cliente cobre 90% do valor de "relatório"),
Campanha, AuditLog formal, Equipe/atribuição de operador.

---

## 9. Caminho de migração (aproveitando o que existe)

A v2 não joga o código fora. Auth JWT, Google OAuth, layout master/tenant,
kanban drag-and-drop, detail sheet do carrossel, MetaConnection — tudo
continua. A ordem ataca primeiro o que dói hoje:

```
SPRINT 1 — A ponte e o robô (mata o trabalho dobrado)
[ ] automaweb-sync.js (fila / entregar / site)
[ ] Terminar callback Meta (salvar conexão, state param, multi-página)
[ ] Scheduler node-cron: rotina PUBLICAR + VIGIAR tokens
[ ] Colapsar status 8→5 (migration simples)
[ ] Destravar os 2 carrosséis órfãos usando o próprio `entregar` (dogfood)

SPRINT 2 — Aprovação sem fricção (mata o gargalo nº 1)
[ ] LinkAprovacao + página pública mobile /a/[token]
[ ] Envio por WhatsApp (Evolution API — instalar no Coolify)
[ ] Rotina COBRAR do robô
[ ] Guia HOJE no master (primeira versão: publicar + destravar + produzir)

SPRINT 3 — Ficha viva e entrada (mata o "esqueci")
[ ] Model Servico + aba Serviços na ficha do cliente
[ ] Guia ENTRADA + webhook /api/webhooks/instagram (DM por keyword)
[ ] Regra de cobertura de 7 dias alimentando o HOJE
[ ] Fundir calendário na guia CONTEÚDO

SPRINT 4 — O produto que retém (modelo Emmanuel)
[ ] Model ModuloAtivo + shell /tenant/m/[modulo]
[ ] Módulo 1: CRM + retenção pro Rodger (caso real, vira demo)
[ ] Resumo do mês no painel do cliente (Metrica + rotina MEDIR)
[ ] Pitch e pricing novo: operação + sistema, não posts/mês
```

Depois do sprint 4, cada cliente novo de um nicho repetido (segunda
clínica, segundo professor) custa horas de adaptação, não semanas de
construção. É aí que 5 clientes viram 15 sem contratar ninguém.

---

## 10. Resumo em uma frase por camada

- **MazyOS produz** — a plataforma nunca compete com a fábrica.
- **O master coordena** — uma tela diz o que fazer, o robô faz o resto.
- **O cliente aprova no WhatsApp e vive no sistema dele** — e é o sistema
  dele que torna o cancelamento impensável.
