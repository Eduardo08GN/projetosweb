"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, MapPin, Zap, type LucideIcon } from "lucide-react";
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
    title: "Conteúdo Toda Semana",
    description:
      "Seu Instagram abastecido com posts na identidade da sua marca, produzidos a partir do que você já sabe: uma gravação sua, um áudio, as dúvidas que seus clientes mais repetem. Você aprova e o post sai no horário.",
    tags: ["Na identidade da sua marca", "Você aprova", "Sai no horário"],
  },
  {
    icon: LayoutDashboard,
    title: "Um Painel Só Seu",
    description:
      "Cada negócio trava num lugar diferente. Por isso a gente não vende sistema de prateleira: entende onde o seu perde tempo ou perde cliente e constrói um painel com a sua marca que resolve exatamente isso. Pra uns é a agenda, pra outros é o cliente que some, pra outros é não saber os números do mês. O seu, a gente descobre juntos.",
    tags: ["Feito pro seu negócio", "Sua marca", "Cresce com você"],
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
            Quem não aparece no Google é invisível. A gente coloca seu negócio
            na frente de quem procura, e faz a operação rodar sozinha.
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
                <IconTile icon={MapPin} />
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-[#09090B] md:text-2xl">
                  Sites que Colocam Você no Mapa
                </h3>
                <p className="mt-3 leading-relaxed text-[#71717A]">
                  Quando alguém procura seu serviço no Google e não te acha,
                  escolhe o concorrente. A gente resolve isso: site
                  profissional sem cara de template e seu perfil do Google
                  arrumado e bem posicionado, aparecendo pra quem procura na
                  sua região.
                </p>
                <Tags
                  tags={[
                    "Encontrado no Google",
                    "Sem cara de template",
                    "Pronto em até 10 dias",
                  ]}
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
