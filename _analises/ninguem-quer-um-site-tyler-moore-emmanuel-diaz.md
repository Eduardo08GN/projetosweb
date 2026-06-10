# "Ninguem quer um site" — Tyler Moore + Emmanuel Diaz

> Transcricao analisada de entrevista entre Tyler Moore (20+ anos em web) e Emmanuel Diaz (1.000+ sites construidos). Tema central: o que clientes realmente compram quando contratam um site.

---

## Tese central

Donos de negocio nao querem um site bonito. Querem tres coisas:

1. **Mais dinheiro** (mais clientes, mais vendas, mais retencao)
2. **Vida mais facil** (menos trabalho manual, menos estresse operacional)
3. **Solucao sob medida** (software que faz exatamente o que precisam, sem botao sobrando)

O site e o veiculo, nao o produto. Quem vende "site bonito" compete por preco. Quem vende "sistema que resolve problema X" compete por valor.

---

## Casos documentados na entrevista

### Caso 1: Got Your Six Firearms Training (Florida)

**Contexto:** Escola de treinamento em armas de fogo. Site feio, negocio funcionando bem (muitas reviews, ativo no social). Ligar oferecendo "site mais bonito" seria ignorado.

**Problema real:** Alunos fazem o curso uma vez (licenca) e nunca voltam. Receita depende de retencao, nao de aquisicao.

**Sistema construido:**
- Booking com lembrete automatico mensal pra reservar proxima aula
- Tracking de nivel (nivel 1, 2, 3) com convite automatico pro proximo
- Lembrete de aniversario ("quer treinar no seu aniversario?")
- Lembrete pre-feriado ("fim de semana longo, bora treinar?")

**Reacao do cliente:** "Espera, isso = mais alunos = mais dinheiro." Mandou um texto longo dizendo que Emmanuel era "parte da familia". O sistema removeu a barreira que impedia o negocio de crescer.

### Caso 2: Blushing Bridal (boutique de vestidos de noiva)

**Contexto:** Site WordPress com plugin de booking abandonado gerando erros fatais. Cliente ja pagava subscription mensal pelo site.

**Problema real:** Plugin de booking quebrado + experiencia da noiva no atendimento era generica (sem diferenciacao dos concorrentes).

**Sistema construido:**
- Dashboard completa com identidade visual da marca (substituiu UI cinza do WordPress)
- Mini-CRM por noiva (contato, documentos, historico)
- Pre-selecao de vestidos: dona seleciona vestidos por marca direto do catalogo do site, coracao pra favoritar
- **Modo apresentacao:** tela de boas-vindas personalizada ("Welcome, Olivia") na TV de 60" do estudio
- Galeria de vestidos pre-selecionados com video on hover, sem preco, sem tags. Pura experiencia de venda
- Tela shareavel pro Instagram (nome da noiva + @handle da loja) sem mostrar o vestido (que e surpresa)

**Reacao da cliente:** "Blown away." Nervosa. Nao esperava. Sistema ja rodando no site, primeiro atendimento real em dias.

**Preco:** ~$250/mes (subscription). O mesmo sistema sob encomenda custaria $100K+.

### Caso 3: Renovacao de licenca de segurangas (Florida)

**Contexto:** Profissional comecando negocio de renovacao de licenca pra segurangas. Usava HubSpot ($800+/mes no plano Professional). Nao e tecnico.

**Problema real:** Compliance com o estado exige documentacao completa de cada aluno, controle de data de renovacao, armazenamento de certificados. HubSpot e generico demais, caro demais, complexo demais.

**Sistema construido:**
- CRM customizado: lista alfabetica de alunos, perfil com documentos, contato, historico
- Controle de renovacao por aluno com alertas automaticos
- Cursos integrados no proprio sistema (sem plataforma externa)
- Interface com a cara da marca (nao UI generica)
- Zero botoes sobrando. So o que o cara precisa

**Reacao do cliente:** Texto longo dizendo que o sistema removeu a maior barreira pra ele abrir o negocio. Compliance deixou de ser pesadelo.

---

## Modelo de negocio do Emmanuel

| Aspecto | Detalhe |
|---------|---------|
| Modelo | Subscription mensal (nao projeto unico) |
| Preco medio | ~$250/mes |
| Entrega | Site + sistema customizado sob medida |
| Retencao | Alta. O sistema gera mais dinheiro pro cliente do que custa. Cliente nao cancela |
| Ferramentas | Claude Code pra construcao rapida de software bespoke |
| Tempo de dev | ~1 semana pra sistemas completos (antes seriam meses) |
| Pitch | "Eu identifiquei os problemas 1, 2, 3 do seu negocio e construi um sistema que resolve" |
| Anti-pitch | "Posso fazer seu site mais bonito" (isso nao converte) |

### Estrategia de prospeccao (comecando do zero)

1. Conversar com amigos/familia que tem negocios pequenos
2. Entender as dores reais (nao assumir)
3. Construir uma solucao pro primeiro nicho
4. Usar esse caso como portfolio pra abordar negocios similares
5. Se nao tem cliente, construir demo funcional e apresentar frio

### Nicho "de graca" (tip do Emmanuel)

Negocios com booking recorrente que nao conseguem fazer subscription: pet shops, barbearias, personal trainers, academias pequenas, clinicas. Todos tem o mesmo problema: cliente vem uma vez e some. Sistema de retencao automatizado resolve.

---

## Analise: o que isso muda pra AutomaWeb

### O que ja fazemos bem

A AutomaWeb ja tem a infraestrutura pra operar nesse modelo:

