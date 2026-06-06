# Especificação Técnica — Landing Page Rodger Koller

> **Data:** 06/06/2026
> **Status:** Especificação aprovada
> **Stack:** Next.js + Supabase + Brevo + WhatsApp Business API
> **Hospedagem:** Vercel (grátis)
> **Referência:** blueprint-site-ideal-prof-ingles.md

---

## STACK TÉCNICO

| Camada | Tecnologia | Custo |
|--------|-----------|-------|
| Frontend | Next.js (App Router) | Grátis (Vercel) |
| Banco de dados | Supabase (Postgres + RLS + Realtime) | Grátis até 50K rows |
| Storage (PDFs) | Supabase Storage | Grátis até 1GB |
| Email marketing | Brevo (automações + tracking pixel) | Grátis até 300 emails/dia |
| WhatsApp | WhatsApp Business API (via Brevo nativo) | ~R$0,25/msg template |
| Dashboard | Supabase Studio + views SQL customizadas | Grátis |
| Analytics | GA4 via GTM | Grátis |
| Heatmaps | Microsoft Clarity | Grátis |
| Formulário | React Hook Form → API Route → Supabase | — |
| Exit intent | JS nativo (mouseleave + timeout mobile) | — |
| Hero image | Gerada via ferramenta protocolar `ferramentas/gerador-hero-image.md` | — |
| DNS/SSL | Vercel (automático) | Grátis |

---

## ARQUITETURA

```
                    VISITANTE
                       │
                       ▼
              ┌────────────────┐
              │  Landing Page  │
              │   (Vercel)     │
              └───────┬────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │Formulário│ │Exit Intent│ │ Lead     │
   │ Principal│ │  Popup   │ │ Magnet   │
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │             │            │
        └─────────────┼────────────┘
                      │
                      ▼
            ┌───────────────────┐
            │  API Route        │
            │  /api/lead        │
            │  (Next.js)        │
            └────────┬──────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Supabase │ │  Brevo   │ │ WhatsApp │
  │ (dados)  │ │  (email) │ │ (chat)   │
  └────┬─────┘ └────┬─────┘ └──────────┘
       │             │
       ▼             ▼
  ┌──────────┐ ┌──────────┐
  │Dashboard │ │Sequências│
  │ (painel) │ │automáticas│
  └──────────┘ └──────────┘
```

---

## 1. ESTRUTURA DA LANDING PAGE — 11 BLOCOS

### BLOCO 1 — HERO (acima da dobra)

```
┌─────────────────────────────────────────────────────────┐
│ [LOGO Fly to Fluency]              [Menu: Método|FAQ]   │
│                                                         │
│  H1: "Método Koller: Fale Inglês                       │
│       com Quem Tem CPE de Cambridge"     ┌────────────┐ │
│                                          │            │ │
│  Sub: "34.000 alunos já provaram que     │  HERO IMG  │ │
│        imersão funciona. Agora é          │  (foto +   │ │
│        sua vez."                          │  avatar)   │ │
│                                          │            │ │
│  ┌─────────────────────────────┐         │    FADE →  │ │
│  │ Nome: [_______________]    │         └────────────┘ │
│  │ Email: [______________]    │                        │
│  │ WhatsApp: [___________]    │                        │
│  │                            │                        │
│  │ [ QUERO COMEÇAR AGORA ]    │                        │
│  └─────────────────────────────┘                        │
│                                                         │
│  [Garantia 7d] [Acesso vitalício] [+34K alunos] [CPE]  │
└─────────────────────────────────────────────────────────┘
```

