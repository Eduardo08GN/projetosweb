# Identidade visual — Rodger Koller / Fly to Fluency

> Como a marca aparece em tudo que o MazyOS gera.
> As skills de conteúdo, carrossel e post leem esse arquivo antes de criar qualquer visual.

---

## Cores

- **Fundo principal:** Navy deep `#0f172a` (dark premium)
- **Cor de destaque / CTA:** UK Red `#C8102E`
- **Cor secundaria:** Cambridge Blue `#012169` (UK flag blue)
- **Texto principal:** Off-white `#FAFAF7`
- **Texto sobre fundo claro:** `#1A1A1A`
- **Fundo alternativo / cards:** `#1e293b` (slate-800)
- **Accent suave:** Gold `#f59e0b` (uso pontual, selos, badges)
- **Muted text:** `rgba(255,255,255,0.6)`

- **Cor proibida:** Neon de qualquer tipo. Nada de `rgba(COR,0.1)+rgba(COR,0.2)` (anti-slop).

---

## Tipografia

- **Titulos e destaques:** Space Grotesk (Google Fonts) — pesos 500/600/700
- **Corpo, subtitulos e botoes:** DM Sans (Google Fonts) — pesos 400/500/600
- **Peso do titulo:** 700 pra headlines, 600 pra subheadings
- **Tamanho base mobile:** 16px body, 32-40px headlines
- **Tamanho base desktop:** 18px body, 48-64px headlines
- **Letter-spacing titulos:** -0.02em (apertado)
- **Line-height body:** 1.6

- **PROIBIDO:** Inter, Roboto, ou qualquer fonte generica de template

---

## Estilo geral

- Dark premium cinematografico — nao dark mode generico
- Atmosferico, profundo, com camadas de profundidade sutil
- Paleta UK flag (navy + red + white) como fio condutor
- Avatar cartoon como elemento de identidade reconhecivel
- Sem clip-art, sem emoji decorativo, sem gradiente arco-iris

---

## Elementos-chave

- Bordas: `1px solid rgba(255,255,255,0.1)` (sutil, quase invisivel)
- Border-radius dos cards: `12px`
- Botoes: `border-radius: 8px`, fundo red `#C8102E`, hover escurece 10%
- Sombras: `0 4px 20px rgba(0,0,0,0.3)` (profundidade real, nao flat)
- Shape dividers: ondas ou diagonais suaves entre secoes
- Marquee de bandeiras UK como elemento recorrente
- Stats em destaque: numeros grandes + label pequeno

---

## Carrossel — regras especificas

- **Formato:** 1080x1350 (4:5 retrato) — sempre
- **Fundo principal slides:** Navy `#0f172a` alternando com `#1e293b`
- **Slide CTA final:** fundo UK Red `#C8102E` com logo centralizado
- **Logo:** top-left em todos os slides + counter top-right
- **Avatar cartoon:** usar como elemento visual na capa ou CTA
- **Ritmo:** alternar escuro ↔ menos escuro ↔ accent. Nunca dois slides iguais seguidos
- **Copy:** portugues com termos em ingles mantidos naturalmente

---

## O que NUNCA fazer

- Emojis em qualquer contexto visual
- Hifens em copy
- Neon boxes (rgba(COR,0.1) + rgba(COR,0.2) pattern)
- Inter ou Roboto
- Icones abaixo de Lucide
- AOS generico (animacoes de scroll identicas)
- Backgrounds claros como padrao (dark premium e a regra)
- Fotos stock genericas

---

## Logo

- **Arquivo:** Avatar cartoon (boneco com jaqueta jeans, camiseta preta com caveira, brinco, cabelo cacheado)
- **Texto:** "Fly to Fluency ®" em Space Grotesk weight 600
- **Versao pra fundo escuro:** Logo branco
- **Onde usar:** slide final do carrossel (CTA), header de propostas, slides de apresentacao
- **Tamanho sugerido:** largura entre 120-200px nos HTMLs

---

## AutomaWeb — Regras de plataforma

### Modais
- **Todo modal deve ter overlay com blur.** Overlay `bg-black/40` + `backdrop-blur-sm`. Sem excecao.
- Dialogs e Sheets seguem o mesmo padrao de overlay.
- Animacao de entrada: fade-in + zoom-in-95. Saida: fade-out + zoom-out-95.

### Tokens visuais
- Fundo: `#FAFAFA`
- Cards: `#FFFFFF` com border `#E4E4E7` e shadow `0_1px_2px_rgba(0,0,0,0.04)`
- Texto principal: `#09090B`
- Texto muted: `#71717A`
- Accent/botoes: `#18181B` (solid, nunca outline como primario)
- Tags: solid (nunca outline)
- Fonte: Plus Jakarta Sans
- Tema: light only

---

## Observacoes adicionais

- Sempre gerar imagens via prompt descrevendo o avatar (ver scripts/gerar-imagem-cf.js)
- Prompt base do avatar: "Cartoon character illustration, young Brazilian man with short curly dark hair, light stubble beard, silver hoop earring on right ear, wearing a dark denim jacket over a black t-shirt with white skull graphic, teal blue-green background, bold cartoon style with thick outlines, 2D flat illustration"
- UK flag como motivo visual recorrente (marquee, badges, backgrounds sutis)
