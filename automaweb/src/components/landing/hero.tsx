"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, LayoutGrid, Sparkles, Wand2 } from "lucide-react";
import { siInstagram, siYoutube } from "simple-icons";
import { Counter } from "./counter";
import { WHATSAPP_URL } from "./landing-config";

type IconProps = { className?: string };

function BrandIcon({ path, className }: { path: string } & IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={path} />
    </svg>
  );
}

function YoutubeIcon({ className }: IconProps) {
  return <BrandIcon path={siYoutube.path} className={className} />;
}

function InstagramIcon({ className }: IconProps) {
  return <BrandIcon path={siInstagram.path} className={className} />;
}

function IaIcon({ className }: IconProps) {
  return <Wand2 className={className} strokeWidth={1.5} />;
}

function GridIcon({ className }: IconProps) {
  return <LayoutGrid className={className} strokeWidth={1.5} />;
}

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    delay,
  },
});

const FLOW_STEPS = [
  { icon: YoutubeIcon, label: "Vídeo do YouTube" },
  { icon: IaIcon, label: "IA escreve e desenha" },
  { icon: GridIcon, label: "14 carrosséis" },
  { icon: InstagramIcon, label: "Publicado sozinho" },
];

const KANBAN = [
  {
    title: "Produzir",
    tagBg: "#DBEAFE",
    tagText: "#1E40AF",
    cards: [{ w: "w-3/4" }],
  },
  {
    title: "Aprovação",
    tagBg: "#FEF9C3",
    tagText: "#854D0E",
    cards: [{ w: "w-2/3" }],
  },
  {
    title: "Agendado",
    tagBg: "#F0F9FF",
    tagText: "#075985",
    cards: [{ w: "w-4/5" }],
  },
  {
    title: "Publicado",
    tagBg: "#F0FDF4",
    tagText: "#16A34A",
    cards: [{ w: "w-3/5" }, { w: "w-1/2" }],
  },
];

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="inicio"
      className="landing-dot-grid relative overflow-hidden bg-[#FAFAFA] pb-20 pt-32 md:pb-28 md:pt-40"
    >
      {/* Máscara radial: o dot grid some nas bordas pra não competir com o texto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, transparent 30%, #FAFAFA 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.span
            {...enter(0.2)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] px-3.5 py-1.5 text-[13px] font-medium text-[#71717A]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#09090B]" strokeWidth={1.5} />
            Automação com IA
          </motion.span>

          <motion.h1
            {...enter(0.4)}
            className="mt-6 font-bold leading-[1.08] text-[#09090B]"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Seu negócio no piloto automático.
          </motion.h1>

          <motion.p
            {...enter(0.5)}
            className="mt-5 max-w-[600px] text-base leading-relaxed text-[#71717A] md:text-lg"
          >
            Sites premium, conteúdo automatizado com IA e sistemas sob medida
            para o seu negócio. Assinatura mensal, sem contrato anual.
          </motion.p>

          <motion.div
            {...enter(0.6)}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-[#18181B] px-6 py-3 text-sm font-medium text-[#FAFAFA] transition-colors duration-150 hover:bg-[#27272A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]"
            >
              Agendar reunião
            </a>
            <a
              href="#solucoes"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E4E7] bg-transparent px-6 py-3 text-sm font-medium text-[#09090B] transition-colors duration-150 hover:bg-[#F4F4F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]"
            >
              Ver soluções
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.7 },
              },
            }}
            className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:gap-0"
          >
            {[
              {
                value: <Counter value={14} className="tabular-nums" />,
                label: "carrosséis em 2 horas",
              },
              {
                value: <span>R$ 0</span>,
                label: "custo de geração de imagem",
              },
              {
                value: (
                  <Counter value={250} prefix="R$ " className="tabular-nums" />
                ),
                label: "assinatura média mensal",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    },
                  },
                }}
                className={
                  i > 0
                    ? "flex flex-col-reverse items-center sm:border-l sm:border-[#E4E4E7] sm:pl-8 sm:ml-8"
                    : "flex flex-col-reverse items-center"
                }
              >
                <dt className="mt-1 text-[13px] font-medium text-[#71717A]">
                  {stat.label}
                </dt>
                <dd className="text-[28px] font-bold text-[#09090B] md:text-[32px]">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        {/* Estrela do show: a própria plataforma operando, desenhada em código */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.8,
          }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white shadow-[0_24px_80px_-32px_rgba(9,9,11,0.18)]">
            {/* Barra do browser */}
            <div className="flex items-center gap-3 border-b border-[#E4E4E7] px-4 py-3">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4E7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4E7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4E7]" />
              </div>
              <div className="flex-1 rounded-md bg-[#F4F4F5] px-3 py-1 text-center text-[11px] font-medium text-[#A1A1AA]">
                automaweb.pro/painel
              </div>
            </div>

            {/* Fluxo de automação */}
            <div className="border-b border-[#F4F4F5] px-5 py-5 md:px-8">
              <div className="relative">
                <div
                  className="absolute left-0 right-0 top-[19px] hidden h-px bg-[#E4E4E7] sm:block"
                  aria-hidden
                >
                  {!reduced && (
                    <motion.span
                      className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#18181B]"
                      animate={{ left: ["2%", "96%"] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.8,
                      }}
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {FLOW_STEPS.map((step) => (
                    <div
                      key={step.label}
                      className="relative flex flex-col items-center gap-2 text-center"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white">
                        <step.icon className="h-[18px] w-[18px] text-[#09090B]" />
                      </span>
                      <span className="text-[11px] font-medium text-[#71717A]">
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mini pipeline kanban */}
            <div className="grid grid-cols-2 gap-3 px-5 py-5 sm:grid-cols-4 md:px-8">
              {KANBAN.map((col) => (
                <div key={col.title} className="flex flex-col gap-2">
                  <span
                    className="self-start rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.05em]"
                    style={{ backgroundColor: col.tagBg, color: col.tagText }}
                  >
                    {col.title}
                  </span>
                  {col.cards.map((card, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-[#E4E4E7] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    >
                      <div className={`h-1.5 rounded-full bg-[#E4E4E7] ${card.w}`} />
                      <div className="mt-1.5 h-1.5 w-1/3 rounded-full bg-[#F4F4F5]" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
