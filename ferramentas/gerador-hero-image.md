# Ferramenta Protocolar — Gerador de Hero Image

> **Tipo:** Ferramenta reutilizável MazyOS
> **Função:** Receber foto do cliente como input → gerar prompt otimizado para hero section de site
> **Gerador recomendado:** Ideogram / Midjourney / DALL-E / Flux (qualquer gerador com suporte a image-to-image)
> **Última atualização:** 06/06/2026

---

## COMO USAR

### Passo 1 — Input

Forneça ao Claude:
1. **Foto do cliente** (print de vídeo, foto profissional ou selfie)
2. **Lado do posicionamento** (direito ou esquerdo) — padrão: direito
3. **Estilo da marca** (cores, tom, elementos visuais — se houver `design-guide.md`, usar como base)
4. **Nicho/profissão** (professor de inglês, nutricionista, advogado, etc.)
5. **Elementos especiais** (avatar cartoon, mascote, ícones — se houver)

### Passo 2 — Análise da foto

O Claude analisa a imagem e extrai:

| Atributo | O que observar |
|----------|---------------|
| **Rosto** | Formato, tom de pele, expressão, barba/maquiagem, acessórios (brinco, óculos) |
| **Cabelo** | Cor, textura, corte, estilo (cacheado, liso, raspado, etc.) |
| **Roupa** | Tipo, cor, camadas, estilo (casual, formal, uniforme) |
| **Corpo** | Enquadramento visível (rosto, busto, meio corpo) |
| **Cenário** | Fundo original (útil pra manter contexto profissional) |
| **Elementos visuais** | Logo, avatar, mascote, objetos de marca visíveis |

### Passo 3 — Montagem do prompt

Usar o template abaixo, preenchendo as variáveis com os dados extraídos.

---

## TEMPLATE DO PROMPT

```
Professional hero image for a [NICHO] website, designed for text overlay
on the [LADO_OPOSTO] side.

--- PESSOA ---
[DESCRIÇÃO_FÍSICA]: [idade aparente], [etnia/tom de pele], [cabelo: cor,
textura, corte], [expressão facial], wearing [ROUPA_DETALHADA],
[ACESSÓRIOS].

Positioned on the [LADO] THIRD of the frame, body angled slightly toward
the [LADO_OPOSTO], looking directly at camera with a [EXPRESSÃO]
expression. Shot from [ENQUADRAMENTO].

--- ESPAÇO PARA TEXTO ---
The [LADO_OPOSTO] TWO-THIRDS of the image is intentionally clean and
minimal — a soft gradient background fading from [COR_FUNDO_1] to
[COR_FUNDO_2], with generous negative space for headline text and CTA
buttons. No objects, no clutter, no text on that side.

--- FUNDO ---
Behind the person on their side, subtle out-of-focus elements:
[ELEMENTOS_CONTEXTUAIS_BLUR] creating [NICHO] context without
distraction, soft bokeh circles in [COR_BOKEH_1] and [COR_BOKEH_2]
tones.

--- ELEMENTOS ESPECIAIS (se houver) ---
[DESCRIÇÃO_AVATAR_OU_MASCOTE], peeks playfully from behind their
[OMBRO] shoulder, smaller in scale, [AÇÃO]. The illustration is crisp
while the background stays soft.

--- EFEITOS TÉCNICOS ---
Professional fade effect: the [LADO] edge of the image softly fades to
white/transparent, and the bottom edge has a subtle gradient fade to
white, allowing seamless integration with a website background.

Style: editorial portrait photography [COM_ELEMENTO_ILUSTRADO],
hyperrealistic skin and fabric textures on the person, cinematic shallow
depth of field (f/1.8), soft studio key light from the [LADO_OPOSTO]
with a subtle [COR_RIM_LIGHT] rim light on the [LADO] edge of the face,
clean modern aesthetic. 16:9 aspect ratio, 4K resolution.

The overall mood is premium, approachable, and professional —
[FRASE_MOOD_NICHO].
```

---

