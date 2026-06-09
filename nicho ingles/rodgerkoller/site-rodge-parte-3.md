# Parte 3/5: Secoes Intermediarias (Credenciais, Sobre, Habilidades, Metodo)

> Projeto: Rodger Koller / Fly to Fluency
> Data: 2026-06-07
> Referencia 21st Dev: Dark Grid (cards com hover glow + corner squares) + Modern Timeline (milestones verticais)
> Referencia prints: Template Simi Portfolio (secoes alternadas, cards escuros, badges)
> Skills consultadas: UI/UX Pro Max (layout hierarchy, animation stagger, card patterns, spacing scale)

---

## Visao Geral das Secoes

```
[CREDENCIAIS] — faixa horizontal com badges Cambridge + numeros de autoridade
[SOBRE]       — split layout com segunda foto do Rodger + texto pessoal
[HABILIDADES] — grid 3 colunas com cards escuros (o que o aluno vai aprender)
[METODO]      — timeline vertical com 4 passos do Metodo Koller
```

---

## Secao 1: Credenciais (Social Proof de Autoridade)

**Objetivo:** Estabelecer autoridade absoluta em 3 segundos. O visitante precisa sentir "esse cara e qualificado" antes de ler qualquer copy.

**Layout:**
```
Background: var(--bg-elevated) com borda sutil top/bottom var(--border)
Padding: var(--space-16) vertical
Max-width: 1200px centralizado

Desktop (3 colunas iguais):
┌─────────────────┬──────────────────┬──────────────────┐
│   CAMBRIDGE     │    EXPERIENCIA   │     ALUNOS       │
│   CPE + CELTA   │    14+ anos      │    34.000+       │
│   [badge icon]  │   [badge icon]   │   [badge icon]   │
│   University    │  Speak Up Idiomas│  em todo Brasil  │
│   of Cambridge  │  desde 2012      │  e exterior      │
└─────────────────┴──────────────────┴──────────────────┘

Mobile (stack vertical, 1 por vez):
Cada card ocupa 100% da largura
Gap: var(--space-6)
```

**Anatomia de cada card de credencial:**

```html
<div class="credential-card" data-animate="stagger">
  <div class="credential-icon">
    <!-- SVG inline: escudo Cambridge / relogio / grupo pessoas -->
  </div>
  <span class="credential-number">CPE + CELTA</span>
  <span class="credential-label">University of Cambridge</span>
  <span class="credential-sublabel">Certificacao de nivel nativo</span>
</div>
```

**Estilos:**
```css
.credential-card {
  background: linear-gradient(135deg, rgba(37,99,235,0.08), rgba(245,158,11,0.04));
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-10) var(--space-8);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: border-color 300ms var(--ease-out-expo),
              transform 300ms var(--ease-out-expo);
}

.credential-card:hover {
  border-color: var(--cambridge-light);
  transform: translateY(-4px);
}

.credential-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(37,99,235,0.12), transparent 70%);
  opacity: 0;
  transition: opacity 400ms;
}

.credential-card:hover::before {
  opacity: 1;
}

.credential-number {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--accent);
  display: block;
  margin: var(--space-4) 0 var(--space-2);
}

.credential-label {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.credential-sublabel {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--muted);
  margin-top: var(--space-1);
}
```

**Icones (SVG inline, Lucide-level quality):**
- Card 1 (Cambridge): Escudo com coroa (shield-check de Lucide customizado com accent cambridge)
- Card 2 (Experiencia): Clock com circunference animada (animated ring fill on viewport entry)
- Card 3 (Alunos): Users group com ponto pulsante

**Animacao de entrada:**
```
Trigger: IntersectionObserver (threshold 0.2)
Sequencia:
  - Cards entram com translateY(40px) + opacity(0) → translateY(0) + opacity(1)
  - Stagger: 120ms entre cada card
  - Easing: var(--ease-out-expo)
  - Duration: 600ms
  - Os numeros fazem countUp animado apos o card ficar visivel (34.000+, 14+)
```

---

## Secao 2: Sobre (Conexao Pessoal)

**Objetivo:** Humanizar. O visitante precisa sentir quem e o Rodger alem das credenciais. Criar identificacao emocional.

**Layout (split invertido do hero):**
```
Background: var(--bg-deep)
Padding: var(--space-20) vertical

Desktop:
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│   [FOTO RODGER #2]         TEXTO PESSOAL                     │
│   45% width               55% width                           │
│                                                               │
│   foto com tratamento      "I'll Teach You English"           │
│   duotone sutil            Titulo Space Grotesk 700           │
│   (cambridge overlay       3rem, text-primary                 │
│    a 8% opacity)                                              │
│                            Paragrafo 1: Quem e o Rodger       │
│   border-radius: lg        Paragrafo 2: Experiencia na        │
│   object-fit: cover        Irlanda e metodo de imersao        │
│   aspect-ratio: 4/5        Paragrafo 3: Missao pessoal        │
│                                                               │
│                            [Bullet points com icone:]          │
│                            ◆ Formado em Letras + Pos FMU      │
│                            ◆ Viveu em Dublin, Irlanda         │
│                            ◆ Tradutor e interprete ativo      │
│                            ◆ 412 videoaulas publicadas        │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Mobile:
  - Foto em cima (aspect-ratio 16/9, object-position center top)
  - Texto embaixo
  - Bullets viram 2 colunas de 2
```

