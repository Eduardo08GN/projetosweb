# Parte 2/5: Hero Section + Navegacao + Identidade Visual

> Projeto: Rodger Koller / Fly to Fluency
> Data: 2026-06-07
> Referencia 21st Dev: Mini Navbar (floating pill, scroll morph) + MINIMAL Hero (stats, badge, stagger)
> Referencia prints: Template Simi Portfolio (split hero, foto + texto, counters, badges flutuantes)

---

## Componentes desta parte

### 1. Navbar

**Comportamento inspirado no Mini Navbar (21st Dev):**

Navbar flutuante estilo pill que muda de estado no scroll.

```
Estado inicial (topo):
  - Posicao fixa, transparente, sem borda
  - Logo "Fly to Fluency" a esquerda (Space Grotesk 600)
  - Links centralizados: Sobre | Metodo | Ofertas | Depoimentos | Contato
  - CTA a direita: botao "Fale Comigo" (accent dourado, radius-full)
  - Altura: 72px

Estado scrolled (apos 50px de scroll):
  - Background: var(--bg-elevated) com backdrop-filter blur(12px)
  - Borda: 1px solid var(--border)
  - Border-radius: var(--radius-xl) (pill shape)
  - Margem lateral: auto (max-width: 900px, centralizado)
  - Margem superior: var(--space-3)
  - Sombra: var(--shadow-md)
  - Altura: 56px
  - Transicao suave com var(--ease-out-expo) 400ms

Mobile (< 768px):
  - Logo + hamburger icon (Lucide Menu)
  - Ao clicar: overlay fullscreen com links empilhados
  - Overlay entra com slideUp + fade
  - Links com stagger 50ms cada
  - Botao fechar: Lucide X
  - Background do overlay: var(--bg-deep) com 98% opacity
```

**HTML semantico:**

```html
<header id="nav">
  <nav class="navbar" aria-label="Navegacao principal">
    <a href="#hero" class="nav-logo">Fly to Fluency</a>
    <ul class="nav-links" role="list">
      <li><a href="#sobre">Sobre</a></li>
      <li><a href="#metodo">Metodo</a></li>
      <li><a href="#ofertas">Ofertas</a></li>
      <li><a href="#depoimentos">Depoimentos</a></li>
      <li><a href="#contato">Contato</a></li>
    </ul>
    <a href="#contato" class="nav-cta">Fale Comigo</a>
    <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">
      <!-- Lucide Menu SVG -->
    </button>
  </nav>
</header>
```

**CSS critico:**

```
.navbar:
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: var(--z-fixed)
  display: flex
  align-items: center
  justify-content: space-between
  padding: var(--space-4) var(--space-6)
  transition: all 400ms var(--ease-out-expo)
  background: transparent

.navbar.scrolled:
  max-width: 900px
  margin: var(--space-3) auto
  padding: var(--space-3) var(--space-6)
  background: rgba(30, 41, 59, 0.85)
  backdrop-filter: blur(12px)
  -webkit-backdrop-filter: blur(12px)
  border: 1px solid var(--border)
  border-radius: var(--radius-xl)
  box-shadow: var(--shadow-md)

.nav-logo:
  font-family: var(--font-heading)
  font-weight: 600
  font-size: var(--text-lg)
  color: var(--text-primary)
  text-decoration: none
  letter-spacing: -0.01em

.nav-links:
  display: flex
  gap: var(--space-1)
  list-style: none

.nav-links a:
  font-family: var(--font-body)
  font-size: var(--text-sm)
  font-weight: 500
  color: var(--muted)
  padding: var(--space-2) var(--space-3)
  border-radius: var(--radius-md)
  transition: color 200ms, background 200ms

.nav-links a:hover:
  color: var(--text-primary)
  background: rgba(255,255,255,0.05)

.nav-cta:
  font-family: var(--font-heading)
  font-size: var(--text-sm)
  font-weight: 600
  color: var(--bg-deep)
  background: var(--accent)
  padding: var(--space-2) var(--space-6)
  border-radius: var(--radius-full)
  text-decoration: none
  transition: background 200ms, transform 200ms, box-shadow 200ms
  cursor: pointer

.nav-cta:hover:
  background: var(--accent-hover)
  transform: translateY(-1px)
  box-shadow: var(--shadow-glow-accent)

.nav-toggle:
  display: none  (visivel so no mobile via media query)

@media (max-width: 767px):
  .nav-links: display: none
  .nav-cta: display: none
  .nav-toggle: display: flex
```

