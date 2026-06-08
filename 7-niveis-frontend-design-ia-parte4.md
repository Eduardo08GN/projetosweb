# Os 7 Niveis do Frontend Design com IA — Parte 4

> **Antipatterns, vicios operacionais e regras de autocorrecao derivados da pratica real.**

---

## O que e este documento

Registro dos vicios e antipatterns identificados empiricamente durante producoes reais de landing pages com IA. Cada item foi descoberto por erro em campo, corrigido e documentado como regra permanente.

Este documento complementa as partes 1-3 (teoria, protocolos e breadcrumb) com a camada mais valiosa: o que da errado na pratica e como evitar.

---

## 1. Antipattern: Somar em vez de Trocar

### O vicio
Quando o pedido e "trocar X por Y" ou "colocar Y no lugar de X", o instinto e adicionar Y e manter X intacto. Resultado: duas secoes fazendo o mesmo papel, layout inchado, confusao visual.

### Exemplos reais
- Pedido: "tire os cards de credenciais e coloque o video no lugar". Acao errada: criar secao de video E manter credenciais
- Pedido: "coloque a marquee na divisoria da hero com a secao abaixo". Acao errada: colocar a marquee DENTRO da hero

### Regra
Antes de implementar qualquer mudanca, separar explicitamente:
- **O que SAI** (remover, deletar, comentar)
- **O que ENTRA** (criar, adicionar)
- **Onde ENTRA** (posicao exata no DOM)

Se o pedido contiver "no lugar de", "substituir", "trocar", "tirar e colocar", a primeira acao e REMOVER. So depois criar o novo.

---

## 2. Antipattern: Fundo Escuro por Padrao (Dark Bias)

### O vicio
Associar "premium" a fundo escuro. Toda secao nova nasce com `background: var(--bg-deep)` sem considerar o contexto visual da pagina.

### O problema real
Secoes consecutivas com mesmo tom (dark-dark ou light-light) quebram o ritmo visual. A pagina parece um bloco uniforme em vez de uma sequencia de ambientes distintos.

### Regra: Alternancia Obrigatoria

| Posicao | Background | Texto |
|---------|-----------|-------|
| Secao N (dark) | `--bg-deep` | `--text-primary` (claro) |
| Secao N+1 (light) | `--bg-light` | `--text-dark` (escuro) |
| Secao N+2 (dark) | `--bg-deep` | `--text-primary` (claro) |

Antes de definir o background de qualquer secao nova, verificar:
1. Qual e o background da secao ANTERIOR?
2. Qual e o background da secao POSTERIOR?
3. Escolher o oposto da secao anterior

Excecoes so com justificativa explicita (ex: hero sempre dark por causa do shader).

---

## 3. Antipattern: Transicoes Monotomas entre Secoes

### O vicio
Usar o mesmo shape divider (ex: wave) em todas as transicoes, ou pior, usar gradientes genericos.

### O que funciona
Variar o tratamento visual de cada transicao cria sensacao de craft manual e atencao ao detalhe. Cada "costura" entre secoes deve ser unica.

### Catalogo de tratamentos disponiveis

| Tipo | Classe CSS | Quando usar |
|------|-----------|-------------|
| Wave | `shape-divider--wave` | Transicao suave, organica |
| Tilt | `shape-divider--tilt` | Transicao angular, dinamica |
| Curve | `shape-divider--curve` | Transicao profunda, dramatica |
| Wave Alt | `shape-divider--wave-alt` | Variacao da wave, direcao oposta |
| Tilt Rev | `shape-divider--tilt-rev` | Tilt invertido |
| Flat | `shape-divider--flat` | Transicao minima, so linha |
| Marquee | `flag-marquee` | Hero para primeira secao (unica) |

### Regras
1. Nunca repetir o mesmo shape divider em transicoes consecutivas
2. Toda transicao entre secoes com backgrounds diferentes DEVE ter um shape divider
3. Cada shape divider deve incluir a linha vermelha UK (`stroke="#C8102E"` ou `fill="#C8102E"`) como constante visual
4. O `fill` do SVG deve corresponder ao background da secao que vem ABAIXO
5. O `background` do container `.shape-divider` deve corresponder ao da secao que vem ACIMA

---

## 4. Antipattern: Copy em Portugues sem Revisao

### O vicio
Copy em portugues nao recebe a mesma revisao que codigo. Typos como "Conhca" (Conheca), "pessoalmente" (pessoal + mente = correto, mas parece errado), palavras faltando letras.

### Regra
Antes de commitar qualquer alteracao que inclua texto visivel ao usuario:
1. Reler TODO o texto novo em voz alta (mentalmente)
2. Verificar palavras com mais de 6 letras (maior chance de typo)
3. Tratar copy com o mesmo rigor de code review
4. Especial atencao a palavras sem acento (politica ASCII-safe): a ausencia do acento nao pode criar ambiguidade ou palavra inexistente

---

## 5. Antipattern: Iteracao em Producao (Deploy antes de Validar)

### O vicio
Ciclo de commit → deploy → "quebrou" → fix → deploy → "ainda quebrou" → fix → deploy. Cada iteracao custa tempo, bandwidth e credibilidade.

### Exemplos reais
- CSS vars `--space-5` e `--space-10` usadas sem verificar se existiam nos design tokens
- Dockerfile com heredoc interpretado como instrucao Docker em vez de shell
- 5+ tentativas de deploy no Netlify sem investigar a causa do Forbidden (creditos zerados)

### Regra: Checklist pre-commit
Antes de commitar mudancas de frontend:

1. **CSS vars existem?** — Grep no `:root` por toda var() usada
2. **Arquivos referenciados existem?** — Imagens, fonts, scripts
3. **Sintaxe do ambiente esta correta?** — Dockerfile, nginx.conf, TOML
4. **Layout e coerente?** — Background alterna? Shape dividers variam? Textos contrastam?
5. **Copy revisado?** — Nenhum typo em portugues?

So commitar quando os 5 passam.

---

## Resumo Visual

```
ANTES DE IMPLEMENTAR          ANTES DE COMMITAR
========================      ========================
[ ] O que SAI?                [ ] CSS vars existem?
[ ] O que ENTRA?              [ ] Assets existem?
[ ] Onde ENTRA?               [ ] Sintaxe correta?
[ ] Background alterna?       [ ] Layout coerente?
[ ] Transicao varia?          [ ] Copy revisado?
```

---

*Documento vivo. Atualizar com novos antipatterns conforme forem descobertos em producoes futuras.*
