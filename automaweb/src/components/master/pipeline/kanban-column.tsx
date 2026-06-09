"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { variants } from "@/lib/animations";
import { KanbanCard, type KanbanItem } from "./kanban-card";

const columnColors: Record<string, { badge: string; badgeText: string }> = {
  BACKLOG: { badge: "bg-[#F4F4F5]", badgeText: "text-[#52525B]" },
  EM_PRODUCAO: { badge: "bg-[#DBEAFE]", badgeText: "text-[#1E40AF]" },
  REVISAO_INTERNA: { badge: "bg-[#E0E7FF]", badgeText: "text-[#3730A3]" },
  AGUARDANDO_CLIENTE: { badge: "bg-[#FEF9C3]", badgeText: "text-[#854D0E]" },
  APROVADO: { badge: "bg-[#DCFCE7]", badgeText: "text-[#166534]" },
  AGENDADO: { badge: "bg-[#F0F9FF]", badgeText: "text-[#075985]" },
  PUBLICADO: { badge: "bg-[#F0FDF4]", badgeText: "text-[#16A34A]" },
  AJUSTE_PEDIDO: { badge: "bg-[#FEF2F2]", badgeText: "text-[#991B1B]" },
};

const columnLabels: Record<string, string> = {
  BACKLOG: "A fazer",
  EM_PRODUCAO: "Em producao",
  REVISAO_INTERNA: "Revisao interna",
  AGUARDANDO_CLIENTE: "Aguardando cliente",
  APROVADO: "Aprovado",
  AGENDADO: "Agendado",
  PUBLICADO: "Publicado",
  AJUSTE_PEDIDO: "Ajuste pedido",
};

export function KanbanColumn({
  status,
  items,
}: {
  status: string;
  items: KanbanItem[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const colors = columnColors[status] ?? columnColors.BACKLOG;
  const label = columnLabels[status] ?? status;

  return (
    <div className="flex w-[280px] shrink-0 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
          {label}
        </span>
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-xs font-semibold ${colors.badge} ${colors.badgeText}`}
        >
          {items.length}
        </span>
      </div>
      <motion.div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-2.5 rounded-xl p-1.5 transition-colors duration-150 ${
          isOver ? "bg-[#F4F4F5]" : ""
        }`}
        initial="hidden"
        animate="visible"
        variants={variants.staggerContainer}
      >
        {items.map((item) => (
          <KanbanCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <div
            className={`flex h-20 items-center justify-center rounded-xl border border-dashed ${
              isOver ? "border-[#18181B] bg-[#F4F4F5]" : "border-[#E4E4E7]"
            }`}
          >
            <span className="text-xs text-[#A1A1AA]">
              {isOver ? "Soltar aqui" : "Vazio"}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