**JS (scroll detection + mobile menu):**

```
Scroll detection:
  window.addEventListener('scroll', debounce(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 50)
  }, 10))

Mobile toggle:
  toggleBtn.addEventListener('click', () => {
    overlay aberto/fechado
    aria-expanded toggle
    body overflow hidden/auto
  })

Active section highlight:
  IntersectionObserver nas sections
  Ao entrar, atualiza classe .active no link correspondente
```

---

### 2. Hero Section

**Layout inspirado no template Simi + MINIMAL (21st Dev):**

Split layout asimetrico. Texto ocupa ~55% a esquerda, imagem do Rodger ~45% a direita.

```
DESKTOP (>= 1024px):

  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │   [Badge Cambridge CPE + CELTA]         ┌─────────────┐ │
  │                                         │             │ │
  │   Aprenda ingles                        │   RODGER    │ │
  │   de verdade.                           │   (foto     │ │
  │                                         │   close-up  │ │
  │   Pronuncia, vocabulario,              │   + avatar  │ │
  │   conversacao real. Do basico           │   cartoon)  │ │
  │   a fluencia com quem tem              │             │ │
  │   Cambridge CPE + CELTA e              │  [Badge:    │ │
  │   34.000 alunos.                        │  +34K       │ │
  │                                         │  alunos]    │ │
  │   [Comece Agora]  [Material Gratuito]   └─────────────┘ │
  │                                                         │
  │   ──────────────────────────────                       │
  │   +34.000    412      14+     Cambridge                │
  │   alunos    aulas    anos     CPE+CELTA                │
  │                                                         │
  └─────────────────────────────────────────────────────────┘

MOBILE (< 768px):

  ┌───────────────────────┐
  │                       │
  │  [Badge Cambridge]    │
  │                       │
  │  Aprenda ingles       │
  │  de verdade.          │
  │                       │
  │  Subtitulo...         │
  │                       │
  │  [Comece Agora]       │
  │  [Material Gratuito]  │
  │                       │
  │  ┌─────────────────┐  │
  │  │    RODGER        │  │
  │  │    (foto)        │  │
  │  │    fade-out      │  │
  │  │    inferior      │  │
  │  └─────────────────┘  │
  │                       │
  │  +34K  412  14+  CPE  │
  │                       │
  └───────────────────────┘
```

**HTML:**

```html
<section id="hero" class="hero">
  <div class="container hero-grid">
    <div class="hero-content">
      <div class="hero-badge animate-on-scroll">
        <!-- Lucide Award SVG -->
        <span>Cambridge CPE + CELTA</span>
      </div>
      <h1 class="hero-title animate-on-scroll stagger-1">
        Aprenda ingles<br>de verdade.
      </h1>
      <p class="hero-subtitle animate-on-scroll stagger-2">
        Pronuncia, vocabulario, conversacao real. Do basico
        a fluencia com quem tem certificacao Cambridge e
        mais de 34.000 alunos.
      </p>
      <div class="hero-actions animate-on-scroll stagger-3">
        <a href="#contato" class="btn-primary">Comece Agora</a>
        <a href="#ofertas" class="btn-secondary">Material Gratuito</a>
      </div>
      <div class="hero-stats animate-on-scroll stagger-4">
        <div class="stat">
          <span class="stat-number" data-target="34000">0</span>
          <span class="stat-label">alunos</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number" data-target="412">0</span>
          <span class="stat-label">aulas</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number" data-target="14">0</span>
          <span class="stat-label">anos</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-value">CPE</span>
          <span class="stat-label">Cambridge</span>
        </div>
      </div>
    </div>
    <div class="hero-visual animate-on-scroll animate-right">
      <div class="hero-image-wrapper">
        <img src="assets/rodger-closeup.png"
             alt="Professor Rodger Koller com seu avatar cartoon"
             width="600" height="700"
             loading="eager">
        <div class="hero-image-fade"></div>
        <div class="hero-float-badge">
          <span class="float-badge-number">+34K</span>
          <span class="float-badge-text">alunos formados</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

**CSS critico do hero:**

```
.hero:
  min-height: 100dvh
  display: flex
  align-items: center
  padding-top: calc(72px + var(--space-8))  /* offset do navbar */
  overflow: hidden
  position: relative

