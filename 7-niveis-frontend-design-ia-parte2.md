# Os 7 Niveis do Frontend Design com IA — Parte 2

> **Protocolos de producao, engenharia reversa e sistema de agentes para construcao de sites com IA.**

---

## Protocolo de Engenharia Reversa via Prints

### O Fluxo Completo

Quando o usuario fornece prints de templates ou sites de referencia, o fluxo de engenharia reversa segue estas etapas:

```
1. Usuario envia prints de referencia
         |
2. IA analisa: cores, fontes, layout, componentes, estilo visual
         |
3. IA classifica o estilo (ex: "minimalista corporativo", "dark SaaS")
         |
4. IA busca na web por sites com design semelhante
         |
5. IA apresenta referencias encontradas + analise comparativa
         |
6. Usuario valida a direcao / ajusta
         |
7. IA extrai codigo-fonte dos sites referencia (Ctrl+U / scrape)
         |
8. IA disseca as tecnicas usadas (animacoes, layout, efeitos)
         |
9. Implementacao com adaptacao ao contexto do cliente
```

### Capacidades e Limitacoes

**O que a IA consegue fazer com prints:**
- Analisar o design: paleta de cores, tipografia, layout, hierarquia de elementos
- Classificar o estilo visual com vocabulario tecnico preciso
- Buscar na web por sites com estilos semelhantes
- Replicar o design em codigo que reproduz fielmente o estilo

**O que a IA nao consegue fazer:**
- Busca reversa de imagem diretamente (tipo Google Lens ou TinEye)
- Garantir que vai encontrar o template exato (encontra sites parecidos, nao necessariamente o mesmo)

---

## Sistema de Dois Agentes

A producao do site e dividida em dois agentes com roles distintos, operando em sequencia.

### Agente 1: Architect

**Role:** Formulador de prompts estrategicos.

**Responsabilidades:**
- Aguardar as referencias visuais (prints de sites) antes de comecar
- Ler o contexto do negocio (empresa.md, preferencias.md, estrategia.md conforme MazyOS)
- Analisar os prints de referencia e classificar o estilo
- Buscar sites similares para engenharia reversa quando necessario
- Formular os prompts de implementacao divididos em 5 partes
- **Cada prompt deve ser salvo como arquivo .md dedicado** na pasta do projeto com nome descritivo e humano (ex: `site-rodge-parte-1.md`, `site-clinica-parte-3.md`). Nomes genericos como `architect-parte-1.md` sao proibidos. Nunca formular prompt apenas no chat — sempre persistir no artefato

**Regra de operacao:**
- Sempre divide a formulacao em **5 partes** (5 turnos)
- Cada parte = 1 turno
- Ao final de cada turno, pergunta: "Posso continuar para a proxima parte?"
- So avanca com autorizacao explicita do usuario

**Estrutura das 5 partes:**
```
Parte 1: Estrutura base (HTML skeleton, head, meta tags, fontes, reset CSS)
Parte 2: Hero section + navegacao + identidade visual
Parte 3: Secoes intermediarias (features, sobre, metodo, social proof)
Parte 4: Secoes de conversao (oferta, formulario, depoimentos, FAQ)
Parte 5: Footer + componentes flutuantes (WhatsApp, exit intent) + polish final
```

### Agente 2: Executor

**Role:** Escritor do codigo-fonte.

**Responsabilidades:**
- Receber os prompts formulados pelo Architect
- Implementar o codigo-fonte seguindo fielmente as instrucoes
- Executar em **5 gomos** (5 turnos), cada gomo correspondendo a uma parte do Architect

**Regra de operacao:**
- Cada gomo = 1 turno de implementacao
- Ao final de cada gomo, pergunta: "Posso continuar para o proximo gomo?"
- So avanca com autorizacao explicita do usuario

**Finalidade desta logistica:**
Mitigar o problema de cota de tokens pre-definido e janela de contexto limitada das IAs. Dividir em turnos menores evita que o codigo-fonte seja sacrificado por truncamento ou perda de contexto em implementacoes longas.

### Fluxo Completo dos Agentes

