# Parte 4/5: Secoes de Conversao (Ofertas, Depoimentos, Formulario, FAQ)

> Projeto: Rodger Koller / Fly to Fluency
> Data: 2026-06-07
> Referencia 21st Dev: Dark Gradient Pricing (cards com blur entrance, gradient, checklist) + Testimonials (grid masonry com blockquote + avatar)
> Referencia prints: Template Simi Portfolio (pricing cards destaque central, testimonials em grid)
> Skills consultadas: UI/UX Pro Max (forms & feedback, progressive disclosure, CTA hierarchy, card patterns)

---

## Visao Geral das Secoes

```
[OFERTAS]      — 3 pricing cards (Gratuito / Definitivo / Particular) com destaque no central
[DEPOIMENTOS]  — grid masonry com reviews reais do Hotmart + blockquote premium
[FORMULARIO]   — formulario de contato/lead capture com campos inteligentes
[FAQ]          — accordion com 6 perguntas frequentes, abrir/fechar animado
```

---

## Secao 5: Ofertas (Pricing / Planos)

**Objetivo:** Apresentar os 3 caminhos de entrada com clareza. O visitante precisa entender instantaneamente qual opcao e pra ele.

**Inspiracao:** Dark Gradient Pricing (21st Dev) — cards com gradient escuro, border sutil, feature list com check/x, CTA full-width. Card do meio destacado.

**Layout:**
```
Background: var(--bg-elevated)
Padding: var(--space-20) vertical

Header:
  - Eyebrow: "OFERTAS" (Space Grotesk 500, 0.75rem, letter-spacing 3px, var(--accent))
  - Titulo: "Escolha seu caminho pra fluencia" (Space Grotesk 700, 2.5rem)
  - Subtitulo: "Do gratuito ao acompanhamento pessoal. Cada nivel te leva mais longe."
    (DM Sans, 1.125rem, var(--muted))

Desktop (3 colunas, card central 10% maior):
┌──────────────┬────────────────────┬──────────────┐
│   GRATUITO   │    DEFINITIVO      │  PARTICULAR  │
│              │   (DESTAQUE)       │              │
│   R$ 0       │   [preco TBD]      │  Sob consulta│
│              │   Badge: Popular   │              │
│   4 items    │   7 items          │   5 items    │
│              │   scale(1.05)      │              │
│   CTA ghost  │   CTA primary      │  CTA outline │
└──────────────┴────────────────────┴──────────────┘

Mobile: stack vertical, Definitivo primeiro (reordenado via order CSS)
Gap: var(--space-6)
```

**HTML semantico:**

```html
<section id="ofertas" class="section-ofertas" data-animate="section">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">OFERTAS</span>
      <h2>Escolha seu caminho pra fluencia</h2>
      <p class="section-subtitle">
        Do gratuito ao acompanhamento pessoal. Cada nivel te leva mais longe.
      </p>
    </div>

    <div class="pricing-grid">

      <!-- Card 1: Gratuito -->
      <div class="pricing-card" data-animate="stagger">
        <div class="pricing-header">
          <span class="pricing-tier">Gratuito</span>
          <span class="pricing-price">R$ 0</span>
          <span class="pricing-period">pra sempre</span>
        </div>
        <div class="pricing-divider"></div>
        <ul class="pricing-features">
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>67 videoaulas no YouTube</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Material PDF por aula</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Curso Basico 1.0 completo</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Curso Intermediario 1.0</span>
          </li>
          <li class="feature-excluded">
            <svg><!-- Lucide X --></svg>
            <span>Acompanhamento pessoal</span>
          </li>
          <li class="feature-excluded">
            <svg><!-- Lucide X --></svg>
            <span>Correcao de exercicios</span>
          </li>
        </ul>
        <a href="https://youtube.com/@RodgerKoller" class="pricing-cta cta-ghost"
           target="_blank" rel="noopener">
          Comecar gratis
        </a>
      </div>

      <!-- Card 2: Definitivo (DESTAQUE) -->
      <div class="pricing-card pricing-card--featured" data-animate="stagger">
        <span class="pricing-badge">Popular</span>
        <div class="pricing-header">
          <span class="pricing-tier">Definitivo</span>
          <span class="pricing-price">Consultar</span>
          <span class="pricing-period">acesso vitalicio</span>
        </div>
        <div class="pricing-divider"></div>
        <ul class="pricing-features">
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>4 cursos completos em 1</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Preparatorio + Basico 3.0</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Todos os tempos verbais</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Pronuncia perfeita (1.400 frases)</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>1 ano de acompanhamento pessoal</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Plano semanal + feedback</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Correcao de exercicios pelo Rodger</span>
          </li>
        </ul>
        <a href="#contato" class="pricing-cta cta-primary">
          Quero o Definitivo
        </a>
      </div>

      <!-- Card 3: Particular -->
      <div class="pricing-card" data-animate="stagger">
        <div class="pricing-header">
          <span class="pricing-tier">Particular</span>
          <span class="pricing-price">Sob consulta</span>
          <span class="pricing-period">por aula ou pacote</span>
        </div>
        <div class="pricing-divider"></div>
        <ul class="pricing-features">
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Aulas 1-on-1 com o Rodger</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Plano 100% personalizado</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Horarios flexiveis</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Foco no seu objetivo especifico</span>
          </li>
          <li class="feature-included">
            <svg><!-- Lucide Check --></svg>
            <span>Preparatorio pra Cambridge/IELTS</span>
          </li>
        </ul>
        <a href="#contato" class="pricing-cta cta-outline">
          Agendar conversa
        </a>
      </div>

    </div>
  </div>
</section>
```