| Elemento | Especificação |
|----------|--------------|
| H1 | Exatamente 1, com keyword "inglês" + diferencial Cambridge |
| Hero image | Gerada via `ferramentas/gerador-hero-image.md` — Rodger no terço direito, texto no esquerdo |
| Formulário | React Hook Form, 3 campos, validação client-side |
| CTA | Background azul (#1a73e8), texto branco, hover com scale(1.02) |
| Badges | 4 ícones SVG com texto, dispostos em row |
| Mobile | Formulário abaixo da hero image, CTA sticky no bottom |

### BLOCO 2 — PROVA SOCIAL IMEDIATA

```
┌─────────────────────────────────────────────────────────┐
│  [CONTADOR ANIMADO]  +34.000 alunos em 15+ países       │
│                                                         │
│  [★★★★★ 4.8] Hotmart    [CPE+CELTA] Cambridge          │
│                                                         │
│  ═══ FLUÊNCIA ═ IMERSÃO ═ RESULTADO ═ CONFIANÇA ═══    │
│                        (marquee animado)                 │
└─────────────────────────────────────────────────────────┘
```

| Elemento | Especificação |
|----------|--------------|
| Contador | Intersection Observer + animação de 0 até 34.000 (2s) |
| Marquee | CSS animation infinite, pausa no hover |
| Selo Hotmart | Badge "Top Rated" + nota 4.8 |
| Mobile | Contador menor, marquee em velocidade reduzida |

### BLOCO 3 — DOR + COMPARATIVO DE PREÇOS

```
┌─────────────────────────────────────────────────────────┐
│  H2: "Por que o Método Koller custa uma fração?"        │
│                                                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐       │
│  │  ESCOLA   │  │INTERCÂMBIO│  │ MÉTODO KOLLER │       │
│  │ TRADICION.│  │           │  │   ★ MELHOR ★  │       │
│  ├───────────┤  ├───────────┤  ├───────────────┤       │
│  │R$400-600  │  │R$20.000-  │  │  12x R$XX,XX  │       │
│  │  /mês     │  │  50.000   │  │  (pgto único) │       │
│  │ 3-5 anos  │  │ 1-6 meses │  │Acesso vitalíc.│       │
│  │Horário fix│  │Precisa    │  │Qualquer hora  │       │
│  │Sem acomp. │  │  viajar   │  │Acomp. 1 ANO   │       │
│  └───────────┘  └───────────┘  └───────────────┘       │
│                                                         │
│  [ QUERO O MELHOR CUSTO-BENEFÍCIO → ]                   │
└─────────────────────────────────────────────────────────┘
```

### BLOCO 4 — MÉTODO KOLLER

```
┌─────────────────────────────────────────────────────────┐
│  H2: "Conheça o Método Koller"                          │
│                                                         │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐                        │
│  │ 01 │  │ 02 │  │ 03 │  │ 04 │                        │
│  │    │  │    │  │    │  │    │                        │
│  │LEG.│  │LEG.│  │SEM │  │REP.│                        │
│  │ PT │  │ EN │  │LEG.│  │TUDO│                        │
│  └────┘  └────┘  └────┘  └────┘                        │
│  Assista   Anote   Treine  Repita                       │
│  com leg.  vocab.  listen. com todos                    │
│  PT-BR     novo    puro    os vídeos                    │
│                                                         │
│  [VÍDEO: Método em ação — 2min]                         │
│                                                         │
│  "Quanto mais contato com inglês, melhor você            │
│   saberá inglês." — Rodger Koller                       │
└─────────────────────────────────────────────────────────┘
```

### BLOCO 5 — CONTEÚDO DO CURSO

```
┌─────────────────────────────────────────────────────────┐
│  H2: "Tudo que Você Recebe"                             │
│                                                         │
│  ✓ Módulo 1 — Como ser autodidata (videoaulas + ebook)  │
│  ✓ Módulo 2 — Básico 3.0 (BRINDE)                      │
│  ✓ Módulo 3 — Todos os tempos verbais                   │
│  ✓ Módulo 4 — Pronúncia perfeita (1.400 frases)         │
│  ✓ BÔNUS: Acompanhamento pessoal por 1 ANO              │
│                                                         │
│  [MOCKUP: plataforma em 3 dispositivos]                 │
│                                                         │
│  [ VER CONTEÚDO COMPLETO → ]                            │
└─────────────────────────────────────────────────────────┘
```

### BLOCO 6 — DEPOIMENTOS

```
┌─────────────────────────────────────────────────────────┐
│  H2: "O que Nossos Alunos Dizem"                        │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │ ★★★★★   │ │ ★★★★★   │ │ ★★★★★   │                │
│  │ "O maior │ │ "O melhor│ │ "Amei o  │                │
│  │diferencia│ │e mais    │ │método,   │                │
│  │l é o     │ │completo  │ │agora sei │                │
│  │acompanha-│ │curso     │ │que posso │                │
│  │mento..." │ │online..."│ │aprender" │                │
│  │ — João   │ │ — Gilmar │ │ — Tânia  │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│                                                         │
│  [VÍDEO DEPOIMENTO — 30s]                               │
│                                                         │
│  [ QUERO ESSES RESULTADOS → ]                           │
└─────────────────────────────────────────────────────────┘
```

### BLOCO 7 — SOBRE O PROFESSOR

```
┌─────────────────────────────────────────────────────────┐
│  H2: "Quem é o Professor Rodger Koller"                 │
│                                                         │
│  [FOTO PROFISSIONAL]                                    │
│                                                         │
│  • CPE + CELTA — University of Cambridge                │
│  • Letras + Pós em Tradução (FMU)                       │
│  • 14+ anos ensinando (Speak Up Idiomas)                │
│  • +34.000 alunos formados                              │
│  • Viveu na Irlanda (intercâmbio em Dublin)              │
│  • Trilíngue: Português, Inglês, Espanhol               │
│                                                         │
│  "Meu intuito é transformar meus alunos em              │
│   falantes ativos da língua inglesa."                    │
└─────────────────────────────────────────────────────────┘
```

### BLOCO 8 — OFERTA + FORMULÁRIO

```
┌─────────────────────────────────────────────────────────┐
│  [BADGE: "Oferta por tempo limitado"]                   │
│                                                         │
│  DE: R$ X.XXX                                           │
│  POR: 12x R$ XX,XX                                      │
│  ou R$ XXX à vista (desconto)                            │
│                                                         │
│  ┌─────────────────────────────┐                        │
│  │ Nome: [_______________]    │                        │
│  │ Email: [______________]    │                        │
│  │ WhatsApp: [___________]    │                        │
│  │                            │                        │
│  │ [ GARANTIR MINHA VAGA ]    │                        │
│  └─────────────────────────────┘                        │
│                                                         │
│  [Pgto seguro] [Garantia 7d] [Acesso imediato]          │
│                                                         │
│  Prefere tirar dúvidas primeiro?                        │
│  [💬 FALAR PELO WHATSAPP]                               │
└─────────────────────────────────────────────────────────┘
```

### BLOCO 9 — GARANTIA

```
┌─────────────────────────────────────────────────────────┐
│  H2: "Você Não Tem Nada a Perder"                       │
│                                                         │
│  [ÍCONE ESCUDO]                                         │
│                                                         │
│  "Faça sua inscrição, acesse o curso por 7 dias.        │
│   Se por qualquer motivo sentir que não é pra você,     │
│   devolvemos 100% do seu investimento. Sem perguntas,   │
│   sem burocracia."                                      │
│                                                         │
│  [ COMEÇAR SEM RISCO → ]                                │
└─────────────────────────────────────────────────────────┘
```

### BLOCO 10 — FAQ (accordion + Schema FAQPage)

```
┌─────────────────────────────────────────────────────────┐
│  H2: "Perguntas Frequentes"                             │
│                                                         │
│  ▸ Preciso saber algo de inglês para começar?           │
│  ▸ Como são as aulas?                                   │
│  ▸ O que é o Método Koller?                             │
│  ▸ Quanto tempo leva para ficar fluente?                │
│  ▸ Como acesso o curso depois da compra?                │
│  ▸ Posso assistir pelo celular?                         │
│  ▸ É assinatura mensal ou pagamento único?              │
│  ▸ Tem certificado?                                     │
│  ▸ E se eu não gostar? (garantia)                       │
│  ▸ Como funciona o acompanhamento do professor?         │
│  ▸ Posso fazer aulas ao vivo com o Rodger?              │
│  ▸ E se eu já sei o básico?                             │
└─────────────────────────────────────────────────────────┘
```

### BLOCO 11 — RODAPÉ

```
┌─────────────────────────────────────────────────────────┐
│  [💬 FALE CONOSCO PELO WHATSAPP]                        │
│                                                         │
│  Fly to Fluency ® — Rodger Koller                       │
│  CNPJ: XX.XXX.XXX/XXXX-XX                               │
│  koller.institute@gmail.com                              │
│                                                         │
│  [IG] [YT] [FB] [TW]                                   │
│                                                         │
│  Termos de Uso | Política de Privacidade                │
└─────────────────────────────────────────────────────────┘
```

### ELEMENTO FIXO — WHATSAPP FLUTUANTE

```
┌──────────────────────────────────────────────┐
│ DESKTOP: botão canto inferior direito        │
│ - Aparece após 30s                           │
│ - Pulso sutil a cada 30s                     │
│ - Texto muda conforme scroll:                │
│   Topo: "Tire suas dúvidas"                  │
│   Após depoimentos: "Fale com quem já fez"   │
│   Oferta: "Garanta sua vaga agora"           │
│                                              │
│ MOBILE: sticky bar inferior                  │
│ - Não tampa conteúdo (padding-bottom no body)│
│ - CTA: "Falar pelo WhatsApp"                 │
└──────────────────────────────────────────────┘
```

---

## 2. FORMULÁRIO → WHATSAPP + SUPABASE

### Fluxo completo

```
VISITANTE PREENCHE FORMULÁRIO
         │
         ▼
  ┌──────────────────┐
  │ Validação client │  React Hook Form
  │ - Nome (min 2)   │  - zod schema
  │ - Email (regex)  │  - máscara WhatsApp
  │ - WhatsApp (DDI) │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ POST /api/lead   │  Next.js API Route
  └────────┬─────────┘
           │
     ┌─────┼─────────────────┐
     │     │                 │
     ▼     ▼                 ▼
  ┌──────┐ ┌──────┐    ┌──────────┐
  │Supa- │ │Brevo │    │ Redirect │
  │base  │ │ API  │    │ wa.me/   │
  │INSERT│ │create│    │ ?text=.. │
  └──────┘ │contact│    └──────────┘
           │+tag  │
           │+auto │
           └──────┘
```

### Schema Supabase — tabela `leads`

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- dados do lead
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,

  -- origem
  fonte TEXT NOT NULL DEFAULT 'formulario',
    -- 'formulario' | 'exit-intent' | 'lead-magnet' | 'whatsapp-direto'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  pagina TEXT,
    -- '/landing' | '/blog/metodo-koller' | etc.
  bloco TEXT,
    -- 'hero' | 'oferta' | 'exit-intent' | 'lead-magnet'

  -- status do funil
  status TEXT NOT NULL DEFAULT 'novo',
    -- 'novo' | 'conversou' | 'qualificado' | 'comprou' | 'desistiu'
  valor_potencial NUMERIC(10,2),
  data_conversao TIMESTAMPTZ,

  -- tracking
  brevo_contact_id TEXT,
  ip_address INET,
  user_agent TEXT
);

