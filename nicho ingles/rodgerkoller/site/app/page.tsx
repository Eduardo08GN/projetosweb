import Image from 'next/image'
import { LeadForm } from '@/components/LeadForm'
import { ExitIntent } from '@/components/ExitIntent'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'

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

export default function LandingPage() {
  return (
    <>
      {/* ===== BLOCO 1 — HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-white via-white to-bg-soft">
        <div className="container mx-auto px-6 lg:px-12 py-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <p className="text-brand-light font-semibold text-sm tracking-widest uppercase mb-4">
              Certificado Cambridge CPE + CELTA
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand leading-[1.1] mb-6">
              Método Koller: Fale Inglês com Quem Tem{' '}
              <span className="text-brand-light">CPE de Cambridge</span>
            </h1>
            <p className="text-lg text-text-muted mb-8 leading-relaxed">
              +34.000 alunos já provaram que imersão funciona. Curso completo do
              zero à fluência com acompanhamento pessoal do professor por 1 ano.
            </p>

            <LeadForm bloco="hero" />

            <div className="flex flex-wrap gap-4 mt-6">
              {['Garantia 7 dias', 'Acesso vitalício', '+34K alunos', 'CPE Cambridge'].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 text-sm text-text-muted bg-gray-100 px-3 py-1.5 rounded-full"
                >
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <Image
              src="/images/hero-rodgerkoller.jpg"
              alt="Rodger Koller — Professor de Inglês certificado Cambridge"
              width={700}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* ===== BLOCO 2 — PROVA SOCIAL ===== */}
      <section className="bg-brand text-white py-8 overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-6">
          <p className="text-4xl md:text-5xl font-black">+34.000</p>
          <p className="text-lg opacity-80">alunos em 15+ países</p>
        </div>
        <div className="flex justify-center gap-8 mb-6 flex-wrap px-6">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">★★★★★</span>
            <span className="font-semibold">4.8</span>
            <span className="opacity-70 text-sm">Hotmart</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <span className="font-semibold">CPE + CELTA</span>
            <span className="opacity-70 text-sm">Cambridge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="font-semibold">Top Rated</span>
            <span className="opacity-70 text-sm">Hotmart</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-2xl font-black opacity-20">
            {Array(2)
              .fill(['FLUÊNCIA', 'IMERSÃO', 'RESULTADO', 'CONFIANÇA', 'MÉTODO', 'LIBERDADE'])
              .flat()
              .map((word, i) => (
                <span key={i}>{word}</span>
              ))}
          </div>
        </div>
      </section>

      {/* ===== BLOCO 3 — COMPARATIVO ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-brand mb-4">
            Por que o Método Koller custa uma fração?
          </h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">
            Compare e veja por que mais de 34 mil alunos escolheram o caminho mais inteligente.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Escola */}
            <div className="border border-gray-200 rounded-2xl p-6 text-center">
              <h3 className="font-bold text-lg mb-4 text-text-muted">Escola Tradicional</h3>
              <p className="text-3xl font-black text-text-muted mb-2">R$ 400-600</p>
              <p className="text-sm text-text-muted mb-6">/mês</p>
              <ul className="text-sm text-text-muted space-y-2 text-left">
                <li>✗ 3 a 5 anos pra fluência</li>
                <li>✗ Horário fixo</li>
                <li>✗ Sem acompanhamento individual</li>
                <li>✗ Material genérico</li>
              </ul>
            </div>

            {/* Intercâmbio */}
            <div className="border border-gray-200 rounded-2xl p-6 text-center">
              <h3 className="font-bold text-lg mb-4 text-text-muted">Intercâmbio</h3>
              <p className="text-3xl font-black text-text-muted mb-2">R$ 20.000+</p>
              <p className="text-sm text-text-muted mb-6">investimento total</p>
              <ul className="text-sm text-text-muted space-y-2 text-left">
                <li>✗ Precisa viajar</li>
                <li>✗ 1 a 6 meses apenas</li>
                <li>✗ Custo de vida no exterior</li>
                <li>✗ Sem garantia de fluência</li>
              </ul>
            </div>

            {/* Método Koller */}
            <div className="border-2 border-brand rounded-2xl p-6 text-center relative bg-brand/5">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-4 py-1 rounded-full">
                MELHOR OPÇÃO
              </span>
              <h3 className="font-bold text-lg mb-4 text-brand">Método Koller</h3>
              <p className="text-3xl font-black text-brand mb-2">12x R$ XX</p>
              <p className="text-sm text-text-muted mb-6">acesso vitalício</p>
              <ul className="text-sm text-text space-y-2 text-left">
                <li>✓ Resultados em 3 meses</li>
                <li>✓ Qualquer hora, qualquer lugar</li>
                <li>✓ Acompanhamento pessoal 1 ano</li>
                <li>✓ Professor Cambridge CPE+CELTA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOCO 4 — MÉTODO ===== */}
      <section className="py-20 bg-bg-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-brand mb-4">
            Conheça o Método Koller
          </h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">
            4 passos simples baseados em imersão. Quanto mais contato com inglês, melhor você saberá inglês.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { step: '01', icon: '📺', title: 'Assista com legenda PT', desc: 'Entenda o contexto e a história' },
              { step: '02', icon: '📝', title: 'Legenda EN + anote', desc: 'Identifique vocabulário novo' },
              { step: '03', icon: '👂', title: 'Sem legenda', desc: 'Treine seu listening puro' },
              { step: '04', icon: '🔁', title: 'Repita com tudo', desc: 'Use este método em todos os vídeos' },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <span className="text-4xl mb-3 block">{s.icon}</span>
                <span className="text-xs font-bold text-brand-light tracking-widest">PASSO {s.step}</span>
                <h3 className="font-bold mt-2 mb-1">{s.title}</h3>
                <p className="text-sm text-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>

          <blockquote className="text-center text-xl italic text-text-muted max-w-2xl mx-auto">
            &quot;Quanto mais contato com inglês, melhor você saberá inglês.&quot;
            <footer className="text-sm font-bold text-brand mt-2 not-italic">— Rodger Koller</footer>
          </blockquote>
        </div>
      </section>

      {/* ===== BLOCO 5 — CONTEÚDO DO CURSO ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-brand mb-12">
            Tudo que Você Recebe
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {modulos.map((m) => (
              <div
                key={m.num}
                className="flex items-start gap-4 bg-bg-soft rounded-xl p-5 border border-gray-100"
              >
                <span className="bg-brand text-white font-black text-sm w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                  {m.num}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{m.title}</h3>
                    {m.tag && (
                      <span className="text-xs bg-brand-light/10 text-brand-light px-2 py-0.5 rounded-full font-semibold">
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted">{m.desc}</p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-4 bg-accent/10 rounded-xl p-5 border border-accent/20">
              <span className="bg-accent text-white font-black text-sm w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                ★
              </span>
              <div>
                <h3 className="font-bold text-accent">Bônus: Acompanhamento pessoal por 1 ANO</h3>
                <p className="text-sm text-text-muted">
                  Correção, plano de estudo semanal e feedback direto do professor Rodger Koller.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOCO 6 — DEPOIMENTOS ===== */}
      <section className="py-20 bg-bg-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-brand mb-12">
            O que Nossos Alunos Dizem
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {depoimentos.map((d) => (
              <div key={d.nome} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-yellow-400 mb-3">
                  {'★'.repeat(d.nota)}
                </div>
                <p className="text-text-muted mb-4 text-sm leading-relaxed">
                  &quot;{d.texto}&quot;
                </p>
                <p className="font-bold text-brand">— {d.nome}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="#oferta"
              className="inline-block bg-brand text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-brand-light transition-all hover:scale-[1.02]"
            >
              QUERO ESSES RESULTADOS
            </a>
          </div>
        </div>
      </section>

      {/* ===== BLOCO 7 — SOBRE O PROFESSOR ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/images/hero-rodgerkoller.jpg"
                alt="Professor Rodger Koller"
                width={500}
                height={400}
                className="rounded-2xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-3xl font-black text-brand mb-6">
                Quem é o Professor Rodger Koller
              </h2>
              <ul className="space-y-3 text-text-muted">
                {[
                  'CPE + CELTA — University of Cambridge',
                  'Letras + Pós-graduação em Tradução (FMU)',
                  '14+ anos ensinando (Speak Up Idiomas)',
                  '+34.000 alunos formados',
                  'Viveu na Irlanda (intercâmbio em Dublin)',
                  'Trilíngue: Português, Inglês, Espanhol',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-light mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <blockquote className="mt-6 border-l-4 border-brand-light pl-4 italic text-text-muted">
                &quot;Meu intuito é transformar meus alunos em falantes ativos da língua inglesa.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOCO 8 — OFERTA ===== */}
      <section id="oferta" className="py-20 bg-brand text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center">
            <span className="inline-block bg-accent text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6">
              Oferta por tempo limitado
            </span>
            <p className="text-lg opacity-80 line-through mb-1">De R$ X.XXX</p>
            <p className="text-5xl font-black mb-2">12x R$ XX,XX</p>
            <p className="opacity-70 mb-8">ou R$ XXX à vista com desconto</p>

            <div className="bg-white rounded-2xl p-6">
              <LeadForm
                bloco="oferta"
                ctaText="GARANTIR MINHA VAGA"
                className="text-left"
              />
            </div>

            <div className="flex justify-center gap-6 mt-6 flex-wrap">
              {['Pagamento seguro', 'Garantia 7 dias', 'Acesso imediato'].map((b) => (
                <span key={b} className="text-sm opacity-80 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOCO 9 — GARANTIA ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <span className="text-6xl block mb-6">🛡️</span>
          <h2 className="text-3xl font-black text-brand mb-4">
            Você Não Tem Nada a Perder
          </h2>
          <p className="text-text-muted text-lg leading-relaxed mb-8">
            Faça sua inscrição, acesse o curso por 7 dias. Se por qualquer motivo
            sentir que não é pra você, devolvemos 100% do seu investimento.
            Sem perguntas, sem burocracia.
          </p>
          <a
            href="#oferta"
            className="inline-block bg-brand text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-brand-light transition-all hover:scale-[1.02]"
          >
            COMEÇAR SEM RISCO
          </a>
        </div>
      </section>

      {/* ===== BLOCO 10 — FAQ ===== */}
      <section className="py-20 bg-bg-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-brand mb-12">
            Perguntas Frequentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-3">
            {faq.map((item, i) => (
              <details
                key={i}
                className="bg-white rounded-xl border border-gray-100 group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-text hover:text-brand transition-colors list-none">
                  {item.q}
                  <svg className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-text-muted leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOCO 11 — RODAPÉ ===== */}
      <footer className="bg-brand text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl font-black mb-6">Fly to Fluency ®</p>
          <p className="opacity-70 mb-2">Rodger Koller — Professor de Inglês</p>
          <p className="opacity-50 text-sm mb-6">koller.institute@gmail.com</p>

          <div className="flex justify-center gap-4 mb-8">
            {[
              { label: 'Instagram', href: 'https://instagram.com/rodgerkoller' },
              { label: 'YouTube', href: 'https://youtube.com/@RodgerKoller' },
              { label: 'Facebook', href: 'https://facebook.com/RodgerKoller' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity text-sm underline"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 text-xs opacity-40">
            <p>Termos de Uso | Política de Privacidade</p>
            <p className="mt-2">© 2026 Fly to Fluency. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* ===== ELEMENTOS FLUTUANTES ===== */}
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
              description: 'Curso completo de inglês do básico ao avançado com o Método Koller. 6 módulos, 1.400 frases de pronúncia, acompanhamento pessoal por 1 ano.',
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
