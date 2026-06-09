"use client";

import { KanbanColumn } from "./kanban-column";
import type { KanbanItem } from "./kanban-card";

const COLUMN_ORDER = [
  "BACKLOG",
  "EM_PRODUCAO",
  "REVISAO_INTERNA",
  "AGUARDANDO_CLIENTE",
  "APROVADO",
  "AGENDADO",
  "PUBLICADO",
  "AJUSTE_PEDIDO",
];

type Props = {
  data: Record<string, KanbanItem[]>;
};

export function KanbanBoard({ data }: Props) {
  return (
    <div className="flex gap-5 overflow-x-auto pb-4">
      {COLUMN_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          items={data[status] ?? []}
        />
      ))}
    </div>
  );
}
