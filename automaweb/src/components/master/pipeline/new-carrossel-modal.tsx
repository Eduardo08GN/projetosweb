"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createCarrossel,
  type CreateCarrosselState,
} from "@/app/actions/carrossel-actions";
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

type TenantOption = { id: string; name: string };

export function NewCarrosselModal({ tenants }: { tenants: TenantOption[] }) {
  const [state, action, pending] = useActionState<
    CreateCarrosselState,
    FormData
  >(createCarrossel, undefined);
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
        Novo carrossel
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo carrossel</DialogTitle>
          <DialogDescription>
            Crie um carrossel para um cliente
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <div>
            <label
              htmlFor="tenantId"
              className="text-xs font-medium text-[#A1A1AA]"
            >
              Cliente
            </label>
            <select
              id="tenantId"
              name="tenantId"
              required
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione o cliente
              </option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="titulo"
              className="text-xs font-medium text-[#A1A1AA]"
            >
              Titulo
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              required
              placeholder="Ex: 5 erros que travam seu ingles"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>

          <div>
            <label
              htmlFor="angulo"
              className="text-xs font-medium text-[#A1A1AA]"
            >
              Angulo
            </label>
            <input
              id="angulo"
              name="angulo"
              type="text"
              placeholder="Ex: Dor do aluno intermediario que trava"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>

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
              {pending ? "Criando..." : "Criar carrossel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
