# Blueprint — Site Ideal para Professor de Ingles Online

> **Baseado em:** auditoria empirica de 6 sites reais (Prof. Kenny, Fluencypass,
> Full English, Makeasy English, Kultivi, Ingles com a Gringa)
> **Protocolo:** MazyOS (15 skills + sistema de memoria + Playwright MCP)
> **Data:** 06/06/2026

---

## PONTOS FORTES EXTRAIDOS

### Prof. Kenny — O que ele faz bem

| # | Ponto forte | Aprendizado |
|---|------------|-------------|
| 1 | **Dominacao de SERP** — 4 dominios-satelite (Fluencypass, Makeasy, Full English, Kultivi) todos redirecionam pro mesmo funil | Ocupar multiplas posicoes no Google = monopolizar a primeira pagina pra mesma busca |
| 2 | **Stack de tracking completo** — FB Pixel + GTM + GA4 + Google Ads + Hotjar + Clarity + VK Digital + Reclame Aqui | Nenhum visitante passa despercebido; dados comportamentais em triangulacao |
| 3 | **Cross-domain tracking** — VK Digital rastreia entre dominios, atribuindo conversao mesmo vindo de outro site | Remarketing segue o lead entre sites |
| 4 | **Prova social massiva** — "200 mil alunos" repetido + selo Reclame Aqui RA1000 | Numero grande + selo verificavel = confianca instantanea |
| 5 | **5 pontos de WhatsApp** na landing page | Nao deixa o visitante sair sem ter como falar |
| 6 | **Formulario com DDI** — seletor de pais | Captura de brasileiros no exterior (mercado enorme) |
| 7 | **Velocidade** — 741ms page load, 167ms TTFB com 123 imagens e 30 scripts | Performance real, nao so no Lighthouse |
| 8 | **Lazy loading massivo** — 80/123 imagens | Otimizacao de performance aplicada |
| 9 | **Multi-plataforma** — FB, IG, YouTube, TikTok, Pinterest, Blog | Presenca em todos os canais relevantes |
| 10 | **Remarketing infraestrutura** — Hotjar (heatmaps) + Clarity (session replay) + FB Pixel (retargeting) | Dados qualitativos + quantitativos cruzados |

### Gringa — O que ela faz bem

| # | Ponto forte | Aprendizado |
|---|------------|-------------|
| 1 | **Proposta unica cristalina** — "Professora nativa americana" | Diferencial impossivel de copiar; toda a copy gira em torno disso |
| 2 | **Metodo com nome proprio** — LEAC (Leitura, Escrita, Audicao, Conversacao) | Transforma curso generico em "sistema exclusivo" |
| 3 | **Modelo de acesso vitalicio** — pagamento unico, sem mensalidade | Elimina a principal objecao ("e se eu parar de pagar?") |
| 4 | **Ancoragem de preco** — Escola (R$36k) vs Intercambio (R$50k) vs Gringa (12x R$39,90) | Contraste devastador; preco parece irrisorio |
| 5 | **Celebridade** — Gil do Vigor (Forbes Under 30) + aparicao na Globo | Autoridade instantanea por associacao |
| 6 | **Video de 9 minutos** antes do preco | Aquece e qualifica; filtra curiosos |
| 7 | **7 CTAs distribuidos** pela pagina | Nao importa onde o visitante decida, tem botao ali |
| 8 | **Comparativo visual** — Escola vs Intercambio vs Gringa em 3 colunas | Destroi objecoes de preco sem precisar argumentar |
| 9 | **Garantia como bloco emocional** — secao propria com copy "voce nao precisa ter medo" | Muito mais forte que um badge generico |
| 10 | **Marquee animado** — CONQUISTA / FLUIDEZ / LIBERDADE / REALIDADE em loop | Cria estado emocional sem ocupar espaco |
| 11 | **FAQ com 11 perguntas** em accordion | Cobre todas as objecoes comuns de uma vez |
| 12 | **628ms page load** — mais rapida que o Kenny mesmo sendo WordPress | Prova que WP bem configurado compete |

---

## FRAQUEZAS DE AMBOS

| Fraqueza | Kenny | Gringa | Solucao no site ideal |
|----------|-------|--------|----------------------|
| Schema JSON-LD | Ausente | Ausente | Course + FAQPage + Organization + Review |
| H1 | 6 tags | 0 tags | Exatamente 1, com keyword principal |
| Meta tags OG | Inconsistentes | Ausentes | Completas e alinhadas com canonical |
| Alt text | 70% ausente | Nao auditado | 100% preenchido |
| LGPD | Sem banner | Sem banner | Banner com bloqueio real de trackers |
| Formulario | GET (inseguro) | Quebrado (!) | POST + validacao + fallback WhatsApp |
| Conteudo recorrente | Blog fraco | Inexistente | Pipeline automatizado `/publicar-tema` |
| Pos-lead | Desconhecido | Inexistente | Brevo + WhatsApp automatizados |
| Mobile CTA | Sem sticky | Sem sticky | Botao fixo no mobile |
| Remarketing email | Desconhecido | Inexistente | Brevo com sequencias segmentadas |
| WhatsApp como canal | Links soltos | 2 numeros (erro) | Fluxo estruturado com automacao |

