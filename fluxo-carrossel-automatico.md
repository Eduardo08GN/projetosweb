# Fluxo de Producao de Carrossel Automatico

> 14 carrosseis + 7 videos em 2 horas. Zero custo. 7h/semana economizadas.

---

## Visao geral

Pipeline de 8 etapas com 3 checkpoints de aprovacao. YouTube como input, Instagram como output, Claude Code como motor.

```
YouTube (video)
    |
    v
[1] Transcrever audio
    |
    v
[2] Claude Code: copy + angulos + keywords  -->  APROVACAO 1
    |
    v
[3] Cloudflare Workers AI: gerar 6-7 imagens (FLUX schnell, gratis)  -->  APROVACAO 2
    |
    v
[4] HTML editorial: montar slides com identidade visual
    |
    v
[5] Puppeteer: screenshot dos slides (1080x1350 ou 1380x1728)
    |
    v
[6] Supabase: upload dos PNGs + fila de agendamento
    |
    v
[7] Instagram API: postar via Meta token (buffer/backlog)  -->  APROVACAO 3
    |
    v
[8] DM Flow: keyword no comentario → DM automatica pro lead
```

---

## Etapa 1 — Transcrever o video

**Input:** Link do YouTube
**Output:** Transcricao completa em texto

### Por que transcrever primeiro
- Economiza tokens (nao precisa enviar audio/video pro LLM)
- YouTube ja fornece transcricao pronta
- Texto limpo e mais facil de processar pra gerar angulos

### Como fazer
1. Abrir o video no YouTube
2. Copiar a transcricao disponivel na descricao/aba de transcricao
3. Colar no Claude Code junto com o link do video

---

## Etapa 2 — Gerar copy, angulos e keywords

**Input:** Transcricao + link do video
**Output:** 2-3 angulos com copy completa por slide + keyword de comentario

### Tipos de angulo treinados
- **Educacional (hacks)** — ensina algo pratico, formato passo a passo
- **Provocativo** — desafia crenca comum, gera reacao
- **Comparativo** — antes/depois, com/sem, X vs Y

### O que o Claude Code entrega por angulo
- Copy de cada slide (6-7 slides por carrossel)
- Keyword de comentario (palavra que o lead comenta pra receber o material)
- Tom de voz e estilo ja calibrados via skills

### CHECKPOINT 1 — Aprovar angulos
- Revisar angulos propostos
- Pedir ajustes (mais provocativo, trocar keyword, refazer copy)
- Aprovar antes de seguir pra geracao de imagem

---

## Etapa 3 — Gerar imagens via API

**Input:** Descricao/prompt de cada imagem
**Output:** 6-7 imagens por carrossel

### Stack de geracao
- **Servico:** Cloudflare Workers AI
- **Modelo:** FLUX schnell
- **Custo:** Gratis (10.000 imagens/dia no plano free)
- **Velocidade:** 6 imagens em menos de 14 segundos

### Como funciona
1. Claude Code chama a API do Cloudflare via Worker
2. Envia prompt de imagem por slide
3. Recebe imagem gerada
4. Salva localmente

### CHECKPOINT 2 — Aprovar imagens
- Revisar cada imagem gerada
- Pedir refacao de slides especificos ("slide 4, refaca")
- Nova chamada API so pro slide reprovado
- Aprovar antes de montar o HTML

---

## Etapa 4 — HTML editorial

**Input:** Copy aprovada + imagens aprovadas
**Output:** Pagina HTML com todos os slides do carrossel renderizados

### O que o HTML inclui por slide
- Imagem de fundo gerada pela API
- Label/tag da marca no topo
- Copy com a fonte e estilo treinados
- Keyword de comentario (quando aplicavel)
- Layout na identidade visual do perfil

### Como treinar o editorial
1. Dar exemplos reais de carrosseis ja publicados pro Claude Code
2. Especificar: fonte, posicao dos elementos, estilo de label, paleta
3. Mostrar variacoes (com imagem de fundo vs sem imagem de fundo)
4. Travar o template quando estiver satisfeito (v5 LOCKED)