**Estilos:**
```css
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  gap: var(--space-6);
  align-items: center;
  max-width: 1000px;
  margin: var(--space-12) auto 0;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  .pricing-card--featured {
    order: -1;
  }
}

.pricing-card {
  background: linear-gradient(
    180deg,
    rgba(30,41,59,0.5) 0%,
    rgba(15,23,42,0.8) 100%
  );
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  position: relative;
  transition: border-color 300ms, transform 300ms var(--ease-out-expo);
}

.pricing-card:hover {
  border-color: rgba(148,163,184,0.2);
}

.pricing-card--featured {
  border-color: var(--accent);
  background: linear-gradient(
    180deg,
    rgba(245,158,11,0.08) 0%,
    rgba(15,23,42,0.9) 40%
  );
  transform: scale(1.02);
  box-shadow: 0 0 40px rgba(245,158,11,0.08);
}

.pricing-card--featured:hover {
  border-color: var(--accent-hover);
  transform: scale(1.04);
}

.pricing-badge {
  position: absolute;
  top: calc(-1 * var(--space-3));
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--bg-deep);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 600;
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  letter-spacing: 0.5px;
}

.pricing-tier {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 500;
  display: block;
  margin-bottom: var(--space-2);
}

.pricing-price {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.pricing-period {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--muted);
  display: block;
  margin-top: var(--space-1);
}

.pricing-divider {
  height: 1px;
  background: var(--border);
  margin: var(--space-6) 0;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-body);
  font-size: 0.875rem;
}

.feature-included svg {
  width: 16px;
  height: 16px;
  stroke: var(--accent);
  flex-shrink: 0;
}

.feature-included span {
  color: var(--text-primary);
}

.feature-excluded svg {
  width: 16px;
  height: 16px;
  stroke: var(--muted);
  opacity: 0.5;
  flex-shrink: 0;
}

.feature-excluded span {
  color: var(--muted);
  opacity: 0.6;
}

/* CTAs */
.pricing-cta {
  display: block;
  width: 100%;
  text-align: center;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 300ms var(--ease-out-expo);
}

.cta-primary {
  background: var(--accent);
  color: var(--bg-deep);
}

.cta-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245,158,11,0.25);
}

.cta-ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.cta-ghost:hover {
  border-color: var(--text-primary);
  background: rgba(241,245,249,0.05);
}

.cta-outline {
  background: transparent;
  color: var(--cambridge-light);
  border: 1px solid var(--cambridge);
}

.cta-outline:hover {
  background: rgba(37,99,235,0.1);
  border-color: var(--cambridge-light);
}
```

