"use client";

import { motion } from "framer-motion";
import { Cpu, Globe, Zap, type LucideIcon } from "lucide-react";
import { landingViewport } from "@/lib/animations";

type Pillar = {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
};

const SECONDARY: Pillar[] = [
  {
    icon: Zap,
    title: "Conteúdo Automatizado",
    description:
      "14 carrosséis de Instagram em 2 horas. A IA transforma um único vídeo do YouTube em imagens, copy e legendas originais. Custo de imagem: zero.",
    tags: ["IA generativa", "FLUX", "Custo zero"],
  },
  {
    icon: Cpu,
    title: "Sistemas sob Medida",
    description:
      "CRM, agendamento, retenção automática e dashboards com a cara da sua marca. Um sistema que faz exatamente o que seu negócio precisa, no lugar de cinco ferramentas genéricas.",
    tags: ["Sua marca", "Assinatura mensal", "Sob medida"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md bg-[#F4F4F5] px-2.5 py-1 text-xs font-medium text-[#71717A]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#F4F4F5]">
      <Icon className="h-5 w-5 text-[#09090B]" strokeWidth={1.5} />
    </span>
  );
}

/* Miniatura abstrata de um site premium, desenhada em código */
function SitePreview() {
  return (
    <div
      aria-hidden
      className="relative hidden h-full min-h-[220px] overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] lg:block"
    >
      <div className="flex items-center gap-2 border-b border-[#E4E4E7] bg-white px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#E4E4E7]" />
        <span className="h-2 w-2 rounded-full bg-[#E4E4E7]" />
        <div className="ml-2 h-2 w-24 rounded-full bg-[#F4F4F5]" />
      </div>
      <div className="px-6 py-6">
        <div className="h-2 w-16 rounded-full bg-[#E4E4E7]" />
        <div className="mt-4 h-4 w-4/5 rounded-full bg-[#D4D4D8]" />
        <div className="mt-2 h-4 w-3/5 rounded-full bg-[#D4D4D8]" />
        <div className="mt-4 h-2 w-2/3 rounded-full bg-[#E4E4E7]" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-[#E4E4E7]" />
        <div className="mt-5 flex gap-2">
          <div className="h-7 w-24 rounded-lg bg-[#18181B]" />
          <div className="h-7 w-24 rounded-lg border border-[#E4E4E7] bg-white" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="h-14 rounded-lg border border-[#E4E4E7] bg-white" />
          <div className="h-14 rounded-lg border border-[#E4E4E7] bg-white" />
          <div className="h-14 rounded-lg border border-[#E4E4E7] bg-white" />
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="solucoes" className="bg-[#FAFAFA] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={landingViewport}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="max-w-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
            O que fazemos
          </p>
          <h2
            className="mt-3 font-bold text-[#09090B]"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Três pilares. Uma plataforma.
          </h2>
          <p className="mt-4 max-w-[560px] text-base leading-relaxed text-[#71717A]">
            Tudo que o seu negócio precisa para ter presença digital e operação
            automática, num lugar só.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-12 grid gap-4 lg:grid-cols-2"
        >
          {/* Card destaque: Sites Premium */}
          <motion.article
            variants={cardVariants}
            className="group rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4D4D8] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:p-8 lg:col-span-2"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <IconTile icon={Globe} />
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-[#09090B] md:text-2xl">
                  Sites Premium
                </h3>
                <p className="mt-3 leading-relaxed text-[#71717A]">
                  Landing pages com cara de dez mil dólares por uma fração do
                  custo. Processo próprio de sete níveis contra design
                  genérico. O resultado: seu negócio com presença digital de
                  empresa grande.
                </p>
                <Tags
                  tags={["Protocolo 7 Níveis", "Design autoral", "Feito pra celular"]}
                />
              </div>
              <SitePreview />
            </div>
          </motion.article>

          {SECONDARY.map((pillar) => (
            <motion.article
              key={pillar.title}
              variants={cardVariants}
              className="rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4D4D8] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:p-8"
            >
              <IconTile icon={pillar.icon} />
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-[#09090B]">
                {pillar.title}
              </h3>
              <p className="mt-3 leading-relaxed text-[#71717A]">
                {pillar.description}
              </p>
              <Tags tags={pillar.tags} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