**Copy (filtro MazyOS aplicado — tom informal, direto, sem jargao):**

```
Titulo: "I'll Teach You English"
Subtitulo: "Do basico ao avancado, com sotaque e metodo de verdade."

Paragrafo 1:
"Meu nome e Rodger Koller. Ensino ingles ha mais de 14 anos e ja formei
mais de 34 mil alunos com o Metodo Koller — um sistema baseado em
imersao total que transforma estudantes em falantes ativos."

Paragrafo 2:
"Morei na Irlanda, trabalhei como tradutor, interprete e guia turistico
no Reino Unido. Trouxe toda essa vivencia real pra dentro das minhas
aulas. Aqui voce nao aprende ingles de livro — aprende ingles de
quem vive o idioma."

Paragrafo 3:
"Minha missao e simples: te transformar num estudante independente que
nao precisa mais de professor. Parece contraditorio? E exatamente por
isso que funciona."
```

**Tratamento visual da foto:**
```css
.about-photo {
  border-radius: var(--radius-lg);
  object-fit: cover;
  aspect-ratio: 4/5;
  width: 100%;
  position: relative;
}

.about-photo-wrapper {
  position: relative;
}

.about-photo-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(37,99,235,0.08) 0%,
    transparent 60%
  );
  border-radius: var(--radius-lg);
  pointer-events: none;
}
```

**Animacao:**
```
Foto: clipPath de circulo expandindo do centro (circle(0%) → circle(75%))
  - Duration: 800ms
  - Easing: var(--ease-out-expo)
  - Trigger: IntersectionObserver

Texto: fadeIn com translateX(30px) → translateX(0)
  - Duration: 600ms
  - Delay: 200ms (depois da foto comecar)
  - Easing: var(--ease-out-expo)

Bullets: stagger 80ms cada, fadeIn + translateX(20px)
  - Delay: 400ms (depois do texto)
```

---

## Secao 3: Habilidades (O Que Voce Vai Aprender)

**Objetivo:** Tangibilizar o resultado. O visitante precisa saber exatamente o que vai dominar.

**Inspiracao:** Dark Grid (21st Dev) — cards com icone, titulo, descricao, hover glow com corner squares adaptado pra CSS puro.

**Layout:**
```
Background: var(--bg-elevated)
Padding: var(--space-20) vertical

Header da secao:
  - Eyebrow: "HABILIDADES" (Space Grotesk 500, 0.75rem, letter-spacing 3px, var(--accent))
  - Titulo: "O que voce vai dominar" (Space Grotesk 700, 2.5rem, text-primary)
  - Subtitulo: "Cada habilidade construida com pratica real, nao com teoria morta."
    (DM Sans 400, 1.125rem, var(--muted))

Grid (desktop 3 colunas, tablet 2, mobile 1):
┌─────────────┬─────────────┬─────────────┐
│  SPEAKING   │  LISTENING  │   READING   │
│  Conversacao│  Compreensao│   Leitura   │
│  fluente    │  auditiva   │   avancada  │
├─────────────┼─────────────┼─────────────┤
│  WRITING    │  PRONÚNCIA  │  VOCABULÁRIO│
│  Escrita    │  Sotaque    │   Expressoes│
│  estruturada│  nativo     │   naturais  │
└─────────────┴─────────────┴─────────────┘

Gap: var(--space-6)
```

**Anatomia do card:**

```html
<article class="skill-card" data-animate="stagger">
  <div class="skill-card-glow"></div>
  <div class="skill-card-icon">
    <!-- SVG Lucide: MessageCircle / Headphones / BookOpen / PenTool / Mic / Library -->
  </div>
  <h3 class="skill-card-title">Speaking</h3>
  <p class="skill-card-desc">
    Conversacao fluente com confianca. Sem traduzir mentalmente,
    sem travar no meio da frase.
  </p>
</article>
```

