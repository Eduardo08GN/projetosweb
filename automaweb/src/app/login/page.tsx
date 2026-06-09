"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#FAFAFA]">
      <motion.div
        className="w-full max-w-sm"
        variants={variants.fadeUp}
        initial="hidden"
        animate="visible"
        transition={transitions.page}
      >
        <div className="mb-8 flex justify-center">
          <Image
            src="/automaweb_logo_preta_horizontal.png"
            alt="AutomaWeb"
            width={180}
            height={36}
            priority
          />
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h1 className="text-lg font-semibold tracking-tight text-[#09090B]">
            Entrar
          </h1>
          <p className="mt-1 text-sm text-[#71717A]">
            Acesse sua conta para continuar
          </p>

          <form action={action} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="text-xs font-medium text-[#A1A1AA]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-xs font-medium text-[#A1A1AA]"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Digite sua senha"
                className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-[#FEE2E2] px-3.5 py-2.5 text-sm text-[#991B1B]">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[#18181B] py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
            >
              {pending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#A1A1AA]">
          Acesso restrito a clientes AutomaWeb
        </p>
      </motion.div>
    </div>
  );
}
