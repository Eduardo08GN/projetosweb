# Benchmark — MyPostFlow (editor self-service de carrossel)

> Fonte: tour em video pela ferramenta (mypostflow.com), capturado em 12/06/2026.
> Status: ANOTADO PRA DISCUSSAO. Nada decidido, nada virou spec ainda.
> Dono da pauta: Eduardo. Discutir antes de qualquer implementacao.

---

## O que e

SaaS de criacao de carrosseis e stories pro Instagram com IA (menciona API
Gemini no menu lateral). Alega 1.000+ usuarios. Posicionamento explicito:
"crie carrossel sem Canva, sem ChatGPT, sem designer, sem gastar credito
de Claude Code" — ou seja, eles atacam exatamente o custo por iteracao
que existe quando cada ajuste de texto/imagem queima token.

## O fluxo deles

1. Dashboard com "Gerar com IA" + aba **Trendings**: busca noticias em alta
   sobre um tema e gera o carrossel a partir da noticia escolhida
2. Wizard de 6 passos: tema → conteudo (campo livre, toggle "conteudo exato"
   que distribui o texto sem reescrever, idioma, numero de slides 1 a 20) →
   estilo visual (4 templates) → cores → gerar
3. Geracao em ~1 minuto, ja com imagem de fundo gerada por IA
4. 4 templates: **Minimalista** (foto de fundo + overlay + badges de canto),
   **Profile** (visual de tweet/X com avatar e bio), **Creators** (texto em
   gradiente + chips de progresso), **TechViral** (titulos com marca-texto,
   ideal tech/noticias)

## A superficie de edicao (o ponto que interessa)

Editor WYSIWYG completo pos-geracao, **sem custo por edicao** — o usuario
itera quanto quiser sem queimar credito:

- **Texto:** edicao inline, troca de fonte por elemento, tamanho de titulo
  e subtitulo separados
- **Imagem:** trocar, anexar arquivo proprio, gerar com IA usando foto de
  referencia (rosto ou produto) + prompt livre, zoom e posicao da imagem
  dentro do slide
- **Estilo global (aplica a todos os slides):** cores e gradientes, sombra
  com opacidade, "cantos" (4 badges de canto com toggle individual e texto
  livre), indicadores de quantidade, icone do canto inferior, botoes/CTAs,
  logo da marca
- **IA pontual por slide:** "refinar este slide" (ex.: encurtar o texto) e
  "Gerar Legenda" pro post
- **Formato:** o mesmo conteudo alterna entre stories, carrossel e quadrado
  (1080x1350 visto no rodape)
- **Slides:** adicionar, remover, reordenar; baixar 1 ou todos; salvar como
  template; autosave com timestamp
- Ha ainda "Treinar Carrossel": configurar nicho, tom de voz e referencias
  pra IA gerar sempre no padrao do usuario (analogo ao nosso perfil de tenant)

## Onde isso bate na gente

Nosso modelo e fabrica white-label: a gente produz, o tenant aprova, e o
tenant tem UM loop de edicao (edita 1x na plataforma, o pipeline reprocessa,
re-renderiza e re-sobe). A discricionariedade de edicao do tenant e minima
por design.

O MyPostFlow e o extremo oposto: o usuario final tem liberdade total de
edicao e iterar custa zero. Leitura honesta: **nesse eixo especifico
(liberdade de edicao por parte do tenant), eles estao ganhando da gente.**

A vantagem deles nao e qualidade de design (o output e generico perto da
nossa fabrica editorial) — e a sensacao de controle e a iteracao gratuita.

## Pergunta aberta (pra proxima conversa)

O que vale absorver na nossa superficie de edicao do tenant pra aumentar a
discricionariedade SEM quebrar o modelo de fabrica?

Candidatos a discutir:

- Edicao de texto inline nos slides, sem disparar reprocesso completo
- Controles de estilo "seguros" dentro dos limites da identidade do tenant
  (zoom/posicao da imagem, tamanho de fonte, toggle de elementos)
- "Refinar com IA" pontual por slide, em vez do loop unico de ajustes
- Troca de imagem pelo proprio tenant (upload ou regerar)
- Mais de um ciclo de edicao quando o custo de re-render for baixo

Riscos a pesar na conversa:

- Tenant com liberdade demais quebra a identidade visual que a gente garante
- Conflito com o pipeline de aprovacao (o que ja foi aprovado pode mudar?)
- Custo de re-render e de imagem (regra Cloudflare FLUX, cota)
- Nosso diferencial e "o cliente so aprova, a operacao e nossa" — edicao
  ilimitada empurra a operacao de volta pro cliente
