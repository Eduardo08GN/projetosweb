# Arquitetura do Pipeline de Carrossel — AutomaWeb

> Estado atual da infraestrutura, custos, integrações e gaps.
> Atualizado em 2026-06-08.

---

## Visao geral do sistema

```
                         AUTOMAWEB — Pipeline de Carrossel
                         =================================

 INPUT                    PROCESSAMENTO                        OUTPUT
 -----                    --------------                        ------

 YouTube Video    ──►  [Claude Code Desktop]                 Instagram Post
 (link + transcript)    │                                    (carrossel)
                        ├─ Skill /carrossel-auto             │
                        │   ├─ Analisa transcript            ├─ 6-7 slides PNG
                        │   ├─ Gera 2-3 angulos              ├─ Legenda
                        │   ├─ Define keywords               └─ Keyword DM
                        │   └─ 3 checkpoints humanos
                        │
                        ├─ Cloudflare Workers AI ──────────► Imagens geradas
                        │   ├─ FLUX 1 Schnell (gratis)       (1024x1024)
                        │   ├─ FLUX 2 Klein 4B (pago)
                        │   ├─ FLUX 2 Klein 9B (pago)
                        │   └─ FLUX 2 Dev (pago)
                        │
                        ├─ HTML Editorial ─► Playwright ──► PNGs 1080x1350
                        │   (layouts: CAPA, SOLO, DUO,
                        │    NUMERO, CITACAO, CTA FINAL)
                        │
                        ├─ Cloudflare R2 ─────────────────► CDN publico
                        │   (storage, zero egress)            (URLs das imagens)
                        │
                        └─ Instagram Graph API ───────────► Post publicado
                            (Meta token via Lucas)
```

---

## Infraestrutura atual

### Servicos configurados e operacionais

| Servico | Status | Credenciais | Localização |
|---------|--------|-------------|-------------|
| Cloudflare Workers AI | OPERACIONAL | Account ID + API Token | `.env` |
| Cloudflare R2 (storage) | OPERACIONAL | Access Key + Secret + Public URL | `.env` |
| Coolify (deploy) | OPERACIONAL | API Token + App UUID | Conversa anterior |
| VPS Netcup | OPERACIONAL | IP: 159.195.12.135 | Coolify dashboard |
| GitHub (repo) | OPERACIONAL | Push via SSH/HTTPS | Eduardo08GN/projetosweb |

### Servicos pendentes de configuração

| Servico | Status | Bloqueio | Responsavel |
|---------|--------|----------|-------------|
| Instagram Graph API | PENDENTE | Precisa de tokens da Meta | Lucas (socio) |
| Meta App (developers.facebook.com) | PENDENTE | Lucas precisa criar | Lucas |
| DM Flow (ManyChat proprio) | FUTURO | Depende de Meta App Review | Equipe |

---

## Credenciais e variaveis de ambiente

**Arquivo:** `.env` (gitignored, nunca commitado)

```
# CONFIGURADO
CLOUDFLARE_ACCOUNT_ID=b375ec5e...
CLOUDFLARE_API_TOKEN=cfut_Uukz16BK...
R2_ACCESS_KEY_ID=a694f5dbf6...
R2_SECRET_ACCESS_KEY=c8bd86bb7c...
R2_BUCKET_NAME=sellscale-media
R2_PUBLIC_URL=https://pub-1898e7690b3d451388b01f84a0f31627.r2.dev

# PENDENTE (Lucas)
META_PAGE_ACCESS_TOKEN=
META_PAGE_ID=
META_IG_USER_ID=
```

**Guia pro Lucas:** `guia-lucas-meta-api.md` — passo a passo pra conseguir os 3 tokens da Meta.

---

## Scripts do pipeline

| Script | Funcao | Input | Output | Status |
|--------|--------|-------|--------|--------|
| `scripts/gerar-imagem-cf.js` | Gera imagem via Cloudflare AI | Prompt + output path | JPG/PNG | TESTADO |
| `scripts/upload-r2.js` | Sobe PNGs pro R2 | Pasta local + prefixo R2 | urls.json | CRIADO |
| `scripts/postar-instagram.js` | Posta carrossel no Instagram | Pasta do angulo | Post ID | CRIADO (aguarda tokens) |

