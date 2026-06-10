---
name: carrossel-2.0
description: >
  Ferramenta protocolar white-label de producao de carrossel.
  Puxa dados do banco AutomaWeb, identifica o tenant, carrega identidade visual,
  pesquisa lastro na web (firecrawl), processa copy em 4 camadas (pesquisa, estrategia,
  estrutura, micro-copy), monta HTML editorial, renderiza PNGs via Playwright,
  faz upload pro R2 e agenda publicacao. 3 checkpoints de aprovacao humana.
  Invocado quando o usuario disser "carrossel 2.0", "produz o carrossel de [nome]",
  ou referenciar producao de conteudo de um carrossel que ja existe no banco.
---

# Carrossel 2.0 — Ferramenta protocolar white-label

Protocolo completo de producao de carrossel. Recebe o nome de um carrossel
que ja existe no banco da AutomaWeb, identifica o tenant, carrega a identidade
visual dele, pesquisa lastro na web, processa copy em 4 camadas e entrega
carrossel pronto pra postar.

White-label: funciona pra qualquer tenant. A identidade visual, tom de voz
e contexto de negocio sao carregados dinamicamente por cliente.

---

## PASSO ZERO — Leitura obrigatoria (auto-invocacao)

**ANTES DE QUALQUER ACAO, LER TODOS OS ARQUIVOS ABAIXO NA INTEGRA.**
Nao resumir, nao pular, nao assumir que ja sabe. Ler de fato.
So prosseguir pra Etapa 0 depois de ter lido TODOS.

### Arquivos de contexto do negocio
1. `_memoria/empresa.md` — quem e o cliente, o que faz, como funciona
2. `_memoria/preferencias.md` — tom de voz, estilo, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades

### Processamento de copy (obrigatorio)
4. `_memoria/estrategias_de_copy.md` — **DOCUMENTO CENTRAL.** 4 camadas de processamento, 12 angulos, 7 slides, formulas de bullet, regra do 7x, loops. Ler inteiro

### Skills de producao visual
5. `.claude/skills/carrossel/SKILL.md` — layouts (CAPA, SOLO, DUO, NUMERO, CITACAO, CTA FINAL), tipografia, cores, render, regras de ritmo visual
6. `.claude/skills/carrossel-auto/SKILL.md` — pipeline automatizado, etapas de geracao de imagem, upload, postagem

### Identidade visual
7. `identidade/design-guide.md` — identidade base (referencia, nao necessariamente do tenant atual)
8. `identidade/tenants/<tenant-slug>/design-guide.md` — identidade especifica do tenant (se existir; sera verificada na Etapa 1)

### Publicacao
9. `.claude/skills/aprovar-post/SKILL.md` — pipeline de aprovacao e distribuicao (blog + social)

### Checklist de validacao
- [ ] empresa.md lido
- [ ] preferencias.md lido
- [ ] estrategia.md lido
- [ ] estrategias_de_copy.md lido (inteiro, 361 linhas)
- [ ] /carrossel SKILL.md lido
- [ ] /carrossel-auto SKILL.md lido
- [ ] design-guide.md lido
- [ ] /aprovar-post SKILL.md lido

**Se algum arquivo nao existir:** registrar qual falta e continuar com os demais.
**Se algum arquivo estiver vazio:** registrar e continuar.
**Nao perguntar ao usuario se deve ler. Ler e ponto.**

### Cache por sessao

Se os 9 arquivos ja foram lidos nesta conversa (ex: segundo carrossel na mesma sessao),
NAO reler. Usar o contexto ja carregado. So reler se:
- O usuario pedir explicitamente
- Algum arquivo foi alterado durante a sessao
- O tenant mudou (reler apenas o design-guide do novo tenant)

---

## Dependencias tecnicas

- **Banco AutomaWeb (producao):** `postgresql://automaweb:Automaweb2026Prod@159.195.12.135:5433/automaweb`
- **Firecrawl MCP:** pesquisa externa de lastro (estudos, dados, estatisticas)
- **Scripts:** `scripts/gerar-imagem-cf.js`, `scripts/upload-r2.js`, `scripts/postar-instagram.js`
- **Playwright:** renderizar HTML em PNG (1080x1350)
- **`.env`** com credenciais Cloudflare, R2, Meta

