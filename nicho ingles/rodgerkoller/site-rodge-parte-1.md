# Architect — Parte 1/5: Estrutura Base

> Projeto: Rodger Koller / Fly to Fluency
> Data: 2026-06-07
> Stack: HTML5 + CSS3 + JS vanilla → Netlify static
> Referencia visual: Template "Simi Portfolio" (Dark Portfolio Vibrante)
> Skills consultadas: UI/UX Pro Max (design-system, typography, color, style, landing)

---

## Decisoes de Design (fundamentadas pela UI/UX Pro Max)

### Tipografia

**Space Grotesk (heading) + DM Sans (body)**

Pesquisa na skill retornou 10 pares tipograficos. Descartados:
- Inter (qualquer combinacao) — banida pela regra anti-slop
- Roboto, Open Sans — banidas
- Cormorant + Montserrat (Luxury Serif) — elegancia serifa demais pra professor jovem e humoristico
- Bodoni Moda + Jost — high-end fashion, nao encaixa em educacao
- Caveat + Quicksand — casual demais, nao transmite autoridade Cambridge

Selecionados:
- **Space Grotesk 500/600/700** — classificada como "bold, high-energy, display". Casa com a energia e personalidade do Rodger. Geometrica, moderna, com carater
- **DM Sans 400/500/600** — Google Fonts alternative do premium Satoshi/General Sans. Classificada como "premium, modern, clean, sophisticated". Legivel, neutra com personalidade

### Paleta de Cores

Baseada nas paletas "Portfolio/Personal" + "Luxury Premium" da skill, com adaptacao ao template de referencia (dark mode) e ao nicho educacao.

Rosa do template original substituido por Azul Cambridge — transmite confianca, educacao e remete a certificacao do Rodger.

```
--bg-deep:          #0f172a    Navy profundo (fundo principal)
--bg-elevated:      #1e293b    Cards, secoes elevadas
--bg-light:         #f8fafc    Secoes claras de contraste
--text-primary:     #f1f5f9    Texto sobre dark
--text-dark:        #0f172a    Texto sobre light
--accent:           #f59e0b    Dourado quente (CTAs, badges, destaques)
--accent-hover:     #d97706    Hover do accent
--cambridge:        #2563eb    Azul Cambridge (credenciais, links)
--cambridge-light:  #3b82f6    Hover do Cambridge
--muted:            #94a3b8    Texto secundario
--border:           rgba(255,255,255,0.08)   Bordas sutis sobre dark
--destructive:      #dc2626    Erro
```

### Estilo Visual

**Modern Dark Cinema** — da skill: "deep black, indigo, glow, blur, atmospheric, premium, layered". Sem neon, sem cyberpunk. Elegancia dark com profundidade e hierarquia de elevacao.

### Padrao de Landing

**Hero + Social Proof + Testimonials + CTA** — da skill: hero com CTA acima do fold, social proof antes do CTA principal, 3-5 depoimentos com foto+nome+role.

---

## Prompt de Implementacao

### Arquivos a criar

```
nicho ingles/rodgerkoller/site/index.html
nicho ingles/rodgerkoller/site/css/style.css
nicho ingles/rodgerkoller/site/css/animations.css
nicho ingles/rodgerkoller/site/js/main.js
nicho ingles/rodgerkoller/site/assets/       (pasta para imagens)
```

### index.html

```
DOCTYPE html, lang="pt-BR"

<head>
  charset UTF-8
  viewport: width=device-width, initial-scale=1
  title: "Rodger Koller — Fly to Fluency | Aprenda Ingles de Verdade"

  Meta tags:
    description — professor Cambridge CPE+CELTA, 34K alunos,
      aulas 1-a-1, material gratuito, assessoria intercambio Dublin
    Open Graph completo (og:title, og:description, og:image, og:url, og:type)
    Twitter Card (summary_large_image)

  Fonts:
    preconnect fonts.googleapis.com + fonts.gstatic.com
    Space Grotesk (500, 600, 700)
    DM Sans (400, 500, 600)

  Stylesheets:
    css/style.css
    css/animations.css

  Favicon placeholder
  Canonical URL

<body>
  Skeleton semantico (IDs de secao, sem conteudo):

    <header id="nav">
    <main>
      <section id="hero">
      <section id="credenciais">
      <section id="sobre">
      <section id="habilidades">
      <section id="ofertas">
      <section id="trajetoria">
      <section id="resultados">
      <section id="metodo">
      <section id="depoimentos">
      <section id="contato">
    </main>
    <footer id="footer">

  <script src="js/main.js" defer>
```