**Animacao:**
```
Trigger: IntersectionObserver (threshold 0.15)
Cards entram com:
  - filter: blur(4px) + opacity(0) → filter: blur(0) + opacity(1)
  - translateY(20px) → translateY(0)
  - Stagger: 150ms entre cards
  - Duration: 600ms
  - Easing: var(--ease-out-expo)
  - Card featured entra por ultimo (delay adicional 50ms) pra criar emphasis
```

---

## Secao 6: Depoimentos (Social Proof Real)

**Objetivo:** Prova social com reviews REAIS do Hotmart. Zero texto inventado. O visitante precisa ler palavras de alunos reais.

**Inspiracao:** Testimonials (21st Dev) — grid com card featured maior (row-span-2) + cards menores. Blockquote com avatar e nome.

**Layout:**
```
Background: var(--bg-deep)
Padding: var(--space-20) vertical

Header:
  - Eyebrow: "DEPOIMENTOS" (mesma formatacao)
  - Titulo: "O que dizem os alunos" (Space Grotesk 700, 2.5rem)
  - Subtitulo: "Reviews reais da Hotmart. 4.8 estrelas em 13 avaliacoes."
    (DM Sans, 1.125rem, var(--muted))

Desktop (grid masonry 3 colunas):
┌────────────────────┬──────────────┬──────────────┐
│                    │   CARD 2     │   CARD 3     │
│   CARD 1 (featured)│   Murilo     │   Tania      │
│   Gilmar           │              │              │
│   (row-span-2)     ├──────────────┼──────────────┤
│                    │   CARD 4     │   CARD 5     │
│                    │   Joao       │   Rating bar │
│                    │              │   4.8 media  │
└────────────────────┴──────────────┴──────────────┘

Mobile: stack vertical, todos os cards 100% width
```

**HTML semantico:**

```html
<section id="depoimentos" class="section-depoimentos" data-animate="section">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">DEPOIMENTOS</span>
      <h2>O que dizem os alunos</h2>
      <p class="section-subtitle">
        Reviews reais da Hotmart. 4.8 estrelas em 13 avaliacoes.
      </p>
    </div>

    <div class="testimonials-grid">

      <!-- Featured (Gilmar - review mais detalhada) -->
      <article class="testimonial-card testimonial-card--featured" data-animate="stagger">
        <div class="testimonial-stars">
          <!-- 5 SVG stars (Lucide Star filled) -->
        </div>
        <blockquote class="testimonial-quote">
          "Com certeza e o melhor e mais completo curso online para aprender
          ingles. Pela qualidade do curso achei o preco excelente, outro
          diferencial e o contato semanal que o professor tem com os alunos..."
        </blockquote>
        <footer class="testimonial-author">
          <div class="testimonial-avatar">G</div>
          <div>
            <cite class="testimonial-name">Gilmar</cite>
            <span class="testimonial-date">Junho 2021</span>
          </div>
        </footer>
      </article>

      <!-- Joao -->
      <article class="testimonial-card" data-animate="stagger">
        <div class="testimonial-stars"><!-- 5 stars --></div>
        <blockquote class="testimonial-quote">
          "O maior diferencial que encontrei no curso do Rodger e o
          acompanhamento que ele faz com todos os alunos. Cara isso e DEMAIS!!!
          O professor manda msg para vc cobrando os exercicios..."
        </blockquote>
        <footer class="testimonial-author">
          <div class="testimonial-avatar">J</div>
          <div>
            <cite class="testimonial-name">Joao</cite>
            <span class="testimonial-date">Marco 2021</span>
          </div>
        </footer>
      </article>

      <!-- Tania -->
      <article class="testimonial-card" data-animate="stagger">
        <div class="testimonial-stars"><!-- 5 stars --></div>
        <blockquote class="testimonial-quote">
          "Amei o metodo agora sei que posso aprender ingles"
        </blockquote>
        <footer class="testimonial-author">
          <div class="testimonial-avatar">T</div>
          <div>
            <cite class="testimonial-name">Tania</cite>
            <span class="testimonial-date">Marco 2021</span>
          </div>
        </footer>
      </article>

      <!-- Murilo -->
      <article class="testimonial-card" data-animate="stagger">
        <div class="testimonial-stars"><!-- 5 stars --></div>
        <blockquote class="testimonial-quote">
          "Recomendo demais pra quem quer aprender ingles de verdade com
          um professor que se importa com o progresso de cada aluno."
        </blockquote>
        <footer class="testimonial-author">
          <div class="testimonial-avatar">M</div>
          <div>
            <cite class="testimonial-name">Murilo</cite>
            <span class="testimonial-date">Marco 2021</span>
          </div>
        </footer>
      </article>

      <!-- Rating Summary Card -->
      <article class="testimonial-card testimonial-card--rating" data-animate="stagger">
        <div class="rating-number">4.8</div>
        <div class="rating-stars"><!-- 5 stars (4 full + 1 partial) --></div>
        <span class="rating-label">de 5 estrelas</span>
        <span class="rating-count">13 avaliacoes na Hotmart</span>
        <span class="rating-badge">Top Rated</span>
      </article>

    </div>
  </div>
</section>
```

