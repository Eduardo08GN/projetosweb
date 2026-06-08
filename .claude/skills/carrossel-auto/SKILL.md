---
name: carrossel-auto
description: >
  Pipeline automatizado de carrossel: YouTube transcript → copy/angulos → imagens IA
  (Cloudflare Workers AI FLUX schnell) → HTML editorial → screenshot Playwright →
  upload R2 → agendamento Instagram. 3 checkpoints de aprovacao. Use quando o usuario
  disser "gera carrossel", "carrossel automatico", "pipeline carrossel", ou /carrossel-auto.
---

# /carrossel-auto — Pipeline automatizado de carrossel

Pipeline completo: transcript do YouTube entra, carrossel postado no Instagram sai.
Tudo automatico entre os 3 checkpoints de aprovacao humana.

## Dependencias

- **Skill /carrossel** — base de layouts, tipografia, estilo visual
- **Identidade visual:** `identidade/design-guide.md`
- **Contexto:** `_memoria/empresa.md`, `_memoria/preferencias.md`
- **Node.js 18+**
- **Playwright** — renderizar HTML em PNG
- **Scripts:**
  - `scripts/gerar-imagem-cf.js` — Cloudflare Workers AI (FLUX schnell)
  - `scripts/upload-r2.js` — Cloudflare R2
  - `scripts/postar-instagram.js` — Instagram Graph API
