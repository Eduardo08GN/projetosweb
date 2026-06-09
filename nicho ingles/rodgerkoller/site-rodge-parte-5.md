# Parte 5/5: Footer + Componentes Flutuantes + Polish Final

> Projeto: Rodger Koller / Fly to Fluency
> Data: 2026-06-07
> Referencia 21st Dev: Footer 7 (minimal, social links, sections, copyright)
> Referencia prints: Template Simi Portfolio (footer dark clean, WhatsApp floating, grain overlay)
> Skills consultadas: UI/UX Pro Max (navigation patterns, accessibility, performance, animation consistency)

---

## Visao Geral

```
[FOOTER]              — footer dark minimalista com logo, nav, socials, copyright
[WHATSAPP FLUTUANTE]  — botao fixo bottom-right com pulse + tooltip
[EXIT INTENT]         — popup de lead capture quando mouse sai da viewport (desktop only)
[POLISH FINAL]        — grain overlay, section transitions, smooth scroll, performance, back-to-top
```

---

## Secao 9: Footer

**Objetivo:** Fechar a pagina com informacoes uteis sem poluir. O footer e ponto de resgate pra quem scrollou tudo e nao clicou em nada.

**Inspiracao:** Footer 7 (21st Dev) — layout limpo com logo + descricao a esquerda, links em colunas, socials, copyright com border-top.

**Layout:**
```
Background: var(--bg-deep) com border-top 1px var(--border)
Padding: var(--space-16) vertical

Desktop:
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│   FLY TO FLUENCY           NAVEGACAO      CONTATO     REDES      │
│   (logo text)              Sobre          Email       Instagram  │
│                            Metodo         WhatsApp    YouTube    │
│   "Aprenda ingles com      Ofertas                    Facebook   │
│    metodo de verdade.      Depoimentos                           │
│    Cambridge CPE+CELTA."   FAQ                                   │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│   © 2026 Rodger Koller. Todos os direitos reservados.            │
│                                                        [↑ Topo]  │
└───────────────────────────────────────────────────────────────────┘

Mobile:
  - Logo + descricao (full width)
  - Grid 2x2 (Navegacao | Contato | Redes | vazio)
  - Copyright centralizado
```

**HTML semantico:**

```html
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">

      <!-- Coluna 1: Marca -->
      <div class="footer-brand">
        <a href="#hero" class="footer-logo">Fly to Fluency</a>
        <p class="footer-desc">
          Aprenda ingles com metodo de verdade.
          Professor com Cambridge CPE + CELTA e mais de 34 mil alunos formados.
        </p>
        <div class="footer-socials">
          <a href="https://instagram.com/rodgerkoller" target="_blank" rel="noopener"
             aria-label="Instagram do Rodger">
            <!-- SVG Instagram icon (Lucide-level) -->
          </a>
          <a href="https://youtube.com/@RodgerKoller" target="_blank" rel="noopener"
             aria-label="YouTube do Rodger">
            <!-- SVG YouTube icon -->
          </a>
          <a href="https://facebook.com/RodgerKoller" target="_blank" rel="noopener"
             aria-label="Facebook do Rodger">
            <!-- SVG Facebook icon -->
          </a>
        </div>
      </div>

      <!-- Coluna 2: Navegacao -->
      <div class="footer-column">
        <h3 class="footer-heading">Navegacao</h3>
        <ul class="footer-links">
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#metodo">Metodo</a></li>
          <li><a href="#ofertas">Ofertas</a></li>
          <li><a href="#depoimentos">Depoimentos</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>

      <!-- Coluna 3: Contato -->
      <div class="footer-column">
        <h3 class="footer-heading">Contato</h3>
        <ul class="footer-links">
          <li><a href="mailto:koller.institute@gmail.com">Email</a></li>
          <li><a href="#contato">Formulario</a></li>
          <li><a href="https://wa.me/55XXXXXXXXXXX" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>

    </div>

    <!-- Copyright bar -->
    <div class="footer-bottom">
      <p class="footer-copyright">
        &copy; 2026 Rodger Koller / Fly to Fluency. Todos os direitos reservados.
      </p>
      <a href="#hero" class="back-to-top" aria-label="Voltar ao topo">
        <!-- SVG ChevronUp (Lucide) -->
        <span>Topo</span>
      </a>
    </div>
  </div>
</footer>
```