---

## Trigger

Invocar quando o usuario disser:

- "carrossel 2.0"
- "produz o carrossel de [titulo]"
- "produz o carrossel de [titulo] do/da [cliente]"
- Qualquer referencia a producao de conteudo de um carrossel que existe no banco

---

## Etapa 0 — Puxar contexto do banco

**Automatico. Nao perguntar nada.**

1. Conectar no banco de producao da AutomaWeb
2. Buscar o carrossel pelo titulo (ou pelo tenant + titulo se ambiguo)
3. Extrair: `titulo`, `angulo`, `tenantId`, `tenant.name`, `status`
4. Se o carrossel nao existir no banco: avisar e parar

```sql
SELECT c.id, c.titulo, c.angulo, c.status, c.slides, c."legendaBody", c.hashtags,
       t.id as "tenantId", t.name as tenant_name
FROM "Carrossel" c
JOIN "Tenant" t ON c."tenantId" = t.id
WHERE c.titulo ILIKE '%<titulo>%'
```

---

## Etapa 1 — Carregar identidade do tenant (white-label)

**Automatico.**

O sistema precisa da identidade visual do tenant pra produzir qualquer conteudo.
A identidade vive em `identidade/tenants/<tenant-slug>/design-guide.md`.

1. Verificar se existe `identidade/tenants/<tenant-slug>/design-guide.md`
2. **Se existir:** ler e usar como base visual (cores, fontes, logo, tom, avatar)
3. **Se NAO existir:** 
   a. Avisar o usuario: "O tenant [nome] ainda nao tem identidade visual cadastrada."
   b. Perguntar: "Voce tem as informacoes (cores, fontes, logo, tom de voz, nicho) ou quer que eu pesquise o perfil online do cliente pra montar?"
   c. Se o usuario fornecer: criar o `design-guide.md` do tenant
   d. Se pedir pesquisa: usar firecrawl pra analisar Instagram, site e presenca digital do cliente, extrair paleta visual, tom de voz, nicho, publico-alvo, e propor um design-guide
   e. Salvar em `identidade/tenants/<tenant-slug>/design-guide.md`
   f. Mostrar pro usuario e pedir aprovacao antes de prosseguir

### Estrutura do design-guide por tenant

```markdown
# Identidade visual — [Nome do Tenant]

## Dados do negocio
- **Nome:** [nome comercial]
- **Nicho:** [area de atuacao]
- **Publico-alvo:** [quem e a persona]
- **Diferencial:** [o que separa dos concorrentes]

## Cores
- **Fundo principal:** [hex]
- **Cor de destaque / CTA:** [hex]
- **Cor secundaria:** [hex]
- **Texto principal:** [hex]
- **Texto sobre fundo claro:** [hex]

## Tipografia
- **Titulos:** [fonte] (Google Fonts) — pesos [X/Y/Z]
- **Corpo:** [fonte] (Google Fonts) — pesos [X/Y/Z]

## Tom de voz
- [descricao do tom: formal/informal, tecnico/acessivel, etc.]
- [o que evitar na comunicacao desse cliente]
- [exemplos de como o cliente fala]

## Carrossel — regras especificas
- **Fundo principal slides:** [hex] alternando com [hex]
- **Slide CTA final:** fundo [hex] com logo centralizado
- **Logo:** [descricao ou path do arquivo]
- **Ritmo:** alternar [padrao de alternancia]
- **Copy:** [idioma + particularidades]

## O que NUNCA fazer
- [regras anti-slop especificas deste tenant]
```

---

## Etapa 2 — Pesquisa de lastro (web research)

**Automatico. Usar firecrawl_search.**

Esta e a camada 4 do `estrategias_de_copy.md`. O objetivo: encontrar 1-3
dados externos (estudos, estatisticas, casos documentados, citacoes de
autoridade) que ancoram o argumento central do carrossel em FATO.

### Processo

