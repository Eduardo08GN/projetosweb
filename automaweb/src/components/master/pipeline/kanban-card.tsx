"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";

export type KanbanItem = {
  id: string;
  titulo: string;
  tenant: string;
  operador: string;
  dias: number;
};

export function KanbanCard({
  item,
  isDragOverlay,
}: {
  item: KanbanItem;
  isDragOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
  });

  return (
    <motion.div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
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
    </motion.div>
  );
}