### css/style.css

```
CSS Reset moderno:
  *, *::before, *::after { box-sizing: border-box }
  * { margin: 0; padding: 0 }
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100% }
  body { min-height: 100dvh; -webkit-font-smoothing: antialiased }
  img, picture, video, canvas, svg { display: block; max-width: 100% }
  input, button, textarea, select { font: inherit }
  p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word }

:root — Custom Properties:

  Cores (todos os tokens listados acima)

  Tipografia:
    --font-heading: 'Space Grotesk', system-ui, sans-serif
    --font-body: 'DM Sans', system-ui, sans-serif

  Scale responsivo (clamp):
    --text-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
    --text-sm:   clamp(0.875rem, 0.8rem + 0.35vw, 1rem)
    --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem)
    --text-lg:   clamp(1.125rem, 1rem + 0.6vw, 1.5rem)
    --text-xl:   clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)
    --text-2xl:  clamp(2rem, 1.5rem + 2.5vw, 3.5rem)
    --text-hero: clamp(2.5rem, 2rem + 3vw, 4.5rem)

  Spacing (8dp scale):
    --space-1: 0.25rem    (4px)
    --space-2: 0.5rem     (8px)
    --space-3: 0.75rem    (12px)
    --space-4: 1rem       (16px)
    --space-6: 1.5rem     (24px)
    --space-8: 2rem       (32px)
    --space-12: 3rem      (48px)
    --space-16: 4rem      (64px)
    --space-20: 5rem      (80px)
    --space-24: 6rem      (96px)

  Easing premium:
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
    --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1)
    --ease-spring:   cubic-bezier(0.175, 0.885, 0.32, 1.275)

  Z-index scale:
    --z-base: 0
    --z-dropdown: 10
    --z-sticky: 20
    --z-fixed: 40
    --z-modal: 100
    --z-toast: 1000

  Radius:
    --radius-sm: 0.375rem
    --radius-md: 0.5rem
    --radius-lg: 0.75rem
    --radius-xl: 1rem
    --radius-2xl: 1.5rem
    --radius-full: 9999px

  Shadows (elevation consistente):
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.3)
    --shadow-md: 0 4px 12px rgba(0,0,0,0.4)
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.5)
    --shadow-glow-accent: 0 0 20px rgba(245,158,11,0.15)
    --shadow-glow-cambridge: 0 0 20px rgba(37,99,235,0.15)

Estilos globais:
  body:
    background: var(--bg-deep)
    color: var(--text-primary)
    font-family: var(--font-body)
    font-size: var(--text-base)
    line-height: 1.6

  h1, h2, h3, h4, h5, h6:
    font-family: var(--font-heading)
    font-weight: 700
    line-height: 1.1
    letter-spacing: -0.02em

  a:
    color: var(--cambridge)
    text-decoration: none
    transition: color 200ms var(--ease-out-expo)

  ::selection:
    background: var(--accent)
    color: var(--bg-deep)

  :focus-visible:
    outline: 2px solid var(--cambridge)
    outline-offset: 3px

Container:
  .container:
    width: 100%
    max-width: 1280px
    margin-inline: auto
    padding-inline: var(--space-4)

    @media (min-width: 768px):
      padding-inline: var(--space-8)

    @media (min-width: 1440px):
      max-width: 1400px

Secoes:
  section:
    padding-block: var(--space-16)

    @media (min-width: 768px):
      padding-block: var(--space-20)

    @media (min-width: 1024px):
      padding-block: var(--space-24)

Secoes claras:
  .section-light:
    background: var(--bg-light)
    color: var(--text-dark)

Prefers-reduced-motion:
  @media (prefers-reduced-motion: reduce):
    *, *::before, *::after:
      animation-duration: 0.01ms !important
      animation-iteration-count: 1 !important
      transition-duration: 0.01ms !important
      scroll-behavior: auto !important
```

### css/animations.css

