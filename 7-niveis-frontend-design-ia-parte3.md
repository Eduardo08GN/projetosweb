# Os 7 Niveis do Frontend Design com IA — Parte 3

> **Breadcrumb completo da primeira producao real usando o Protocolo 7 Niveis: site Rodger Koller / Fly to Fluency.**

---

## O que e este documento

Registro minucioso de todos os passos, decisoes, ferramentas, skills, MCPs, crivos e validacoes aplicados durante a construcao da landing page do Rodger Koller — a primeira execucao completa do Protocolo 7 Niveis com Sistema de Dois Agentes.

Serve como:
- Prova de processo para o proprio operador (o que foi feito e por que)
- Template de referencia para futuras producoes
- Documentacao de cada ponto de decisao e a skill/regra que o fundamentou

---

## Dados do Projeto

| Campo | Valor |
|-------|-------|
| Cliente | Rodger Koller |
| Marca | Fly to Fluency |
| Nicho | Professor de ingles (Cambridge CPE + CELTA, 34K+ alunos) |
| Stack | HTML5 + CSS3 + Vanilla JS (zero frameworks, zero build step) |
| Deploy | Netlify Static (`netlify deploy --prod --dir=.`) |
| URL de producao | https://splendorous-crepe-e29c59.netlify.app |
| Repositorio | https://github.com/Eduardo08GN/projetosweb.git |
| Data de producao | 2026-06-06 / 2026-06-07 |

---

## Sistema de Dois Agentes: Como foi Aplicado

### Fase 1 — Architect (sessao anterior)

O Architect formulou 5 especificacoes tecnicas completas, salvas como artefatos `.md` na pasta do projeto:

| Turno | Arquivo | Escopo |
|-------|---------|--------|
| 1/5 | `site-rodge-parte-1.md` | Estrutura base: HTML skeleton, head, meta tags, CSS reset, design tokens, custom properties, animations.css, main.js base |
| 2/5 | `site-rodge-parte-2.md` | Hero section + navbar (floating pill com scroll morph) + identidade visual completa |
| 3/5 | `site-rodge-parte-3.md` | Secoes intermediarias: credenciais, sobre, habilidades (Dark Grid cards), metodo (timeline vertical) |
| 4/5 | `site-rodge-parte-4.md` | Secoes de conversao: ofertas (pricing cards), depoimentos (masonry grid), formulario (WhatsApp redirect), FAQ (accordion) |
| 5/5 | `site-rodge-parte-5.md` | Footer, WhatsApp flutuante (pulse + tooltip), exit intent (desktop only), polish final (grain overlay, preloader, smooth scroll, back-to-top) |

Cada spec incluiu:
- Referencia visual (prints de template + componentes do 21st Dev)
- Decisoes de design fundamentadas pela UI/UX Pro Max
- HTML semantico completo (com atributos ARIA)
- CSS detalhado (custom properties, breakpoints, estados)
- JS comportamental (observers, event handlers, animacoes)
- Validacao contra o $10K Checklist e Regra Anti-Slop

### Fase 2 — Executor (esta sessao)

O Executor recebeu cada spec e implementou em 5 gomos sequenciais, com aprovacao do usuario entre cada gomo:

| Gomo | O que foi implementado | Linhas aprox. |
|------|------------------------|---------------|
| 1/5 | HTML skeleton + CSS reset + design tokens + animations.css + main.js base | HTML ~120, CSS ~250, animations ~100, JS ~40 |
| 2/5 | Navbar completa (fixo + scrolled pill morph + mobile overlay) + Hero (badge + titulo + CTAs + stats + foto + float badge) | HTML +80, CSS +400, JS +120 |
| 3/5 | Credenciais (3 cards com icones SVG inline) + Sobre (split com foto + bullets) + Habilidades (6 Dark Grid cards) + Metodo (4-step timeline vertical) | HTML +180, CSS +500, JS +60 |
| 4/5 | Ofertas (3 pricing cards com destaque central) + Depoimentos (masonry grid + rating card) + Formulario (campos + WhatsApp redirect) + FAQ (6 items accordion) | HTML +250, CSS +550, JS +80 |
| 5/5 | Footer (3 colunas + socials + copyright + back-to-top) + WhatsApp flutuante (delay spring entrance + pulse ring + tooltip) + Exit Intent (popup com form) + Grain overlay + Preloader + Schema.org JSON-LD | HTML +120, CSS +200, JS +40 |