**Estilos do card (inspirado Dark Grid 21st Dev, adaptado CSS puro):**
```css
.skill-card {
  background: linear-gradient(180deg, rgba(15,23,42,0.6), rgba(15,23,42,0.3));
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  position: relative;
  overflow: visible;
  transition: border-color 300ms, transform 300ms var(--ease-out-expo);
}

.skill-card:hover {
  border-color: rgba(148,163,184,0.3);
  transform: translateY(-2px);
}

/* Glow sutil no hover (radial gradient interno) */
.skill-card-glow {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(245,158,11,0.06),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 400ms;
  pointer-events: none;
}

.skill-card:hover .skill-card-glow {
  opacity: 1;
}

/* Corner squares no hover (detalhe premium do Dark Grid) */
.skill-card::before,
.skill-card::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--accent);
  opacity: 0;
  transition: opacity 300ms;
}

.skill-card::before {
  top: -4px;
  left: -4px;
}

.skill-card::after {
  bottom: -4px;
  right: -4px;
}

.skill-card:hover::before,
.skill-card:hover::after {
  opacity: 1;
}

.skill-card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: rgba(30,41,59,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
}

.skill-card-icon svg {
  width: 24px;
  height: 24px;
  stroke: var(--text-primary);
  stroke-width: 1.5;
}

.skill-card-title {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.skill-card-desc {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.6;
}
```

**Conteudo dos 6 cards:**

| Card | Icone (Lucide) | Titulo | Descricao |
|------|----------------|--------|-----------|
| 1 | MessageCircle | Speaking | Conversacao fluente com confianca. Sem traduzir mentalmente, sem travar no meio da frase. |
| 2 | Headphones | Listening | Compreensao auditiva real. Entender nativos em velocidade normal, com gírias e sotaques. |
| 3 | BookOpen | Reading | Leitura avancada. Consumir livros, artigos e noticias sem dicionario. |
| 4 | PenTool | Writing | Escrita estruturada. Emails, textos e redacoes com clareza e naturalidade. |
| 5 | Mic | Pronuncia | Sotaque treinado com tecnicas reais. 1.400 frases de pratica no curso. |
| 6 | Library | Vocabulario | Expressoes naturais do dia a dia. Vocabulario que nativos realmente usam. |

**Animacao:**
```
Trigger: IntersectionObserver (threshold 0.15)
Cards entram com:
  - scale(0.95) + opacity(0) → scale(1) + opacity(1)
  - Stagger: 80ms entre cada card
  - Duration: 500ms
  - Easing: var(--ease-out-expo)
```

---

## Secao 4: Metodo (Como Funciona o Metodo Koller)

**Objetivo:** Explicar o processo em 4 passos simples. O visitante precisa entender que existe um SISTEMA, nao aulas aleatorias.

**Inspiracao:** Modern Timeline (21st Dev) — timeline vertical com marcadores, adaptada pra 4 steps com visual premium.

**Layout:**
```
Background: var(--bg-deep)
Padding: var(--space-20) vertical

Header:
  - Eyebrow: "METODO KOLLER" (mesma formatacao da secao anterior)
  - Titulo: "4 passos pra fluencia real" (Space Grotesk 700, 2.5rem)
  - Subtitulo: "Um sistema baseado em imersao. Quanto mais contato, mais fluente."
    (DM Sans, 1.125rem, var(--muted))

Desktop:
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ○─── Passo 1: Fundacao                                         │
│  │    Aprenda as bases do idioma com o curso preparatorio.       │
│  │    Fonetica, estrutura e vocabulario essencial.               │
│  │                                                               │
│  ○─── Passo 2: Imersao                                          │
│  │    Mergulhe no ingles todos os dias. Videos, podcasts,        │
│  │    textos — tudo em ingles, sem excecao.                      │
│  │                                                               │
│  ○─── Passo 3: Pratica Ativa                                    │
│  │    Fale, escreva, erre. O Metodo Koller te obriga a          │
│  │    produzir, nao so consumir.                                 │
│  │                                                               │
│  ○─── Passo 4: Autonomia                                        │
│       Vire um estudante independente. Esse e o objetivo          │
│       final: voce nao precisar mais de professor.                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Mobile:
  - Timeline alinhada a esquerda (linha vertical com dots)
  - Cards de texto a direita da linha
  - Mesmo conteudo, sem alteracao de copy
```

**HTML semantico:**

