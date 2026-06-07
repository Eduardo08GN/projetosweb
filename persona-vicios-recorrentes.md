# Persona: Vicios Recorrentes

> **Catalogo de erros recorrentes cometidos durante implementacoes de frontend. Cada entrada documenta o vicio, por que acontece, como detectar e qual e o caminho correto. Este documento e uma diretriz instrucional de escopo geral — nao e especifico de nenhum projeto. Deve ser consultado antes de toda implementacao para evitar o bad path e garantir o happy path.**

---

## Como usar este documento

1. **Antes de implementar:** Ler as entradas relevantes ao tipo de tarefa (layout, cores, componentes, assets)
2. **Durante code review:** Usar como checklist de vicios conhecidos
3. **Apos feedback do usuario:** Se o feedback apontar um padrao repetido, adicionar nova entrada aqui
4. **Atualizacao continua:** Este documento cresce com cada iteracao. Cada erro novo documentado e um erro a menos no futuro.

---

## Vicio 01: Trocar cor sem pensar na transicao

### O que acontece
Quando recebe instrucao para intercalar cores de fundo entre secoes (ex: dark/light), simplesmente altera o `background` de cada secao e considera o trabalho feito. O resultado sao cortes abruptos entre secoes — uma linha reta e seca separando fundo escuro de fundo claro.

### Por que e um erro
Um desenvolvedor senior de excelencia em frontend nunca entrega transicoes abruptas entre secoes. A transicao entre blocos visuais e uma decisao de design tao importante quanto a cor em si. Sites de $10K+ tratam a juncao entre secoes como uma oportunidade de polish, nao como um detalhe ignoravel.

### O bad path
```
Instrucao: "Intercale dark e light nas secoes"
Execucao: troca background-color de cada secao
Resultado: cortes retos, abruptos, sem acabamento
Impressao: site de template gratuito
```

### O happy path
```
Instrucao: "Intercale dark e light nas secoes"
Execucao:
  1. Troca background-color de cada secao
  2. Aplica gradient bleed (80-120px) na juncao de cada par de secoes
  3. Verifica se a transicao e suave e invisivel
Resultado: secoes fluem uma na outra sem corte visivel
Impressao: site premium, Awwwards-level
```

### Tecnicas corretas (por ordem de preferencia)
1. **Gradient bleed** — 80-120px de gradiente que sangra a cor de uma secao na proxima. A mais elegante e invisivel.
2. **CSS clip-path curves** — `clip-path: ellipse()` ou `polygon()` com curvas suaves. Mais ousado, usado pela Stripe.
3. **Overlap com negative margin** — Secao de baixo sobe com `margin-top: -60px` + `border-radius` no topo.
4. **SVG wave dividers** — Somente se MUITO sutil. Facil de cair em "templatezao".

### Regra
**Toda vez que alterar o background de uma secao, perguntar: "como essa secao se encontra com a anterior e com a proxima?" Se a resposta for "corte reto", nao esta pronto.**

---

## Vicio 02: Elementos visuais sem imagem (placeholders invisíveis)

### O que acontece
Ao implementar componentes que requerem imagem (avatares, fotos de equipe, cards com foto, hero images), usa alternativas preguicosas em vez de imagens reais: circulos com iniciais, fundos solidos coloridos, gradientes decorativos, ou simplesmente deixa o espaco vazio.

### Por que e um erro
O usuario leigo nao sabe articular o que esta errado, mas sente que "algo falta" ou "parece amador". O profissional identifica imediatamente: o site parece incompleto. Unsplash existe exatamente para suprir essa lacuna quando o cliente nao fornece fotos.

### O bad path
```
Componente: avatar de depoimento
Sem foto do cliente disponivel
Execucao: <div class="avatar">G</div> (circulo com inicial)
Resultado: site parece inacabado, prototipo, wireframe
```

### O happy path
```
Componente: avatar de depoimento
Sem foto do cliente disponivel
Execucao: <img src="https://images.unsplash.com/photo-ID?w=80&h=80&fit=crop&crop=face">
Resultado: rosto real, site parece completo e profissional
```

### Regra
**Se um elemento deveria ter imagem e nao tem, usar Unsplash CDN. "Sem foto do cliente" nunca e desculpa para placeholder. O formato padrao e: `https://images.unsplash.com/photo-ID?w=LARGURA&h=ALTURA&fit=crop&crop=face`.**