```
FASE 1 — ARCHITECT
  Turno 1/5: Prompt da estrutura base        → "Posso continuar?"
  Turno 2/5: Prompt do hero + nav            → "Posso continuar?"
  Turno 3/5: Prompt das secoes intermediarias → "Posso continuar?"
  Turno 4/5: Prompt das secoes de conversao  → "Posso continuar?"
  Turno 5/5: Prompt do footer + polish       → "Architect concluido."

FASE 2 — EXECUTOR
  Gomo 1/5: Implementa estrutura base        → "Posso continuar?"
  Gomo 2/5: Implementa hero + nav            → "Posso continuar?"
  Gomo 3/5: Implementa secoes intermediarias  → "Posso continuar?"
  Gomo 4/5: Implementa secoes de conversao   → "Posso continuar?"
  Gomo 5/5: Implementa footer + polish       → "Deploy."
```

---

## Templates de Prompt do Architect

O Architect deve incluir nos prompts que formula as informacoes contextuais do projeto. Existem dois cenarios:

### Cenario A: Cliente Nao Possui Site

```
Atue como um Desenvolvedor Senior e Especialista em UX/UI e
Estrategia Digital. Vamos iniciar o desenvolvimento de um site
do zero para um cliente da minha agencia.

Dados do Projeto:

Nome da Empresa/Marca: [NOME DA EMPRESA]
Nicho de Atuacao: [EX: CLINICA ODONTOLOGICA / EMPRESA DE ENGENHARIA]
Demandas Especificas (se houver): [EX: Cliente pediu sistema de
agendamento online / Deixo a seu criterio definir]

Diretrizes de Desenvolvimento:

Identidade Visual Dinamica: Analise o nicho do cliente e defina
a melhor paleta de cores, tipografia e layout. Priorize visuais
que transmitam confianca, autoridade e alta usabilidade para este
setor especifico (evite dark mode generico se nao fizer sentido
para o nicho).

Funcionalidades Estrategicas: Com base no perfil do negocio, crie
e integre todas as funcionalidades que voce julgar essenciais para
maximizar vendas, captacao de leads ou eficiencia (ex: calculadoras,
portais, integracoes de WhatsApp, etc.). Nao ha limite, adicione
tudo o que for elevar o nivel do projeto.
```

### Cenario B: Cliente Ja Possui um Site

**Prompt 1 — Pre-Analise (diagnostico antes de codar):**

```
Atue como um Auditor de UX/UI, Especialista em Conversao (CRO) e
Desenvolvedor Senior. Meu cliente ja possui um site, mas ele esta
ruim ou ultrapassado e fomos contratados para criar uma versao
muito superior.

Dados do Projeto:

Nome da Empresa/Marca: [NOME DA EMPRESA]
Nicho de Atuacao: [EX: PAPELARIA B2B / ESCRITORIO DE ADVOCACIA]
Demandas/Queixas do Cliente: [EX: Ele disse que nao passa confianca
para grandes empresas e quer rastreio de pedidos]

Material de Analise:
[URL DO SITE ATUAL OU CODIGOS/DADOS/PRINTS]

Sua Tarefa (Diagnostico Previo):
NAO gere codigo ainda. Faca uma analise critica completa do site
atual com base nas informacoes que forneci e me entregue um
relatorio contendo:

1. Erros e Pontos Criticos: O que esta falhando no site atual
   (design, usabilidade, falta de funcionalidades para o nicho)?

2. Plano de Nova Identidade Visual: Quais cores, fontes e estilo
   de layout voce recomenda para o novo site para transmitir maxima
   autoridade e confianca neste nicho especifico?

3. Funcionalidades Sugeridas: Alem do que o cliente pediu, liste
   todas as funcionalidades extras e automacoes que sao essenciais
   para este modelo de negocio e que nos deveriamos implementar
   na nova versao.

Apresente esse diagnostico de forma clara e profissional.
```

**Prompt 2 em diante:** Apos aprovacao do diagnostico, o Architect segue com a divisao em 5 partes do desenvolvimento.

---

## Checklist Pre-Producao

Antes do Architect comecar a formular os prompts, ele deve ter em maos:

- [ ] Prints de referencia visual (sites de inspiracao)
- [ ] Nome da empresa/marca do cliente
- [ ] Nicho de atuacao
- [ ] Demandas especificas do cliente (se houver)
- [ ] URL do site atual (cenario B) ou confirmacao de que e do zero (cenario A)
- [ ] Assets do cliente (logo, fotos, cores da marca — se existirem)
- [ ] Contexto do MazyOS (empresa.md, preferencias.md, estrategia.md)

---

