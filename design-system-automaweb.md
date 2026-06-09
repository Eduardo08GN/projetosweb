# Design System — Plataforma AutomaWeb

> Enterprise minimalista. Premium. Animações fluidas.
> Inspiração: Eleven Labs, Linear, Vercel Dashboard.
> Stack: Next.js 14 + Tailwind + shadcn/ui + 21st Dev + Framer Motion.

---

## Princípios

1. **Menos é mais.** Cada elemento na tela precisa justificar sua existência
2. **Whitespace é design.** Espaço vazio transmite premium
3. **Movimento com propósito.** Animação comunica estado, não decora
4. **Tipografia carrega tudo.** Hierarquia clara, sem ruído visual
5. **Cor é escassa.** Neutros dominam, cor aparece com intenção

---

## Paleta de cores

### Neutros (base de tudo)

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg` | `#FAFAFA` | Fundo da página |
| `--bg-card` | `#FFFFFF` | Cards, modais, painéis |
| `--bg-subtle` | `#F4F4F5` | Fundo de seções alternadas, inputs |
| `--border` | `#E4E4E7` | Bordas de cards, separadores |
| `--border-hover` | `#D4D4D8` | Bordas em hover |
| `--text` | `#09090B` | Texto principal |
| `--text-secondary` | `#71717A` | Texto de apoio, labels, timestamps |
| `--text-muted` | `#A1A1AA` | Placeholders, texto desabilitado |

### Accent (uma cor, usada com intenção)

| Token | Hex | Uso |
|-------|-----|-----|
| `--accent` | `#18181B` | Botão primário, links, elementos ativos |
| `--accent-hover` | `#27272A` | Hover do primário |
| `--accent-foreground` | `#FAFAFA` | Texto sobre accent |

### Semânticas (status)

| Token | Hex | Fundo | Uso |
|-------|-----|-------|-----|
| `--success` | `#16A34A` | `#F0FDF4` | Publicado, ativo, pago, conectado |
| `--warning` | `#CA8A04` | `#FEFCE8` | Pendente, aguardando, expirando |
| `--danger` | `#DC2626` | `#FEF2F2` | Erro, cancelado, atrasado, desconectado |
| `--info` | `#2563EB` | `#EFF6FF` | Em produção, agendado, informativo |

### Tags de status do pipeline (fundo sólido, texto sólido)

| Status | Fundo | Texto |
|--------|-------|-------|
| BACKLOG | `#F4F4F5` | `#52525B` |
| EM PRODUCAO | `#DBEAFE` | `#1E40AF` |
| REVISAO INTERNA | `#E0E7FF` | `#3730A3` |
| AGUARDANDO CLIENTE | `#FEF9C3` | `#854D0E` |
| APROVADO | `#DCFCE7` | `#166534` |
| AGENDADO | `#F0F9FF` | `#075985` |
| PUBLICADO | `#F0FDF4` | `#16A34A` |
| AJUSTE PEDIDO | `#FEF2F2` | `#991B1B` |

Todas as tags: `font-weight: 500`, `font-size: 12px`, `padding: 4px 10px`,
`border-radius: 6px`. Sem dot indicator. Sem borda. Fundo sólido.

---

## Tipografia

### Fonte

**Plus Jakarta Sans** (única fonte em toda a plataforma)

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

```js
// tailwind.config.js
fontFamily: {
  sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
}
```

### Escala tipográfica

| Elemento | Tamanho | Peso | Line-height | Tracking |
|----------|---------|------|-------------|----------|
| H1 (título de página) | 28px | 700 | 1.2 | -0.02em |
| H2 (título de seção) | 22px | 600 | 1.3 | -0.01em |
| H3 (subtítulo, card) | 16px | 600 | 1.4 | 0 |
| Body | 14px | 400 | 1.6 | 0 |
| Body medium | 14px | 500 | 1.6 | 0 |
| Small (labels, meta) | 12px | 500 | 1.4 | 0.01em |
| Overline (kicker, tag) | 11px | 600 | 1.2 | 0.05em |

### Regras

- Títulos com tracking negativo (apertado), body com tracking neutro
- Nunca usar peso abaixo de 400 (sem light/thin)
- Nunca usar tamanho abaixo de 11px
- Números em tabelas e métricas: `font-variant-numeric: tabular-nums`

---

## Espaçamento

### Base: 4px

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Gap mínimo entre ícone e texto |
| `space-2` | 8px | Gap entre elementos inline |
| `space-3` | 12px | Padding interno de tags, badges |
| `space-4` | 16px | Padding de inputs, gap de grid |
| `space-5` | 20px | Padding interno de cards |
| `space-6` | 24px | Gap entre seções dentro de card |
| `space-8` | 32px | Gap entre cards |
| `space-10` | 40px | Margin entre seções da página |
| `space-16` | 64px | Padding da página (desktop) |

### Layout