---

## Vicio 03: Padrao rgba neon em badges e pills

### O que acontece
Ao criar badges, pills, tags ou qualquer elemento de destaque, aplica automaticamente o padrao: `background: rgba(COR, 0.1)` + `border: 1px solid rgba(COR, 0.2)` + `color: COR`. Esse padrao e a assinatura visual mais reconhecivel do AI Slop — qualquer designer identifica em 1 segundo.

### Por que e um erro
Esse padrao nao existe em sites premium feitos por humanos. E um artefato da IA que aprendeu com milhares de templates mediocres. E o equivalente visual de "Lorem ipsum" — grita "isso foi gerado automaticamente".

### O bad path
```css
.badge {
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: #3b82f6;
}
/* = caixa neon azul transparente = AI Slop */
```

### O happy path
```css
.badge {
  background: var(--bg-elevated);    /* fundo solido, discreto */
  border: 1px solid var(--border);   /* borda sutil, nao colorida */
  color: var(--text-primary);        /* texto neutro */
}
.badge svg {
  color: var(--accent);              /* cor semantica no icone, nao no container */
}
/* = badge premium, discreto, cor no icone */
```

### Regra
**Nunca aplicar cor semantica nas 3 camadas simultaneas (fundo + borda + texto). Cor semantica vai no icone ou em UM elemento. O container e sempre neutro.**

---

## Vicio 04: Alterar background sem ajustar contraste de todos os filhos

### O que acontece
Ao mudar o background de uma secao (ex: de dark para light), altera o background da secao mas esquece de ajustar as cores de texto, bordas, sombras e backgrounds de todos os elementos filhos. O resultado e texto claro sobre fundo claro (invisivel) ou texto escuro sobre fundo escuro.

### Por que e um erro
Contraste e o requisito mais basico de design. Texto invisivel nao e um detalhe — e o site quebrado. Um dev senior nunca alteraria um background sem fazer o pass completo de todos os filhos.

### O bad path
```
Instrucao: "Mude essa secao pra fundo claro"
Execucao: troca background para branco
Resultado: texto branco sobre fundo branco = invisivel
```

### O happy path
```
Instrucao: "Mude essa secao pra fundo claro"
Execucao:
  1. Troca background para claro
  2. Redefine custom properties na secao:
     --text-primary: var(--text-dark)
     --muted: #64748b
     --border: rgba(15, 23, 42, 0.08)
     --bg-elevated: white
  3. Verifica CADA elemento filho visualmente
  4. Testa no browser antes de declarar pronto
Resultado: todos os textos legiveis, contrastes corretos
```

### A tecnica correta: override de tokens por secao
Em vez de cacar cada elemento filho individualmente, redefinir as custom properties no nivel da secao. Todos os filhos que usam `var(--text-primary)` etc. herdam automaticamente os valores corretos.

```css
.section-clara {
  background: var(--bg-light);
  --text-primary: var(--text-dark);
  --muted: #64748b;
  --border: rgba(15, 23, 42, 0.08);
  --bg-elevated: white;
}
```

### Regra
**Toda mudanca de background exige um pass completo de contraste em todos os filhos. A tecnica correta e override de tokens CSS no nivel da secao, nao editar elemento por elemento.**

---

## Meta-regra: Pensar como Dev Senior

Antes de considerar qualquer implementacao visual "pronta", aplicar este filtro:

1. **Transicoes** — Como cada secao se encontra com a proxima? Tem acabamento ou corte reto?
2. **Contraste** — Todo texto e legivel sobre seu fundo? WCAG AA minimo?
3. **Completude** — Todo espaco que deveria ter imagem tem imagem?
4. **AI Slop** — Tem algum padrao rgba neon? Tem circulo com inicial? Tem fade-up generico?
5. **Mobile** — As decisoes de layout foram pensadas pro mobile ou e o desktop comprimido?
6. **Micro-detalhes** — Hover states, focus states, loading states, transitions — tudo tem acabamento?

**Se a resposta para qualquer item for "nao", nao esta pronto.**

---

> **"O erro mais caro nao e o bug. E a complacencia com o 'bom o suficiente' quando o padrao e excelencia."**