-- índices para o dashboard
CREATE INDEX idx_leads_created ON leads (created_at DESC);
CREATE INDEX idx_leads_status ON leads (status);
CREATE INDEX idx_leads_fonte ON leads (fonte);

-- RLS: só o dono do projeto lê
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner_read" ON leads FOR SELECT
  USING (auth.uid() = 'RODGER_USER_ID');
CREATE POLICY "anon_insert" ON leads FOR INSERT
  WITH CHECK (true);
```

### API Route — `/api/lead`

```typescript
// app/api/lead/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const BREVO_API_KEY = process.env.BREVO_API_KEY!
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER! // 5511XXXXXXXXX

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nome, email, whatsapp, fonte, bloco, utm_source, utm_medium, utm_campaign } = body

  // 1. Salvar no Supabase
  const { error: dbError } = await supabase
    .from('leads')
    .insert({
      nome,
      email,
      whatsapp,
      fonte: fonte || 'formulario',
      bloco: bloco || 'hero',
      utm_source,
      utm_medium,
      utm_campaign,
      pagina: req.headers.get('referer') || '/landing',
      ip_address: req.headers.get('x-forwarded-for'),
      user_agent: req.headers.get('user-agent'),
    })

  if (dbError) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  // 2. Criar contato no Brevo
  await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      attributes: { NOME: nome, WHATSAPP: whatsapp },
      listIds: [2], // lista "leads-landing"
      updateEnabled: true,
    }),
  })

  // 3. Montar link WhatsApp contextual
  const mensagens: Record<string, string> = {
    hero: `Oi Rodger! Sou ${nome}, vim do site e quero saber mais sobre o Método Koller.`,
    oferta: `Oi Rodger! Sou ${nome}, quero garantir minha vaga no Curso Definitivo!`,
    'lead-magnet': `Oi Rodger! Sou ${nome}, baixei o PDF e quero saber mais sobre o curso completo.`,
    'exit-intent': `Oi Rodger! Sou ${nome}, quase saí do site mas decidi falar com você.`,
  }

  const texto = mensagens[bloco || 'hero']
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`

  return NextResponse.json({ redirect: waLink })
}
```