- Sidebar: `240px` fixo (colapsável pra `64px` em mobile)
- Container principal: `max-width: 1200px`, centrado
- Grid de cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Kanban: colunas com `min-width: 280px`, scroll horizontal

---

## Componentes

### Botões

Sempre sólidos. Sem ghost. Sem outlined.

```
PRIMÁRIO
  Fundo: #18181B (accent)
  Texto: #FAFAFA
  Hover: #27272A (escurece levemente)
  Border-radius: 8px
  Padding: 10px 16px
  Font: 14px, weight 500
  Transição: background 150ms ease

SECUNDÁRIO
  Fundo: #F4F4F5
  Texto: #18181B
  Hover: #E4E4E7
  Mesmo radius e padding

DESTRUTIVO
  Fundo: #DC2626
  Texto: #FFFFFF
  Hover: #B91C1C
```

### Cards

```
Fundo: #FFFFFF
Border: 1px solid #E4E4E7
Border-radius: 12px
Shadow: 0 1px 2px rgba(0,0,0,0.04)
Padding: 20px
Hover (se clicável): border-color #D4D4D8, shadow 0 2px 8px rgba(0,0,0,0.06)
Transição: border-color 150ms, box-shadow 200ms
```

### Inputs

```
Fundo: #FFFFFF
Border: 1px solid #E4E4E7
Border-radius: 8px
Padding: 10px 12px
Font: 14px
Focus: border-color #18181B, ring 2px #18181B/10%
Label: sempre acima, 12px weight 500, color #71717A
Placeholder: color #A1A1AA
```

### Tabelas

```
Header: fundo #F4F4F5, texto #71717A, 12px weight 600, uppercase, tracking 0.05em
Rows: fundo #FFFFFF, border-bottom 1px #E4E4E7
Row hover: fundo #FAFAFA
Padding cells: 12px 16px
Sem zebra striping
```

### Sidebar (MASTER)

```
Fundo: #FFFFFF
Border-right: 1px solid #E4E4E7
Width: 240px
Logo: topo, 32px height
Items: padding 8px 12px, border-radius 8px
Item ativo: fundo #F4F4F5, texto #09090B, weight 500
Item inativo: texto #71717A, weight 400
Item hover: fundo #F4F4F5
Ícones: Lucide, 18px, stroke-width 1.5
Sem separadores visíveis entre seções (usar whitespace)
```

### Sidebar (TENANT)

```
Mesma estrutura, menos items.
Accent sutil na guia ativa (barra lateral esquerda 2px #18181B)
```

### Modais

```
Overlay: rgba(0,0,0,0.4), backdrop-blur 4px
Card: fundo #FFFFFF, border-radius 16px, shadow-xl
Padding: 24px
Animação entrada: scale 0.95→1 + opacity 0→1, 200ms spring
Animação saída: scale 1→0.97 + opacity 1→0, 150ms ease-out
Largura: 480px (default), 640px (wide), 320px (compact)
```

### Toasts

```
Fundo: #18181B (dark)
Texto: #FAFAFA
Border-radius: 10px
Shadow: 0 8px 24px rgba(0,0,0,0.12)
Padding: 12px 16px
Posição: bottom-right
Animação entrada: slide-up 16px + fade, 300ms spring
Animação saída: slide-down 8px + fade, 200ms ease
Auto-dismiss: 4s
Máximo 1 frase. Sem título. Sem ícone decorativo.
Sucesso: barra left 3px #16A34A
Erro: barra left 3px #DC2626
Info: sem barra
```

### Kanban (Pipeline)

```
Colunas:
  Header: texto 12px weight 600 uppercase tracking 0.05em, cor da tag
  Contador: badge circular, fundo sólido, mesmo esquema de cor da tag
  Fundo: transparent (sem cor de fundo na coluna)

Cards:
  Mesmo estilo de card (branco, border, shadow-sm)
  Título: 14px weight 500
  Tenant: 12px weight 500, cor accent
  Meta: 12px, cor secondary (operador, dias)
  Drag: cursor grab, shadow-lg durante drag, scale 1.02
  Drop zone: border dashed #D4D4D8, fundo #F4F4F5/50%
```

### Calendário

```
Grid: 7 colunas, border 1px #E4E4E7
Dia atual: fundo #F4F4F5
Eventos: pill sólido com cor do tenant
  Height: 24px
  Font: 11px weight 500
  Border-radius: 4px
  Truncate com ellipsis se longo
Hover no evento: tooltip com preview do slide 1
```

---

## Animações

### Princípios

- Movimento comunica causa e efeito, nunca decora
- Duração curta: 150ms micro-interações, 200-300ms transições de estado
- Easing: spring physics (não linear, não ease genérico)
- Respeitar `prefers-reduced-motion`: desabilitar tudo exceto opacity

### Framer Motion tokens