**Totais finais aproximados:**
- `index.html`: ~750 linhas
- `style.css`: ~1900 linhas
- `animations.css`: ~100 linhas
- `main.js`: ~366 linhas

---

## Skills Consultadas e Como Foram Aplicadas

### 1. UI/UX Pro Max (obrigatoria)

Skill com 50+ estilos, 161 paletas, 57 pares tipograficos, 161 product types e 99 guidelines UX. Foi consultada em TODAS as decisoes de design.

**Onde impactou diretamente:**

| Decisao | Regra da Skill | Resultado |
|---------|----------------|-----------|
| Par tipografico | Pesquisa nos 57 pares, descartados Inter/Roboto (anti-slop), selecionados Space Grotesk + DM Sans | Tipografia premium com carater |
| Paleta de cores | Paletas "Portfolio/Personal" + "Luxury Premium", adaptadas ao dark mode + nicho educacao | 5 cores semanticas contidas, sem arco-iris |
| Estilo visual | Classificado como "Modern Dark Cinema" — deep black, indigo, glow, blur, atmospheric, premium, layered | Direcao visual clara e comprometida |
| Padrao de landing | "Hero + Social Proof + Testimonials + CTA" — hero com CTA acima do fold | Hierarquia de conversao otimizada |
| Acessibilidade | `color-contrast` (4.5:1), `focus-states` (2px outline), `skip-links`, `heading-hierarchy`, `keyboard-nav`, `aria-labels` | WCAG AA compliance |
| Touch & Interaction | `touch-target-size` (44x44 min), `touch-spacing` (8px gap), `loading-buttons` (spinner no submit) | Mobile-ready sem mis-taps |
| Performance | `font-loading` (preconnect + swap), `image-dimension` (width/height declarados), `lazy-loading` (below fold), `debounce-throttle` | Core Web Vitals otimizados |
| Animacoes | `duration-timing` (150-300ms micro, <=400ms complex), `transform-performance` (so transform/opacity), `easing` (ease-out enter, ease-in exit), `stagger-sequence` (30-50ms), `reduced-motion` (media query respeitada), `interruptible`, `no-blocking-animation` | Motion premium sem AI Slop |
| Forms & Feedback | `input-labels` (labels visiveis), `error-placement` (inline), `submit-feedback` (loading state), `progressive-disclosure`, `input-type-keyboard` (email/tel semantic) | Formulario com UX profissional |
| Navegacao | `bottom-nav-limit`, `back-behavior`, `nav-label-icon`, `nav-state-active` | Navbar com active section highlight |
| Layout | `viewport-meta`, `mobile-first`, `breakpoint-consistency` (375/768/1024/1440), `spacing-scale` (8dp), `z-index-management`, `container-width` | Grid system responsivo |

### 2. Frontend Design Skills

Principios de design thinking para web aplicados durante a formulacao dos prompts do Architect e na implementacao do Executor. Cobriu:
- Hierarquia visual (primario > secundario > terciario)
- Whitespace como elemento de design
- Contraste e agrupamento (Gestalt)
- Layout responsivo com intenção (mobile desenhado, nao encolhido)

---

## MCPs Utilizados

### 21st Dev (MCP — Component Inspiration)

Consultado antes de implementar cada componente visual complexo. O Architect buscou inspiracao e o Executor adaptou ao contexto do projeto.

| Componente buscado | Referencia 21st Dev | Como foi adaptado |
|--------------------|---------------------|-------------------|
| Navbar | **Mini Navbar** — floating pill, scroll morph | Estado inicial transparente → scrolled pill com backdrop-blur. Transicao 400ms ease-out-expo. Mobile overlay fullscreen com stagger |
| Hero | **MINIMAL Hero** — stats, badge, stagger | Split layout (texto + foto), badge "Cambridge CPE + CELTA", float badge "+34K alunos", stats row com counters animados |
| Cards de habilidades | **Dark Grid** — cards com hover glow + corner squares | 6 cards em grid 3x2, corner squares em hover (pseudo-elements nos cantos), gradient glow sutil |
| Timeline | **Modern Timeline** — milestones verticais | 4 passos com scroll-driven line fill (scaleY controlado pelo scroll), cards alternados esquerda/direita no desktop |
| Pricing | **Dark Gradient Pricing** — cards com blur entrance, gradient, checklist | 3 cards (Gratuito/Definitivo/Particular), card central com scale(1.05) + badge "Popular", CTAs diferenciados |
| Depoimentos | **Testimonials Grid** — masonry com blockquote + avatar | Grid masonry com reviews reais do Hotmart, rating card lateral com nota 4.9/5 |
| Footer | **Footer 7** — minimal, social links, sections, copyright | 3 colunas (marca/navegacao/contato), social links, copyright com back-to-top |

