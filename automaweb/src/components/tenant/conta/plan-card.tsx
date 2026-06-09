"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { CheckCircle2 } from "lucide-react";

const planFeatures = [
  "Carrosséis ilimitados",
  "Publicação automática no Instagram",
  "Automação de DMs",
  "Suporte prioritário",
];

export function PlanCard() {
  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="border-b border-[#E4E4E7] px-6 py-4">
        <h3 className="text-sm font-semibold text-[#09090B]">Seu plano</h3>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-end justify-between">
          <div>
            <span className="inline-block rounded-md bg-[#18181B] px-3 py-1 text-xs font-semibold text-[#FAFAFA]">
              Completo
            </span>
            <p className="mt-2 text-xs text-[#71717A]">
              Ativo desde 20 de maio de 2026
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-[#09090B]">
              R$ 497
            </p>
            <p className="text-xs text-[#71717A]">/mês</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {planFeatures.map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <CheckCircle2
                size={14}
                strokeWidth={2}
                className="shrink-0 text-[#166534]"
              />
              <span className="text-sm text-[#71717A]">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
