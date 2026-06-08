# Os 7 Niveis do Frontend Design com IA — Parte 5

> **6 tecnicas de design que fazem sites converterem E pararem o scroll.**

---

## O que e este documento

Registro de 6 tecnicas de design extraidas de producao real. Cada uma pode ser aplicada imediatamente em qualquer site sem experiencia avancada. Ordenadas da mais rapida pra mais profunda.

---

## 1. Tipografia em 3 niveis

### Nivel 1: Uma fonte so
Seguro, funcional, sem risco. A maioria dos sites usa isso.

### Nivel 2: Super Families
Familias massivas que incluem sans-serif, serif e monospace construidas pra funcionar juntas. Ex: IBM Plex, Source (Sans/Serif/Code).

### Nivel 3: Combinacao de foundries diferentes
Fonts de origens diferentes que se complementam. Contraste intencional sem parecer acidental.

### Metodo: Fonte Ancora
1. Comecar pela **headline** (nao pelo body). A headline define a personalidade da pagina
2. A ancora deve refletir a marca: moderno? tecnico? acessivel?
3. Depois encontrar fonts que suportem a ancora com contraste suficiente
4. Nunca combinar fonts similares demais (Georgia + Times New Roman = erro)
5. Usar [Fonts In Use](https://fontsinuse.com) pra buscar pares validados por outros designers

### Regra
Contraste sim, confusao nao. O par deve parecer intencional, como se viesse do mesmo universo mas adicionasse interesse visual.

---

## 2. Star of the Show (Estrela do Show)

### O conceito
Todo site que para o scroll tem UM elemento que captura atencao e faz a pessoa sentir algo. Esse e a estrela.

### Como escolher
A estrela NAO e escolhida porque "parece legal". Ela nasce da historia do negocio.

**Metodo Brandon Sanderson — A Semente:**
1. Entender o que o negocio faz
2. Fazer uma pergunta "E se...?" conectada ao produto
3. Deixar tudo crescer ao redor dessa semente

### Exemplo pratico
- Produto: SaaS de operacoes pra empresas de servico
- Essencia: transformar dados complexos em dashboards simples
- Estrela: imagem abstrata que referencia graficos/charts, nao o chart literal

### Regra
A estrela e o ponto de ancoragem visual. Todo o resto da pagina existe pra suportar ela, nao pra competir com ela.

---

## 3. Visual Rhyming (Rima Visual)

### O conceito
Repetir detalhes visuais de formas diferentes ao longo do site cria coesao. Nao e copiar elementos — e extrair DNA visual da estrela e espalhar pelo site.

### O que pode rimar
- **Formas**: triangulos do logo aparecem em setas, masks, callouts
- **Cores**: gradientes que aparecem em fundos, botoes, detalhes
- **Texturas**: noise, glass, patterns que se repetem sutilmente
- **Movimento**: mesmo easing, mesma direcao, mesma intensidade

### Exemplo pratico
Logo tem triangulos → dropdown icons viram triangulos → CTA ganha seta triangular → imagem hero usa mask triangular → callout box com forma triangular

### Regra
Rima visual e sutil. O usuario nao percebe conscientemente, mas sente que "tudo combina". Se voce precisa apontar a rima, ela funcionou.

---

## 4. Depth (Profundidade)

### O conceito
Sites que parecem existir no mundo real, nao apenas como codigo na tela. Profundidade faz o usuario sentir que pode quase tocar os elementos.

### Ferramentas de profundidade
- **Texturas**: noise sutil no background ou em elementos chave
- **Glass effect**: glassmorphism em cards e nav (backdrop-filter blur)
- **Sombras reais**: shadows que simulam iluminacao direcional
- **Layering**: elementos que parecem estar em camadas diferentes

### Regra critica
Profundidade deve ser SUTIL. Nunca competir com a estrela do show. Sao detalhes que voce nota mas que nao pedem atencao. Como os detalhes de uma sala bem decorada — voce sente, mas nao cataloga.

---

## 5. Opacity Hierarchy (Hierarquia de Opacidade)

### O conceito
Nem todo texto tem a mesma importancia. Usar opacidade diferente cria hierarquia visual instantanea.

### Escala de opacidade (referencia Google Material Design)
| Nivel | Opacidade | Uso |
|-------|-----------|-----|
| Alta enfase | 100% | Headlines, CTAs, numeros chave |
| Media enfase | 70-87% | Subheadings, body text principal |
| Baixa enfase | 50-60% | Labels, captions, texto secundario |
| Desabilitado | 38% | Texto inativo, placeholders |

### Aplicacao pratica
```css
h1 { opacity: 1; }
.subtitle { opacity: 0.7; }
.caption { opacity: 0.55; }
.muted { opacity: 0.4; }
```

### Regra
A diferenca e sutil mas poderosa. O olho sabe imediatamente o que ler primeiro, o que escanear, e o que ignorar. A pagina sente intencional em vez de uniforme.

---

## 6. Variacao Radical

### O conceito (metodo do produtor musical)
Os melhores produtores musicais pegam uma musica e forçam variacoes extremas: aceleram muito, desaceleram, mudam a oitava, trocam o tom. Isso tira o musico do pensamento original pra encontrar a melhor versao absoluta.

### Aplicacao em web design
Nao iterar na primeira versao. Criar versoes radicalmente diferentes:

1. Tente **light mode** se comecou com dark
2. Mude o **layout** completamente (vertical → horizontal, centered → asymmetric)
3. Troque a **estrela do show** por outra
4. Inverta a **hierarquia** (headline gigante → headline pequena)
5. Mude a **paleta** inteira

### Regra
A primeira versao quase nunca e a melhor. O exemplo do video teve **12 versoes** da mesma estrela antes de chegar na final. A versao 1 teria sido "ok", mas nao teria sido "wow".

> "Brinque com suas ideias ate o anjo ser esculpido da pedra." — Michelangelo (via o video)

---

## Checklist de aplicacao

```
ANTES DE COMECAR O DESIGN
[ ] Ancora tipografica definida? (headline first)
[ ] Par tipografico validado? (Fonts In Use)
[ ] Pergunta "E se...?" da estrela respondida?
[ ] DNA visual da estrela identificado pra rimar?

DURANTE O BUILD
[ ] Estrela comanda atencao sem competicao?
[ ] Rimas visuais em pelo menos 3 lugares?
[ ] Profundidade sutil (noise, glass, layers)?
[ ] Hierarquia de opacidade aplicada?

ANTES DE ENTREGAR
[ ] Pelo menos 3 variacoes radicais tentadas?
[ ] Melhor versao escolhida (nao a primeira)?
```

---

*Documento extraido de producao real. Complementa partes 1-4 do protocolo 7 niveis.*