### Stitch (MCP)

Referenciado no protocolo como ferramenta de refinamento visual pos-implementacao. Nesta producao, o refinamento foi integrado diretamente no Gomo 5 (polish final) com grain overlay, preloader, section transitions e scroll suavizado.

---

## Crivo MazyOS

O filtro MazyOS foi aplicado para garantir alinhamento do conteudo com o contexto do negocio:

| Arquivo de contexto | Como foi aplicado |
|---------------------|-------------------|
| `_memoria/empresa.md` | Dados do Rodger (CPE + CELTA, 34K alunos, Speak Up Idiomas, Dublin, humor e personalidade) informaram toda a copy e posicionamento |
| `_memoria/preferencias.md` | Tom de voz calibrado: direto, confiante, sem formalismo excessivo. Linguagem do Rodger, nao linguagem corporativa |
| `_memoria/estrategia.md` | Foco atual em nicho ingles como prioridade. Landing page como ativo de captacao para o professor |

O conteudo foi produzido com copy real do negocio do Rodger — nenhum Lorem ipsum, nenhum placeholder de texto foi pro deploy.

---

## Crivo dos 8 Criterios ($10K Checklist)

Validacao final aplicada ao site completo:

### 01. Ponto de vista, nao template
**APROVADO.** Dark premium com identidade "Modern Dark Cinema". Nao e template generico — paleta navy + dourado + azul Cambridge e especifica pra esse professor. Direcao visual clara e mantida em todas as secoes.

### 02. Tipografia que trabalha
**APROVADO.** Space Grotesk (headings) + DM Sans (body). Nenhuma fonte generica (Inter, Roboto, Open Sans banidas explicitamente). Scale responsivo com `clamp()` em todos os niveis. Pesos 500/600/700 em headings criando hierarquia clara. Letter-spacing `-0.02em` nos titulos grandes.