1. Identificar o TEMA CENTRAL a partir do titulo + angulo do carrossel
2. Executar 2-3 buscas no firecrawl com queries variadas:
   - `"[tema] estudo pesquisa dados"` (portugues)
   - `"[tema] study research statistics"` (ingles, resultados melhores)
   - `"[tema] [nicho do tenant] resultados"` (contextualizado)
3. Filtrar por fontes confiaveis: universidades, institutos, publicacoes reconhecidas, orgaos oficiais
4. Selecionar 1-3 dados matadores
5. Anotar fonte completa (autor, publicacao, ano, link)

### Criterios de selecao do dado

- Surpreende? Se o dado e obvio, nao serve
- Ancora o argumento? Se nao fortalece a tese do carrossel, descartar
- E verificavel? Fonte deve ser rastreavel
- Funciona como prova social ou mecanismo? Encaixa no slide 2, 4 ou 5?

### Como usar o lastro na copy

O dado entra DIGERIDO no tom do publico. Nunca em formato academico.

**PROIBIDO:**
- "Pesquisadores descobriram que..."
- "Segundo estudo da Universidade..."
- "Conforme pesquisa publicada em..."

**PERMITIDO (exemplos de como o mesmo dado pode entrar):**
- Fato bruto: "73% desistem antes do terceiro mes"
- Embutido na narrativa: "seu cerebro leva 21 dias pra criar o padrao"
- Quebra de crenca: "os jogos que voce jogava quando crianca reconfiguraram seu cerebro"
- Numero como impacto visual: slide NUMERO com "207" gigante
- Provocacao: "testaram 200 pessoas. So 12 conseguiram"

**Fontes completas vao na legenda.md**, nunca nos slides.

### Quando pular

- Cliente forneceu dados proprios suficientes (depoimentos, resultados reais)
- Carrossel e puramente emocional/narrativo e dado externo quebraria o tom
- Nesse caso, registrar "lastro: dados proprios do cliente" e seguir

---

## Etapa 3 — Processar copy (4 camadas)

Seguir `_memoria/estrategias_de_copy.md` integralmente. Resumo do fluxo:

### Camada 4 (ja feita): Pesquisa de lastro
Dados coletados na Etapa 2.

### Camada 3: Estrategia (Benson/RMBC)

1. Identificar PERSONA (publico do tenant, nao generico)
2. Identificar DOR principal
3. Identificar SOLUCAO/OFERTA do tenant
4. Escolher ANGULO de abertura (1 dos 12 listados no estrategias_de_copy.md)
5. Definir narrativa macro e loops entre slides

### Camada 2: Estrutura (7 slides)

Distribuir nos 7 slides com funcoes definidas:

| Slide | Funcao | Conteudo |
|-------|--------|----------|
| 1 | HOOK (CAPA) | Max 8 palavras. Ataca dor ou quebra crenca |
| 2 | PROBLEMA + AGITACAO | Persona se identifica. Piora a dor. Lastro aqui se for estatistica de problema |
| 3 | VIRADA | Muda tom de dor pra esperanca. Introduz que existe saida |
| 4 | SOLUCAO + MECANISMO | Mostra O QUE, nao COMO completo. Lastro aqui se for sobre mecanismo |
| 5 | PROVA | Resultado real + dado externo. Elimina ceticismo |
| 6 | BENEFICIO | Transformacao. Futuro desejado. Linguagem sensorial |
| 7 | CTA | Palavra-chave memoravel. "Comenta [X] que eu te mando [Y] no DM" |

### Camada 1: Micro-copy (Makepeace/Edwards)

1. Gerar **7 variacoes do hook** (slide 1). Selecionar a melhor
2. Aplicar formulas de bullet nos slides internos (Como, Segredo de, Por que, O que, O que nunca, E mais)
3. Criar loops entre slides (abrir curiosidade em um, resolver no proximo)
4. Variar formulas entre slides pra manter ritmo
5. Gerar **5 variacoes do CTA** (slide 7). Selecionar a melhor
6. Definir **3 opcoes de palavra-chave**. Selecionar a mais curta e memoravel

### CHECKPOINT 1 — Aprovar copy

Apresentar ao usuario:

1. Dado de lastro encontrado (fonte + como sera usado)
2. Angulo escolhido + justificativa
3. Copy completa dos 7 slides
4. As 3 melhores variacoes do hook
5. Palavra-chave do CTA
6. Tipo de carrossel: conversao / educacional / hibrido

