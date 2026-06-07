'use client'

import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  Monitor,
  BookOpen,
  Headphones,
  RefreshCw,
  ShieldCheck,
  Check,
  X as XIcon,
  ChevronDown,
  GraduationCap,
  Trophy,
  Star,
  Award,
  CheckCircle,
} from 'lucide-react'
import { LeadForm } from '@/components/LeadForm'
import { ExitIntent } from '@/components/ExitIntent'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'

/* ────────────────────────── Data ────────────────────────── */

const modulos = [
  { num: '01', title: 'Como ser autodidata', desc: 'Métodos para estudar de forma independente em qualquer nível', tag: 'Videoaulas + Ebook' },
  { num: '02', title: 'Básico 3.0', desc: 'Tudo que você precisa para avançar de nível com segurança', tag: 'BRINDE' },
  { num: '03', title: 'Todos os tempos verbais', desc: 'Do pré-intermediário ao avançado, com exercícios práticos', tag: 'Ebooks + Pronúncia' },
  { num: '04', title: 'Pronúncia perfeita', desc: '1.400 frases para praticar com acompanhamento semanal', tag: 'Feedback direto' },
]

const depoimentos = [
  { nome: 'João', nota: 5, texto: 'O maior diferencial que encontrei no curso do Rodger é o acompanhamento que ele faz com todos os alunos. Cara, isso é DEMAIS!!! O professor manda mensagem pra você cobrando os exercícios.' },
  { nome: 'Gilmar', nota: 5, texto: 'Com certeza é o melhor e mais completo curso online para aprender inglês. Pela qualidade do curso achei o preço excelente, outro diferencial é o contato semanal que o professor tem com os alunos.' },
  { nome: 'Tânia', nota: 5, texto: 'Amei o método, agora sei que posso aprender inglês. O Rodger explica de um jeito que você realmente entende e se sente capaz.' },
]

const faq = [
  { q: 'Preciso saber algo de inglês para começar?', a: 'Não. O curso começa do zero com o módulo Básico 3.0 incluso como bônus.' },
  { q: 'O que é o Método Koller?', a: 'É um método baseado em imersão em 4 passos: assistir com legenda PT, com legenda EN, sem legenda e repetir. Quanto mais contato com inglês, melhor você saberá inglês.' },
  { q: 'Quanto tempo leva para ficar fluente?', a: 'Depende da sua dedicação, mas alunos que seguem o método com disciplina relatam resultados significativos a partir de 3 meses.' },
  { q: 'Como acesso o curso depois da compra?', a: 'Você recebe acesso imediato por email e WhatsApp. A plataforma funciona em qualquer dispositivo.' },
  { q: 'Posso assistir pelo celular?', a: 'Sim. O curso é 100% online e responsivo — funciona no celular, tablet e computador.' },
  { q: 'É assinatura mensal ou pagamento único?', a: 'Pagamento único com acesso vitalício. Sem mensalidades, sem surpresas.' },
  { q: 'Tem certificado?', a: 'Sim, certificado digital de conclusão emitido ao final do curso.' },
  { q: 'E se eu não gostar?', a: 'Você tem 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor sem perguntas.' },
  { q: 'Como funciona o acompanhamento do professor?', a: 'O Rodger acompanha pessoalmente cada aluno por 1 ano após a compra. Você recebe correções, plano de estudo semanal e feedback do seu progresso.' },
  { q: 'E se eu já sei o básico?', a: 'O curso é modular. Você pode começar direto pelo módulo de tempos verbais ou pronúncia, sem precisar passar pelo básico.' },
]

const metodoPasso = [
  { step: '01', Icon: Monitor, title: 'Assista com legenda PT', desc: 'Entenda o contexto e a história' },
  { step: '02', Icon: BookOpen, title: 'Legenda EN + anote', desc: 'Identifique vocabulário novo' },
  { step: '03', Icon: Headphones, title: 'Sem legenda', desc: 'Treine seu listening puro' },
  { step: '04', Icon: RefreshCw, title: 'Repita com tudo', desc: 'Use este método em todos os vídeos' },
]