.hero::before:
  /* Gradient sutil de profundidade */
  content: ''
  position: absolute
  top: 0
  right: 0
  width: 50%
  height: 100%
  background: radial-gradient(
    ellipse at 70% 50%,
    rgba(37, 99, 235, 0.06) 0%,
    transparent 70%
  )
  pointer-events: none

.hero-grid:
  display: grid
  grid-template-columns: 1fr
  gap: var(--space-8)
  align-items: center

  @media (min-width: 1024px):
    grid-template-columns: 55% 45%
    gap: var(--space-12)

.hero-badge:
  display: inline-flex
  align-items: center
  gap: var(--space-2)
  padding: var(--space-2) var(--space-4)
  background: rgba(37, 99, 235, 0.1)
  border: 1px solid rgba(37, 99, 235, 0.2)
  border-radius: var(--radius-full)
  font-family: var(--font-body)
  font-size: var(--text-sm)
  font-weight: 500
  color: var(--cambridge-light)

.hero-badge svg:
  width: 16px
  height: 16px
  color: var(--cambridge)

.hero-title:
  font-family: var(--font-heading)
  font-size: var(--text-hero)
  font-weight: 700
  line-height: 1.05
  letter-spacing: -0.03em
  color: var(--text-primary)
  margin-top: var(--space-6)

.hero-subtitle:
  font-size: var(--text-lg)
  color: var(--muted)
  line-height: 1.6
  max-width: 520px
  margin-top: var(--space-6)

.hero-actions:
  display: flex
  flex-wrap: wrap
  gap: var(--space-4)
  margin-top: var(--space-8)

.btn-primary:
  font-family: var(--font-heading)
  font-size: var(--text-base)
  font-weight: 600
  color: var(--bg-deep)
  background: var(--accent)
  padding: var(--space-4) var(--space-8)
  border-radius: var(--radius-xl)
  text-decoration: none
  transition: all 250ms var(--ease-out-expo)
  cursor: pointer
  display: inline-flex
  align-items: center
  gap: var(--space-2)

.btn-primary:hover:
  background: var(--accent-hover)
  transform: translateY(-2px)
  box-shadow: var(--shadow-glow-accent)

.btn-secondary:
  font-family: var(--font-heading)
  font-size: var(--text-base)
  font-weight: 600
  color: var(--text-primary)
  background: transparent
  padding: var(--space-4) var(--space-8)
  border-radius: var(--radius-xl)
  border: 1px solid var(--border)
  text-decoration: none
  transition: all 250ms var(--ease-out-expo)
  cursor: pointer

.btn-secondary:hover:
  border-color: rgba(255,255,255,0.2)
  background: rgba(255,255,255,0.03)
  transform: translateY(-1px)

.hero-stats:
  display: flex
  align-items: center
  gap: var(--space-6)
  margin-top: var(--space-12)
  padding-top: var(--space-8)
  border-top: 1px solid var(--border)

.stat-number:
  font-family: var(--font-heading)
  font-size: var(--text-2xl)
  font-weight: 700
  color: var(--accent)

.stat-value:
  font-family: var(--font-heading)
  font-size: var(--text-xl)
  font-weight: 700
  color: var(--cambridge)

.stat-label:
  display: block
  font-size: var(--text-xs)
  color: var(--muted)
  margin-top: var(--space-1)
  text-transform: uppercase
  letter-spacing: 0.05em

.stat-divider:
  width: 1px
  height: 40px
  background: var(--border)

/* Imagem do hero */
.hero-visual:
  position: relative
  display: flex
  justify-content: center

.hero-image-wrapper:
  position: relative
  max-width: 500px

.hero-image-wrapper img:
  width: 100%
  height: auto
  object-fit: contain

.hero-image-fade:
  position: absolute
  bottom: 0
  left: 0
  right: 0
  height: 30%
  background: linear-gradient(to top, var(--bg-deep), transparent)
  pointer-events: none

