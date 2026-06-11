"use client";

import { useActionState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { variants, transitions } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateProfile, type AccountActionState } from "@/app/actions/account-actions";

type Props = {
  data: {
    name: string;
    email: string;
    phone: string;
    empresa: string;
    initials: string;
  };
};

export function ProfileCard({ data }: Props) {
  const [state, formAction, pending] = useActionState<AccountActionState, FormData>(
    updateProfile,
    undefined
  );

  useEffect(() => {
    if (state?.success) toast("Dados atualizados");
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
        <h3 className="text-sm font-semibold text-[#09090B]">Seus dados</h3>
      </div>

      <form action={formAction} className="px-6 py-5">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F4F5] text-lg font-semibold text-[#09090B]">
            {data.initials}
          </div>
          <div>
            <p className="text-base font-semibold text-[#09090B]">
              {data.name}
            </p>
            <p className="mt-0.5 text-sm text-[#71717A]">{data.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="perfil-nome" className="text-xs font-medium text-[#A1A1AA]">Nome</label>
            <input
              id="perfil-nome"
              name="name"
              type="text"
              required
              defaultValue={data.name}
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
            />
          </div>
          <div>
            <label htmlFor="perfil-email" className="text-xs font-medium text-[#A1A1AA]">Email</label>
            <input
              id="perfil-email"
              name="email"
              type="email"
              required
              defaultValue={data.email}
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
            />
          </div>
          <div>
            <label htmlFor="perfil-telefone" className="text-xs font-medium text-[#A1A1AA]">
              Telefone
            </label>
            <input
              id="perfil-telefone"
              name="phone"
              type="tel"
              defaultValue={data.phone}
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
            />
          </div>
          <div>
            <label htmlFor="perfil-empresa" className="text-xs font-medium text-[#A1A1AA]">
              Empresa
            </label>
            <input
              id="perfil-empresa"
              type="text"
              defaultValue={data.empresa}
              disabled
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-[#A1A1AA] outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={pending}
            className="gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            {pending ? "Salvando..." : "Salvar alteracoes"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
