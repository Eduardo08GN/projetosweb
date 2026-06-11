"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Calendar, Pencil } from "lucide-react";

export type KanbanItem = {
  id: string;
  titulo: string;
  tenant: string;
  operador: string;
  dias: number;
  angulo: string | null;
  slides: string[];
  legendaBody: string;
  hashtags: string;
  edicaoPendente: Array<{
    slide: number;
    texto?: string;
    imagemUrl?: string;
  }> | null;
  editadoPeloCliente: boolean;
  agendadoParaLabel: string | null;
};

export function KanbanCard({
  item,
  isDragOverlay,
  onClick,
}: {
  item: KanbanItem;
  isDragOverlay?: boolean;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
  });

  return (
    <motion.div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
      onClick={onClick}
      className={`cursor-grab rounded-xl border border-[#E4E4E7] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-150 hover:border-[#D4D4D8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
        isDragging ? "opacity-30" : ""
      } ${isDragOverlay ? "rotate-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]" : ""}`}
      variants={isDragOverlay ? undefined : variants.fadeUpSmall}
      transition={isDragOverlay ? undefined : transitions.smooth}
    >
      <p className="text-sm font-medium text-[#09090B]">{item.titulo}</p>
      <p className="mt-1.5 text-xs font-medium text-[#18181B]">
        {item.tenant}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[#A1A1AA]">{item.operador}</span>
        <span className="text-xs text-[#A1A1AA]">
          {item.dias === 0 ? "Hoje" : `${item.dias}d`}
        </span>
      </div>

      {item.edicaoPendente && item.edicaoPendente.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#FEF9C3] px-3 py-2">
          <Pencil size={12} className="mt-0.5 shrink-0 text-[#854D0E]" />
          <p className="text-xs leading-relaxed text-[#854D0E]">
            Edicao do cliente pra aplicar (
            {item.edicaoPendente.length} slide
            {item.edicaoPendente.length > 1 ? "s" : ""})
          </p>
        </div>
      )}

      {item.agendadoParaLabel && (
        <div className="mt-3 flex items-center gap-1.5">
          <Calendar size={12} strokeWidth={1.5} className="text-[#A1A1AA]" />
          <span className="text-xs text-[#71717A]">
            {item.agendadoParaLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}