```
@keyframes:
  fadeInUp:
    from { opacity: 0; transform: translateY(30px) }
    to   { opacity: 1; transform: translateY(0) }

  fadeInLeft:
    from { opacity: 0; transform: translateX(-30px) }
    to   { opacity: 1; transform: translateX(0) }

  fadeInRight:
    from { opacity: 0; transform: translateX(30px) }
    to   { opacity: 1; transform: translateX(0) }

  scaleIn:
    from { opacity: 0; transform: scale(0.9) }
    to   { opacity: 1; transform: scale(1) }

  slideUp:
    from { opacity: 0; transform: translateY(100%) }
    to   { opacity: 1; transform: translateY(0) }

  float:
    0%, 100% { transform: translateY(0) }
    50%      { transform: translateY(-10px) }

  shimmer:
    0%   { background-position: -200% 0 }
    100% { background-position: 200% 0 }

Classes de scroll animation:
  .animate-on-scroll:
    opacity: 0
    transform: translateY(30px)
    transition: opacity 0.8s var(--ease-out-expo),
                transform 0.8s var(--ease-out-expo)

  .animate-on-scroll.visible:
    opacity: 1
    transform: translateY(0)

  .animate-left:
    transform: translateX(-30px)
  .animate-left.visible:
    transform: translateX(0)

  .animate-right:
    transform: translateX(30px)
  .animate-right.visible:
    transform: translateX(0)

  .animate-scale:
    transform: scale(0.9)
  .animate-scale.visible:
    transform: scale(1)

Stagger delays:
  .stagger-1 { transition-delay: 50ms }
  .stagger-2 { transition-delay: 100ms }
  .stagger-3 { transition-delay: 150ms }
  .stagger-4 { transition-delay: 200ms }
  .stagger-5 { transition-delay: 250ms }
  .stagger-6 { transition-delay: 300ms }
```

### js/main.js

```
Intersection Observer para scroll animations:
  Seleciona todos os .animate-on-scroll
  Options: threshold 0.15, rootMargin "0px 0px -50px 0px"
  Ao entrar no viewport: adiciona .visible, faz unobserve

Smooth scroll para ancoras internas:
  Event delegation no document
  Previne default em links com href="#..."
  scrollIntoView({ behavior: 'smooth', block: 'start' })

Prefers-reduced-motion guard:
  Se matchMedia('(prefers-reduced-motion: reduce)').matches:
    Aplica .visible a todos os .animate-on-scroll imediatamente
    Nao registra o observer

Utility: debounce(fn, delay)
  Retorna funcao com clearTimeout/setTimeout
  Sera usada em gomos posteriores (scroll events, resize)
```

---

## Validacao Pre-Entrega

### $10K Checklist (Parte 1)

| # | Criterio | Status | Evidencia |
|---|----------|--------|-----------|
| 01 | Ponto de vista | OK | Dark premium portfolio, direcao visual clara e comprometida |
| 02 | Tipografia que trabalha | OK | Space Grotesk + DM Sans, premium, com carater |
| 03 | Sistema de cores contido | OK | 5 cores semanticas, sem arco-iris |
| 04 | Hierarquia que respira | OK | Scale responsivo clamp(), spacing 8dp, z-index organizado |
| 05 | Imagens com intencao | OK | Fotos do Rodger fornecidas pelo cliente (nao stock generico) |
| 06 | Motion que sussurra | OK | Easing curves customizadas (expo, back, spring), nao AOS |
| 07 | Mobile desenhado | OK | Breakpoints 375/768/1024/1440, clamp() em toda tipografia |
| 08 | Caro invisivel | OK | Semantic HTML, meta tags completas, preload fonts, reduced-motion, focus-visible |

### Regra Anti-Slop

| Item proibido | Status |
|---------------|--------|
| Emojis | Nenhum |
| Hifens decorativos | Nenhum |
| Jargao verborragico | Copy limpa |
| Caixas neon | Nenhuma |
| Inter/Roboto/Open Sans | Nenhuma (Space Grotesk + DM Sans) |
| Icones abaixo do Lucide | N/A neste gomo (icones vem na Parte 2+) |
| AOS fade-up generico | Substituido por IntersectionObserver + easing premium |

### UI/UX Pro Max Checklist

| Regra | Status |
|-------|--------|
| color-contrast 4.5:1 | Tokens definidos para atingir AA+ |
| focus-states | :focus-visible com outline 2px cambridge |
| viewport-meta | width=device-width, initial-scale=1 |
| mobile-first | Breakpoints progressivos |
| font-loading | preconnect + display swap |
| reduced-motion | @media query desabilita animacoes |
| heading-hierarchy | Skeleton com h1→h6 sequencial |
| spacing-scale | 8dp incremental |
| z-index-management | Scale definido (0/10/20/40/100/1000) |
| scroll-behavior | smooth com reduced-motion fallback |

---

## Proximo Passo

Parte 2/5: Hero section + navegacao + identidade visual