- **Multi-tenant white-label:** cada cliente tem identidade propria, design-guide, dados isolados
- **Producao automatizada de conteudo:** carrossel 2.0 com script, pipeline de copy em 4 camadas
- **Protocolo de producao de sites:** 7 niveis com engenharia reversa, anti-slop, $10K checklist
- **Stack propria:** Coolify, Netcup, banco PostgreSQL, Cloudflare. Nao depende de terceiros pra infra
- **MazyOS como sistema operacional:** contexto persistente por cliente, skills reutilizaveis

### O que falta (gap estrategico)

O que o Emmanuel faz e que nos ainda nao fazemos:

1. **Modulos funcionais por tenant.** Hoje entregamos site + conteudo. Nao entregamos sistemas operacionais (booking, CRM, dashboard, retencao). O site e bonito mas passivo. O cliente olha e fala "legal" mas nao muda a operacao dele.

2. **Pitch baseado em problema, nao em estetica.** Nosso protocolo 7 niveis garante qualidade visual $10K. Mas o pitch ainda e "vou fazer seu site bonito". O Emmanuel mostra que isso nao converte. O pitch que converte e "identifiquei 3 problemas no seu negocio e construi o sistema que resolve".

3. **Retencao por valor operacional.** Subscription de site e fragil: cliente acha que "ja tem o site, pra que pagar?" Subscription de sistema que gera dinheiro e blindada: cancelar = perder receita.

4. **Micro-SaaS por nicho.** Com Claude Code + nossa stack, podemos construir modulos funcionais sob medida por tenant em dias, nao meses. O custo de producao caiu 90%. O valor percebido continua em $100K+.

### Oportunidade imediata: Rodger Koller

Rodger e nosso tenant ativo. Ele e professor solo de ingles. Vamos aplicar a tese do Emmanuel ao caso dele:

**Problema que Rodger tem (identico ao caso da escola de armas):**
- Aluno faz aula particular, aprende o basico, some
- Nao tem sistema de retencao automatizado
- Nao tem CRM de alunos (usa WhatsApp manual)
- 67 licoes gratuitas no YouTube sem funil pro curso pago
- Hotmart indisponivel, Systeme.io bloqueado. Zero automacao de vendas

**Sistema que podemos construir pra ele:**

| Modulo | Funcao | Impacto |
|--------|--------|---------|
| CRM de alunos | Perfil do aluno, nivel atual, historico de aulas, contato | Sai do WhatsApp. Profissionaliza |
| Retencao automatica | Lembrete semanal/mensal pra agendar proxima aula | Aluno nao some. Receita recorrente |
| Tracking de nivel | Basico → Intermediario → Avancado → Cambridge Prep | Aluno ve progressao. Motivacao |
| Funil do YouTube | Lead magnet → email → sequencia → oferta do curso | 32K inscritos sem funil = dinheiro na mesa |
| Dashboard do professor | Quantos alunos ativos, receita mensal, taxa de retencao | Rodger ve o negocio crescer em numeros |
| Booking integrado no site | Agendar aula direto no site Fly to Fluency | Remove fricao. Nao precisa de link externo |

**Pitch pro Rodger (aplicando a tese):**
"Rodger, seu site ta bonito. Mas eu identifiquei que voce perde alunos porque nao tem sistema de retencao. Vou construir um CRM que acompanha cada aluno, manda lembrete automatico pra ele agendar a proxima aula, e mostra pra voce num dashboard quantos alunos estao ativos e quanto ta entrando por mes. Quando um aluno completa o basico, o sistema convida ele pro intermediario. No aniversario dele, manda um desconto. Isso transforma aluno avulso em aluno recorrente."

### Mudanca estrutural na AutomaWeb

A longo prazo, a AutomaWeb pode evoluir de "agencia de sites" pra "fabrica de micro-SaaS white-label":

```
ANTES (agencia classica):
  Site bonito + conteudo social → projeto unico → cliente cancela em 3 meses

DEPOIS (modelo Emmanuel):
  Site bonito + sistema operacional do negocio → subscription → cliente nao cancela nunca
```

**Modulos reutilizaveis que podem virar produto:**

| Modulo | Nichos que usam |
|--------|----------------|
| Booking + retencao | Qualquer servico recorrente (professor, dentista, personal, barbearia) |
| Mini-CRM por nicho | Qualquer negocio com clientes recorrentes |
| Dashboard com identidade da marca | Todos (substitui interfaces genericas tipo HubSpot) |
| Modo apresentacao | Boutiques, consultorios, imoveis, fotografia |
| Compliance tracker | Seguranca, saude, juridico |
| Funil automatizado | Criadores de conteudo, infoprodutores |

Cada modulo e construido uma vez e adaptado por tenant. O custo marginal por cliente cai, o valor percebido sobe.

---

## Resumo executivo

| Insight | Implicacao pra AutomaWeb |
|---------|--------------------------|
| Ninguem quer site, quer dinheiro | Mudar o pitch de "site bonito" pra "sistema que resolve" |
| $250/mes por sistema customizado | Nosso subscription precisa entregar valor operacional, nao so estetica |
| Claude Code = micro-SaaS em 1 semana | Temos a ferramenta. Falta o framework de discovery por nicho |
| Retencao por valor, nao por contrato | Construir ferramentas que geram mais receita pro cliente do que custam |
| Nicho > generico | Focar em 1-2 nichos, dominar os problemas, replicar a solucao |
| Demo antes do cliente | Construir prototipos funcionais pra abordar prospects frio |

---

> Fonte: Entrevista Tyler Moore + Emmanuel Diaz (YouTube, junho 2026)
> Analise aplicada ao contexto AutomaWeb/MazyOS