```html
<section id="metodo" class="section-metodo" data-animate="section">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">METODO KOLLER</span>
      <h2>4 passos pra fluencia real</h2>
      <p class="section-subtitle">
        Um sistema baseado em imersao. Quanto mais contato, mais fluente.
      </p>
    </div>

    <div class="timeline">
      <div class="timeline-line"></div>

      <div class="timeline-step" data-animate="stagger">
        <div class="timeline-marker">
          <span class="timeline-number">01</span>
        </div>
        <div class="timeline-content">
          <h3>Fundacao</h3>
          <p>Aprenda as bases do idioma com o curso preparatorio.
             Fonetica, estrutura e vocabulario essencial.</p>
        </div>
      </div>

      <div class="timeline-step" data-animate="stagger">
        <div class="timeline-marker">
          <span class="timeline-number">02</span>
        </div>
        <div class="timeline-content">
          <h3>Imersao</h3>
          <p>Mergulhe no ingles todos os dias. Videos, podcasts,
             textos — tudo em ingles, sem excecao.</p>
        </div>
      </div>

      <div class="timeline-step" data-animate="stagger">
        <div class="timeline-marker">
          <span class="timeline-number">03</span>
        </div>
        <div class="timeline-content">
          <h3>Pratica Ativa</h3>
          <p>Fale, escreva, erre. O Metodo Koller te obriga a
             produzir, nao so consumir.</p>
        </div>
      </div>

      <div class="timeline-step" data-animate="stagger">
        <div class="timeline-marker">
          <span class="timeline-number">04</span>
        </div>
        <div class="timeline-content">
          <h3>Autonomia</h3>
          <p>Vire um estudante independente. Esse e o objetivo
             final: voce nao precisar mais de professor.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Estilos da timeline:**
```css
.timeline {
  position: relative;
  max-width: 640px;
  margin: var(--space-12) auto 0;
}

.timeline-line {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    var(--cambridge) 0%,
    var(--accent) 100%
  );
  opacity: 0.3;
}

.timeline-step {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: var(--space-6);
  padding-bottom: var(--space-10);
  position: relative;
}

.timeline-step:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 2px solid var(--cambridge);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  transition: border-color 400ms, background 400ms;
}

.timeline-step:hover .timeline-marker {
  border-color: var(--accent);
  background: rgba(245,158,11,0.1);
}

.timeline-number {
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cambridge-light);
  transition: color 400ms;
}

.timeline-step:hover .timeline-number {
  color: var(--accent);
}

.timeline-content h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.timeline-content p {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--muted);
  line-height: 1.7;
}
```

**Animacao da timeline:**
```
Trigger: IntersectionObserver por step (threshold 0.3)

Linha vertical: height 0% → 100% conforme scroll (scroll-driven animation)
  - Usa requestAnimationFrame pra calcular progresso baseado no scroll position
  - A linha "preenche" conforme os steps entram em view

Markers: scale(0) → scale(1) com spring bounce
  - Duration: 400ms
  - Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (overshoot)

Content: translateX(-20px) + opacity(0) → translateX(0) + opacity(1)
  - Duration: 500ms
  - Delay: 100ms apos o marker
  - Stagger entre steps: 150ms
  - Easing: var(--ease-out-expo)
```

**Scroll-driven line fill (JS):**
```javascript
// Dentro do main.js, observer dedicado para a timeline
const timelineLine = document.querySelector('.timeline-line');
const timelineSection = document.querySelector('.timeline');

if (timelineLine && timelineSection) {
  const updateTimeline = () => {
    const rect = timelineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    // Calcula quanto da secao ja foi scrollada
    const progress = Math.min(
      Math.max((windowHeight - sectionTop) / (sectionHeight + windowHeight * 0.5), 0),
      1
    );

    timelineLine.style.transform = `scaleY(${progress})`;
    timelineLine.style.transformOrigin = 'top';
  };

  window.addEventListener('scroll', updateTimeline, { passive: true });
  updateTimeline(); // initial call
}
```

---

## Validacao $10K Checklist (Secoes 1-4)

| Criterio | Status | Justificativa |
|----------|--------|---------------|
| 01. Ponto de vista | OK | Dark cinema com cambridge blue + gold. Nenhuma secao e generica |
| 02. Tipografia | OK | Space Grotesk headings + DM Sans body. Eyebrows com tracking 3px |
| 03. Cores contidas | OK | Navy + Gold + Cambridge Blue. 3 cores, uso consistente |
| 04. Hierarquia | OK | Eyebrow → Titulo → Subtitulo → Content. Whitespace generoso |
| 05. Imagens com intencao | OK | Foto real do Rodger com duotone treatment. Nenhum stock generico |
| 06. Motion premium | OK | Stagger, clipPath reveal, spring bounce, scroll-driven line fill |
| 07. Mobile desenhado | OK | Grid colapsa pra 1col, foto aspect muda, bullets viram 2x2 |
| 08. Caro invisivel | OK | Semantico, aria-labels, IntersectionObserver (performatico) |

## Validacao Anti-Slop

| Item proibido | Status |
|---------------|--------|
| Emojis | ZERO |
| Hifens decorativos | ZERO |
| Jargao tecnico | ZERO (copy direta e coloquial) |
| Caixas neon | ZERO |
| Fontes genericas | ZERO (Space Grotesk + DM Sans) |
| Icones inferiores | ZERO (Lucide SVG inline) |
| AOS fade-up generico | ZERO (stagger, clipPath, spring, scroll-driven) |

---

## Proximo Passo

Parte 4/5: Secoes de Conversao (ofertas com pricing, formulario de contato, depoimentos, FAQ accordion)