Perguntar:
> "Copy pronta. Aprova ou quer ajustar algo?"

**NAO prosseguir sem aprovacao explicita.**

---

## Etapa 4 — Gerar imagens (Cloudflare Workers AI)

**Automatico apos aprovacao da copy.**

1. Montar prompt de imagem POR SLIDE em ingles (FLUX funciona melhor em ingles)
2. Adaptar prompts ao nicho e identidade visual do tenant
3. Gerar via script:

```bash
node --env-file=.env scripts/gerar-imagem-cf.js "<prompt>" "marketing/conteudo/carrossel-<tema>-<data>/<tenant-slug>/imagem-slide-XX.png"
```

4. Modelo padrao: FLUX Schnell (gratis, ~5s por imagem)
5. Se qualidade insuficiente: escalar pra Klein4B ou Klein9B

**Regras de imagem:**
- Prompts sempre em ingles
- Nunca gerar rostos identificaveis ou pessoas reais
- Minimo 5 de 7 slides com imagem de fundo (gradient overlay)
- Slide CTA final pode ser cor solida sem imagem

### CHECKPOINT 2 — Aprovar imagens

Mostrar imagens geradas. Perguntar:
> "Imagens prontas. Quer refazer algum slide? (ex: 'slide 3, mais abstrato')"

Refazer apenas os slides reprovados. **NAO prosseguir sem aprovacao.**

---

## Etapa 5 — Montar HTML editorial

**Automatico apos aprovacao das imagens.**

Seguir os padroes da skill `/carrossel` (layouts CAPA, SOLO, DUO, NUMERO, CITACAO, CTA FINAL),
mas usando a identidade visual do tenant carregada na Etapa 1.

1. Criar `carrossel.html` com todos os slides como `<div class="slide">` inline
2. Aplicar:
   - Cores do tenant (design-guide.md do tenant)
   - Fontes do tenant (Google Fonts)
   - Logo do tenant (top-left em todos os slides)
   - Counter (top-right em todos os slides)
   - Ritmo de fundo alternado (conforme design-guide do tenant)
3. Inserir imagens como background com gradient overlay
4. Garantir minimo 2 layouts diferentes
5. Criar `render.js` na mesma pasta

**Estrutura de saida:**
```
marketing/conteudo/carrossel-<tema>-<YYYY-MM-DD>/
  <tenant-slug>/
    imagem-slide-01.png ... imagem-slide-07.png
    carrossel.html
    render.js
```

---

## Etapa 6 — Renderizar PNGs (Playwright)

**Automatico.**

```bash
NODE_PATH="<node_modules>" node <tenant-slug>/render.js
```

Gera:
```
<tenant-slug>/
  instagram/
    slide-01.png ... slide-07.png
```

Formato: 1080x1350 (4:5 retrato). Sempre.

---

## Etapa 7 — Gerar legenda

**Automatico. Gerar junto com os PNGs, nao esperar o usuario pedir.**

### legenda.md (Instagram + Facebook)

Estrutura:
1. **Hook** — pergunta ou afirmacao forte (mesma energia do slide 1)
2. **Contexto** — 1-2 frases sobre o conteudo do carrossel
3. **CTA arrastar** — "Arraste pro lado e confere"
4. **Bloco de oferta** — diferenciais do tenant, contato, link
5. **Fontes** — referencias completas do lastro (autor, publicacao, ano)
6. **Hashtags** — 10-15 (publico + nicho + local se aplicavel)
7. **Keyword DM** — "Comenta [PALAVRA] que eu te mando [X] no DM"

### legenda-linkedin.md (se aplicavel ao tenant)

Tom mais formal, 3-5 paragrafos analiticos, sem CTA de arrastar, link
direto, max 3 hashtags.

Salvar ambas na pasta do tenant.

---

## Etapa 8 — Upload e publicacao

### Upload pro R2

```bash
node --env-file=.env scripts/upload-r2.js <tenant-slug>/instagram/ carrosseis/<tenant-slug>/<data>/
```

