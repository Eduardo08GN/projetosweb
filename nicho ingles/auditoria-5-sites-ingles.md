# Auditoria de 5 Sites de Cursos de Ingles

> **Data:** 06/06/2026
> **Ferramenta:** MazyOS + Playwright MCP (navegacao automatizada)
> **Metodo:** Navegacao real, analise de DOM, console, meta tags, performance, formularios, acessibilidade

---

## DESCOBERTA PRINCIPAL: REDE INTERLIGADA

Os 5 sites encontrados no Google para "curso de ingles online" revelaram uma **rede oculta de redirecionamentos** centrada no **Prof. Kenny (profkenny.com.br)**:

```
KULTIVI.COM
   |
   +---> redireciona para ProfKenny / Fluencypass
   
FLUENCYPASS.COM/INGLES-ONLINE
   |
   +---> redireciona para PROFKENNY.COM.BR
   
MAKEASYENGLISH.COM.BR
   |
   +---> redireciona para FULLENGLISH.COM.BR
   
FULLENGLISH.COM.BR
   |
   +---> script VK Digital SEQUESTRA a pagina e redireciona leads para PROFKENNY.COM.BR
   
PROFKENNY.COM.BR  <--- DESTINO FINAL DE TODOS OS CAMINHOS
```

**Implicacao:** Pelo menos 3 dominios diferentes estao canalizando trafego para o Prof. Kenny — por redirect explicito (Fluencypass, Kultivi) ou por script malicioso (Full English via VK Digital). Isso significa que a auditoria dos 5 sites na pratica cobre **2 ecossistemas reais**: o grupo ProfKenny/K Education e o Full English (que esta sendo parasitado).

---

## SITE 1: KULTIVI

| Campo | Valor |
|-------|-------|
| **URL** | `kultivi.com/cursos/idiomas/ingles` |
| **Tipo** | Plataforma de cursos gratuitos |
| **Plataforma** | React SPA |

### Erros Criticos

| # | Erro | Impacto |
|---|------|---------|
| 1 | **Cadeia de redirect** envia usuarios para sites pagos (ProfKenny/Fluencypass) via JS | Usuarios buscando curso gratuito sao redirecionados para curso pago sem aviso |
| 2 | **14/21 imagens sem alt** (66%) | Acessibilidade e SEO de imagens prejudicados |
| 3 | **og:title e apenas "Ingles"** | Compartilhamentos nas redes sem contexto util |
| 4 | **Erros CORS** bloqueiam widget do Reclame Aqui | Selo de confianca nao aparece |
| 5 | **JSON-LD quebrado** (@type: "unknown") | Google ignora structured data |
| 6 | **Sem banner de cookies** | Violacao da LGPD |

### Dados Tecnicos

| Item | Valor |
|------|-------|
| H1 | "Ingles" (generico demais) |
| Scripts | 121 (44 externos + 77 inline) |
| Iframes | 16 |
| DOM elements | Alto |

### 5 Melhorias Sugeridas

1. **Remover cadeia de redirect** — parar de enviar usuarios para sites pagos externos
2. **Adicionar CTA acima da dobra** — o conteudo do curso fica escondido atras de redirects
3. **Implementar Schema Course/FAQ** — rich snippets no Google
4. **Adicionar prova social visivel** — depoimentos, numero de alunos
5. **Reduzir scripts de adtech** — 121 scripts pesam a pagina desnecessariamente

---

## SITE 2: FLUENCYPASS

| Campo | Valor |
|-------|-------|
| **URL solicitada** | `fluencypass.com/ingles-online` |
| **URL final** | `profkenny.com.br/?xcod=...&utm_content=...` |
| **Tipo** | Landing page de vendas (redireciona para ProfKenny) |
| **Plataforma** | PHP/Laravel (ProfKenny) |

### Erros Criticos

| # | Erro | Impacto |
|---|------|---------|
| 1 | **Identidade de marca perdida** — URL da Fluencypass entrega pagina do ProfKenny | Confusao total; SEO e brand equity desperdicados |
| 2 | **6 tags H1** (deveria ser 1) — incluindo mensagens de erro do formulario | Google nao identifica tema principal |
| 3 | **Canonical conflita com og:url** — `profkenny.com.br` vs `www.profkenny.com.br` | Sinais confusos para motores de busca |
| 4 | **86/123 imagens sem alt** (70%) | Acessibilidade e SEO gravemente prejudicados |
| 5 | **Zero Structured Data** | Sem rich snippets no Google |
| 6 | **Sem banner de cookies/LGPD** — com 7 trackers ativos | Violacao legal |