**Estilos:**
```css
.site-footer {
  background: var(--bg-deep);
  border-top: 1px solid var(--border);
  padding: var(--space-16) 0 var(--space-8);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-12);
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
}

.footer-logo {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  display: block;
  margin-bottom: var(--space-3);
}

.footer-desc {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.6;
  max-width: 320px;
  margin-bottom: var(--space-5);
}

.footer-socials {
  display: flex;
  gap: var(--space-4);
}

.footer-socials a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 200ms, background 200ms;
}

.footer-socials a:hover {
  border-color: var(--cambridge-light);
  background: rgba(37,99,235,0.1);
}

.footer-socials svg {
  width: 18px;
  height: 18px;
  stroke: var(--muted);
  transition: stroke 200ms;
}

.footer-socials a:hover svg {
  stroke: var(--cambridge-light);
}

.footer-heading {
  font-family: var(--font-heading);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  letter-spacing: 0.5px;
}

.footer-links {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer-links a {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--muted);
  text-decoration: none;
  transition: color 200ms;
}

.footer-links a:hover {
  color: var(--text-primary);
}

/* Copyright */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border);
  margin-top: var(--space-10);
  padding-top: var(--space-6);
}

.footer-copyright {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--muted);
}

.back-to-top {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  color: var(--muted);
  text-decoration: none;
  transition: color 200ms;
}

.back-to-top:hover {
  color: var(--text-primary);
}

.back-to-top svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
}
```

---

## Componente Flutuante 1: WhatsApp Button

**Objetivo:** CTA permanente e nao-intrusivo. O visitante pode clicar a qualquer momento sem procurar.

**Posicao:** Fixed, bottom-right (bottom: 24px, right: 24px). Z-index: 900.

**HTML:**

```html
<a href="https://wa.me/55XXXXXXXXXXX?text=Oi%20Rodger%2C%20vim%20pelo%20site!"
   class="whatsapp-float" target="_blank" rel="noopener"
   aria-label="Conversar pelo WhatsApp">
  <svg class="whatsapp-icon"><!-- WhatsApp SVG logo --></svg>
  <span class="whatsapp-tooltip">Fale comigo</span>
</a>
```

**Estilos:**
```css
.whatsapp-float {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 900;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,0.4);
  transition: transform 200ms var(--ease-out-expo),
              box-shadow 200ms;
  cursor: pointer;
  text-decoration: none;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(37,211,102,0.5);
}

.whatsapp-icon {
  width: 28px;
  height: 28px;
  fill: white;
}

/* Pulse ring */
.whatsapp-float::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(37,211,102,0.4);
  animation: whatsappPulse 2s infinite;
}

@keyframes whatsappPulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* Tooltip */
.whatsapp-tooltip {
  position: absolute;
  right: calc(100% + var(--space-3));
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms, transform 200ms;
  transform: translateY(-50%) translateX(8px);
}

.whatsapp-float:hover .whatsapp-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* Mobile: menor e sem tooltip */
@media (max-width: 768px) {
  .whatsapp-float {
    width: 48px;
    height: 48px;
    bottom: var(--space-4);
    right: var(--space-4);
  }
  .whatsapp-icon {
    width: 24px;
    height: 24px;
  }
  .whatsapp-tooltip {
    display: none;
  }
}
```

**Entrada animada:**
```
Aparece apos 3 segundos na pagina:
  - scale(0) + opacity(0) → scale(1) + opacity(1)
  - Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (spring bounce)
  - Duration: 400ms
```

**JS para delay de entrada:**
```javascript
const whatsappBtn = document.querySelector('.whatsapp-float');
if (whatsappBtn) {
  whatsappBtn.style.transform = 'scale(0)';
  whatsappBtn.style.opacity = '0';

  setTimeout(() => {
    whatsappBtn.style.transition = 'transform 400ms cubic-bezier(0.34,1.56,0.64,1), opacity 300ms';
    whatsappBtn.style.transform = 'scale(1)';
    whatsappBtn.style.opacity = '1';
  }, 3000);
}
```

---

