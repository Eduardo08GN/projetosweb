"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import {
  Bot,
  Hammer,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { landingViewport } from "@/lib/animations";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
};

const STEPS: Step[] = [
  {
    icon: Search,
    title: "Descoberta",
    description:
      "Entendemos seu negócio, seus clientes e seus problemas reais. Não vendemos site. Identificamos o que falta pra você crescer.",
    time: "1 reunião",
  },
  {
    icon: Hammer,
    title: "Construção",
    description:
      "Construímos seu site premium e os sistemas que o seu negócio precisa. Tudo com a cara da sua marca, sem interface genérica.",
    time: "5 a 10 dias",
  },
  {
    icon: Bot,
    title: "Automação",
    description:
      "Ativamos a esteira de conteúdo e os fluxos de retenção. Seu Instagram posta sozinho. Seu sistema lembra o cliente de voltar.",
    time: "Contínuo",
  },
  {
    icon: TrendingUp,
    title: "Crescimento",
    description:
      "Acompanhamos métricas reais: novos clientes, retenção, receita. Ajustamos os sistemas todo mês. Você cresce, a gente otimiza.",
    time: "Todo mês",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 70%"],
  });

  return (
    <section
      id="como-funciona"
      className="relative border-t border-[#E4E4E7] bg-[#F4F4F5] py-20 md:py-28"
    >
      {/* Bleed sutil: o fundo da seção anterior sangra pra dentro desta */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAFAFA] to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={landingViewport}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="max-w-xl"
        >
          <h2
            className="font-bold text-[#09090B]"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Do primeiro papo ao piloto automático.
          </h2>
          <p className="mt-4 max-w-[560px] text-base leading-relaxed text-[#71717A]">
            Quatro etapas, zero esforço técnico do seu lado. Você aprova pelo
            celular, o sistema faz o resto.
          </p>
        </motion.div>

        <div ref={ref} className="relative mt-14">
          {/* Linha conectora desktop: preenche conforme o scroll */}
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-[5px] hidden h-0.5 bg-[#E4E4E7] md:block"
          >
            <motion.div
              className="h-full origin-left bg-[#18181B]"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          {/* Linha conectora mobile: vertical, à esquerda */}
          <div
            aria-hidden
            className="absolute bottom-6 left-[5px] top-1 w-0.5 bg-[#E4E4E7] md:hidden"
          >
            <motion.div
              className="h-full w-full origin-top bg-[#18181B]"
              style={{ scaleY: scrollYProgress }}
            />
          </div>

          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={landingViewport}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: i * 0.08,
                }}
                className="relative pl-8 md:pl-0"
              >
                {/* Dot do passo */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1 block h-3 w-3 rounded-full border-[3px] border-[#F4F4F5] bg-[#18181B] md:relative md:left-auto md:top-auto md:mx-auto"
                />
                <div className="md:mt-6 md:text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white">
                    <step.icon
                      className="h-[18px] w-[18px] text-[#09090B]"
                      strokeWidth={1.5}
                    />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-[#09090B]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#71717A]">
                    {step.description}
                  </p>
                  <span className="mt-3 inline-block rounded-md bg-white px-2.5 py-1 text-xs font-medium text-[#71717A]">
                    {step.time}
                  </span>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