### Uso dos scripts

```bash
# Gerar imagem (4 modelos disponiveis)
node --env-file=.env scripts/gerar-imagem-cf.js "prompt" saida.jpg
node --env-file=.env scripts/gerar-imagem-cf.js "prompt" saida.jpg --model klein4b

# Upload pro R2
node --env-file=.env scripts/upload-r2.js pasta/instagram/ carrosseis/cliente/data/

# Postar no Instagram (precisa dos tokens Meta)
node --env-file=.env scripts/postar-instagram.js pasta/do/angulo/
```

---

## Skills relacionadas

| Skill | Funcao | Dependencia |
|-------|--------|-------------|
| `/carrossel-auto` | Pipeline completo automatizado (7 etapas, 3 checkpoints) | Todas abaixo |
| `/carrossel` | Base: HTML editorial + screenshot Playwright + legenda | Playwright |
| `/aprovar-post` | Publicacao: blog + Instagram + Facebook via Meta API | Meta tokens |
| `/publicar-tema` | Orquestracao: blog + carrossel + 3 legendas | `/carrossel` |
| `/salvar` | Git commit + push | GitHub |

---

## Modelos de geracao de imagem

### Comparativo testado em 2026-06-08

| Modelo | Flag | Tempo | Qualidade | Formato request | Precisa cartao? |
|--------|------|-------|-----------|-----------------|-----------------|
| **FLUX 1 Schnell** | `schnell` (default) | **~5s** | Boa | JSON | **Nao (free tier)** |
| FLUX 2 Klein 4B | `klein4b` | ~22s | Superior | Multipart | A verificar |
| FLUX 2 Klein 9B | `klein9b` | ~30s+ | Alta | Multipart | A verificar |
| FLUX 2 Dev | `dev` | ~60s+ | Maxima | Multipart | A verificar |

**Modelo ativo:** FLUX 1 Schnell. Custo zero, sem cartao, suficiente pro pipeline. Klein/Dev disponiveis no script caso precise de upgrade futuro.

### Sobre custos — por que funcionou sem cartao

Cloudflare Workers AI tem um **free tier generoso**:

- **10.000 neurons/dia gratis** — cobre a maioria dos usos leves
- FLUX 1 Schnell custa **$0.0000528 por tile 512x512** — uma imagem 1024x1024 = 4 tiles = ~$0.0002
- Isso significa **~50.000 imagens gratis por dia** no schnell
- Os modelos FLUX 2 (Klein, Dev) sao "partner models" com pricing separado, mas aparentemente tambem rodam no free tier ate certo volume
- **Sem cartao configurado:** Cloudflare permite usar o free tier sem cadastrar cartao de credito

**Estimativa de custo pro pipeline de carrossel:**

| Cenario | Imagens/dia | Modelo | Custo estimado |
|---------|-------------|--------|----------------|
| 2 carrosseis (14 imagens) | 14 | schnell | Gratis |
| 5 carrosseis (35 imagens) | 35 | schnell | Gratis |
| 14 carrosseis (98 imagens) | 98 | schnell | Gratis |
| 2 carrosseis (14 imagens) | 14 | klein4b | ~$0.01-0.05 |
| 14 carrosseis (98 imagens) | 98 | klein4b | ~$0.10-0.50 |

**Conclusao:** pro volume que operamos, o custo e efetivamente zero com schnell. Com klein4b pra qualidade superior, centavos por dia.

### Sobre o R2 (storage)

| Aspecto | Free tier | Alem do free |
|---------|-----------|--------------|
| Storage | 10 GB/mes | $0.015/GB |
| Operacoes (PUT) | 1M/mes | $4.50/M |
| Egress (bandwidth) | **Ilimitado** | **Zero** |

O egress zero e o diferencial — Instagram puxa as imagens do R2 sem custar nada.

---

## Fluxo de dados completo