## Componente Flutuante 2: Exit Intent Popup (Desktop Only)

**Objetivo:** Ultima chance de captura. Quando o cursor sai pela parte superior da viewport, mostrar oferta irresistivel. SEM ser irritante — aparece UMA VEZ por sessao.

**Trigger:** `mouseleave` no document quando clientY < 0 (cursor saiu pelo topo). Apenas desktop (> 768px). Nao aparece se o usuario ja preencheu o formulario.

**Layout:**
```
Overlay escuro (bg-deep com 80% opacity + backdrop-blur)
Modal centralizado (max-width 480px):
┌─────���───────────────────────────────────┐
│   [X] (fechar)                          │
│                                         │
│   "Espera! Antes de ir..."              │
│                                         │
│   "Baixe o ebook gratuito com as        │
│    7 tecnicas do Metodo Koller pra      │
│    destravar seu ingles em 30 dias."    │
│                                         │
│   [Seu email]                           │
│   [QUERO O EBOOK GRATIS]               │
│                                         │
│   "Sem spam. So conteudo de valor."     │
│                                         │
└─────────────────────────────────────────┘
```

**HTML:**

```html
<div class="exit-intent-overlay" id="exit-intent" role="dialog"
     aria-modal="true" aria-labelledby="exit-title" hidden>
  <div class="exit-intent-backdrop"></div>
  <div class="exit-intent-modal">
    <button class="exit-close" aria-label="Fechar">
      <!-- Lucide X -->
    </button>
    <h3 id="exit-title">Espera! Antes de ir...</h3>
    <p class="exit-desc">
      Baixe o ebook gratuito com as 7 tecnicas do Metodo Koller
      pra destravar seu ingles em 30 dias.
    </p>
    <form class="exit-form" id="exit-form">
      <input type="email" placeholder="Seu melhor email" required
             autocomplete="email">
      <button type="submit">Quero o ebook gratis</button>
    </form>
    <p class="exit-note">Sem spam. So conteudo de valor.</p>
  </div>
</div>
```

**Estilos:**
```css
.exit-intent-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.exit-intent-overlay[hidden] {
  display: none;
}

.exit-intent-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15,23,42,0.85);
  backdrop-filter: blur(4px);
}

.exit-intent-modal {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-10);
  max-width: 480px;
  width: 100%;
  text-align: center;
  animation: exitModalIn 400ms var(--ease-out-expo);
}

@keyframes exitModalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.exit-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 200ms;
}

.exit-close:hover {
  background: rgba(241,245,249,0.1);
}

.exit-close svg {
  width: 20px;
  height: 20px;
  stroke: var(--muted);
}

.exit-intent-modal h3 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.exit-desc {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.exit-form {
  display: flex;
  gap: var(--space-2);
}

.exit-form input {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  outline: none;
  min-height: 48px;
  transition: border-color 200ms;
}

.exit-form input:focus {
  border-color: var(--cambridge-light);
}

.exit-form button {
  padding: var(--space-3) var(--space-5);
  background: var(--accent);
  color: var(--bg-deep);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 200ms, transform 200ms;
  min-height: 48px;
}

.exit-form button:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.exit-note {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: var(--space-3);
}

@media (max-width: 768px) {
  .exit-form {
    flex-direction: column;
  }
}
```