**Estilos:**
```css
.testimonials-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: var(--space-4);
  max-width: 1000px;
  margin: var(--space-12) auto 0;
}

.testimonial-card--featured {
  grid-row: 1 / -1;
}

@media (max-width: 768px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  .testimonial-card--featured {
    grid-row: auto;
  }
}

.testimonial-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: border-color 300ms;
}

.testimonial-card:hover {
  border-color: rgba(148,163,184,0.2);
}

.testimonial-card--featured {
  padding: var(--space-8);
  background: linear-gradient(
    135deg,
    rgba(37,99,235,0.06) 0%,
    var(--bg-elevated) 50%
  );
}

.testimonial-stars {
  display: flex;
  gap: 2px;
}

.testimonial-stars svg {
  width: 16px;
  height: 16px;
  fill: var(--accent);
  stroke: var(--accent);
}

.testimonial-quote {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--text-primary);
  line-height: 1.7;
  font-style: normal;
  flex: 1;
}

.testimonial-card--featured .testimonial-quote {
  font-size: 1.125rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
}

.testimonial-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--cambridge), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.testimonial-name {
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  font-style: normal;
  display: block;
}

.testimonial-date {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--muted);
}

/* Rating Summary Card */
.testimonial-card--rating {
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(245,158,11,0.08) 0%,
    var(--bg-elevated) 60%
  );
}

.rating-number {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.rating-label {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--muted);
  display: block;
  margin-top: var(--space-1);
}

.rating-count {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--muted);
  display: block;
  margin-top: var(--space-2);
}

.rating-badge {
  display: inline-block;
  margin-top: var(--space-3);
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--accent);
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 1px;
  text-transform: uppercase;
}
```

**Animacao:**
```
Trigger: IntersectionObserver (threshold 0.15)
Cards entram com:
  - translateY(30px) + opacity(0) → translateY(0) + opacity(1)
  - Stagger: 100ms entre cards
  - Duration: 500ms
  - Easing: var(--ease-out-expo)
  - Card featured entra primeiro (delay 0), demais seguem em sequencia
```

---

## Secao 7: Formulario de Contato (Lead Capture)

**Objetivo:** Captar leads e direcionar pro WhatsApp. Formulario simples (3 campos max) que nao assusta. O visitante precisa sentir que e rapido e sem compromisso.

**Layout:**
```
Background: var(--bg-elevated)
Padding: var(--space-20) vertical

Desktop (split 50/50):
┌──────────────────────────────┬──────────────────────────────┐
│                              │                              │
│   TEXTO MOTIVACIONAL         │   FORMULARIO                 │
│                              │                              │
│   Titulo: "Pronto pra       │   [Nome]                     │
│    comecar?"                 │   [Email]                    │
│                              │   [Qual seu nivel?]          │
│   Subtitulo: "Me conta       │   dropdown: Iniciante /      │
│    um pouco sobre voce       │   Basico / Intermediario /   │
│    e eu te ajudo a           │   Avancado / Nao sei         │
│    escolher o melhor         │                              │
│    caminho."                 │   [BOTAO: Falar com Rodger]  │
│                              │                              │
│   ◆ Resposta em 24h         │   Nota: "Sem compromisso.    │
│   ◆ Sem compromisso         │    Respondo pessoalmente."   │
│   ◆ Atendimento pessoal     │                              │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘

Mobile: stack vertical (texto em cima, form embaixo)
```

**HTML semantico:**

