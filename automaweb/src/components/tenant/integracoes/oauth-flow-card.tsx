"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Shield, ArrowRight } from "lucide-react";

const steps = [
  {
    num: "1",
    title: "Autorizar",
    desc: "Clique em conectar e faça login na sua conta Meta",
  },
  {
    num: "2",
    title: "Permissão",
    desc: "Autorize a AutomaWeb a publicar no seu perfil",
  },
  {
    num: "3",
    title: "Pronto",
    desc: "Carrosséis serão publicados automaticamente",
  },
];

export function OAuthFlowCard() {
  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="flex items-center gap-3 border-b border-[#E4E4E7] px-6 py-4">
        <Shield size={18} strokeWidth={1.5} className="text-[#71717A]" />
        <h3 className="text-sm font-semibold text-[#09090B]">
          Como funciona a conexão
        </h3>
      </div>

      <div className="px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-3">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-start gap-3 sm:flex-1">
              <div className="flex flex-1 items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F4F4F5] text-xs font-semibold text-[#09090B]">
                  {step.num}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#09090B]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#71717A]">{step.desc}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="mt-1.5 hidden shrink-0 text-[#D4D4D8] sm:block"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-[#FAFAFA] px-4 py-3">
          <p className="text-xs text-[#71717A]">
            A AutomaWeb nunca armazena sua senha. Usamos o mesmo padrão de
            segurança de plataformas como Buffer e Hootsuite. Você pode revogar
            o acesso a qualquer momento.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