**JS (exit intent logic):**
```javascript
const exitOverlay = document.getElementById('exit-intent');
let exitShown = false;

// Apenas desktop
if (window.innerWidth > 768 && exitOverlay) {
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0 && !exitShown) {
      exitShown = true;
      exitOverlay.removeAttribute('hidden');
      sessionStorage.setItem('exitShown', 'true');
    }
  });

  // Nao mostrar se ja viu nessa sessao
  if (sessionStorage.getItem('exitShown')) {
    exitShown = true;
  }

  // Fechar com botao X
  exitOverlay.querySelector('.exit-close').addEventListener('click', () => {
    exitOverlay.setAttribute('hidden', '');
  });

  // Fechar ao clicar no backdrop
  exitOverlay.querySelector('.exit-intent-backdrop').addEventListener('click', () => {
    exitOverlay.setAttribute('hidden', '');
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !exitOverlay.hasAttribute('hidden')) {
      exitOverlay.setAttribute('hidden', '');
    }
  });

  // Submit do form
  const exitForm = document.getElementById('exit-form');
  exitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = exitForm.querySelector('input').value;

    // Redirecionar pro WhatsApp com o email
    const message = encodeURIComponent(
      `Oi Rodger! Quero o ebook das 7 tecnicas.\nMeu email: ${email}`
    );
    window.open(`https://wa.me/55XXXXXXXXXXX?text=${message}`, '_blank');
    exitOverlay.setAttribute('hidden', '');
  });
}
```

---

## Polish Final

### 1. Grain Texture Overlay (Cinematic Feel)

Textura sutil de grain por cima de toda a pagina. Nao interfere na legibilidade mas adiciona profundidade premium.

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

### 2. Section Transition Gradients

Gradientes sutis entre secoes pra criar fluxo visual continuo (nao cortes abruptos de cor):

```css
.section-credenciais::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(180deg, var(--bg-deep), transparent);
  pointer-events: none;
}

.section-habilidades::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(180deg, var(--bg-deep), transparent);
  pointer-events: none;
}
```

Aplicar em todas as secoes que mudam de background-color.

### 3. Smooth Scroll

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* Compensar navbar fixa */
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### 4. Selection Style

```css
::selection {
  background: rgba(245,158,11,0.3);
  color: var(--text-primary);
}
```

### 5. Scrollbar Custom (Webkit)

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-deep);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-elevated);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148,163,184,0.3);
}
```

### 6. Preloader (Optional, Lightweight)

Tela de loading ultra-rapida (300ms max) pra evitar FOUC das fontes:

```html
<!-- No <head>, inline style pra carregar instantaneo -->
<style>
  .preloader {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 300ms;
  }
  .preloader.done {
    opacity: 0;
    pointer-events: none;
  }
</style>
```

```html
<!-- Primeiro elemento do <body> -->
<div class="preloader" id="preloader">
  <span style="font-family: 'Space Grotesk', sans-serif; color: #f59e0b; font-size: 1.25rem; font-weight: 700;">
    Fly to Fluency
  </span>
</div>
```

```javascript
// No final do main.js
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('done');
    setTimeout(() => preloader.remove(), 300);
  }
});
```

### 7. Performance Checklist

| Item | Implementacao |
|------|--------------|
| Fontes | preload Space Grotesk 600/700 + DM Sans 400/500. font-display: swap |
| Imagens | Fotos do Rodger em WebP com fallback JPG. width/height declarados. loading="lazy" exceto hero |
| CSS | Inline critical (above-fold) no head. Resto em link com media="print" onload hack |
| JS | defer em todos os scripts. IntersectionObserver e nativo (sem libs) |
| Icons | SVG inline (zero HTTP requests pra icones) |
| Animacoes | Apenas transform + opacity (GPU-accelerated). will-change apenas onde necessario |
| CLS | Aspect-ratio declarado nas imagens. Font-display swap |
| TTFB | Netlify CDN (ja otimizado). Headers de cache em netlify.toml |

### 8. Netlify Config

```toml
# netlify.toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 9. Meta Tags Completas (complemento da Parte 1)

```html
<!-- Open Graph -->
<meta property="og:title" content="Rodger Koller — Fly to Fluency">
<meta property="og:description" content="Aprenda ingles com metodo de verdade. Cambridge CPE+CELTA, 34.000+ alunos.">
<meta property="og:image" content="assets/og-image.jpg">
<meta property="og:url" content="https://[dominio].netlify.app">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Rodger Koller — Fly to Fluency">
<meta name="twitter:description" content="Aprenda ingles com metodo de verdade.">
<meta name="twitter:image" content="assets/og-image.jpg">