## Regras Gerais do Protocolo

1. **O Architect nunca comeca sem prints de referencia.** Sem direcao visual, o resultado sera AI Slop (Nivel 1).

2. **Cada turno/gomo e autonomo.** Se a janela de contexto for perdida entre turnos, o proximo turno deve ser auto-suficiente com as instrucoes necessarias.

3. **O Executor nao improvisa.** Segue fielmente o prompt do Architect. Desvios criativos devem ser sinalizados e aprovados.

4. **Deploy incremental.** A cada gomo concluido pelo Executor, o site deve estar funcional (mesmo que incompleto). Nada de "tudo quebrado ate o gomo 5".

5. **Stack simplificada.** Para sites de clientes da agencia, priorizar HTML + CSS + JS puro com deploy via Netlify. Frameworks so quando justificado pelo escopo.

6. **Engenharia reversa e para aprender, nao plagiar.** O codigo extraido de sites referencia serve como base tecnica. O resultado final deve ter identidade propria do cliente.

7. **Animacoes sempre super ultra premium.** Toda animacao deve usar Framer Motion (ou equivalente CSS de alto nivel). Nenhum elemento entra em tela sem transicao refinada. O padrao minimo e motion design de nivel Awwwards — spring physics, stagger, parallax sutil, micro-interacoes em hover/scroll. Animacao generica ou basica e AI Slop.

---

## Skills Obrigatorias

Antes de qualquer decisao de design ou implementacao, o Architect e o Executor devem consultar as skills instaladas no ambiente:

1. **UI/UX Pro Max** (`.claude/skills/ui-ux-pro-max/`) — Consulta obrigatoria para: paleta de cores, tipografia, layout, acessibilidade, animacoes, formularios, navegacao. Contem 50+ estilos, 161 paletas, 57 pares tipograficos, 99 guidelines UX. Nunca tomar decisao de design sem passar por essa skill primeiro.

2. **Frontend Design Skills** — Qualquer skill de frontend instalada no ambiente deve ser ativada e consultada durante a formulacao dos prompts e durante a implementacao.

**Regra: nenhum site sai da producao sem ter sido validado contra as regras dessas skills.**

---

## MCPs de Refinamento e Componentes

1. **21st Dev (MCP)** — Antes de implementar componentes visuais complexos (hero, cards, modals, carousels, CTAs), o Executor deve consultar o 21st Dev para buscar componentes de referencia. Sempre aguardar input do usuario sobre quais componentes adotar antes de implementar.

2. **Stitch (MCP)** — Usar para refinamento visual pos-implementacao. Apos cada gomo, passar pelo Stitch para validar e refinar a qualidade visual do que foi construido.

**Fluxo: 21st Dev (componentes) → Implementacao → Stitch (refinamento)**

---

## Fonte de Assets

1. **Assets primarios:** Fotos, logos e materiais fornecidos pelo cliente.
2. **Assets secundarios (OBRIGATORIO):** Unsplash via CDN (`images.unsplash.com`) — fonte oficial e obrigatoria para suprir QUALQUER demanda de imagem que o cliente nao forneceu. Isso inclui: avatares de depoimentos, fotos de apoio, backgrounds, texturas, hero images suplementares. **Nunca deixar um elemento visual sem imagem.** Circulos com iniciais, placeholders coloridos ou areas vazias onde deveria haver foto sao AI Slop. Usar imagens com curadoria apertada que combinem com a direcao de arte do projeto. Nunca usar as "Unsplash defaults que todo mundo ja viu" — a curadoria deve fazer as imagens parecerem encomendadas. Formato do CDN: `https://images.unsplash.com/photo-ID?w=LARGURA&h=ALTURA&fit=crop&crop=face`.
3. **Icones:** Lucide React como piso minimo. Nunca usar icones inferiores, emoji como icone, ou icon packs genericos.
4. **Flags e assets complementares:** SVGs de alta qualidade ou extraidos de fontes confiáveis.

### Regra de Zero Placeholders Visuais

Nenhum elemento que deveria conter uma imagem pode ir pro deploy sem imagem. Se o cliente nao forneceu, Unsplash supre. Exemplos de violacoes:

- Avatares de depoimentos com apenas a inicial da pessoa em um circulo colorido
- Areas de foto com fundo solido ou gradiente em vez de imagem real
- Secoes "sobre" ou "equipe" sem fotos de pessoas
- Cards com icone generico onde deveria haver foto