### CHECKPOINT 3 — Aprovar carrossel final

Mostrar:
- Slides renderizados (paths ou preview)
- Legenda completa
- Keyword configurada
- Data/horario sugerido pra publicacao

Perguntar:
> "Carrossel pronto. Posta agora, agenda, ou quer ajustar?"

### Postar (se aprovado)

```bash
node --env-file=.env scripts/postar-instagram.js marketing/conteudo/carrossel-<tema>-<data>/<tenant-slug>
```

### Salvar no banco

Apos aprovacao (independente de postar ou nao), atualizar o carrossel no banco
da AutomaWeb com os dados produzidos:

```sql
UPDATE "Carrossel"
SET slides = '<array de textos dos slides>',
    "legendaBody" = '<legenda>',
    hashtags = '<hashtags>'
WHERE id = '<carrossel-id>'
```

Isso garante que a plataforma reflete o conteudo produzido.

---

## Etapa 9 — Resumo final

Mostrar:

```
Carrossel 2.0 — Producao completa

Tenant: [nome]
Titulo: [titulo]
Angulo: [tipo] — [descricao]
Slides: [N]
Lastro: [resumo do dado + fonte]
Keyword: [palavra]

Arquivos:
  HTML: marketing/conteudo/carrossel-<tema>-<data>/<tenant-slug>/carrossel.html
  PNGs: marketing/conteudo/carrossel-<tema>-<data>/<tenant-slug>/instagram/
  Legenda: marketing/conteudo/carrossel-<tema>-<data>/<tenant-slug>/legenda.md
  URLs R2: marketing/conteudo/carrossel-<tema>-<data>/<tenant-slug>/instagram/urls.json

Instagram: [link do post, se publicado]
Banco: [atualizado / pendente]
```

---

## Regras inviolaveis

1. **Nunca pular checkpoints.** 3 aprovacoes humanas obrigatorias (copy, imagens, final)
2. **Nunca produzir sem identidade do tenant.** Se nao existir, criar antes
3. **Nunca escrever copy sem lastro.** Pesquisar antes. So pular quando houver justificativa explicita
4. **Nunca usar tom generico.** Copy segue o tom do tenant, nao do MazyOS
5. **Nunca ensinar demais.** Carrossel de conversao e filtro, nao aula
6. **Nunca publicar sem ortografia 100%.** Acentos corretos em todo texto visivel. Hashtags sao excecao
7. **Sempre salvar no banco.** Dados produzidos voltam pra AutomaWeb
8. **Anti-slop:** zero emojis, zero hifens em copy, zero neon boxes, zero Inter/Roboto, zero AOS generico
9. **Formato:** sempre 1080x1350 (4:5 retrato)
10. **Fontes do lastro:** sempre na legenda, nunca nos slides
11. **7 variacoes do hook.** Nunca aceitar a primeira versao
12. **Loops entre slides.** Sempre manter pelo menos 1 loop aberto ate o CTA
13. **Imagens em 80%+ dos slides.** Minimo 5 de 7 com imagem de fundo

---

## Fluxo resumido

```
[Usuario] "produz o carrossel de Lentes de contato dental da Dra. Camila"
    |
    v
[0] Puxa dados do banco AutomaWeb (titulo, angulo, tenant)
    |
    v
[1] Carrega identidade visual do tenant (ou cria se nao existir)
    |
    v
[2] Pesquisa lastro na web (firecrawl): estudos, dados, estatisticas
    |
    v
[3] Processa copy em 4 camadas (lastro → estrategia → estrutura → micro-copy)
    |
    v
[CHECKPOINT 1] Aprovar copy + angulo + keyword
    |
    v
[4] Gerar imagens (Cloudflare FLUX)
    |
    v
[CHECKPOINT 2] Aprovar imagens
    |
    v
[5] Montar HTML editorial com identidade do tenant
    |
    v
[6] Renderizar PNGs via Playwright (1080x1350)
    |
    v
[7] Gerar legenda + hashtags + fontes do lastro
    |
    v
[8] Upload R2 + [CHECKPOINT 3] Aprovar e publicar/agendar
    |
    v
[9] Salvar no banco AutomaWeb + resumo final
```