/* ────────────────────── Animation helpers ────────────────────── */

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FloatingShape({
  className = '',
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border border-white/[0.08]`}
        />
      </motion.div>
    </motion.div>
  )
}

function AnimatedCounter({
  target,
  suffix = '',
}: {
  target: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString('pt-BR')}
      {suffix}
    </span>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full p-5 text-left font-semibold text-text hover:text-brand transition-colors"
      >
        {q}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-text-muted shrink-0 ml-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="px-5 pb-5 text-text-muted leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function LandingPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.07] via-transparent to-gold/[0.05]" />
        <div className="absolute inset-0 dot-pattern" />

        <FloatingShape
          delay={0.3}
          width={500}
          height={120}
          rotate={12}
          gradient="from-blue-500/[0.12]"
          className="left-[-8%] top-[20%]"
        />
        <FloatingShape
          delay={0.5}
          width={400}
          height={100}
          rotate={-15}
          gradient="from-gold/[0.1]"
          className="right-[-3%] top-[70%]"
        />
        <FloatingShape
          delay={0.7}
          width={200}
          height={60}
          rotate={20}
          gradient="from-gold/[0.08]"
          className="right-[20%] top-[12%]"
        />
        <FloatingShape
          delay={0.4}
          width={250}
          height={70}
          rotate={-8}
          gradient="from-blue-400/[0.1]"
          className="left-[8%] bottom-[12%]"
        />

        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-8">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span className="text-sm text-white/60 tracking-wide">
                Certificado Cambridge CPE + CELTA
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
              Método Koller: Fale Inglês com Quem Tem{' '}
              <span className="text-gradient-gold">CPE de Cambridge</span>
            </h1>

            <p className="text-lg text-white/50 mb-10 leading-relaxed max-w-lg">
              +34.000 alunos já provaram que imersão funciona. Curso completo do
              zero à fluência com acompanhamento pessoal do professor por 1 ano.
            </p>

            <div className="bg-white rounded-2xl p-6 shadow-2xl shadow-black/20 max-w-md">
              <LeadForm bloco="hero" />
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {[
                'Garantia 7 dias',
                'Acesso vitalício',
                '+34K alunos',
                'CPE Cambridge',
              ].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-2 text-sm text-white/50 bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-full"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-gold/20 via-transparent to-blue-500/10 rounded-3xl blur-2xl" />
            <Image
              src="/images/hero-rodgerkoller.jpg"
              alt="Rodger Koller — Professor de Inglês certificado Cambridge"
              width={700}
              height={500}
              className="relative rounded-2xl shadow-2xl shadow-black/40 border border-white/10 w-full h-auto"
              priority
            />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent pointer-events-none" />
      </section>

      {/* ===== PROVA SOCIAL ===== */}
      <section className="bg-brand text-white py-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-heading">
                +<AnimatedCounter target={34000} />
              </p>
              <p className="text-sm opacity-60 mt-1">alunos em 15+ países</p>
            </div>

            <div className="hidden md:block w-px h-12 bg-white/20" />

            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="font-bold text-lg">4.8</span>
              <span className="opacity-50 text-sm">Hotmart</span>
            </div>

            <div className="hidden md:block w-px h-12 bg-white/20" />

            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gold" />
              <span className="font-semibold">CPE + CELTA</span>
              <span className="opacity-50 text-sm">Cambridge</span>
            </div>

            <div className="hidden md:block w-px h-12 bg-white/20" />

            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-gold" />
              <span className="font-semibold">Top Rated</span>
              <span className="opacity-50 text-sm">Hotmart</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-16 text-2xl font-black opacity-[0.08] tracking-widest">
            {Array(2)
              .fill([
                'FLUÊNCIA',
                'IMERSÃO',
                'RESULTADO',
                'CONFIANÇA',
                'MÉTODO',
                'LIBERDADE',
              ])
              .flat()
              .map((word, i) => (
                <span key={i}>{word}</span>
              ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARATIVO ===== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl text-center text-text mb-4">
              Por que o Método Koller custa uma fração?
            </h2>
            <p className="text-center text-text-muted mb-16 max-w-2xl mx-auto">
              Compare e veja por que mais de 34 mil alunos escolheram o caminho
              mais inteligente.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FadeIn delay={0.1} className="h-full">
              <div className="border border-gray-200 rounded-2xl p-8 text-center h-full hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold text-lg mb-4 text-text-muted">
                  Escola Tradicional
                </h3>
                <p className="text-3xl font-bold text-text-muted mb-1">
                  R$ 400-600
                </p>
                <p className="text-sm text-text-muted mb-6">/mês</p>
                <ul className="text-sm text-text-muted space-y-3 text-left">
                  {[
                    '3 a 5 anos pra fluência',
                    'Horário fixo',
                    'Sem acompanhamento individual',
                    'Material genérico',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <XIcon className="w-4 h-4 text-red-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="h-full">
              <div className="border border-gray-200 rounded-2xl p-8 text-center h-full hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold text-lg mb-4 text-text-muted">
                  Intercâmbio
                </h3>
                <p className="text-3xl font-bold text-text-muted mb-1">
                  R$ 20.000+
                </p>
                <p className="text-sm text-text-muted mb-6">
                  investimento total
                </p>
                <ul className="text-sm text-text-muted space-y-3 text-left">
                  {[
                    'Precisa viajar',
                    '1 a 6 meses apenas',
                    'Custo de vida no exterior',
                    'Sem garantia de fluência',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <XIcon className="w-4 h-4 text-red-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="h-full">
              <div className="relative border-2 border-gold rounded-2xl p-8 text-center bg-gradient-to-b from-gold/[0.04] to-transparent h-full hover:shadow-xl hover:shadow-gold/10 transition-all duration-300">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-gold-light text-dark text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">
                  MELHOR OPÇÃO
                </span>
                <h3 className="font-semibold text-lg mb-4 text-brand">
                  Método Koller
                </h3>
                <p className="text-3xl font-bold text-brand mb-1">12x R$ XX</p>
                <p className="text-sm text-text-muted mb-6">acesso vitalício</p>
                <ul className="text-sm text-text space-y-3 text-left">
                  {[
                    'Resultados em 3 meses',
                    'Qualquer hora, qualquer lugar',
                    'Acompanhamento pessoal 1 ano',
                    'Professor Cambridge CPE+CELTA',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== MÉTODO ===== */}
      <section className="py-24 bg-bg-warm">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl text-center text-text mb-4">
              Conheça o Método Koller
            </h2>
            <p className="text-center text-text-muted mb-16 max-w-2xl mx-auto">
              4 passos simples baseados em imersão. Quanto mais contato com
              inglês, melhor você saberá inglês.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {metodoPasso.map((s, i) => (
              <FadeIn key={s.step} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300 h-full border border-gray-50">
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <s.Icon className="w-7 h-7 text-gold" />
                  </div>
                  <span className="text-xs font-bold text-gold tracking-[0.2em]">
                    PASSO {s.step}
                  </span>
                  <h3 className="font-semibold mt-3 mb-2 text-text">
                    {s.title}
                  </h3>
                  <p className="text-sm text-text-muted">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <blockquote className="text-center max-w-2xl mx-auto">
              <p className="text-xl italic text-text-muted leading-relaxed">
                &quot;Quanto mais contato com inglês, melhor você saberá
                inglês.&quot;
              </p>
              <footer className="mt-4 flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-gold" />
                <span className="text-sm font-bold text-brand">
                  Rodger Koller
                </span>
                <div className="w-8 h-px bg-gold" />
              </footer>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* ===== CONTEÚDO DO CURSO ===== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl text-center text-text mb-16">
              Tudo que Você Recebe
            </h2>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-4">
            {modulos.map((m, i) => (
              <FadeIn key={m.num} delay={i * 0.1}>
                <div className="flex items-start gap-4 bg-bg-soft rounded-xl p-6 border border-gray-100 hover:border-gold/30 transition-colors duration-300">
                  <span className="bg-brand text-white font-bold text-sm w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                    {m.num}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{m.title}</h3>
                      {m.tag && (
                        <span className="text-xs bg-gold/10 text-gold px-2.5 py-0.5 rounded-full font-semibold">
                          {m.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted">{m.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.4}>
              <div className="flex items-start gap-4 bg-gold/[0.06] rounded-xl p-6 border border-gold/20">
                <span className="bg-gold text-dark font-bold text-sm w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-gold-dark">
                    Bônus: Acompanhamento pessoal por 1 ANO
                  </h3>
                  <p className="text-sm text-text-muted">
                    Correção, plano de estudo semanal e feedback direto do
                    professor Rodger Koller.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section className="py-24 bg-bg-soft">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl text-center text-text mb-16">
              O que Nossos Alunos Dizem
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {depoimentos.map((d, i) => (
              <FadeIn key={d.nome} delay={i * 0.15} className="h-full">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 h-full border border-gray-50 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(d.nota)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">
                    &quot;{d.texto}&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                      <span className="text-brand font-bold text-sm">
                        {d.nome[0]}
                      </span>
                    </div>
                    <span className="font-semibold text-text">{d.nome}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mt-14">
              <a
                href="#oferta"
                className="inline-block bg-brand text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-brand-light transition-all duration-300 hover:shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5"
              >
                QUERO ESSES RESULTADOS
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== SOBRE O PROFESSOR ===== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-gold/15 to-brand/10 rounded-2xl blur-xl" />
                <Image
                  src="/images/hero-rodgerkoller.jpg"
                  alt="Professor Rodger Koller"
                  width={500}
                  height={400}
                  className="relative rounded-2xl w-full h-auto shadow-xl border border-gray-100"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <h2 className="font-heading text-3xl text-text mb-8">
                  Quem é o Professor Rodger Koller
                </h2>
                <ul className="space-y-4 text-text-muted">
                  {[
                    'CPE + CELTA — University of Cambridge',
                    'Letras + Pós-graduação em Tradução (FMU)',
                    '14+ anos ensinando (Speak Up Idiomas)',
                    '+34.000 alunos formados',
                    'Viveu na Irlanda (intercâmbio em Dublin)',
                    'Trilíngue: Português, Inglês, Espanhol',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <blockquote className="mt-8 border-l-2 border-gold pl-5 italic text-text-muted">
                  &quot;Meu intuito é transformar meus alunos em falantes ativos
                  da língua inglesa.&quot;
                </blockquote>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== OFERTA ===== */}
      <section
        id="oferta"
        className="py-24 relative overflow-hidden bg-dark"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.05] via-transparent to-gold/[0.05]" />
        <div className="absolute inset-0 dot-pattern" />

        <div className="relative z-10 container mx-auto px-6">
          <FadeIn>
            <div className="max-w-lg mx-auto text-center">
              <span className="inline-flex items-center gap-2 bg-gold/20 text-gold text-sm font-semibold px-5 py-2 rounded-full mb-8 border border-gold/30">
                <Award className="w-4 h-4" />
                Oferta por tempo limitado
              </span>
              <p className="text-lg text-white/40 line-through mb-1">
                De R$ X.XXX
              </p>
              <p className="text-5xl md:text-6xl font-heading text-white mb-2">
                12x R$ XX,XX
              </p>
              <p className="text-white/40 mb-10">
                ou R$ XXX à vista com desconto
              </p>

              <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-black/30">
                <LeadForm
                  bloco="oferta"
                  ctaText="GARANTIR MINHA VAGA"
                  className="text-left"
                />
              </div>

              <div className="flex justify-center gap-6 mt-8 flex-wrap">
                {['Pagamento seguro', 'Garantia 7 dias', 'Acesso imediato'].map(
                  (b) => (
                    <span
                      key={b}
                      className="text-sm text-white/50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-gold/70" />
                      {b}
                    </span>
                  )
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== GARANTIA ===== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <FadeIn>
            <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="w-10 h-10 text-gold" />
            </div>
            <h2 className="font-heading text-3xl text-text mb-6">
              Você Não Tem Nada a Perder
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-10">
              Faça sua inscrição, acesse o curso por 7 dias. Se por qualquer
              motivo sentir que não é pra você, devolvemos 100% do seu
              investimento. Sem perguntas, sem burocracia.
            </p>
            <a
              href="#oferta"
              className="inline-block bg-brand text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-brand-light transition-all duration-300 hover:shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5"
            >
              COMEÇAR SEM RISCO
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 bg-bg-soft">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl text-center text-text mb-16">
              Perguntas Frequentes
            </h2>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-3">
            {faq.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <FaqItem q={item.q} a={item.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RODAPÉ ===== */}
      <footer className="bg-dark text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl font-heading text-gradient-gold inline-block mb-6">
            Fly to Fluency
          </p>
          <p className="text-white/50 mb-2">
            Rodger Koller — Professor de Inglês
          </p>
          <p className="text-white/30 text-sm mb-8">
            koller.institute@gmail.com
          </p>

          <div className="flex justify-center gap-6 mb-10">
            {[
              {
                label: 'Instagram',
                href: 'https://instagram.com/rodgerkoller',
              },
              {
                label: 'YouTube',
                href: 'https://youtube.com/@RodgerKoller',
              },
              {
                label: 'Facebook',
                href: 'https://facebook.com/RodgerKoller',
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold transition-colors duration-300 text-sm"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="border-t border-white/[0.06] pt-8 text-xs text-white/20">
            <p>Termos de Uso | Política de Privacidade</p>
            <p className="mt-2">
              &copy; 2026 Fly to Fluency. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== FLUTUANTES ===== */}
      <WhatsAppFloat />
      <ExitIntent />

      {/* ===== SCHEMA JSON-LD ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: 'Curso de Inglês Definitivo — Método Koller',
              description:
                'Curso completo de inglês do básico ao avançado com o Método Koller. 6 módulos, 1.400 frases de pronúncia, acompanhamento pessoal por 1 ano.',
              provider: {
                '@type': 'Person',
                name: 'Rodger Koller',
                jobTitle: 'Professor de Inglês',
                alumniOf: 'University of Cambridge',
                knowsLanguage: ['pt-BR', 'en', 'es'],
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '13',
                bestRating: '5',
              },
              inLanguage: 'pt-BR',
              educationalLevel: 'Beginner to Advanced',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faq.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
          ]),
        }}
      />
    </>
  )
}