**Se nao tem foto do cliente, tem Unsplash. Se nao tem Unsplash, tem defeito.**

---

## Crivo dos 8 Criterios ($10K Checklist)

Todo site produzido pelo protocolo deve passar por estes 8 criterios antes de ser considerado pronto. Se falhar em qualquer um, nao esta pronto.

### 01. Ponto de vista, nao template.
O site se compromete com uma direcao de design especifica e executa sem vacilar. Site generico e de $200. Site com gosto e de $10K.

### 02. Tipografia que trabalha.
Par display + body escolhido com intencao. Escala e peso carregam hierarquia. Os headings parecem escolhidos, nao defaultados. **Nunca usar Inter, Roboto ou fontes genéricas.** Tipografia sempre premium.

### 03. Sistema de cores contido.
Tres a cinco cores, usadas com consistencia. Sem paletas arco-iris. Premium se comunica por contencao, nao por decoracao.

### 04. Hierarquia que respira.
Whitespace, escala e contraste dizem ao visitante onde olhar sem esforco. A pagina tem primario, secundario, terciario claros. Sem muros planos de conteudo. Respeitar lei de grupamentos e espacamentos.

### 05. Imagens com intencao.
Nunca defaults genericos. Fotografia customizada, assets gerados que combinem com a direcao de arte, ou curadoria apertada o suficiente pra parecer encomendado.

### 06. Motion que sussurra.
Micro-interacoes e comportamento de scroll parecem feitos a mao, nao AOS-fade-up slop. O criterio: um designer aprovaria, nao reviraria os olhos.

### 07. Mobile que e desenhado, nao encolhido.
Decisoes de layout pro celular sao diferentes do desktop, nao a versao desktop comprimida. Aqui 90% dos sites baratos colapsam. Atencao total ao mobile.

### 08. O caro invisivel.
Sub-2s de load, contraste WCAG AA, navegacao por teclado, HTML semantico, meta tags reais. O visitante nao ve diretamente mas sente "esse site e rapido e funciona".

---

## Filtro MazyOS

Todo texto, copy e conteudo do site deve passar pelo crivo do contexto MazyOS antes de ir pro ar:

1. **empresa.md** — O texto reflete corretamente o negocio, servicos e posicionamento do cliente?
2. **preferencias.md** — O tom de voz, estilo e linguagem estao calibrados com as preferencias definidas?
3. **estrategia.md** — O foco e as prioridades atuais estao refletidos na hierarquia do conteudo?

Se algum desses arquivos estiver preenchido, o conteudo do site deve estar 100% alinhado. Nenhum texto generico tipo "Lorem ipsum" ou placeholder vai pro deploy.

---

## Regra de Ouro Anti-Slop (INVIOLAVEL)

Recursos terminantemente **PROIBIDOS** em qualquer site produzido por este protocolo:

1. **Emojis** — Nunca. Em nenhum lugar. A menos que o nicho do cliente exija expressamente.
2. **Hifens decorativos** — Nunca como separador visual ou recurso de design.
3. **Jargao tecnico verborragico** — Copy limpa e direta. Sem encher linguica com termos tecnicos que o publico-alvo nao usa.
4. **Caixas delineadoras neon** — Caixas com borda neon + fundo neon transparente sao TERMINANTEMENTE PROIBIDAS. Zero tolerancia. Isso inclui badges, pills, tags e qualquer elemento com `background: rgba(COR, 0.1)` + `border: 1px solid rgba(COR, 0.2)` + `color: COR` — esse padrao e a assinatura visual do AI Slop. Badges e pills devem usar `background: var(--bg-elevated)` + `border: var(--border)` + `color: var(--text-primary)`. Cores semanticas vao nos icones, nao no container.
5. **Fontes genericas** — Inter, Roboto, Open Sans e similares estao banidas. Tipografia sempre premium e com personalidade.
6. **Icones inferiores** — Lucide React e o piso minimo. Nada abaixo disso. Nunca emoji como icone.
7. **AOS fade-up generico** — Animacoes de entrada genericas (fade-up, fade-in basico) sem personalidade sao AI Slop.

**Se qualquer um desses elementos aparecer no codigo, e defeito — corrigir antes do deploy.**

---

> **"Dois agentes, cinco turnos cada, zero token desperdicado."**