- **`.env`** na raiz com:
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_API_TOKEN`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`
  - `R2_PUBLIC_URL` (URL publica do bucket, ex: https://cdn.automaweb.com)
  - `META_PAGE_ACCESS_TOKEN`
  - `META_PAGE_ID`
  - `META_IG_USER_ID`

Se algum script ou variavel faltar: parar e listar o que falta.

---

## Input

O usuario fornece:

1. **Link do YouTube** + **transcricao** (colada ou extraida)
2. **Marca/cliente** (ex: "Rodger Koller") — pra carregar identidade visual correta
3. (Opcional) Numero de angulos desejados (default: 2)
4. (Opcional) Tipos de angulo preferidos (educacional, provocativo, comparativo)

---

## Etapa 1 — Analisar transcript e gerar angulos

**Automatico.**

1. Ler `_memoria/empresa.md` e `_memoria/preferencias.md` do cliente
2. Ler `identidade/design-guide.md`
3. Analisar a transcricao e extrair:
   - Tema central
   - 3-5 insights principais
   - Frases de impacto (citacoes diretas aproveitaveis)
4. Gerar 2-3 angulos distintos, cada um com:

```
ANGULO: [nome] ([tipo: educacional/provocativo/comparativo])
KEYWORD: [palavra que o lead comenta pra receber material]

Slide 1 (CAPA): [titulo max 8 palavras]
Slide 2: [insight + copy]
Slide 3: [insight + copy]
Slide 4: [insight + copy]
Slide 5: [insight + copy]
Slide 6: [insight + copy]
Slide 7 (CTA): [chamada + keyword]

PROMPT DE IMAGEM POR SLIDE:
Slide 1: [prompt em ingles pro FLUX]
Slide 2: [prompt em ingles pro FLUX]
...
```

### CHECKPOINT 1 — Aprovar angulos

Mostrar todos os angulos formatados. Perguntar:

> "Angulos prontos. Qual(is) voce aprova? Quer ajustar algum?"

So seguir apos aprovacao explicita. O usuario pode:
- Aprovar todos
- Aprovar alguns e descartar outros
- Pedir ajustes em copy, keyword ou prompts de imagem

---

## Etapa 2 — Gerar imagens (Cloudflare Workers AI)

**Automatico.**

Para cada angulo aprovado, gerar as imagens dos slides:

```bash
node --env-file=.env scripts/gerar-imagem-cf.js "<prompt>" "<output-path>"
```

O script gera uma imagem por chamada. Rodar em sequencia pra cada slide que precisa de imagem (nem todo slide precisa — slides de texto puro nao).

Salvar em:
```
marketing/conteudo/carrossel-<tema>-<YYYY-MM-DD>/
  angulo-1/
    imagem-slide-01.png
    imagem-slide-02.png
    ...
  angulo-2/
    imagem-slide-01.png
    ...
```

### CHECKPOINT 2 — Aprovar imagens

Mostrar as imagens geradas (abrir no editor ou listar paths). Perguntar:

> "Imagens geradas. Quer refazer algum slide? (ex: 'slide 3 do angulo 1, mais abstrato')"

Se pedir refacao:
1. Ajustar o prompt
2. Chamar o script novamente so pra aquele slide
3. Mostrar de novo

So seguir apos aprovacao explicita.

---

## Etapa 3 — Montar HTML editorial

**Automatico.**

Seguir os padroes da skill `/carrossel` (layouts CAPA, SOLO, DUO, NUMERO, CITACAO, CTA FINAL).

Para cada angulo aprovado:

1. Criar `carrossel.html` com todos os slides inline
2. Aplicar identidade visual do cliente (cores, fontes, logo)
3. Inserir imagens geradas como background dos slides relevantes
4. Garantir:
   - Logo top-left + counter top-right em todos os slides
   - Ritmo de fundo alternado (escuro ↔ claro ↔ destaque)
   - Minimo 2 layouts diferentes
   - Keyword no slide CTA final
5. Criar `render.js` na mesma pasta

Salvar em:
```
marketing/conteudo/carrossel-<tema>-<YYYY-MM-DD>/
  angulo-1/
    carrossel.html
    render.js
    imagem-slide-*.png
  angulo-2/
    ...
```

---

## Etapa 4 — Screenshot (Playwright)

**Automatico.**

```bash
NODE_PATH="<node_modules>" node angulo-1/render.js
```

Gera PNGs 1080x1350 de cada slide:
```
angulo-1/
  instagram/
    slide-01.png
    slide-02.png
    ...
    slide-07.png
```

Gerar legenda automaticamente (seguir padrao da skill `/carrossel`):
```
angulo-1/
  legenda.md
```

---

## Etapa 5 — Upload pro Cloudflare R2

**Automatico.**

```bash
node --env-file=.env scripts/upload-r2.js angulo-1/instagram/ carrosseis/<cliente>/<data>-angulo-1/
```

O script:
1. Sobe todos os PNGs do diretorio pro R2
2. Retorna as URLs publicas de cada slide
3. Salva um `urls.json` na pasta com os links

---

## Etapa 6 — Postar no Instagram

### CHECKPOINT 3 — Aprovar carrossel final

Mostrar:
- Slides renderizados (paths dos PNGs)
- Legenda completa
- Keyword configurada
- Horario de postagem (se agendado)

Perguntar:

> "Carrossel pronto. Posta agora ou agenda? (ex: 'agenda pra amanha 10h')"

Se aprovar postagem imediata:

```bash
node --env-file=.env scripts/postar-instagram.js <pasta-angulo>
```

O script:
1. Le `urls.json` pra pegar as URLs publicas dos slides no R2
2. Cria container de carrossel na Instagram Graph API
3. Publica o carrossel
4. Retorna o link do post

Se agendar: salvar em `agenda.json` na pasta (horario + status pendente).

---

## Etapa 7 — Resumo final

Mostrar:

```
Pipeline completo.

Angulos gerados: X
Carrosseis publicados: Y
Slides totais: Z

[Angulo 1] "<titulo>"
  Instagram: <link>
  Keyword: <keyword>
  Slides: 7

[Angulo 2] "<titulo>"
  Instagram: <link>
  Keyword: <keyword>
  Slides: 7
```

---

## Regras

- Nunca pular checkpoints — SEMPRE esperar aprovacao humana nos 3 pontos
- Imagens: prompts sempre em ingles (FLUX funciona melhor)
- Imagens: nunca gerar rostos identificaveis ou pessoas reais
- Copys: seguir `_memoria/preferencias.md` — tom do cliente, nao generico
- HTML: seguir padroes da skill `/carrossel` (layouts, tipografia, ritmo)
- Legenda: gerar automaticamente junto com os screenshots
- R2: usar paths organizados por cliente e data
- Instagram: sempre postar como carrossel (multiplas imagens), nunca como imagem unica
- Se qualquer script falhar: parar, mostrar o erro, sugerir fix
- Anti-slop: zero emojis, zero hifens em copy, zero neon boxes, zero Inter/Roboto (usar fontes do cliente)