.hero-float-badge:
  position: absolute
  bottom: 15%
  right: -10%
  background: var(--accent)
  color: var(--bg-deep)
  padding: var(--space-3) var(--space-6)
  border-radius: var(--radius-xl)
  box-shadow: var(--shadow-glow-accent)
  animation: float 4s ease-in-out infinite
  text-align: center

.float-badge-number:
  display: block
  font-family: var(--font-heading)
  font-size: var(--text-xl)
  font-weight: 700
  line-height: 1

.float-badge-text:
  display: block
  font-size: var(--text-xs)
  font-weight: 600
  margin-top: 2px

/* Mobile */
@media (max-width: 767px):
  .hero:
    min-height: auto
    padding-top: calc(56px + var(--space-6))
    padding-bottom: var(--space-8)

  .hero-grid:
    text-align: center

  .hero-subtitle:
    margin-inline: auto

  .hero-actions:
    justify-content: center
    flex-direction: column
    align-items: stretch

  .hero-stats:
    justify-content: center
    flex-wrap: wrap
    gap: var(--space-4)

  .hero-visual:
    order: 2
    margin-top: var(--space-6)

  .hero-float-badge:
    right: 5%
    bottom: 20%
```

**JS do hero:**

```
Counter animation:
  Quando .hero-stats entra no viewport (via IntersectionObserver):
    Para cada .stat-number com data-target:
      Anima de 0 ate o target em 2000ms
      Usa easing desacelerado (ease-out)
      Formata com ponto de milhar (34.000)
      Adiciona "+" antes do numero quando > 100
```

---

## Animacoes Premium (desta parte)

Todas as animacoes usam as curvas definidas na Parte 1.

| Elemento | Tipo | Timing | Detalhe |
|----------|------|--------|---------|
| Navbar scroll morph | Transform + bg | 400ms ease-out-expo | Pill shape, blur, shadow |
| Hero badge | fadeInLeft | 600ms ease-out-expo | Primeira coisa a aparecer |
| Hero title | fadeInUp | 800ms ease-out-expo | Stagger 50ms apos badge |
| Hero subtitle | fadeInUp | 800ms ease-out-expo | Stagger 100ms |
| Hero CTAs | fadeInUp | 800ms ease-out-expo | Stagger 150ms |
| Hero stats | fadeInUp | 800ms ease-out-expo | Stagger 200ms |
| Hero image | fadeInRight | 1000ms ease-out-expo | Slide lateral suave |
| Float badge | float loop | 4s ease-in-out infinite | Hovering sutil |
| Counters | countUp | 2000ms ease-out | Numeros subindo do zero |
| Nav link hover | bg + color | 200ms | Background sutil |
| CTA hover | translateY + glow | 250ms ease-out-expo | Lift + shadow glow |
| Mobile menu | slideUp + fade | 300ms ease-out-expo | Overlay fullscreen |
| Mobile links | stagger | 50ms por item | Entrada sequencial |

---

## Validacao

### $10K Checklist (Parte 2)

| # | Criterio | Evidencia |
|---|----------|-----------|
| 01 | Ponto de vista | Navbar pill flutuante + hero split asimetrico = direcao autoral |
| 02 | Tipografia | Space Grotesk hero com -0.03em tracking, escala clamp() |
| 03 | Cores | Badge cambridge blue, accent dourado nos CTAs, contido |
| 04 | Hierarquia | Badge > Title > Subtitle > CTAs > Stats, whitespace generoso |
| 05 | Imagens | Foto real do Rodger + avatar cartoon, nao stock |
| 06 | Motion | Spring physics no navbar, stagger no hero, float no badge |
| 07 | Mobile | Layout reorganizado (nao encolhido), CTAs full-width, menu overlay |
| 08 | Caro invisivel | Semantic nav, aria-label, aria-expanded, loading eager, alt text |

### Anti-Slop

| Proibido | Status |
|----------|--------|
| Emojis | Zero |
| Hifens | Zero |
| Neon boxes | Zero (badge usa opacity 0.1, nao neon) |
| Inter/Roboto | Zero |
| AOS generico | Substituido por IntersectionObserver + curves premium |

---

## Proximo Passo

Parte 3/5: Secoes intermediarias (credenciais, sobre, habilidades, metodo)