### Formulário — componente React

```tsx
// components/LeadForm.tsx

'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

interface LeadFormProps {
  bloco: 'hero' | 'oferta' | 'lead-magnet' | 'exit-intent'
  ctaText?: string
  showWhatsappField?: boolean
}

interface FormData {
  nome: string
  email: string
  whatsapp: string
}

export function LeadForm({ bloco, ctaText = 'QUERO COMEÇAR AGORA', showWhatsappField = true }: LeadFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const [fallback, setFallback] = useState(false)

  async function onSubmit(data: FormData) {
    try {
      const params = new URLSearchParams(window.location.search)

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          bloco,
          fonte: bloco === 'exit-intent' ? 'exit-intent' : 'formulario',
          utm_source: params.get('utm_source'),
          utm_medium: params.get('utm_medium'),
          utm_campaign: params.get('utm_campaign'),
        }),
      })

      const result = await res.json()

      if (result.redirect) {
        window.open(result.redirect, '_blank')
      }
    } catch {
      setFallback(true)
    }
  }

  if (fallback) {
    return (
      <div className="fallback">
        <p>Ops, algo deu errado.</p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Oi! O formulário deu erro, quero me inscrever`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          Inscrever pelo WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('nome', { required: true, minLength: 2 })}
        placeholder="Seu nome"
      />
      {errors.nome && <span>Nome obrigatório</span>}

      <input
        {...register('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        placeholder="Seu melhor email"
        type="email"
      />
      {errors.email && <span>Email inválido</span>}

      {showWhatsappField && (
        <input
          {...register('whatsapp', { required: true, minLength: 10 })}
          placeholder="WhatsApp com DDD"
          type="tel"
        />
      )}
      {errors.whatsapp && <span>WhatsApp obrigatório</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : ctaText}
      </button>
    </form>
  )
}
```

---

## 3. EXIT INTENT POPUP

### Comportamento

| Plataforma | Trigger | Formato |
|-----------|---------|---------|
| Desktop | `mouseleave` no topo da viewport | Modal centralizado com overlay |
| Mobile | 60s sem scroll OU scroll rápido pra cima (intenção de voltar) | Bottom sheet (slide up) |

### Regras

| Regra | Implementação |
|-------|--------------|
| Aparece 1 vez por sessão | `sessionStorage.setItem('exitShown', 'true')` |
| Não aparece se já preencheu formulário | Checar `localStorage.getItem('leadCaptured')` |
| Não aparece nos primeiros 15s | `setTimeout` antes de ativar o listener |
| Fechar com ESC ou clique fora | Event listeners padrão |
| Não aparece se veio do WhatsApp | Checar `utm_source !== 'whatsapp'` |

### Conteúdo do popup

```
┌─────────────────────────────────────────┐
│                                    [X]  │
│                                         │
│   🎁 ESPERA! Leva um presente.         │
│                                         │
│   PDF gratuito:                         │
│   "50 Expressões que Todo               │
│    Brasileiro Erra em Inglês"           │
│                                         │
│   ┌───────────────────────────┐         │
│   │ Email: [________________] │         │
│   │                           │         │
│   │ [ QUERO O PDF GRÁTIS ]    │         │
│   └───────────────────────────┘         │
│                                         │
│   Não, obrigado.                        │
└─────────────────────────────────────────┘
```

### Componente React

```tsx
// components/ExitIntent.tsx

