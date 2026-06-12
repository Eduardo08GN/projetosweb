"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { variants, transitions } from "@/lib/animations";
import { Calendar, Clock, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateTimeField } from "@/components/tenant/carrossel/datetime-field";
import { reagendarCarrossel } from "@/app/actions/tenant-carrossel-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type NextPostData = {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  agendadoParaInput: string;
  editavel: boolean;
  progress: number;
} | null;

export function NextPost({ data }: { data: NextPostData }) {
  const [aberto, setAberto] = useState(false);
  const [novaData, setNovaData] = useState(data?.agendadoParaInput ?? "");
  const [pending, startTransition] = useTransition();

  function salvar() {
    if (!data) return;
    startTransition(async () => {
      const result = await reagendarCarrossel(data.id, novaData);
      if (result.error) {
        toast(result.error);
      } else {
        toast("Data atualizada");
        setAberto(false);
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
      <div className="flex items-center justify-between border-b border-[#E4E4E7] px-5 py-4">
        <h3 className="text-sm font-semibold text-[#09090B]">
          Proxima publicacao
        </h3>
        {data?.editavel && (
          <button
            onClick={() => {
              setNovaData(data.agendadoParaInput);
              setAberto(true);
            }}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
          >
            <Pencil size={12} strokeWidth={1.5} />
            Mudar data
          </button>
        )}
      </div>
      <div className="px-5 py-5">
        {data ? (
          <>
            <p className="text-base font-medium text-[#09090B]">
              {data.titulo}
            </p>

            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} strokeWidth={1.5} className="text-[#A1A1AA]" />
                <span className="text-sm text-[#71717A]">{data.data}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} strokeWidth={1.5} className="text-[#A1A1AA]" />
                <span className="text-sm text-[#71717A]">{data.hora}</span>
              </div>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#F4F4F5]">
              <motion.div
                className="h-full rounded-full bg-[#18181B]"
                initial={{ width: 0 }}
                animate={{ width: `${data.progress}%` }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.3,
                }}
              />
            </div>
            <p className="mt-1.5 text-xs text-[#A1A1AA]">
              {data.progress}% pronto
            </p>
          </>
        ) : (
          <p className="text-sm text-[#A1A1AA]">
            Nenhuma publicacao agendada
          </p>
        )}
      </div>

      {data && (
        <Dialog open={aberto} onOpenChange={setAberto}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Mudar a data</DialogTitle>
              <DialogDescription>{data.titulo}</DialogDescription>
            </DialogHeader>
            <DateTimeField value={novaData} onChange={setNovaData} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAberto(false)}
                disabled={pending}
                className="rounded-lg"
              >
                Voltar
              </Button>
              <Button
                onClick={salvar}
                disabled={pending || !novaData || novaData === data.agendadoParaInput}
                className="gap-2 rounded-lg bg-[#18181B] text-[#FAFAFA] hover:bg-[#27272A]"
              >
                {pending && <Loader2 size={14} className="animate-spin" />}
                {pending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
