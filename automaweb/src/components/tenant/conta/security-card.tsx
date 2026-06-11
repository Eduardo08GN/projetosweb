"use client";

import { useActionState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { variants, transitions } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { changePassword, type AccountActionState } from "@/app/actions/account-actions";

export function SecurityCard() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<AccountActionState, FormData>(
    changePassword,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      toast("Senha alterada");
      formRef.current?.reset();
    }
    if (state?.error) toast(state.error);
  }, [state]);

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

      <form ref={formRef} action={formAction} className="space-y-5 px-6 py-5">
        <div>
          <label htmlFor="senha-atual" className="text-xs font-medium text-[#A1A1AA]">
            Senha atual
          </label>
          <input
            id="senha-atual"
            name="atual"
            type="password"
            required
            placeholder="Digite sua senha atual"
            className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="senha-nova" className="text-xs font-medium text-[#A1A1AA]">
              Nova senha
            </label>
            <input
              id="senha-nova"
              name="nova"
              type="password"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>
          <div>
            <label htmlFor="senha-confirmar" className="text-xs font-medium text-[#A1A1AA]">
              Confirmar nova senha
            </label>
            <input
              id="senha-confirmar"
              name="confirmar"
              type="password"
              required
              minLength={8}
              placeholder="Repita a nova senha"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          {pending ? "Alterando..." : "Alterar senha"}
        </Button>
      </form>
    </motion.div>
  );
}