### 03. Sistema de cores contido
**APROVADO.** 5 cores semanticas: navy deep (#0f172a), elevated (#1e293b), accent dourado (#f59e0b), azul Cambridge (#2563eb), muted (#94a3b8). Todas em custom properties. Zero paleta arco-iris. Contencao premium.

### 04. Hierarquia que respira
**APROVADO.** Spacing 8dp scale consistente. Whitespace generoso entre secoes (space-16 a space-24 progressivo por breakpoint). Primario (hero title), secundario (section headings), terciario (body text) claramente definidos. Nenhum muro plano de conteudo.

### 05. Imagens com intencao
**APROVADO.** Fotos reais do Rodger Koller fornecidas pelo cliente (rodger_hero04.png, rodge.png, rodger_bandeira.png). Nenhuma foto stock generica. Icones SVG inline (nivel Lucide). Nenhum emoji.

### 06. Motion que sussurra
**APROVADO.** Easing curves customizadas: ease-out-expo, ease-out-back, ease-spring (cubic-bezier). IntersectionObserver com threshold 0.15 e rootMargin ajustado. Stagger delays (50ms incrementais). Counter animation com rAF + ease-out quartic. Timeline line fill scroll-driven. WhatsApp entrance com spring delay 3s. Nenhum AOS generico. Reduced-motion respeitada em todas as animacoes.

### 07. Mobile que e desenhado, nao encolhido
**APROVADO.** Breakpoints 375/768/1024/1440. Navbar com overlay fullscreen dedicado (nao dropdown). Hero stack vertical com foto acima no mobile. Cards de credencial empilham 1 por vez. Grid de habilidades passa de 3 colunas pra 2 pra 1. Pricing stack com Definitivo primeiro (reordenado via CSS order). Tipografia com clamp() nativo — nunca comprimida, sempre fluida.

### 08. O caro invisivel
**APROVADO.**
- Performance: Google Fonts com preconnect, width/height em todas as imagens (CLS < 0.1), lazy loading abaixo do fold, JS deferido, debounce em scroll handlers, passive event listeners
- Acessibilidade: Skip link, focus-visible outline, ARIA labels em todos os botoes/nav, heading hierarchy sequencial (h1→h2→h3), roles semanticos, contraste WCAG AA
- SEO: Meta tags completas (OG, Twitter Card), Schema.org JSON-LD (EducationalOrganization), canonical URL, titulo semantico
- Seguranca: Netlify headers (X-Frame-Options DENY, nosniff, strict referrer-policy, permissions-policy)
- Cache: Headers de 1 ano imutavel para CSS/JS/assets/fonts

---

## Regra Anti-Slop — Validacao Final

| Item proibido | Status | Evidencia |
|---------------|--------|-----------|
| Emojis | ZERO | Nenhum emoji em nenhum arquivo. Icones sao SVG inline |
| Hifens decorativos | ZERO | Nenhum hifem como separador visual |
| Jargao verborragico | ZERO | Copy direta: "Aprenda ingles de verdade", "Do basico a fluencia" |
| Caixas neon delineadoras | ZERO | Nenhuma borda neon + fundo neon transparente |
| Inter / Roboto / Open Sans | ZERO | Space Grotesk + DM Sans exclusivamente |
| Icones abaixo do Lucide | ZERO | Todos SVG inline com qualidade Lucide ou superior |
| AOS fade-up generico | ZERO | IntersectionObserver customizado + easing curves premium |

---

## Tecnicas de Implementacao Documentadas

### CSS

| Tecnica | Onde foi usada | Por que |
|---------|----------------|---------|
| Custom Properties (CSS Variables) | `:root` com todos os tokens | Design system consistente, facil de manter |
| `clamp()` responsivo | Toda a escala tipografica | Tipografia fluida sem media queries por font-size |
| 8dp spacing scale | Todos os gaps, paddings, margins | Consistencia visual matemática |
| `backdrop-filter: blur()` | Navbar scrolled, exit intent | Glass effect premium sem decoracao excessiva |
| Pseudo-elements `::before/::after` | Corner squares nos cards Dark Grid, gradient overlays | Efeitos visuais sem markup extra |
| CSS Grid + Flexbox | Layouts de secao, cards, pricing, footer | Grid para 2D, Flexbox para 1D — cada um no seu lugar |
| `scroll-behavior: smooth` | HTML global | Navegacao suave nativa |
| Grain overlay (SVG feTurbulence) | `::after` no body | Textura cinematografica a 3% opacity |
| Media queries progressivas | 768px, 1024px, 1440px | Mobile-first verdadeiro |
| `prefers-reduced-motion` | Media query global | Acessibilidade para sensibilidade a movimento |

### JavaScript

| Tecnica | Onde foi usada | Por que |
|---------|----------------|---------|
| IntersectionObserver | Scroll animations, counters, active section | Performance superior a scroll event listeners |
| `requestAnimationFrame` | Counter animation | 60fps garantido, sincronizado com refresh rate |
| Event delegation | Smooth scroll, FAQ | Um unico listener em vez de N |
| `sessionStorage` | Exit intent (one-time guard) | Popup aparece uma vez por sessao, nao por pageview |
| IIFE + `'use strict'` | Wrapper do main.js | Zero poluicao do escopo global |
| `{ passive: true }` | Scroll event listeners | Performance: browser sabe que nao vai preventDefault |
| `debounce()` | Utility disponivel para scroll/resize | Evita layout thrashing em eventos de alta frequencia |
| `mouseleave` com `clientY < 0` | Exit intent | Detecta saida real do viewport, nao hover em elemento |

### HTML Semantico

| Elemento | Uso |
|----------|-----|
| `<header>`, `<main>`, `<footer>` | Landmarks de navegacao |
| `<nav>` com `aria-label` | Navegacao principal identificada |
| `<section>` com `id` e `aria-label` | Cada secao navegavel e rotulada |
| `<details>/<summary>` | FAQ accordion nativo (sem JS para abrir/fechar) |
| `<a href="#contato">` | Skip link para teclado |
| `role="list"` em `<ul>` | Corrige Safari que remove role em listas estilizadas |
| Schema.org JSON-LD | EducationalOrganization estruturado |

---

## Fluxo de Deploy

```
1. Codigo implementado localmente (5 gomos sequenciais)
2. git add + git commit para cada gomo
3. git push para GitHub (Eduardo08GN/projetosweb)
4. netlify deploy --prod --dir=. (Netlify CLI)
5. Site live em producao
6. Fotos do cliente adicionadas como assets
7. Novo commit + push + redeploy com imagens corrigidas
```

**Commits relevantes:**
- `d047c55` — Deploy Netlify static + dual-mode config
- `974774f` — Site Next.js completo (versao anterior, descartada)
- `fcda3bb` — HTML/CSS/JS puro deployado
- `125bb7b` — Fotos reais do Rodger + correcao de paths

---

## Estrutura de Arquivos Final

```
nicho ingles/rodgerkoller/site/
  index.html              Pagina unica completa (9 secoes + footer)
  netlify.toml            Config de deploy + headers de seguranca + cache
  css/
    style.css             Design system + todos os estilos (~1900 linhas)
    animations.css        Keyframes + scroll animation classes (~100 linhas)
  js/
    main.js               Toda a interatividade (~366 linhas, IIFE)
  assets/
    rodger_hero04.png     Foto hero (Rodger com bandeira UK)
    rodge.png             Foto sobre (closeup do rosto)
    rodger_bandeira.png   Foto extra (Rodger segurando bandeira)
```

---

## Niveis do Protocolo Aplicados

Este projeto operou entre os **Niveis 2 a 6** do Protocolo:

| Nivel | Aplicacao neste projeto |
|-------|------------------------|
| 2 — Skills | UI/UX Pro Max + Frontend Design consultadas em TODA decisao de design |
| 3 — Diretor Visual | Prints do template "Simi Portfolio" como referencia visual primaria |
| 4 — Clonador | Analise e adaptacao de padroes do template de referencia (nao copia direta) |
| 5 — Toque Pessoal | Fotos reais do Rodger, cores Cambridge-specific, componentes do 21st Dev adaptados |
| 6 — Refinamento | Grain overlay, easing curves premium, stagger animations, counter rAF, preloader, scroll-driven timeline, exit intent |

**Nivel 7 (WebGL/3D)** nao foi aplicado — fora do escopo para este tipo de landing page.

---

## O que Falta (Pendencias Pos-Deploy)

| Item | Status | Impacto |
|------|--------|---------|
| Numero WhatsApp real do Rodger | Placeholder `5511999999999` | Formulario e botao flutuante nao redirecionam para o numero correto |
| Favicon | Referenciado mas nao criado (`assets/favicon.svg`) | Tab do browser sem icone |
| OG Image | Referenciado mas nao criado (`assets/og-image.jpg`) | Preview em redes sociais sem imagem |
| Dominio custom no Netlify | URL generica `splendorous-crepe-e29c59` | Branding do URL |

---

## Resumo do Breadcrumb Completo

```
INPUTS DO PROTOCOLO
  Prints de referencia (template Simi Portfolio)
  + Dados do negocio (MazyOS: empresa.md, preferencias.md, estrategia.md)
  + Prospecção e auditoria previa do Rodger Koller
      |
      v
SKILL: UI/UX Pro Max
  → Tipografia: Space Grotesk + DM Sans (pesquisa em 57 pares)
  → Paleta: Navy + Dourado + Cambridge (pesquisa em 161 paletas)
  → Estilo: Modern Dark Cinema
  → 99 guidelines UX aplicadas (acessibilidade, touch, performance, forms, nav, animation)
      |
      v
MCP: 21st Dev (Component Inspiration)
  → Mini Navbar (floating pill scroll morph)
  → MINIMAL Hero (stats, badge, stagger)
  → Dark Grid (cards com corner squares)
  → Modern Timeline (milestones verticais)
  → Dark Gradient Pricing (cards com blur entrance)
  → Testimonials Grid (masonry + avatar)
  → Footer 7 (minimal, socials, sections)
      |
      v
SISTEMA DE DOIS AGENTES
  Architect (5 specs .md salvos como artefatos)
    → Executor (5 gomos de implementacao com aprovacao entre cada)
      |
      v
CRIVO $10K CHECKLIST (8 criterios)
  01. Ponto de vista ✓
  02. Tipografia ✓
  03. Cores contidas ✓
  04. Hierarquia ✓
  05. Imagens com intencao ✓
  06. Motion premium ✓
  07. Mobile desenhado ✓
  08. Caro invisivel ✓
      |
      v
FILTRO ANTI-SLOP (7 itens proibidos)
  Emojis ✓ Hifens ✓ Jargao ✓ Neon boxes ✓ Inter/Roboto ✓ Icones ✓ AOS ✓
      |
      v
FILTRO MAZYOS
  empresa.md ✓ preferencias.md ✓ estrategia.md ✓
      |
      v
DEPLOY
  Git → GitHub → Netlify CLI → Producao
      |
      v
OUTPUT: Landing page premium, zero AI Slop, 9 secoes funcionais
  https://splendorous-crepe-e29c59.netlify.app
```

---

> **"Dois agentes, cinco turnos cada, zero token desperdicado, zero AI Slop."**