## VARIÁVEIS — REFERÊNCIA RÁPIDA

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NICHO` | Profissão/área do cliente | "English language course" |
| `LADO` | Onde a pessoa fica (RIGHT ou LEFT) | "RIGHT" |
| `LADO_OPOSTO` | Lado livre pro texto | "LEFT" |
| `DESCRIÇÃO_FÍSICA` | Características físicas extraídas da foto | "A young Brazilian man in his late 20s" |
| `ROUPA_DETALHADA` | Roupas visíveis na foto | "a dark navy blue button-up shirt over a black t-shirt" |
| `ACESSÓRIOS` | Brincos, óculos, relógio, etc. | "small silver earring on the left ear" |
| `EXPRESSÃO` | Tipo de expressão | "warm confident" / "welcoming" / "serious professional" |
| `ENQUADRAMENTO` | Corte da foto | "chest up" / "waist up" / "full body" |
| `COR_FUNDO_1` | Cor dominante do gradiente | "warm white" |
| `COR_FUNDO_2` | Cor secundária do gradiente | "very light sky blue" |
| `ELEMENTOS_CONTEXTUAIS_BLUR` | Objetos desfocados que dão contexto do nicho | "a blurred whiteboard edge with barely visible blue handwriting" |
| `COR_BOKEH_1` | Cor primária do bokeh | "blue" |
| `COR_BOKEH_2` | Cor secundária do bokeh | "warm orange" |
| `DESCRIÇÃO_AVATAR_OU_MASCOTE` | Se houver personagem/mascote | "His cartoon avatar — stylized 2D illustrated version with..." |
| `OMBRO` | Ombro por onde o avatar espia | "right" / "left" |
| `AÇÃO` | O que o avatar faz | "waving with one hand" |
| `COM_ELEMENTO_ILUSTRADO` | Acrescenta se tiver avatar | "with 2D illustration accent" |
| `COR_RIM_LIGHT` | Cor da luz de contorno | "blue" / "golden" / "warm orange" |
| `FRASE_MOOD_NICHO` | Frase final de mood adaptada ao nicho | "a teacher you can trust who also makes learning fun" |

---

## REGRAS DE COMPOSIÇÃO

### Posicionamento

```
┌─────────────────────────────────────────────┐
│                    │                │        │
│   ESPAÇO LIVRE     │                │        │
│   PARA TEXTO       │    PESSOA      │ FADE → │
│                    │                │        │
│   • Headline       │   (foto real)  │        │
│   • Subtítulo      │                │        │
│   • Botão CTA      │   [avatar]     │        │
│                    │                │        │
│                    │                │        │
├────────────────────┴────────────────┴────────┤
│              ↓ FADE INFERIOR ↓               │
└─────────────────────────────────────────────┘
```

- Pessoa ocupa **1/3 da largura** (regra dos terços)
- Texto ocupa **2/3** com negative space generoso
- Fade na borda do lado da pessoa (integra com fundo do site)
- Fade inferior (integra com a seção seguinte)
- Avatar/mascote: **menor que 20% do tamanho da pessoa**, posicionado atrás do ombro

### O que NÃO fazer

| Erro | Por que |
|------|---------|
| Pessoa centralizada | Não sobra espaço pro texto da hero |
| Fundo complexo/colorido demais | Compete com o headline |
| Avatar do mesmo tamanho da pessoa | Confunde hierarquia visual |
| Texto escrito na imagem | O texto vem do HTML/CSS do site, não da imagem |
| Bordas duras | Sem fade = imagem "colada" no site, não integrada |
| Bokeh exagerado | Fica artificial e distrai |

### Adaptações por nicho

| Nicho | Elementos de fundo (blur) | Cores sugeridas | Mood |
|-------|--------------------------|-----------------|------|
| Professor de idiomas | Whiteboard, livros, bandeiras | Azul, branco, laranja | Acessível, divertido, confiável |
| Nutricionista | Frutas, cozinha clean, avental | Verde, branco, laranja | Saudável, profissional, acolhedor |
| Advogado | Estante de livros, escritório | Azul escuro, dourado, cinza | Sério, confiável, premium |
| Personal trainer | Academia blur, equipamentos | Preto, vermelho, cinza | Energético, forte, motivador |
| Terapeuta/psicólogo | Sofá, plantas, luz natural | Verde suave, bege, branco | Calmo, seguro, empático |
| Dentista | Consultório clean, equipamento | Azul claro, branco, menta | Limpo, moderno, tecnológico |
| Coach | Palco, microfone, plateia blur | Dourado, preto, azul | Inspirador, líder, premium |
| Fotógrafo | Câmeras blur, estúdio | Preto, branco, laranja | Criativo, artístico, profissional |

---

## EXEMPLO COMPLETO — Rodger Koller (professor de inglês)

**Input:** foto de vídeo do YouTube (CLASS 02), avatar cartoon com caveira

**Prompt gerado:**

```
Professional hero image for an English language course website, designed
for text overlay on the left side.

A young Brazilian man in his late 20s with curly black hair styled high
on top and faded on the sides, light brown skin, short beard stubble,
warm confident smile with teeth showing, wearing a dark navy blue
button-up shirt over a black t-shirt, small silver earring on the left
ear.

Positioned on the RIGHT THIRD of the frame, body angled slightly toward
the left, looking directly at camera with a welcoming expression. Shot
from chest up.

The LEFT TWO-THIRDS of the image is intentionally clean and minimal — a
soft gradient background fading from warm white to very light sky blue,
with generous negative space for headline text and CTA buttons. No
objects, no clutter, no text on that side.

Behind the man on his side, subtle out-of-focus elements: a blurred
whiteboard edge with barely visible blue handwriting creating educational
context without distraction, soft bokeh circles in blue and warm orange
tones.

His cartoon avatar character — a stylized 2D illustrated version of
himself with exaggerated curly hair, big round eyes, wide open smile,
wearing a black t-shirt with a small skull graphic, thick cartoon
outlines — peeks playfully from behind his right shoulder, smaller in
scale, waving with one hand. The cartoon is crisp while the background
stays soft.

Professional fade effect: the right edge of the image softly fades to
white/transparent, and the bottom edge has a subtle gradient fade to
white, allowing seamless integration with a website background.

Style: editorial portrait photography with 2D illustration accent,
hyperrealistic skin and fabric textures on the person, cinematic shallow
depth of field (f/1.8), soft studio key light from the left with a
subtle blue rim light on the right edge of his face, clean modern
aesthetic. 16:9 aspect ratio, 4K resolution.

The overall mood is premium, approachable, and professional — a teacher
you can trust who also makes learning fun.
```

---

## INTEGRAÇÃO MazyOS

Esta ferramenta se conecta com:
- **`/seo`** — a hero image gerada é usada como og:image e imagem principal da landing page
- **`/carrossel`** — variações do prompt podem gerar imagens para carrosséis
- **`identidade/design-guide.md`** — cores e estilo visual devem respeitar o guide do cliente
- **`/publicar-tema`** — adaptações do prompt geram thumbnails para blog posts

### Fluxo dentro do projeto

```
1. Cliente envia foto
2. Claude analisa com esta ferramenta
3. Prompt gerado → enviado ao gerador de imagem (Ideogram/Midjourney/etc)
4. Imagem gerada → revisão com o cliente
5. Aprovada → inserida na landing page via /seo
6. Variações → geradas para og:image, carrossel, thumbnails
```