### Dimensoes
- **Instagram feed:** 1080 x 1350px
- **Template interno:** 1380 x 1728px (maior, depois reduz)

---

## Etapa 5 — Screenshot dos slides

**Input:** Pagina HTML renderizada
**Output:** PNGs individuais de cada slide

### Stack
- **Ferramenta:** Puppeteer (headless Chrome via Claude Code)
- **Processo:** Abre o HTML local, tira screenshot de cada slide
- **Formato:** PNG em alta resolucao

### Fluxo
1. Claude Code abre o HTML no Puppeteer
2. Navega slide por slide
3. Tira screenshot com dimensoes exatas
4. Salva os PNGs localmente

---

## Etapa 6 — Upload pro Supabase

**Input:** PNGs dos slides
**Output:** URLs publicas no Supabase Storage + registro na fila

### Estrutura no Supabase

**Storage (bucket):**
```
carrosseis/
  31/
    slide-1.png
    slide-2.png
    ...
    slide-7.png
```

**Tabela pipeline_cards (exemplo):**
| campo | tipo | descricao |
|-------|------|-----------|
| id | uuid | identificador unico |
| angulo | text | educacional / provocativo / comparativo |
| keyword | text | palavra-chave do comentario |
| slides_urls | jsonb | array de URLs do storage |
| status | text | pendente / agendado / publicado |
| scheduled_at | timestamp | data/hora de publicacao |
| created_at | timestamp | data de criacao |

### Controle de processos
- Tags e metadados pra rastrear cada carrossel
- Status do pipeline (gerado → aprovado → agendado → publicado)
- Nome e identificador pra encontrar rapido

---

## Etapa 7 — Postar no Instagram

**Input:** URLs dos slides no Supabase + horario agendado
**Output:** Post publicado no Instagram

### Stack
- **API:** Instagram Graph API (via Meta/Facebook)
- **Autenticacao:** Token do Facebook Meta
- **Modo:** Agendamento com buffer/backlog (nao posta na hora)

### Logica de agendamento
- Cron job no Supabase verifica posts pendentes
- Publica nos horarios pre-definidos
- Nao precisa estar com computador ligado
- Buffer de posts garante cadencia mesmo sem produzir no dia

### Cadencia alvo
- 2-3 carrosseis de alta qualidade por dia
- 14 carrosseis por sessao de 2 horas

---

## Etapa 8 — DM Flow (captura de lead)

**Input:** Comentario com keyword no post
**Output:** DM automatica com tutorial/material

### Como funciona
1. Carrossel tem CTA: "comente [KEYWORD] pra receber o tutorial"
2. Lead comenta a keyword
3. DM Flow detecta o comentario
4. Envia DM automatica com o material/link

### Resultado por carrossel
- Cada carrossel gera keyword propria
- Lead comenta → recebe material → entra no funil
- Seguidor → lead → qualificado

### Ferramenta
- DM Flow: ferramenta propria (alternativa ao ManyChat)
- Painel de controle pra regulagem de envios
- Custo mais acessivel que ManyChat

---

## Resumo de ferramentas

| Ferramenta | Funcao | Custo |
|------------|--------|-------|
| Claude Code (Desktop) | Motor central, copy, HTML, automacao | Assinatura Claude |
| Cloudflare Workers AI | Geracao de imagem (FLUX schnell) | Gratis (10k/dia) |
| Puppeteer | Screenshot dos slides HTML | Gratis |
| Supabase | Storage + banco + cron de agendamento | Free tier |
| Instagram Graph API | Publicacao automatica | Gratis |
| DM Flow | Automacao de DM por keyword | Beta |

---

## Metricas de referencia

| Metrica | Valor |
|---------|-------|
| Carrosseis por sessao (2h) | 14 |
| Slides por carrossel | 6-7 |
| Tempo de geracao de imagens | ~14s por 6 imagens |
| Horas economizadas/semana | 7h |
| Custo total | Zero (APIs gratuitas) |
| Checkpoints de aprovacao | 3 |

---

*Fluxo documentado a partir de producao real. Cada etapa pode ser executada independentemente ou como pipeline completo via Claude Code.*
