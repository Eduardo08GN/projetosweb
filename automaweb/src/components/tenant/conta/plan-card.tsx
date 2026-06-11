"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { variants, transitions } from "@/lib/animations";
import { CheckCircle2, CalendarClock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestPlanChange } from "@/app/actions/account-actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const planFeatures = [
  "Carrosseis toda semana no seu Instagram",
  "Publicacao automatica, sem voce mover um dedo",
  "Aprovacao e edicao de cada post antes de ir ao ar",
  "Suporte direto com a equipe",
];

type PlanData = {
  plano: string | null;
  inicioLabel: string;
  validoAteLabel: string | null;
  mensalidade: number | null;
};

type PlanoDisponivel = {
  id: string;
  nome: string;
  valor: number;
  descricao: string;
  destaque: boolean;
};

export function PlanCard({
  data,
  planos,
}: {
  data: PlanData;
  planos: PlanoDisponivel[];
}) {
  const [planosOpen, setPlanosOpen] = useState(false);
  const [pedido, setPedido] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function pedirPlano(nome: string) {
    startTransition(async () => {
      const result = await requestPlanChange(nome);
      if (result.error) {
        toast(result.error);
      } else {
        setPedido(nome);
        toast("Recebemos seu interesse. A gente entra em contato");
      }
    });
  }

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
              {data.plano ?? "A definir"}
            </span>
            <p className="mt-2 text-xs text-[#71717A]">
              Ativo desde {data.inicioLabel}
            </p>
          </div>
          {data.mensalidade !== null && (
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-[#09090B]">
                R$ {data.mensalidade}
              </p>
              <p className="text-xs text-[#71717A]">/mes apos o periodo incluso</p>
            </div>
          )}
        </div>

        {data.validoAteLabel && (
          <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2.5">
            <CalendarClock size={14} strokeWidth={1.5} className="shrink-0 text-[#71717A]" />
            <p className="text-xs text-[#52525B]">
              Periodo incluso valido ate{" "}
              <span className="font-semibold text-[#09090B]">
                {data.validoAteLabel}
              </span>
            </p>
          </div>
        )}

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

        <Button
          onClick={() => setPlanosOpen(true)}
          className="mt-6 w-full rounded-lg border border-[#E4E4E7] bg-white px-5 py-2.5 text-sm font-medium text-[#09090B] shadow-none hover:bg-[#F4F4F5]"
        >
          Ver planos
        </Button>
      </div>

      <Sheet open={planosOpen} onOpenChange={setPlanosOpen}>
        <SheetContent side="right" className="overflow-y-auto bg-white sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-sm font-semibold text-[#09090B]">
              Planos de continuidade
            </SheetTitle>
            <SheetDescription className="text-xs leading-relaxed text-[#71717A]">
              Quando o periodo incluso no seu pacote terminar, voce escolhe
              como seguir. Sem fidelidade e sem surpresa.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 pb-6">
            {planos.map((plano) => (
              <div
                key={plano.nome}
                className={`rounded-xl border p-5 ${
                  plano.destaque
                    ? "border-[#18181B] bg-[#FAFAFA]"
                    : "border-[#E4E4E7] bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#09090B]">
                      {plano.nome}
                    </p>
                    {plano.destaque && (
                      <span className="mt-1 inline-block rounded-md bg-[#18181B] px-2 py-0.5 text-[10px] font-semibold text-[#FAFAFA]">
                        Mais completo
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold tracking-tight text-[#09090B]">
                      R$ {plano.valor}
                    </p>
                    <p className="text-[11px] text-[#71717A]">/mes</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#71717A]">
                  {plano.descricao}
                </p>
                <button
                  onClick={() => pedirPlano(plano.nome)}
                  disabled={pending || pedido === plano.nome}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors duration-150 disabled:opacity-60 ${
                    plano.destaque
                      ? "bg-[#18181B] text-[#FAFAFA] hover:bg-[#27272A]"
                      : "border border-[#E4E4E7] bg-white text-[#09090B] hover:bg-[#F4F4F5]"
                  }`}
                >
                  {pending && pedido !== plano.nome && (
                    <Loader2 size={12} className="animate-spin" />
                  )}
                  {pedido === plano.nome
                    ? "Interesse registrado"
                    : "Tenho interesse"}
                </button>
              </div>
            ))}

            <a
              href="mailto:contato@automaweb.pro?subject=Quero saber mais sobre os planos"
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] transition-colors duration-150 hover:bg-[#27272A]"
            >
              Falar com a gente
            </a>
            <p className="text-center text-[11px] text-[#A1A1AA]">
              A gente responde rapido e sem compromisso.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