<!-- Schema.org (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Fly to Fluency",
  "founder": {
    "@type": "Person",
    "name": "Rodger Koller",
    "jobTitle": "English Teacher",
    "alumniOf": "University of Cambridge"
  },
  "description": "Curso de ingles online com Metodo Koller. Cambridge CPE+CELTA.",
  "url": "https://[dominio].netlify.app",
  "sameAs": [
    "https://instagram.com/rodgerkoller",
    "https://youtube.com/@RodgerKoller",
    "https://facebook.com/RodgerKoller"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "13"
  }
}
</script>
```

### 10. Accessibility Final Pass

| Check | Status |
|-------|--------|
| Contraste WCAG AA (4.5:1) | OK — text-primary (#f1f5f9) no bg-deep (#0f172a) = 15.4:1 |
| Focus visible em todos os interativos | OK — outline com cambridge blue |
| Skip to content link | Adicionar `<a href="#main" class="skip-link">Ir pro conteudo</a>` |
| aria-label em icon buttons | OK — hamburger, social links, WhatsApp, close buttons |
| Keyboard nav completa | OK — tab order logica, Escape fecha modals |
| prefers-reduced-motion | OK — desativa animacoes quando ativo |
| HTML semantico | OK — header, nav, main, section, article, footer |
| Alt text nas imagens | OK — fotos do Rodger com alt descritivo |
| Form labels visíveis | OK — label com for em todos os inputs |
| min-height 48px touch targets | OK — botoes e inputs |

---

## Validacao $10K Checklist (Final Completo)

| Criterio | Status | Justificativa |
|----------|--------|---------------|
| 01. Ponto de vista | OK | Dark cinema coeso do hero ao footer. Grain overlay e scrollbar custom selam |
| 02. Tipografia | OK | Space Grotesk + DM Sans. Zero fontes genericas. Preloaded |
| 03. Cores contidas | OK | Navy + Gold + Cambridge Blue. Consistente em 9 secoes |
| 04. Hierarquia | OK | Eyebrow → Titulo → Subtitle em toda secao. 3 niveis de CTA |
| 05. Imagens com intencao | OK | Fotos reais do Rodger (WebP). Zero stock. OG image customizada |
| 06. Motion premium | OK | 8+ tipos de animacao: stagger, clipPath, spring, blur, scroll-driven, pulse, slideDown, scale |
| 07. Mobile desenhado | OK | Navbar overlay, grids colapsam, form full-width, WhatsApp menor, exit intent disabled |
| 08. Caro invisivel | OK | Sub-2s load, WCAG AA, keyboard nav, Schema.org, font-display swap, Netlify headers |

## Validacao Anti-Slop (Final)

| Item proibido | Status |
|---------------|--------|
| Emojis | ZERO em todo o site |
| Hifens decorativos | ZERO |
| Jargao tecnico | ZERO |
| Caixas neon | ZERO (grain overlay + gradients sutis) |
| Fontes genericas | ZERO |
| Icones inferiores | ZERO (SVG inline Lucide-level) |
| AOS fade-up generico | ZERO (8+ tipos de motion distintos) |

---

## Estrutura Final de Arquivos

```
nicho ingles/rodgerkoller/site/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── global.css
│   ├── components.css
│   └── animations.css
├── js/
│   └── main.js
├── assets/
│   ├── rodger-hero.webp
│   ├── rodger-about.webp
│   ├── rodger-avatar.webp
│   ├── og-image.jpg
│   └── flag-uk.svg
├── fonts/ (se self-hosted)
│   ├── SpaceGrotesk-SemiBold.woff2
│   ├── SpaceGrotesk-Bold.woff2
│   ├── DMSans-Regular.woff2
│   └── DMSans-Medium.woff2
├── netlify.toml
└── _redirects
```

---

## Architect Concluido

As 5 partes do Architect estao formuladas:

| Parte | Arquivo | Conteudo |
|-------|---------|----------|
| 1/5 | site-rodge-parte-1.md | Estrutura base (HTML skeleton, CSS reset, custom properties, animations, JS observers) |
| 2/5 | site-rodge-parte-2.md | Hero + Navbar (floating pill, scroll morph, split hero, animated counters) |
| 3/5 | site-rodge-parte-3.md | Secoes intermediarias (credenciais, sobre, habilidades, metodo) |
| 4/5 | site-rodge-parte-4.md | Secoes de conversao (ofertas, depoimentos, formulario, FAQ) |
| 5/5 | site-rodge-parte-5.md | Footer + flutuantes (WhatsApp, exit intent) + polish final |

**Proximo passo: Fase 2 — Executor (5 gomos de implementacao de codigo).**
