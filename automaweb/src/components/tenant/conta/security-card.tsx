"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export function SecurityCard() {
  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="border-b border-[#E4E4E7] px-6 py-4">
        <h3 className="text-sm font-semibold text-[#09090B]">Segurança</h3>
      </div>

      <div className="px-6 py-5 space-y-5">
        <div>
          <label className="text-xs font-medium text-[#A1A1AA]">
            Senha atual
          </label>
          <input
            type="password"
            placeholder="Digite sua senha atual"
            className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-medium text-[#A1A1AA]">
              Nova senha
            </label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#A1A1AA]">
              Confirmar nova senha
            </label>
            <input
              type="password"
              placeholder="Repita a nova senha"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>
        </div>
        <Button className="rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]">
          Alterar senha
        </Button>
      </div>
    </motion.div>
  );
}