---

## O SITE IDEAL — ESTRUTURA DA LANDING PAGE

### Principio

Combinar a **maquina de trafego e tracking do Kenny** com a **persuasao
emocional e clareza de proposta da Gringa**. Cada bloco abaixo indica
qual skill MazyOS executa.

---

### BLOCO 1 — HERO (acima da dobra)

```
[LOGO + MENU MINIMO]

H1: "{Nome do metodo}: Fale Ingles em {X} Meses com {Diferencial Unico}"
Sub: Frase que conecta dor com solucao

[VIDEO 60-90s mobile / 5-10min desktop]

[FORMULARIO COMPACTO: Nome + Email + WhatsApp]
[CTA: "QUERO COMECAR AGORA"]

[BADGES: Garantia X dias | Acesso vitalicio | +X mil alunos | Certificado]
```

| Skill MazyOS | Acao |
|-------------|------|
| `/seo` etapa 04 | H1 otimizado, meta tags, Schema Course |
| `/carrossel` | Badges visuais, identidade visual |
| Playwright MCP | Testar formulario periodicamente |

**Por que:** Kenny poe formulario so no rodape. Gringa tem 7 CTAs mas formulario so no final. O ideal captura JA na hero.

---

### BLOCO 2 — PROVA SOCIAL IMEDIATA

```
[CONTADOR ANIMADO: "+{X} mil alunos em {Y} paises"]
[SELO RECLAME AQUI] [NOTA GOOGLE] [APARICOES NA MIDIA]
[MARQUEE: FLUENCIA | LIBERDADE | CONFIANCA | RESULTADO]
```

| Skill MazyOS | Acao |
|-------------|------|
| `/responder-avaliacoes` | Manter nota Google alta com respostas humanizadas |
| `/seo` etapa 03 (GMB) | Otimizar perfil Google Meu Negocio |

---

### BLOCO 3 — DOR + COMPARATIVO DE PRECOS

```
ESCOLA TRADICIONAL     vs     INTERCAMBIO     vs     {SEU CURSO}
R$ 400-600/mes                R$ 20.000-50.000       12x R$ XX,XX
3-5 anos                      1-6 meses              Acesso vitalicio
Horario fixo                  Precisa viajar         Qualquer hora
```

| Skill MazyOS | Acao |
|-------------|------|
| `/seo` etapa 02 | Pesquisa de concorrentes pra dados reais |
| `/carrossel` | Versao visual do comparativo pra Instagram |

**Licao Gringa:** A secao de comparativo e a mais persuasiva da pagina inteira. Kenny nao tem nada parecido.

---

### BLOCO 4 — METODO (diferencial intelectual)

```
[H2: "Conheca o Metodo {NOME}"]
[4 PILARES VISUAIS com icones]
[VIDEO ou ANIMACAO do metodo em acao]
```

| Skill MazyOS | Acao |
|-------------|------|
| `/publicar-tema` | Artigo de blog detalhando o metodo (SEO) |
| `/carrossel` | Carrossel educativo sobre cada pilar |

**Licao Gringa:** LEAC transforma "curso de ingles" em "sistema exclusivo". Kenny nao tem metodo nomeado = generico.

---

### BLOCO 5 — CONTEUDO DO CURSO

```
[H2: "Tudo o Que Voce Recebe"]
- X modulos do zero a fluencia
- Exercicios interativos
- Certificado + Bonus
- Atualizacoes sem custo
[MOCKUP da plataforma em 3 dispositivos]
```

---

### BLOCO 6 — DEPOIMENTOS

```
[CARROSSEL escrito: 4+ com foto + nome + cidade]
[1-2 VIDEOS curtos de alunos reais (15-30s)]
[DEPOIMENTO VIP: celebridade ou figura publica]
[CTA: "QUERO ESSES RESULTADOS"]
```

| Skill MazyOS | Acao |
|-------------|------|
| `/carrossel` | Posts de depoimento pro Instagram |
| `/publicar-tema` | Case de sucesso como artigo de blog |

---

### BLOCO 7 — SOBRE O PROFESSOR

```
[FOTO + BIO emocional: 3-4 frases]
[LOGOS de midia onde apareceu]
```

---

### BLOCO 8 — URGENCIA + OFERTA + FORMULARIO

