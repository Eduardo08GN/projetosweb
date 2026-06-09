"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createClient,
  type CreateClientState,
} from "@/app/actions/client-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs font-medium text-[#A1A1AA]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
      />
    </div>
  );
}

export function NewClientModal() {
  const [state, action, pending] = useActionState<CreateClientState, FormData>(
    createClient,
    undefined
  );
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state?.success) {
      closeRef.current?.click();
    }
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]" />
        }
      >
        <Plus size={16} strokeWidth={2} />
        Novo cliente
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo cliente</DialogTitle>
          <DialogDescription>
            Cadastre um novo cliente na plataforma
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <FormField
            label="Nome"
            name="name"
            placeholder="Ex: Prof. Rodger Koller"
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="cliente@email.com"
            required
          />
          <FormField
            label="Telefone"
            name="phone"
            type="tel"
            placeholder="(00) 00000-0000"
          />
          <FormField
            label="Senha inicial"
            name="password"
            type="text"
            placeholder="Deixe vazio para gerar automaticamente"
          />

          {state?.error && (
            <p className="rounded-lg bg-[#FEE2E2] px-3.5 py-2.5 text-sm text-[#991B1B]">
              {state.error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose
              ref={closeRef}
              render={
                <button
                  type="button"
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
                />
              }
            >
              Cancelar
            </DialogClose>
            <Button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
            >
              {pending ? "Criando..." : "Criar cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