```html
<section id="contato" class="section-contato" data-animate="section">
  <div class="container">
    <div class="contact-grid">

      <div class="contact-text">
        <span class="eyebrow">CONTATO</span>
        <h2>Pronto pra comecar?</h2>
        <p class="contact-subtitle">
          Me conta um pouco sobre voce e eu te ajudo a escolher o melhor caminho.
        </p>
        <ul class="contact-benefits">
          <li>
            <svg><!-- Lucide Clock --></svg>
            <span>Resposta em ate 24 horas</span>
          </li>
          <li>
            <svg><!-- Lucide Shield --></svg>
            <span>Sem compromisso nenhum</span>
          </li>
          <li>
            <svg><!-- Lucide User --></svg>
            <span>Atendimento pessoal do Rodger</span>
          </li>
        </ul>
      </div>

      <form class="contact-form" id="contact-form" action="#" method="POST">
        <div class="form-group">
          <label for="name">Seu nome</label>
          <input type="text" id="name" name="name" required
                 placeholder="Como posso te chamar?" autocomplete="name">
        </div>

        <div class="form-group">
          <label for="email">Seu email</label>
          <input type="email" id="email" name="email" required
                 placeholder="pra onde mando a resposta" autocomplete="email">
        </div>

        <div class="form-group">
          <label for="level">Qual seu nivel de ingles?</label>
          <select id="level" name="level" required>
            <option value="" disabled selected>Escolha uma opcao</option>
            <option value="iniciante">Iniciante (zero ou quase)</option>
            <option value="basico">Basico (entendo um pouco)</option>
            <option value="intermediario">Intermediario (consigo conversar)</option>
            <option value="avancado">Avancado (quero polir)</option>
            <option value="nao-sei">Nao sei dizer</option>
          </select>
        </div>

        <button type="submit" class="form-submit">
          <span class="submit-text">Falar com Rodger</span>
          <span class="submit-loading" aria-hidden="true">
            <!-- SVG spinner -->
          </span>
        </button>

        <p class="form-note">
          Sem compromisso. Respondo pessoalmente em ate 24h.
        </p>
      </form>

    </div>
  </div>
</section>
```

**Estilos:**
```css
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}

.contact-text h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  color: var(--text-primary);
  margin: var(--space-3) 0 var(--space-4);
}

.contact-subtitle {
  font-family: var(--font-body);
  font-size: 1.0625rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.contact-benefits {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-benefits li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.contact-benefits svg {
  width: 20px;
  height: 20px;
  stroke: var(--cambridge-light);
  flex-shrink: 0;
}

/* Form */
.contact-form {
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
}

.form-group {
  margin-bottom: var(--space-5);
}

.form-group label {
  display: block;
  font-family: var(--font-heading);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  transition: border-color 200ms, box-shadow 200ms;
  outline: none;
  min-height: 48px;
}

.form-group input::placeholder {
  color: var(--muted);
  opacity: 0.7;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--cambridge-light);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* chevron-down SVG */
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  cursor: pointer;
}

.form-submit {
  width: 100%;
  padding: var(--space-4);
  background: var(--accent);
  color: var(--bg-deep);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 200ms, transform 200ms, box-shadow 200ms;
  min-height: 52px;
}

.form-submit:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(245,158,11,0.3);
}

.form-submit:active {
  transform: translateY(0);
}

.form-note {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--muted);
  text-align: center;
  margin-top: var(--space-3);
}
```

**Comportamento do form (JS):**
```javascript
const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.querySelector('#name').value;
  const email = form.querySelector('#email').value;
  const level = form.querySelector('#level').value;

  // Monta mensagem pro WhatsApp
  const message = encodeURIComponent(
    `Oi Rodger! Meu nome e ${name}.\n` +
    `Email: ${email}\n` +
    `Nivel: ${level}\n\n` +
    `Vi seu site e quero saber mais sobre as aulas.`
  );

  // Redireciona pro WhatsApp (numero a definir com o Rodger)
  const whatsappURL = `https://wa.me/55XXXXXXXXXXX?text=${message}`;

  // Feedback visual antes de redirecionar
  const btn = form.querySelector('.form-submit');
  btn.classList.add('is-loading');

  setTimeout(() => {
    window.open(whatsappURL, '_blank');
    btn.classList.remove('is-loading');
    btn.querySelector('.submit-text').textContent = 'Enviado!';

    setTimeout(() => {
      btn.querySelector('.submit-text').textContent = 'Falar com Rodger';
    }, 3000);
  }, 800);
});
```

**Animacao:**
```
Texto: fadeIn + translateX(-20px) → translateX(0)
  - Duration: 500ms