'use client'
import { useEffect, useState } from 'react'
import { LeadForm } from './LeadForm'

export function ExitIntent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('exitShown')) return
    if (localStorage.getItem('leadCaptured')) return

    const timer = setTimeout(() => {
      // Desktop: mouseleave
      const handleMouse = (e: MouseEvent) => {
        if (e.clientY < 10) {
          setShow(true)
          sessionStorage.setItem('exitShown', 'true')
          document.removeEventListener('mouseleave', handleMouse)
        }
      }
      document.addEventListener('mouseleave', handleMouse)

      // Mobile: 60s sem interação
      const mobileTimer = setTimeout(() => {
        if (window.innerWidth < 768) {
          setShow(true)
          sessionStorage.setItem('exitShown', 'true')
        }
      }, 60000)

      return () => {
        document.removeEventListener('mouseleave', handleMouse)
        clearTimeout(mobileTimer)
      }
    }, 15000) // delay 15s antes de ativar

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="exit-overlay" onClick={() => setShow(false)}>
      <div className="exit-modal" onClick={e => e.stopPropagation()}>
        <button className="exit-close" onClick={() => setShow(false)}>✕</button>

        <h3>Espera! Leva um presente.</h3>
        <p>PDF gratuito: <strong>"50 Expressões que Todo Brasileiro Erra em Inglês"</strong></p>

        <LeadForm
          bloco="exit-intent"
          ctaText="QUERO O PDF GRÁTIS"
          showWhatsappField={false}
        />

        <button className="exit-dismiss" onClick={() => setShow(false)}>
          Não, obrigado.
        </button>
      </div>
    </div>
  )
}
```

---

## 4. LEAD MAGNET — ISCA DIGITAL (PDF GRATUITO)

### Contexto

O Rodger já distribuía PDFs gratuitos por aula via Systeme.io. O sistema morreu. Vamos reconstruir com infraestrutura própria.

### Fluxo completo

```
VISITANTE
    │
    ├── CTA na landing page: "Baixe o PDF gratuito"
    ├── Exit intent popup: "Leva um presente"
    ├── Descrição dos vídeos do YouTube (link novo)
    │
    ▼