```
[BADGE: "Oferta por tempo limitado"]
DE: R$ X.XXX → POR: 12x R$ XX,XX

[FORMULARIO: Nome + Email + WhatsApp]
[CTA: "GARANTIR MINHA VAGA"]
[BADGES: Pagamento seguro | Garantia | Acesso imediato]
```

| Skill MazyOS | Acao |
|-------------|------|
| Playwright MCP | Monitorar formulario (nunca mais quebrar sem perceber como a Gringa) |
| `/anuncio-google` | Campanhas apontando pra essa secao (#cta) |

---

### BLOCO 9 — GARANTIA

```
[H2: "Voce Nao Tem Nada a Perder"]
[Copy emocional + icone de escudo]
[CTA: "COMECAR SEM RISCO"]
```

**Licao Gringa:** Bloco inteiro dedicado a garantia >>> badge generico no rodape.

---

### BLOCO 10 — FAQ (accordion + Schema)

```
[10-12 perguntas em accordion]
[Schema FAQPage embutido no JSON-LD]
```

| Skill MazyOS | Acao |
|-------------|------|
| `/seo` etapa 04 | Schema FAQPage pronto pra copiar |
| `/seo` etapa 08 (GEO) | FAQ otimizado pra respostas de IA (ChatGPT/Gemini) |

**Perguntas essenciais (empiricas dos 6 sites):**
1. Preciso saber algo de ingles para comecar?
2. Como sao as aulas?
3. Qual e a metodologia?
4. Quanto tempo leva para ficar fluente?
5. Como acesso o curso depois da compra?
6. Posso assistir pelo celular / offline?
7. E assinatura mensal ou pagamento unico?
8. Tem certificado?
9. Qual a garantia?
10. Sera que realmente consigo aprender?

---

### BLOCO 11 — SUPORTE + RODAPE

```
[CTA WHATSAPP: "Fale com a gente agora"]
[WHATSAPP UNICO — 1 numero, nao 2 como a Gringa]
[CNPJ + Email + Redes + Politicas]
```

### ELEMENTO FIXO — WHATSAPP FLUTUANTE

```
[BOTAO canto inferior direito, pulso sutil a cada 30s]
[MOBILE: sticky bar na parte inferior]
[TEXTO: "Duvidas? Resposta em 2 min"]
```

---

## SEO TECNICO OBRIGATORIO

Tudo executado por `/seo` (8 etapas):

| Item | Especificacao | Etapa `/seo` |
|------|--------------|-------------|
| H1 | Exatamente 1, keyword principal | Etapa 04 |
| Meta title | 50-60 chars, keyword + marca | Etapa 04 |
| Meta description | 120-155 chars, com CTA implicito | Etapa 04 |
| Canonical | Unico, = og:url | Etapa 04 |
| og:title/description/image/url | Completas e consistentes | Etapa 04 |
| twitter:card | summary_large_image | Etapa 04 |
| Schema JSON-LD | Course, FAQPage, Organization, AggregateRating | Etapa 04 |
| Alt text | 100% das imagens | Etapa 04 |
| Hierarquia | H1 > H2 > H3 sem pular | Etapa 04 |
| Keywords | 30-50 termos classificados | Etapa 01 |
| Concorrentes | Gaps e oportunidades mapeados | Etapa 02 |
| GMB | Perfil completo otimizado | Etapa 03 |
| Conteudo | Calendario editorial + clusters | Etapa 05 |
| Google Ads | CSV pronto pra importar | Etapa 06 |
| Monitoramento | Checklist semanal/mensal | Etapa 07 |
| GEO | Aparecer no ChatGPT/Gemini/Perplexity | Etapa 08 |

### Performance

| Item | Meta |
|------|------|
| Page Load | < 700ms (Kenny: 741, Gringa: 628) |
| TTFB | < 200ms |
| LCP | < 2.5s |
| CLS | < 0.1 |
| Lazy loading | Todas as imagens abaixo da dobra |
| Formato | WebP/AVIF (nao PNG) |
| Scripts | defer/async em tudo nao-critico |

### Seguranca e LGPD

| Item | Requisito |
|------|-----------|
| Formulario | method="POST" (4/6 sites usam GET = dados na URL) |
| HTTPS | Obrigatorio |
| rel="noopener" | Todo link target="_blank" (Kenny tem 15 sem) |
| Banner LGPD | Bloqueio real de trackers ate consentimento |
| Politicas | Privacidade + Termos em paginas proprias |

### Tracking (via GTM — container unico)

| Ferramenta | Funcao |
|-----------|--------|
| Google Tag Manager | Container unico pra todos os pixels |
| Google Analytics 4 | Analytics (producao, NAO debug como o Kenny) |
| Facebook Pixel | Retargeting Meta |
| Google Ads tag | Remarketing Google |
| Clarity OU Hotjar | Heatmaps (1 dos 2, nao ambos como Kenny) |
| Brevo tracking | Remarketing email (detalhe abaixo) |

---

## WHATSAPP — ESTRATEGIA COMPLETA

### Diagnostico empirico

| Site | WhatsApp | Problema |
|------|----------|----------|
| Kenny | 5 links soltos na pagina | Sem fluxo; lead cai num chat generico |
| Gringa | 2 numeros diferentes (FAQ vs Rodape) | Confunde o visitante |
| Full English | 1 link (wa.me) | Basico, sem mensagem pre-preenchida |
| Todos | Nenhum tem automacao | WhatsApp e so um link, nao um canal |

### O que o site ideal faz com WhatsApp

#### 1. Ponto unico de contato

- 1 numero apenas (WhatsApp Business API)
- Mensagem pre-preenchida contextual por bloco da pagina:

```
Hero:     "Oi! Vim do site e quero saber mais sobre o curso"
Oferta:   "Oi! Quero garantir minha vaga no curso de ingles"
FAQ:      "Oi! Tenho uma duvida sobre o curso"
Garantia: "Oi! Quero comecar sem risco"
```

Cada link tem UTM: `?text=...&source=landing-hero` — assim o atendente
(ou bot) sabe de onde veio.

#### 2. Botao flutuante inteligente

```
COMPORTAMENTO:
- Aparece apos 30s na pagina (nao imediatamente)
- Pulso sutil a cada 30s
- No mobile: sticky bar inferior (nao flutuante que tampa conteudo)
- Texto muda conforme scroll:
  - Topo: "Tire suas duvidas"
  - Meio (apos depoimentos): "Fale com quem ja fez o curso"
  - Oferta: "Garanta sua vaga agora"
```

#### 3. WhatsApp como fallback de formulario

```
[FORMULARIO FALHOU?]
   |
   v
"Ops, algo deu errado. Clique aqui pra se inscrever pelo WhatsApp"
   |
   v
wa.me/55XXXXXXXXXXX?text=Oi! O formulario deu erro, quero me inscrever
```

**Licao Gringa:** O formulario dela retorna erro e o lead SOME. Com fallback WhatsApp, zero perda.

#### 4. Fluxo automatizado de qualificacao (chatbot)

```
LEAD ENTRA NO WHATSAPP
   |
   v
BOT: "Oi {nome}! Que bom que voce tem interesse no curso.
      Pra te ajudar melhor, me conta:"
   |
   v
[PERGUNTA 1] "Qual seu nivel de ingles hoje?"
   [ ] Zero — nunca estudei
   [ ] Basico — entendo um pouco
   [ ] Intermediario — consigo me virar
   [ ] Avancado — quero fluencia
   |
   v
[PERGUNTA 2] "Qual seu principal objetivo?"
   [ ] Trabalho / carreira
   [ ] Viagem
   [ ] Morar fora
   [ ] Estudar no exterior
   [ ] Hobby / cultura
   |
   v
[PERGUNTA 3] "Quando quer comecar?"
   [ ] Agora mesmo
   [ ] Essa semana
   [ ] Esse mes
   [ ] So pesquisando
   |
   v
ROTEAMENTO:
   "Agora mesmo" + qualquer nivel → OFERTA DIRETA + link pagamento
   "Essa semana" → OFERTA + gatilho de urgencia
   "Esse mes" → NURTURING (sequencia Brevo)
   "So pesquisando" → LEAD MAGNET (mini-curso gratis) + nurturing
```

#### 5. Remarketing via WhatsApp (pos-interacao)

```
LEAD NAO COMPROU APOS CHAT
   |
   +-- [24h] Mensagem 1: "Oi {nome}! Vi que voce ficou interessado(a).
   |   Tem alguma duvida que posso resolver?"
   |
   +-- [48h] Mensagem 2: Depoimento em video de aluno
   |   "{Nome do aluno} comecou do zero e em 6 meses ja fazia
   |   reunioes em ingles. Assista: [link]"
   |
   +-- [72h] Mensagem 3: Oferta com bonus exclusivo
   |   "Pra quem se inscrever ate amanha: modulo bonus de
   |   pronuncia americana + 1 aula ao vivo com o professor"
   |
   +-- [5 dias] Mensagem 4: Ultimo aviso
   |   "Essa e a ultima vez que falo sobre isso. A condicao
   |   especial encerra hoje. Depois volta pro preco cheio."
   |
   +-- [7 dias] Silencio (respeitar o lead)
```

**Regras:**
- Maximo 4 mensagens de follow-up
- Parar imediatamente se responder "nao tenho interesse"
- Horario: seg-sex 9h-20h, sab 9h-14h (nunca domingo)
- Cada mensagem deve ter opcao de sair: "Responda SAIR pra parar de receber"

#### 6. WhatsApp pos-compra (onboarding + upsell)

```
ALUNO COMPROU
   |
   +-- [Imediato] "Parabens, {nome}! Seu acesso ta liberado.
   |   Clica aqui pra acessar: [link]. Qualquer duvida, e so chamar!"
   |
   +-- [1h] "Dica: comeca pelo Modulo 1, Aula 1. Sao so 15 minutos
   |   e voce ja vai sentir a diferenca."
   |
   +-- [3 dias] "E ai, {nome}! Ja fez as primeiras aulas?
   |   O que achou? Conta pra gente!"
   |
   +-- [7 dias] Pedir depoimento:
   |   "Voce ta ha 1 semana no curso! Se tiver gostando,
   |   podia gravar um audio de 30s contando sua experiencia?
   |   Ajuda demais outros alunos que tao na duvida."
   |
   +-- [14 dias] Upsell:
   |   "Ja que voce ta mandando bem, conhece o [Produto Premium]?
   |   Alunos do curso tem 30% de desconto: [link]"
   |
   +-- [30 dias] NPS:
       "De 0 a 10, quanto voce recomendaria o curso pra um amigo?
       Responde com o numero!"
       |
       +-- 9-10: pedir indicacao + link de desconto pra amigo
       +-- 7-8: agradecer + perguntar o que melhoraria
       +-- 0-6: acionar suporte humano imediatamente
```

| Skill MazyOS | Acao |
|-------------|------|
| `/email-profissional` | Redigir cada mensagem da sequencia |
| `/mapear-rotinas` | Criar skill `/whatsapp-fluxo` |
| `_memoria/preferencias.md` | Tom calibrado em todas as mensagens |

### Ferramentas pra implementar

| Ferramenta | Funcao | Custo |
|-----------|--------|-------|
| **WhatsApp Business API** (via 360dialog, Twilio ou Meta Cloud API) | Envio de mensagens template + chatbot | A partir de R$0,25/msg |
| **ManyChat** ou **Botpress** | Builder de fluxo visual (sem codigo) | Freemium |
| **N8N** (self-hosted) ou **Make** | Orquestrador: conecta WhatsApp + Brevo + CRM | Open source / pago |
| **Brevo** | Dispara sequencia de email sincronizada | Freemium |

---

## BREVO — REMARKETING POR EMAIL

### Por que Brevo

| Criterio | Brevo | ActiveCampaign | Mailchimp |
|---------|-------|---------------|-----------|
| Preco pra ate 10k contatos | Gratis (300 emails/dia) | ~R$350/mes | ~R$250/mes |
| Automacao visual | Sim | Sim | Limitado |
| WhatsApp API nativa | Sim | Nao | Nao |
| SMS | Sim | Nao nativo | Nao nativo |
| CRM embutido | Sim (basico) | Sim (avancado) | Nao |
| Formularios + landing pages | Sim | Sim | Sim |
| API aberta | Sim | Sim | Sim |

**Brevo e a unica plataforma que integra email + WhatsApp + SMS numa automacao so.** Isso elimina a necessidade de orquestrador externo pra sequencias simples.

### Configuracao no site ideal

#### Tracking pixel do Brevo

```html
<!-- No <head>, via GTM (disparar apos consentimento LGPD) -->
<script>
  (function() {
    var se = document.createElement('script');
    se.type = 'text/javascript';
    se.async = true;
    se.src = 'https://sibautomation.com/sa.js?key=SEU_KEY';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(se, s);
  })();
</script>
```

Esse pixel permite:
- Rastrear quais paginas o lead visitou
- Criar segmentos baseados em comportamento (visitou pagina de preco, viu FAQ, etc.)
- Disparar automacoes baseadas em acao no site

#### Captura de leads

```
FORMULARIO DO SITE (method POST)
   |
   v
WEBHOOK → Brevo (criar contato + adicionar a lista)
   |
   v
Brevo atribui tags:
   - "lead-landing" (origem)
   - "nivel-zero" / "nivel-basico" / etc. (se tiver quiz)
   - "objetivo-trabalho" / "objetivo-viagem" / etc.
   |
   v
DISPARA AUTOMACAO correspondente
```

### Sequencia 1 — LEAD NAO COMPROU (carrinho abandonado)

```
LEAD PREENCHEU FORMULARIO MAS NAO PAGOU
   |
   +-- [Imediato] Email 1: "Faltou pouco!"
   |   Assunto: "{Nome}, sua vaga ta reservada por 24h"
   |   Corpo: Recap dos beneficios + link direto pro pagamento
   |   CTA: "FINALIZAR INSCRICAO"
   |
   +-- [30 min] WhatsApp 1 (via Brevo):
   |   "Oi {nome}! Vi que voce comecou a se inscrever.
   |   Posso te ajudar com alguma duvida?"
   |
   +-- [24h] Email 2: Depoimento
   |   Assunto: "O que a {Aluna} disse depois de 3 meses"
   |   Corpo: Historia real + resultado concreto + foto
   |   CTA: "QUERO ESSE RESULTADO"
   |
   +-- [48h] Email 3: FAQ
   |   Assunto: "As 5 duvidas mais comuns sobre o curso"
   |   Corpo: Top 5 perguntas respondidas + garantia de 7 dias
   |   CTA: "COMECAR SEM RISCO"
   |
   +-- [72h] WhatsApp 2 (via Brevo):
   |   "{Nome}, liberamos um bonus exclusivo pra quem se inscrever
   |   ate amanha: [descrever bonus]. Link: [url]"
   |
   +-- [5 dias] Email 4: Ultimo aviso
   |   Assunto: "Ultima chance: {bonus} expira hoje"
   |   Corpo: Escassez real + recap + CTA final
   |   CTA: "GARANTIR AGORA"
   |
   +-- [7 dias] FIM DA SEQUENCIA
       Lead move pra lista "frios" — recebe apenas conteudo
       educativo (newsletter mensal) ate reengajar
```

### Sequencia 2 — ALUNO COMPROU (onboarding + upsell)

```
PAGAMENTO CONFIRMADO
   |
   +-- [Imediato] Email 1: Boas-vindas
   |   Assunto: "Bem-vindo(a), {nome}! Seu acesso esta liberado"
   |   Corpo: Link de acesso + como comecar + contato do suporte
   |
   +-- [Imediato] WhatsApp: "Parabens! Acesso liberado: [link]"
   |
   +-- [3 dias] Email 2: Engajamento
   |   Assunto: "Ja fez a primeira aula, {nome}?"
   |   Corpo: Dica de como aproveitar melhor + link da Aula 1
   |   Condicional: se abriu email 1 mas nao logou na plataforma
   |
   +-- [7 dias] Email 3: Depoimento + progresso
   |   Assunto: "Voce ja ta 1 semana a frente de 90% das pessoas"
   |   Corpo: Reforco motivacional + stats de progresso
   |
   +-- [14 dias] Email 4: Pedir depoimento
   |   Assunto: "Conta pra gente: como ta sendo sua experiencia?"
   |   Corpo: Form de 3 perguntas curtas + opcao de gravar audio
   |   Tag Brevo: "depoimento-coletado" se responder
   |
   +-- [21 dias] Email 5: Upsell
   |   Assunto: "Proximo nivel: {Produto Premium} com 30% OFF pra alunos"
   |   Corpo: Beneficios do upgrade + preco exclusivo + prazo
   |   Condicional: so se completou >50% do curso
   |
   +-- [30 dias] Email 6: NPS
       Assunto: "1 pergunta rapida (leva 5 segundos)"
       Corpo: "De 0 a 10, quanto recomendaria?" + link de pesquisa
       |
       +-- Score 9-10: email automatico com link de indicacao
       +-- Score 7-8: email de agradecimento
       +-- Score 0-6: alerta pro suporte humano intervir
```

### Sequencia 3 — LEAD FRIO (reengajamento)

```
LEAD NAO COMPROU APOS SEQUENCIA 1 (7+ dias)
   |
   Move pra lista "nurturing"
   Recebe: 1 email educativo por semana (conteudo do blog)
   |
   +-- [Semana 1] Artigo: "X erros que todo iniciante comete em ingles"
   +-- [Semana 2] Artigo: "Como aprender ingles em 15 min por dia"
   +-- [Semana 3] Artigo: "A diferenca entre ouvir e escutar em ingles"
   +-- [Semana 4] OFERTA DE REATIVACAO
   |   "Faz 1 mes que voce visitou nosso curso.
   |   Nesse periodo, {X} novos alunos comecaram.
   |   Condicao especial pra quem volta: [desconto]"
   |
   Condicional Brevo:
   - Se abriu 2+ emails nas ultimas 4 semanas → continua recebendo
   - Se nao abriu nenhum → parar (nao queimar reputacao do dominio)
```

### Segmentacao no Brevo

| Segmento | Criterio | Acao |
|---------|---------|------|
| Lead quente | Visitou pagina de preco + abriu 2+ emails | Oferta direta + WhatsApp |
| Lead morno | Abriu emails mas nao visitou preco | Conteudo educativo + case |
| Lead frio | Nao abre emails ha 30 dias | Parar envios (higiene de lista) |
| Aluno ativo | Logou na plataforma nos ultimos 7 dias | Upsell + pedir depoimento |
| Aluno inativo | Nao logou ha 14+ dias | Email de reengajamento + WhatsApp |
| Promotor (NPS 9-10) | Respondeu NPS alto | Programa de indicacao |
| Detrator (NPS 0-6) | Respondeu NPS baixo | Suporte humano imediato |

### Integracao Brevo + WhatsApp (na mesma automacao)

```
AUTOMACAO BREVO (fluxo visual):

[Trigger: Lead criado]
   |
   v
[Email 1: Boas-vindas]
   |
   +-- [Esperou 30 min]
   |
   v
[Condicao: Abriu email?]
   |          |
   SIM        NAO
   |          |
   v          v
[Tag: engajado]   [WhatsApp: "Oi {nome}! Mandamos
   |               um email com seus dados de acesso.
   v               Nao recebeu? Me conta aqui que
[Seguir fluxo]     te ajudo!"]
```

**Vantagem Brevo:** Essa automacao email + WhatsApp e nativa — nao precisa de N8N, Make ou Zapier.

---

## FUNIL COMPLETO COM AUTOMACOES MazyOS

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOPO — AQUISICAO
│
├── /seo (8 etapas) ──────── SEO completo + GEO
├── /anuncio-google ──────── Campanhas Search + Display
├── /publicar-tema ───────── Blog + carrossel + legendas
├── /carrossel ───────────── Conteudo social avulso
├── /aprovar-post ────────── Publicacao auto Instagram + FB
│
MEIO — CONVERSAO
│
├── Landing page (este blueprint)
├── Formulario POST ──────── Lead capturado
│   ├── OK ────────────────── Webhook → Brevo + WhatsApp
│   └── ERRO ──────────────── Fallback WhatsApp automatico
├── WhatsApp qualificacao ── Chatbot com 3 perguntas
├── Brevo Seq. 1 ─────────── Carrinho abandonado (4 emails + 2 WhatsApp)
│
FUNDO — CONVERSAO FINAL
│
├── Pagamento ─────────────── Checkout integrado
├── Brevo Seq. 2 ─────────── Onboarding (6 emails + WhatsApp)
├── WhatsApp pos-compra ───── Ativacao + depoimento + upsell
│
POS-VENDA — RETENCAO E CRESCIMENTO
│
├── /responder-avaliacoes ── Google Reviews humanizadas
├── /relatorio-ads ────────── Performance semanal
├── /analisar-dados ───────── Insights consolidados
├── Brevo Seq. 3 ─────────── Reengajamento de frios
├── NPS → Indicacao ───────── Programa de referral via WhatsApp
├── Upsell ────────────────── Produto premium com desconto exclusivo
│
MONITORAMENTO CONTINUO
│
├── Playwright MCP ────────── Auditoria mensal do site
├── /relatorio-ads ────────── Semanal (Google + Meta)
├── /seo etapa 07 ─────────── Checklist mensal de posicoes
├── /mapear-rotinas ───────── Novas automacoes conforme surgem

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## SKILLS MazyOS — EXISTENTES x NOVAS

### Skills existentes que ja cobrem o funil

| Skill | Fase do funil | Acao |
|-------|-------------|------|
| `/seo` | Topo | 8 etapas: keywords, concorrencia, GMB, on-page, conteudo, Ads, monitoramento, GEO |
| `/anuncio-google` | Topo | CSV completo pra Google Ads Editor |
| `/publicar-tema` | Topo | Blog + carrossel + legendas em 1 comando |
| `/carrossel` | Topo | Conteudo visual 1080x1350 com identidade |
| `/aprovar-post` | Topo | Publicacao auto: blog + Instagram + Facebook |
| `/relatorio-ads` | Monitoramento | KPIs, alertas, acoes semanais |
| `/responder-avaliacoes` | Pos-venda | Respostas humanizadas por nota |
| `/email-profissional` | Transversal | Email calibrado por destinatario e objetivo |
| `/analisar-dados` | Monitoramento | Summary executivo com insights |
| `/mapear-rotinas` | Transversal | Descoberta + criacao de skills novas |

### Skills novas necessarias

| Skill | O que faz | Fase | Prioridade |
|-------|----------|------|-----------|
| `/auditar-site` | Navega URL, testa formulario, verifica SEO/performance/UX, gera relatorio | Monitoramento | ALTA — este case provou que funciona |
| `/whatsapp-fluxo` | Cria fluxo conversacional (qualificacao, FAQ, oferta, follow-up) com mensagens prontas | Meio/Fundo | ALTA — WhatsApp e o canal #1 no Brasil |
| `/email-sequencia` | Cria sequencia de N emails (carrinho abandonado, onboarding, nurturing) com timing, condicoes e copy | Meio/Fundo | ALTA — Brevo precisa de conteudo |
| `/lead-magnet` | Mini-curso gratis, quiz de nivel ou e-book + landing de captura + carrossel de divulgacao | Topo | MEDIA — amplia topo de funil |
| `/dominio-satelite` | Cria microsite otimizado pra keyword especifica (replica estrategia Kenny de forma limpa) | Topo | MEDIA — multiplica presenca na SERP |
| `/brevo-automacao` | Monta fluxo visual no Brevo (triggers, condicoes, emails, WhatsApp, tags) e exporta como config | Meio/Fundo | MEDIA — complementa `/email-sequencia` |

Todas criadas via `/mapear-rotinas`.

---

## CALENDARIO DE AUTOMACOES

| Frequencia | Acao | Skill | Canal |
|-----------|------|-------|-------|
| **Diaria** | Monitorar formulario de conversao | Playwright MCP | Site |
| **Diaria** | Brevo dispara sequencias automaticamente | `/email-sequencia` | Email + WhatsApp |
| **Semanal** | Publicar 1 blog + 1 carrossel | `/publicar-tema` + `/aprovar-post` | Blog + Instagram + FB |
| **Semanal** | Relatorio de Ads | `/relatorio-ads` | Google + Meta |
| **Semanal** | Responder avaliacoes Google | `/responder-avaliacoes` | GMB |
| **Quinzenal** | Email educativo pra lista de nurturing | `/email-sequencia` | Brevo |
| **Mensal** | Auditoria tecnica do site | `/auditar-site` | Playwright |
| **Mensal** | Revisar keywords e posicoes | `/seo` etapa 07 | Search Console |
| **Mensal** | Limpar lista Brevo (remover inativos) | `/brevo-automacao` | Brevo |
| **Trimestral** | Atualizar campanhas Google Ads | `/anuncio-google` | Google Ads |
| **Trimestral** | Revisar funil e conversao | `/analisar-dados` | Todos |

---

## LICOES EMPIRICAS

### O que funciona (fazer)

1. **Metodo com nome proprio** — transforma "curso de ingles" em sistema exclusivo (Gringa: LEAC)
2. **Ancoragem de preco com comparativo visual** — 3 colunas com X e check (Gringa)
3. **Video antes do preco** — aquece e filtra (Gringa: 9min)
4. **Tracking completo desde o dia 1** — FB + GTM + GA + heatmap (Kenny: 7 ferramentas)
5. **WhatsApp como canal estrategico** — nao so link, mas fluxo com qualificacao + remarketing
6. **Garantia como bloco emocional** — secao propria, nao badge (Gringa)
7. **Prova social com numero grande** — repetir varias vezes na pagina (Kenny: "200 mil")
8. **Email remarketing com Brevo** — sequencias automatizadas com WhatsApp integrado
9. **FAQ extenso + Schema** — cobre objecoes e alimenta SEO + GEO (Gringa: 11 perguntas)
10. **Dominios-satelite** — ocupar multiplas posicoes no Google (Kenny: 4 dominios)

### O que nao funciona (evitar)

1. **Formulario com GET** — 4/6 sites fazem. Dados na URL = violacao de privacidade
2. **Multiplos H1** — Google nao sabe o que a pagina e sobre (Kenny: 6)
3. **Imagens sem alt** — perde 70% do potencial de SEO de imagens (Kenny)
4. **Zero Schema** — NENHUM dos 6 sites tem. Rich snippets inexistentes no nicho
5. **2 numeros de WhatsApp** — confunde o lead (Gringa)
6. **Formulario so no rodape** — lead precisa rolar tudo pra converter (Kenny + Gringa)
7. **Formulario sem teste** — Gringa perde 100% das conversoes e ninguem percebe
8. **Sem LGPD** — 3/6 sites com dezenas de trackers sem consentimento
9. **GA debug em producao** — gera warnings e pesa a pagina (Kenny)
10. **WhatsApp sem fluxo** — 6/6 sites usam WhatsApp como link mudo, sem automacao

---

## CONCLUSAO

O nicho de cursos de ingles online tem **zero maturidade tecnica**:
- Nenhum dos 6 sites tem Schema JSON-LD (rich snippets inexistentes)
- Nenhum tem remarketing por email estruturado
- Nenhum usa WhatsApp como canal com fluxo automatizado
- 4/6 expoe dados pessoais na URL do formulario

O primeiro professor que implementar esse blueprint — SEO estruturado +
Brevo com sequencias + WhatsApp com fluxo — vai dominar o nicho sem
competicao real. E com o MazyOS, **80% disso e executado com skills que
ja existem**. Os 20% restantes sao 6 skills novas criadas via
`/mapear-rotinas`, todas derivadas do que esse case empirico revelou.