```
1. USUARIO
   │
   ├─ Cola link YouTube + transcript
   │
   v
2. CLAUDE CODE (skill /carrossel-auto)
   │
   ├─ Analisa transcript
   ├─ Gera angulos + copy + keywords
   │
   ├─────── CHECKPOINT 1: usuario aprova angulos ──────►
   │
   ├─ Chama gerar-imagem-cf.js (Cloudflare Workers AI)
   │   └─ FLUX schnell ou klein4b
   │   └─ 6-7 imagens por angulo
   │
   ├─────── CHECKPOINT 2: usuario aprova imagens ──────►
   │
   ├─ Gera HTML editorial (skill /carrossel base)
   │   └─ Layouts: CAPA, SOLO, DUO, NUMERO, CITACAO, CTA
   │   └─ Identidade visual do cliente
   │
   ├─ Playwright screenshot → PNGs 1080x1350
   ├─ Gera legenda.md automaticamente
   │
   ├─ upload-r2.js → Cloudflare R2
   │   └─ Bucket: sellscale-media
   │   └─ URL publica: pub-1898e7690b3d...r2.dev
   │   └─ Salva urls.json
   │
   ├─────── CHECKPOINT 3: usuario aprova carrossel final ──►
   │
   └─ postar-instagram.js → Instagram Graph API
       └─ Cria containers de cada slide
       └─ Publica carrossel
       └─ Retorna link do post
```

---

## Estrutura de arquivos do pipeline

```
MazyOS/
├── .env                          ← Secrets (gitignored)
├── .env.example                  ← Template das variaveis
├── .claude/skills/
│   ├── carrossel-auto/SKILL.md   ← Skill principal (7 etapas)
│   ├── carrossel/SKILL.md        ← Skill base (HTML + screenshot)
│   └── aprovar-post/SKILL.md     ← Skill de publicacao
├── scripts/
│   ├── gerar-imagem-cf.js        ← Cloudflare Workers AI (4 modelos)
│   ├── upload-r2.js              ← Cloudflare R2 upload
│   └── postar-instagram.js       ← Instagram Graph API
├── marketing/conteudo/           ← Output dos carrosseis
│   └── carrossel-<tema>-<data>/
│       ├── angulo-1/
│       │   ├── imagem-slide-*.png
│       │   ├── carrossel.html
│       │   ├── render.js
│       │   ├── instagram/
│       │   │   ├── slide-01.png ... slide-07.png
│       │   │   └── urls.json
│       │   └── legenda.md
│       └── angulo-2/
│           └── ...
├── guia-lucas-meta-api.md        ← Guia pro socio pegar tokens Meta
├── fluxo-carrossel-automatico.md ← Documentacao do pipeline
└── arquitetura-carrossel-automaweb.md ← ESTE DOCUMENTO
```

---

## Gaps e proximos passos

### Bloqueios ativos

| Gap | Bloqueio | Acao | Quem |
|-----|----------|------|------|
| Tokens Meta | Lucas precisa criar app + pegar tokens | Enviar `guia-lucas-meta-api.md` | Lucas |
| Cartao no Cloudflare | Pode limitar klein4b/dev em volume alto | Cadastrar cartao (so cobra excedente) | Eduardo |

### Melhorias planejadas

| Melhoria | Prioridade | Complexidade |
|----------|------------|--------------|
| Testar upload R2 end-to-end | Alta | Baixa |
| Testar postagem Instagram quando tokens chegarem | Alta | Baixa |
| Travar template HTML editorial pro Rodger Koller | Alta | Media |
| Implementar agendamento (buffer de posts) | Media | Media |
| DM Flow proprio (ManyChat alternativo) | Futura | Alta |
| Memoria do cliente preenchida (empresa.md, preferencias.md) | Alta | Baixa |

---

## Dependencias de pacotes Node.js

```bash
# Para upload-r2.js
npm install @aws-sdk/client-s3

# Para screenshot
npm install playwright
npx playwright install chromium
```

---

*Documento vivo — atualizar conforme novos servicos forem configurados.*