┌──────────────────────┐
│ Modal / página de    │
│ captura              │
│                      │
│ Nome: [___________]  │
│ Email: [__________]  │
│                      │
│ [BAIXAR PDF GRÁTIS]  │
└──────────┬───────────┘
           │
           ▼
    POST /api/lead
    (fonte: 'lead-magnet')
           │
     ┌─────┼──────────┐
     │     │          │
     ▼     ▼          ▼
  Supabase  Brevo     Redirect → /obrigado
  (insert)  (contato   (com link
            + lista    do PDF)
            + auto-
            mação)
           │
           ▼
    Brevo dispara sequência:
    ┌────────────────────────────────────────┐
    │ [Imediato] Email 1: PDF anexo         │
    │   "Aqui está seu PDF! E tem mais..."   │
    │                                        │
    │ [24h] Email 2: Conteúdo extra          │
    │   "Gostou? Tem 67 lições grátis no YT"│
    │   + link pras playlists                │
    │                                        │
    │ [48h] Email 3: Método                  │
    │   "Conheça o Método Koller em 2 min"   │
    │   + vídeo explicativo                  │
    │                                        │
    │ [72h] Email 4: Oferta                  │
    │   "Curso Definitivo com 30% OFF"       │
    │   + depoimentos + CTA WhatsApp         │
    │                                        │
    │ [5d] Email 5: Último aviso             │
    │   "Desconto expira hoje"               │
    │   + fallback WhatsApp                  │
    │                                        │
    │ [7d] Move pra lista "frios"            │
    │   → newsletter mensal educativa        │
    └────────────────────────────────────────┘
```

### PDFs sugeridos (reciclar conteúdo existente)

| PDF | Baseado em | Público |
|-----|-----------|---------|
| "50 Expressões que Todo Brasileiro Erra" | 412 vídeos do canal | Todos os níveis |
| "Guia do Present Perfect" | Playlist PRESENT PERFECT (5 vídeos) | Intermediário |
| "Vocabulário Nativo: 100 Palavras que Ninguém Ensina" | Playlist VOCABULARY (10 vídeos) | Intermediário+ |
| "Método Koller: 4 Passos pra Fluência" | Descrição do método nos episódios | Todos os níveis |

### Hospedagem dos PDFs

```
Supabase Storage
└── bucket: lead-magnets (público com URL signed)
    ├── 50-expressoes-brasileiros-erram.pdf
    ├── guia-present-perfect.pdf
    ├── vocabulario-nativo-100.pdf
    └── metodo-koller-4-passos.pdf
```

URL de download: signed URL com expiração de 7 dias (evita compartilhamento massivo).

---

## 5. DASHBOARD SUPABASE

### Views SQL para o painel

```sql
-- Leads por dia (últimos 30 dias)
CREATE VIEW v_leads_diarios AS
SELECT
  DATE(created_at) AS dia,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE fonte = 'formulario') AS formulario,
  COUNT(*) FILTER (WHERE fonte = 'exit-intent') AS exit_intent,
  COUNT(*) FILTER (WHERE fonte = 'lead-magnet') AS lead_magnet,
  COUNT(*) FILTER (WHERE fonte = 'whatsapp-direto') AS whatsapp
FROM leads
WHERE created_at > now() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY dia DESC;

-- Funil de conversão
CREATE VIEW v_funil AS
SELECT
  status,
  COUNT(*) AS total,
  ROUND(COUNT(*)::NUMERIC / NULLIF(SUM(COUNT(*)) OVER(), 0) * 100, 1) AS percentual
FROM leads
GROUP BY status
ORDER BY
  CASE status
    WHEN 'novo' THEN 1
    WHEN 'conversou' THEN 2
    WHEN 'qualificado' THEN 3
    WHEN 'comprou' THEN 4
    WHEN 'desistiu' THEN 5
  END;

-- Top fontes de tráfego
CREATE VIEW v_utm_sources AS
SELECT
  COALESCE(utm_source, 'direto') AS fonte,
  COALESCE(utm_medium, '—') AS meio,
  COUNT(*) AS leads,
  COUNT(*) FILTER (WHERE status = 'comprou') AS conversoes,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'comprou')::NUMERIC /
    NULLIF(COUNT(*), 0) * 100, 1
  ) AS taxa_conversao
FROM leads
GROUP BY utm_source, utm_medium
ORDER BY leads DESC;

-- Leads quentes (últimas 24h, status novo)
CREATE VIEW v_leads_quentes AS
SELECT nome, email, whatsapp, fonte, bloco, created_at
FROM leads
WHERE status = 'novo'
  AND created_at > now() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Receita estimada