Form: fadeIn + translateY(20px) → translateY(0)
  - Duration: 600ms
  - Delay: 150ms

Ambos trigger: IntersectionObserver
```

---

## Secao 8: FAQ (Perguntas Frequentes)

**Objetivo:** Eliminar objecoes. Cada pergunta derruba uma barreira de compra.

**Layout:**
```
Background: var(--bg-deep)
Padding: var(--space-20) vertical

Header centralizado + accordion abaixo
Max-width: 720px (estreito pra leitura confortavel)

Desktop/Mobile: mesmo layout (FAQ funciona igual em qualquer tela)
┌────────────────────────────────────────────────────┐
│  [+] Preciso saber algo de ingles pra comecar?     │
├────────────────────────────────────────────────────┤
│  [+] Quanto tempo leva pra ficar fluente?          │
├────────────────────────────────────────────────────┤
│  [+] O curso e todo online?                        │
├────────────────────────────────────────────────────┤
│  [+] Qual a diferenca pro YouTube gratuito?        │
├────────────────────────────────────────────────────┤
│  [+] Tem certificado?                              │
├────────────────────────────────────────────────────┤
│  [+] Posso cancelar?                               │
└────────────────────────────────────────────────────┘
```

**HTML semantico:**

```html
<section id="faq" class="section-faq" data-animate="section">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">FAQ</span>
      <h2>Perguntas frequentes</h2>
      <p class="section-subtitle">
        Duvidas? Provavelmente a resposta esta aqui.
      </p>
    </div>

    <div class="faq-list">

      <details class="faq-item" data-animate="stagger">
        <summary class="faq-question">
          <span>Preciso saber algo de ingles pra comecar?</span>
          <svg class="faq-icon"><!-- Lucide Plus --></svg>
        </summary>
        <div class="faq-answer">
          <p>Nao. O curso Basico 3.0 (incluso no Definitivo) comeca do absoluto zero.
             Se voce ja sabe algo, o modulo preparatorio te posiciona no nivel certo.</p>
        </div>
      </details>

      <details class="faq-item" data-animate="stagger">
        <summary class="faq-question">
          <span>Quanto tempo leva pra ficar fluente?</span>
          <svg class="faq-icon"><!-- Lucide Plus --></svg>
        </summary>
        <div class="faq-answer">
          <p>Depende da sua dedicacao diaria. Com o Metodo Koller, alunos dedicados
             (1-2h por dia) alcancam conversacao confiante em 8-12 meses.
             Fluencia avancada em 18-24 meses.</p>
        </div>
      </details>

      <details class="faq-item" data-animate="stagger">
        <summary class="faq-question">
          <span>O curso e todo online?</span>
          <svg class="faq-icon"><!-- Lucide Plus --></svg>
        </summary>
        <div class="faq-answer">
          <p>Sim. Videoaulas gravadas + material em PDF + acompanhamento por mensagem.
             Voce estuda no seu ritmo, de qualquer lugar. As aulas particulares
             tambem sao online (via Zoom ou Google Meet).</p>
        </div>
      </details>

      <details class="faq-item" data-animate="stagger">
        <summary class="faq-question">
          <span>Qual a diferenca pro conteudo gratuito do YouTube?</span>
          <svg class="faq-icon"><!-- Lucide Plus --></svg>
        </summary>
        <div class="faq-answer">
          <p>O YouTube e uma amostra. O Definitivo tem estrutura progressiva
             (do zero ao avancado), 1.400 frases de pronuncia, exercicios
             corrigidos pelo Rodger e 1 ano de acompanhamento pessoal semanal.
             No YouTube voce aprende fragmentos. No Definitivo voce constroi fluencia.</p>
        </div>
      </details>

      <details class="faq-item" data-animate="stagger">
        <summary class="faq-question">
          <span>Tem certificado?</span>
          <svg class="faq-icon"><!-- Lucide Plus --></svg>
        </summary>
        <div class="faq-answer">
          <p>O curso em si nao emite certificado formal. Mas o Rodger te prepara
             pra certificacoes internacionais como Cambridge (FCE, CAE, CPE) e IELTS
             nas aulas particulares, se esse for seu objetivo.</p>
        </div>
      </details>

      <details class="faq-item" data-animate="stagger">
        <summary class="faq-question">
          <span>Como funciona o acompanhamento pessoal?</span>
          <svg class="faq-icon"><!-- Lucide Plus --></svg>
        </summary>
        <div class="faq-answer">
          <p>Por 1 ano apos a inscricao, o Rodger envia plano semanal de estudos,
             corrige seus exercicios, responde duvidas e cobra sua consistencia.
             E acompanhamento real, nao bot.</p>
        </div>
      </details>

    </div>
  </div>