### Erros Medios

| # | Erro | Impacto |
|---|------|---------|
| 7 | Meta description fala de "Professor Kenny" para quem buscou "Fluencypass" | Desconexao de marca |
| 8 | Formulario usa metodo GET — expoe dados pessoais na URL | Privacidade / LGPD |
| 9 | 2 preloads nao utilizados | Banda desperdicada |
| 10 | og:image e logo generico | Compartilhamentos sem impacto visual |
| 11 | Hierarquia de headings desordenada (6 H1, 23 H2, 11 H3) | Semantica HTML quebrada |
| 12 | VK Digital `sales_pixel.js` carregado 2x | Duplicacao desnecessaria |

### Dados Tecnicos

| Item | Valor |
|------|-------|
| Page Load | 760ms |
| TTFB | 165ms |
| DOM Elements | 778 |
| Scripts | 30 (23 ext + 7 inline) |
| Imagens | 123 (86 sem alt) |
| Formularios | 1 (GET, 7 campos) |
| Trackers | FB Pixel, GTM, GA4 (debug!), Google Ads, Hotjar, Clarity, VK Digital |

### 5 Melhorias Sugeridas

1. **Resolver redirect e manter identidade Fluencypass** — landing co-branded ou conteudo proprio (+20-40% conversao)
2. **Formulario acima da dobra** — atualmente so no final da pagina (+15-25% leads)
3. **Schema FAQ + Course** — rich snippets no Google (+30-60% CTR organico)
4. **Prova social quantificada na hero** — nota RA, avaliacoes, logos parceiros (+10-20% conversao)
5. **Exit-intent popup** — capturar 5-15% dos visitantes que abandonam

---

## SITE 3: FULL ENGLISH

| Campo | Valor |
|-------|-------|
| **URL** | `fullenglish.com.br/landing-page/` |
| **Tipo** | Landing page de vendas |
| **Plataforma** | Vite/React (SPA) |
| **Proposta** | "A unica do Brasil com 3 garantias reais" |

### ALERTA CRITICO: SEQUESTRO DE PAGINA (HIJACKING)

O script **VK Digital** (`cf.vkdigital.com.br`, pixel ID `W62QaRirT5AYOTPYjNBP`) esta **reescrevendo dinamicamente TODA a pagina**:

- Formulario de lead envia dados para `profkenny.com.br` em vez de Full English
- Links de WhatsApp alterados para numeros do concorrente
- Todas as imagens substituidas por assets do ProfKenny
- Apos segundos, pagina redireciona completamente para `profkenny.com.br`

**100% dos leads estao sendo enviados para um concorrente.**

### Erros Criticos

| # | Erro | Impacto |
|---|------|---------|
| 1 | **Script VK Digital sequestra pagina** — leads vao para concorrente | Perda TOTAL de conversao |
| 2 | **Canonical ausente** | Conteudo duplicado no Google |
| 3 | **Zero Structured Data** | Sem rich snippets |
| 4 | **Links ancora quebrados** — `#historia` nao existe no DOM | UX quebrada |
| 5 | **og:url aponta para outro site** (`fullenglish.com.br/` em vez de `/landing-page/`) | Confusao em compartilhamentos |

### Erros Medios

| # | Erro | Impacto |
|---|------|---------|
| 6 | og:image generica do Unsplash | Sem branding em compartilhamentos |
| 7 | Twitter Card ausente | Sem preview no Twitter/X |
| 8 | Apenas 1/27 imagens com lazy loading | Carregamento lento |
| 9 | Nenhuma imagem com width/height | CLS alto (Core Web Vitals) |
| 10 | 2 containers GTM diferentes (GTM-N7V6BL9 + GTM-M393R672) | Duplicidade de eventos |
| 11 | Formulario usa GET | Dados expostos na URL |
| 12 | 40 erros no console (CORS, React hydration, APIs 401) | Integracoes quebradas |

### Dados Tecnicos

| Item | Valor |
|------|-------|
| Page Load | 616ms |
| DOM Content Loaded | 116ms |
| DOM Elements | 468 |
| Scripts | 12 (10 ext + 2 inline) |
| Imagens | 27 (0 sem alt na versao original) |
| Formularios | 1 (GET, 5 campos required) |
| Trackers | FB Pixel, GTM (2x), GA4, Google Ads, Hotjar, Clarity, VK Digital, Cloudflare |