CREATE VIEW v_receita AS
SELECT
  DATE_TRUNC('month', data_conversao) AS mes,
  COUNT(*) AS vendas,
  SUM(valor_potencial) AS receita
FROM leads
WHERE status = 'comprou'
GROUP BY DATE_TRUNC('month', data_conversao)
ORDER BY mes DESC;
```

### Métricas do painel

```
┌─────────────────────────────────────────────────────────┐
│  DASHBOARD — Fly to Fluency                             │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │  LEADS  │ │CONVERSAS│ │ VENDAS  │ │RECEITA  │      │
│  │  HOJE   │ │  HOJE   │ │  MÊS   │ │  MÊS   │      │
│  │   12    │ │    5    │ │   8    │ │R$X.XXX │      │
│  │  ↑ 20%  │ │  ↑ 10%  │ │  ↑ 15% │ │  ↑ 15% │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                         │
│  ┌─────────────────────┐ ┌─────────────────────┐       │
│  │  LEADS POR FONTE    │ │  FUNIL              │       │
│  │                     │ │                     │       │
│  │  Google Ads  45%    │ │  Novo        100%   │       │
│  │  Instagram   25%    │ │  Conversou    60%   │       │
│  │  YouTube     15%    │ │  Qualificado  35%   │       │
│  │  Orgânico    10%    │ │  Comprou      12%   │       │
│  │  Direto       5%    │ │  Desistiu     28%   │       │
│  └─────────────────────┘ └─────────────────────┘       │
│                                                         │
│  ┌───────────────────────────────────────────────┐      │
│  │  LEADS QUENTES (últimas 24h)                  │      │
│  │                                               │      │
│  │  João Silva    11:23  hero       formulário   │      │
│  │  Maria Costa   10:45  oferta     exit-intent  │      │
│  │  Pedro Souza   09:12  hero       lead-magnet  │      │
│  └───────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## 6. SEO TÉCNICO

### Meta tags

```html
<title>Curso de Inglês Online — Método Koller | Rodger Koller</title>
<meta name="description" content="Aprenda inglês com o Método Koller. Professor certificado Cambridge (CPE+CELTA), +34.000 alunos. Acesso vitalício + acompanhamento pessoal por 1 ano." />
<link rel="canonical" href="https://flytofluency.com.br/" />

<meta property="og:type" content="website" />
<meta property="og:title" content="Método Koller — Fale Inglês com Quem Tem CPE de Cambridge" />
<meta property="og:description" content="+34.000 alunos. Acesso vitalício. Acompanhamento pessoal por 1 ano. Garantia de 7 dias." />
<meta property="og:image" content="https://flytofluency.com.br/og-image.jpg" />
<meta property="og:url" content="https://flytofluency.com.br/" />

<meta name="twitter:card" content="summary_large_image" />
```