</section>
```

**Estilos:**
```css
.faq-list {
  max-width: 720px;
  margin: var(--space-12) auto 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.faq-item {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 200ms;
}

.faq-item:hover {
  border-color: rgba(148,163,184,0.25);
}

.faq-item[open] {
  border-color: var(--cambridge);
  background: rgba(37,99,235,0.04);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  cursor: pointer;
  list-style: none;
  user-select: none;
  min-height: 56px;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question span {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.faq-icon {
  width: 20px;
  height: 20px;
  stroke: var(--muted);
  flex-shrink: 0;
  transition: transform 300ms var(--ease-out-expo), stroke 300ms;
}

.faq-item[open] .faq-icon {
  transform: rotate(45deg);
  stroke: var(--cambridge-light);
}

.faq-answer {
  padding: 0 var(--space-6) var(--space-5);
  animation: faqSlideDown 300ms var(--ease-out-expo);
}

.faq-answer p {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--muted);
  line-height: 1.7;
}

@keyframes faqSlideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Comportamento JS (smooth open/close):**
```javascript
// Smooth accordion - fechar outros ao abrir um
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(other => {
        if (other !== item && other.open) {
          other.removeAttribute('open');
        }
      });
    }
  });
});
```

**Animacao de entrada:**
```
Trigger: IntersectionObserver (threshold 0.1)
Items entram com:
  - translateY(20px) + opacity(0) → translateY(0) + opacity(1)
  - Stagger: 60ms entre items
  - Duration: 400ms
  - Easing: var(--ease-out-expo)
```

---

## Validacao $10K Checklist (Secoes 5-8)

| Criterio | Status | Justificativa |
|----------|--------|---------------|
| 01. Ponto de vista | OK | Pricing dark gradient, testimonials com masonry, FAQ minimalista |
| 02. Tipografia | OK | Space Grotesk + DM Sans consistente. Hierarchy clara em cada secao |
| 03. Cores contidas | OK | Accent gold nos CTAs/badges, Cambridge nos focus states. 3 cores |
| 04. Hierarquia | OK | Card featured maior, CTAs com 3 niveis visuais (primary/outline/ghost) |
| 05. Imagens com intencao | OK | Avatars com iniciais + gradient (sem stock). Rating card como visual anchor |
| 06. Motion premium | OK | Blur entrance nos pricing, stagger nos depoimentos, slideDown no FAQ |
| 07. Mobile desenhado | OK | Pricing reordena (featured primeiro), grid colapsa, form full-width |
| 08. Caro invisivel | OK | Form com autocomplete, min-height 48px, aria-labels, focus visible |

## Validacao Anti-Slop

| Item proibido | Status |
|---------------|--------|
| Emojis | ZERO |
| Hifens decorativos | ZERO |
| Jargao tecnico | ZERO (copy direta, linguagem do aluno) |
| Caixas neon | ZERO (gradients sutis, borders discretas) |
| Fontes genericas | ZERO |
| Icones inferiores | ZERO (Lucide SVG: Check, X, Star, Clock, Shield, User, Plus) |
| AOS fade-up generico | ZERO (blur entrance, stagger, slideDown, translateX/Y variados) |

---

## Proximo Passo

Parte 5/5: Footer + Componentes Flutuantes (WhatsApp button, exit intent popup) + Polish Final (transicoes entre secoes, particles/grain overlay, performance audit)