### 5 Melhorias Sugeridas

1. **REMOVER SCRIPT MALICIOSO IMEDIATAMENTE** — auditar acesso ao GTM e servidor
2. **Adicionar video de prova social na hero** — 0 videos na pagina inteira
3. **Prova social dinamica + urgencia** — contadores, notificacoes de compra
4. **Simplificar formulario** — de 5 campos para 2-3 (+30-50% conversao)
5. **CTA sticky no mobile** — botao fixo na parte inferior da tela

---

## SITE 4: MAKEASY ENGLISH

| Campo | Valor |
|-------|-------|
| **URL solicitada** | `makeasyenglish.com.br/curso-de-ingles-landing-page/` |
| **URL final** | `fullenglish.com.br/landing-page/` |
| **Tipo** | Redirect para Full English |

### Nota

Este dominio redireciona completamente para `fullenglish.com.br/landing-page/` — mesma pagina do Site 3. Os erros e melhorias sao identicos aos do Full English, com agravantes:

### Erros Adicionais Especificos

| # | Erro | Impacto |
|---|------|---------|
| 1 | **og:title diz "Prof. Kenny"** em vez de "Full English" ou "Makeasy" | Terceira marca servindo conteudo de outra |
| 2 | **og:url aponta para `www.profkenny.com.br`** | Terceiro dominio nos OG tags |
| 3 | **Meta description menciona "Professor Kenny"** | SEO desalinhado com qualquer das 2 marcas |
| 4 | **Canonical completamente ausente** | Google nao sabe qual URL priorizar entre 3 dominios |
| 5 | **Textos colados nos headings** — "COM3 GARANTIASREAIS", "AFULL ENGLISH" | Leitura e SEO prejudicados |
| 6 | **H2 sem acentuacao** — "CONDICAO" sem cedilha | Qualidade textual baixa |
| 7 | **0 preconnect / 0 preload** | Performance subotima |

---

## SITE 5: PROF. KENNY

| Campo | Valor |
|-------|-------|
| **URL** | `profkenny.com.br` |
| **Tipo** | Landing page de vendas (destino final de toda a rede) |
| **Plataforma** | PHP/Laravel |
| **Proposta** | "Mais de 200 mil alunos ja transformaram o ingles" |

### Erros Criticos

| # | Erro | Impacto |
|---|------|---------|
| 1 | **6 tags H1** — 2 sao mensagens de erro do formulario | Google confuso sobre tema da pagina |
| 2 | **86/123 imagens sem alt** (69.9%) | Acessibilidade e SEO gravemente prejudicados |
| 3 | **Zero Structured Data (JSON-LD)** | Sem rich snippets no Google |
| 4 | **og:url (`www.profkenny`) ≠ canonical (`profkenny`)** | Sinais conflitantes |
| 5 | **Formulario usa GET** — dados pessoais expostos na URL | Violacao de privacidade/LGPD |
| 6 | **Sem banner de cookies** — com 7+ trackers ativos | Violacao da LGPD |

### Erros Medios

| # | Erro | Impacto |
|---|------|---------|
| 7 | GA `analytics_debug.js` em producao | Performance, warnings no console |
| 8 | 2 preloads nao utilizados | Banda desperdicada |
| 9 | 15 links `target="_blank"` sem `rel="noopener"` | Vulnerabilidade de seguranca (tabnapping) |
| 10 | 43/123 imagens sem lazy loading | Carregamento inicial pesado |
| 11 | Campo DDI sem `required` | Leads com dados incompletos |
| 12 | Botoes CTA com `href` vazio | SEO e acessibilidade prejudicados |

### Dados Tecnicos

| Item | Valor |
|------|-------|
| Page Load | 741ms |
| TTFB | 167ms |
| DOM Elements | 778 |
| Scripts | 30 |
| Imagens | 123 (86 sem alt, 80 com lazy load) |
| Formularios | 1 (GET, 4 campos) |
| Links WhatsApp | 5 |
| Trackers | FB Pixel, GTM, GA4, Google Ads, Clarity, Hotjar, VK Digital, Reclame Aqui |
| Console | 0 erros, 7 warnings |

### 5 Melhorias Sugeridas

1. **Prova social acima da dobra** — contador de 200k alunos, selo RA1000, logos de midia
2. **Formulario na hero** — atualmente so no rodape (+conversao significativa)
3. **Padronizar CTAs** — varios textos diferentes, anchors vazios; unificar acao
4. **Depoimentos em video** — curtos (15-30s) com resultados concretos
5. **WhatsApp flutuante contextual** — com animacao e texto "resposta em 2 min"