### Schema JSON-LD

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Curso de Inglês Definitivo — Método Koller",
    "description": "Curso completo de inglês do básico ao avançado com o Método Koller. 6 módulos, 1.400 frases de pronúncia, acompanhamento pessoal por 1 ano.",
    "provider": {
      "@type": "Person",
      "name": "Rodger Koller",
      "jobTitle": "Professor de Inglês",
      "alumniOf": "University of Cambridge",
      "knowsLanguage": ["pt-BR", "en", "es"]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "13",
      "bestRating": "5"
    },
    "inLanguage": "pt-BR",
    "educationalLevel": "Beginner to Advanced"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Preciso saber algo de inglês para começar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Não. O curso começa do zero com o módulo Básico 3.0 incluso como bônus."
        }
      },
      {
        "@type": "Question",
        "name": "O que é o Método Koller?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "É um método baseado em imersão em 4 passos: assistir com legenda PT, com legenda EN, sem legenda e repetir com todos os vídeos."
        }
      }
    ]
  }
]
```

### Tracking (via GTM)

| Tag | Trigger | Função |
|-----|---------|--------|
| GA4 | Todas as páginas | Analytics |
| Meta Pixel | Todas as páginas | Retargeting Instagram/Facebook |
| Google Ads | Todas as páginas | Remarketing Google |
| Clarity | Todas as páginas | Heatmaps + session replay |
| Brevo tracking | Todas as páginas | Comportamento pra automações |
| Conversion (GA4) | Envio de formulário | Medir ROI de Ads |
| Conversion (Meta) | Envio de formulário | Medir ROI de Meta Ads |

---

## 7. WHATSAPP — 6 CAMADAS

| # | Camada | Descrição |
|---|--------|-----------|
| 1 | **Ponto único** | 1 número WhatsApp Business API, mensagem pré-preenchida contextual por bloco |
| 2 | **Botão flutuante** | Desktop: canto inferior direito. Mobile: sticky bar. Texto muda com scroll |
| 3 | **Fallback de formulário** | Se o POST falhar, CTA "Inscrever pelo WhatsApp" aparece automaticamente |
| 4 | **Chatbot qualificação** | 3 perguntas (nível, objetivo, urgência) → roteamento automático |
| 5 | **Remarketing pós-chat** | 4 mensagens em 7 dias (depoimento, oferta, último aviso, silêncio) |
| 6 | **Pós-compra** | Onboarding (acesso, dicas, engajamento) + NPS 30 dias + upsell |

---

## 8. BREVO — 3 SEQUÊNCIAS

| Sequência | Trigger | Emails | WhatsApp |
|-----------|---------|--------|----------|
| **Carrinho abandonado** | Lead preencheu form mas não pagou | 4 emails (7 dias) | 2 msgs |
| **Onboarding** | Pagamento confirmado | 5 emails (30 dias) | 3 msgs |
| **Lead frio** | 7 dias sem interação | Newsletter mensal | — |

---

## 9. PERFORMANCE

| Métrica | Meta | Como |
|---------|------|------|
| Page Load | < 700ms | Next.js SSG + CDN Vercel |
| TTFB | < 200ms | Edge functions |
| LCP | < 2.5s | Hero image em WebP + priority loading |
| CLS | < 0.1 | Dimensões fixas em imagens e fontes |
| Lazy loading | Tudo abaixo da dobra | next/image com loading="lazy" |
| Formato | WebP/AVIF | next/image converte automaticamente |
| Scripts | defer/async | GTM carrega após interação |
| Bundle | < 100KB first load | Tree shaking + dynamic imports |

---

## 10. INTEGRAÇÃO MazyOS — SKILLS UTILIZADAS

| Skill | Fase | Ação específica |
|-------|------|----------------|
| `/seo` (8 etapas) | Pré-lançamento + contínuo | Keywords, on-page, Schema, GMB, GEO, monitoramento |
| `/carrossel` | Conteúdo recorrente | Badges, comparativo, depoimentos visuais |
| `/anuncio-google` | Tráfego | Campanhas Search + Display pra landing |
| `/publicar-tema` | SEO contínuo | Blog posts reciclando 412 vídeos |
| `/responder-avaliacoes` | Reputação | Google Meu Negócio ativo |
| `/email-profissional` | Sequências Brevo | Redação dos 12 emails das 3 sequências |
| `/relatorio-ads` | Monitoramento | Semanal de Ads + métricas da LP |
| `/aprovar-post` | QA | Revisão antes de publicar |
| `/analisar-dados` | Dashboard | Interpretar dados do Supabase |
| `/mapear-rotinas` | Setup | Criar skills novas (`/whatsapp-fluxo`, `/email-sequencia`) |
| `ferramentas/gerador-hero-image.md` | Visual | Hero image com foto do Rodger |
| Playwright MCP | QA contínuo | Testar formulário semanalmente |

---

## CHECKLIST DE LANÇAMENTO

| # | Tarefa | Status |
|---|--------|--------|
| 1 | Definir domínio (ex: flytofluency.com.br) | ⬜ |
| 2 | Criar projeto Supabase | ⬜ |
| 3 | Criar conta Brevo + configurar domínio de envio | ⬜ |
| 4 | Configurar WhatsApp Business API | ⬜ |
| 5 | Gerar hero image com ferramenta protocolar | ⬜ |
| 6 | Desenvolver landing page (11 blocos) | ⬜ |
| 7 | Implementar formulário + API + Supabase | ⬜ |
| 8 | Implementar exit intent popup | ⬜ |
| 9 | Criar PDFs de lead magnet (4 iscas) | ⬜ |
| 10 | Configurar 3 sequências no Brevo | ⬜ |
| 11 | Configurar GTM com todas as tags | ⬜ |
| 12 | SEO on-page (`/seo` etapas 1-4) | ⬜ |
| 13 | Google Meu Negócio (`/seo` etapa 3) | ⬜ |
| 14 | Schema JSON-LD (Course + FAQPage) | ⬜ |
| 15 | Testar formulário com Playwright MCP | ⬜ |
| 16 | Configurar dashboard Supabase | ⬜ |
| 17 | Atualizar links dos 412 vídeos do YouTube | ⬜ |
| 18 | Campanha Google Ads (`/anuncio-google`) | ⬜ |
| 19 | GEO — aparecer no ChatGPT/Gemini (`/seo` etapa 8) | ⬜ |
| 20 | Monitoramento semanal (`/relatorio-ads`) | ⬜ |