```js
// Transições reutilizáveis
const transitions = {
  micro: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
  smooth: { type: "spring", stiffness: 400, damping: 30 },
  page: { type: "spring", stiffness: 300, damping: 35 },
  modal: {
    enter: { type: "spring", stiffness: 500, damping: 30 },
    exit: { duration: 0.15, ease: "easeOut" }
  }
}
```

### Onde animar

| Elemento | Animação | Duração |
|----------|----------|---------|
| Page enter | fade + slide-up 12px | 300ms spring |
| Card enter (lista) | fade + slide-up 8px, stagger 30ms | 200ms spring |
| Modal enter | scale 0.95→1 + fade | 200ms spring |
| Modal exit | scale 1→0.97 + fade | 150ms ease-out |
| Toast enter | slide-up 16px + fade | 300ms spring |
| Sidebar item hover | background fade | 150ms ease |
| Botão hover | background shift | 150ms ease |
| Kanban drag | scale 1.02, shadow-lg | real-time (spring) |
| Kanban drop | scale 1→1, position spring | 300ms spring |
| Número counter | count-up com easing | 600ms ease-out |
| Tab switch | underline slide + content crossfade | 200ms ease |
| Accordion | height auto + fade | 200ms ease |
| Skeleton loading | shimmer gradient 1.5s infinite | continuous |

### Onde NÃO animar

- Navegação entre páginas (sem page transition completa)
- Scroll (sem parallax, sem scroll-triggered animations)
- Texto (sem typewriter, sem letter-by-letter)
- Ícones (sem bounce, sem spin decorativo)
- Loading states além de skeleton (sem spinners elaborados)

---

## Ícones

**Lucide React** (único icon set)

```bash
npm install lucide-react
```

- Tamanho padrão: 18px (sidebar, inline), 20px (botões), 24px (destaque)
- Stroke width: 1.5 (consistente em toda a plataforma)
- Cor: herda do texto (`currentColor`)

### Ícones por guia (MASTER)

| Guia | Ícone Lucide |
|------|-------------|
| Dashboard | `LayoutDashboard` |
| Pipeline | `Columns3` |
| Calendário | `Calendar` |
| Clientes | `Users` |
| Leads | `UserPlus` |
| Automações | `Zap` |
| Campanhas | `Megaphone` |
| Sites | `Globe` |
| Financeiro | `Wallet` |
| Relatórios | `BarChart3` |
| Equipe | `UsersRound` |
| Configurações | `Settings` |

---

## Responsividade

### Breakpoints

| Nome | Valor | Contexto |
|------|-------|----------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop small |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop wide |

### Comportamento

- **Mobile (< 768px):** sidebar colapsa pra bottom nav (TENANT) ou hamburger (MASTER)
- **Tablet (768-1024px):** sidebar colapsada (ícones only, 64px)
- **Desktop (> 1024px):** sidebar expandida (240px)
- Kanban: scroll horizontal em mobile/tablet
- Tabelas: scroll horizontal com `overflow-x-auto`
- Calendário: view semanal em mobile, mensal em desktop

---

## Dependências de UI

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "tailwindcss": "3.x",
    "@radix-ui/react-*": "latest",
    "framer-motion": "11.x",
    "lucide-react": "latest",
    "sonner": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "date-fns": "latest",
    "date-fns-tz": "latest"
  }
}
```

### shadcn/ui components (instalar sob demanda)

```
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card dialog
npx shadcn-ui@latest add table tabs badge avatar dropdown-menu
npx shadcn-ui@latest add select textarea checkbox switch
npx shadcn-ui@latest add tooltip popover command calendar
npx shadcn-ui@latest add sheet skeleton separator scroll-area
```

### 21st Dev (componentes premium)

Usar via MCP `21st-dev-magic` pra:
- Kanban board (drag-and-drop)
- Calendar grid
- Data charts (métricas do dashboard)
- Animated counters (números do dashboard)
- Page transitions

---

## Estrutura de pastas (frontend)

```
src/
  app/
    master/
      layout.tsx          ← sidebar MASTER
      page.tsx            ← dashboard
      pipeline/page.tsx
      calendario/page.tsx
      clientes/
        page.tsx          ← lista
        [id]/page.tsx     ← detalhe
      leads/page.tsx
      automacoes/page.tsx
      campanhas/page.tsx
      sites/page.tsx
      financeiro/page.tsx
      relatorios/page.tsx
      equipe/page.tsx
      config/page.tsx
    tenant/
      layout.tsx          ← sidebar TENANT
      page.tsx            ← início
      conteudo/page.tsx
      contatos/page.tsx
      site/page.tsx
      relatorios/page.tsx
      conta/page.tsx
    login/page.tsx
    api/
      ...
  components/
    ui/                   ← shadcn base (button, input, card, etc.)
    master/               ← componentes do painel MASTER
    tenant/               ← componentes do painel TENANT
    shared/               ← header, sidebar, tag, toast config
  lib/
    animations.ts         ← tokens de animação Framer Motion
    cn.ts                 ← clsx + tailwind-merge utility
    auth.ts
    db.ts
```
