"use client";

import { motion } from "framer-motion";
import { landingViewport } from "@/lib/animations";
import { Counter } from "./counter";

const METRICS = [
  { display: <Counter value={14} />, label: "carrosséis por sessão de produção" },
  { display: <Counter value={2} suffix="h" />, label: "do vídeo bruto ao conteúdo pronto" },
  { display: <span>R$ 0</span>, label: "de custo na geração de imagens" },
  { display: <Counter value={7} suffix="h" />, label: "economizadas por semana" },
];

export function Results() {
  return (
    <section id="resultados" className="bg-[#FAFAFA] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
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
            Números do nosso próprio pipeline.
          </h2>
          <p className="mt-4 max-w-[560px] text-base leading-relaxed text-[#71717A]">
            Nada inventado. É o que a nossa operação entrega hoje, medido em
            produção.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {METRICS.map((metric) => (
            <motion.div
              key={metric.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                },
              }}
              className="border-l border-[#E4E4E7] pl-5"
            >
              <div className="text-4xl font-bold tracking-[-0.02em] text-[#09090B] md:text-5xl">
                {metric.display}
              </div>
              <p className="mt-2 text-sm font-medium leading-snug text-[#71717A]">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={landingViewport}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="mt-16 max-w-2xl"
        >
          <blockquote className="rounded-r-xl border-l-[3px] border-[#18181B] bg-[#F4F4F5] px-6 py-5">
            <p
              className="font-semibold leading-snug text-[#09090B]"
              style={{ fontSize: "clamp(1.125rem, 2vw, 1.375rem)" }}
            >
              Ninguém quer um site. Quer mais dinheiro, vida mais fácil e
              solução sob medida.
            </p>
            <figcaption className="mt-3 text-sm font-medium text-[#71717A]">
              Tese AutomaWeb
            </figcaption>
          </blockquote>
        </motion.figure>
      </div>
    </section>
  );
}