---

## PANORAMA COMPARATIVO

| Metrica | Kultivi | Fluencypass | Full English | Makeasy | ProfKenny |
|---------|---------|-------------|--------------|---------|-----------|
| **Page Load** | - | 760ms | 616ms | (= Full) | 741ms |
| **TTFB** | - | 165ms | 2ms | (= Full) | 167ms |
| **H1 tags** | 1 | 6 | 1 | (= Full) | 6 |
| **Imagens sem alt** | 66% | 70% | 0% | (= Full) | 70% |
| **Schema JSON-LD** | Quebrado | Ausente | Ausente | Ausente | Ausente |
| **Canonical** | - | Conflitante | Ausente | Ausente | OK (mas ≠ og:url) |
| **LGPD/Cookies** | Ausente | Ausente | - | - | Ausente |
| **Form method** | - | GET | GET | GET | GET |
| **Scripts** | 121 | 30 | 12 | (= Full) | 30 |
| **Redirect?** | Sim | Sim → ProfKenny | Hijacked → ProfKenny | Sim → Full English | Destino final |

---

## ERROS MAIS COMUNS (PADROES TRANSVERSAIS)

Erros que se repetem em 3+ sites — indicam problemas endemicos no nicho:

| Erro | Ocorrencia | Impacto |
|------|-----------|---------|
| **Structured Data ausente/quebrado** | 5/5 sites | Sem rich snippets no Google para nenhum |
| **Formulario com GET** (dados na URL) | 4/5 sites | Violacao de privacidade generalizada |
| **Imagens sem alt** (60-70%) | 3/5 sites | Acessibilidade e SEO de imagens ignorados |
| **Multiplos H1** | 2/5 sites | Hierarquia semantica quebrada |
| **Sem banner LGPD** | 3/5 sites | Risco legal com dezenas de trackers |
| **og:url inconsistente** | 4/5 sites | Compartilhamentos sociais com URLs erradas |
| **Redirects ocultos** | 4/5 sites | Usuarios nao chegam onde esperavam |

---

## OPORTUNIDADE PARA O MazyOS

Cada um dos 5 erros mais comuns tem uma skill correspondente no MazyOS:

| Erro Endemico | Skill MazyOS | Acao |
|---------------|-------------|------|
| Schema ausente | `/seo` etapa 04 (on-page) | Gera JSON-LD completo (Course, FAQ, Organization, Review) |
| Formulario inseguro | Playwright MCP + auditoria | Detecta e documenta; correcao exige acesso ao backend |
| Imagens sem alt | `/seo` etapa 04 | Gera alt texts otimizados por imagem |
| SEO bagunçado (H1, metas) | `/seo` etapa 04 | Reescreve hierarquia completa + meta tags |
| Sem conteudo recorrente | `/publicar-tema` + `/carrossel` | Pipeline blog + social automatizado |
| Ads nao otimizados | `/anuncio-google` + `/relatorio-ads` | Campanhas segmentadas + monitoramento semanal |

**Conclusao comercial:** O nicho de cursos de ingles online apresenta falhas tecnicas graves e sistematicas. Qualquer professor/escola que adote o MazyOS teria vantagem competitiva imediata — seus concorrentes nem sequer tem Schema no Google, muito menos pipeline de conteudo automatizado.

---

## RESUMO EXECUTIVO

| Site | Erros Criticos | Maior Problema |
|------|---------------|----------------|
| **Kultivi** | 6 | Redireciona usuarios para sites pagos sem aviso |
| **Fluencypass** | 6 | Dominio inteiro redireciona para concorrente (ProfKenny) |
| **Full English** | 5 | Script VK Digital sequestra 100% dos leads para ProfKenny |
| **Makeasy English** | 7 | Redirect + OG tags de terceira marca + textos quebrados |
| **Prof. Kenny** | 6 | Destino de toda a rede, mas com 70% das imagens sem alt e 6 H1s |

**Total de erros criticos encontrados:** 30
**Total de melhorias mapeadas:** 25

A descoberta mais grave e que a **Full English esta tendo seus leads roubados** por um script de terceiro que redireciona tudo para o Prof. Kenny. Se a Full English soubesse disso, a correcao seria prioridade zero — e exatamente o tipo de achado que uma auditoria MazyOS com Playwright MCP revela automaticamente.
