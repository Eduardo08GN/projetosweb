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

const mockData: Record<string, KanbanItem[]> = {
  BACKLOG: [
    { id: "1", titulo: "Marketing local para restaurantes", tenant: "Chef Paulo", operador: "Eduardo", dias: 5 },
    { id: "2", titulo: "Como escolher um personal trainer", tenant: "Fit Academy", operador: "Lucas", dias: 2 },
  ],
  EM_PRODUCAO: [
    { id: "3", titulo: "Clareamento x facetas", tenant: "Dra. Camila", operador: "Eduardo", dias: 1 },
    { id: "4", titulo: "Phrasal verbs do dia a dia", tenant: "Prof. Rodger", operador: "Eduardo", dias: 0 },
  ],
  REVISAO_INTERNA: [
    { id: "5", titulo: "Rotina de skincare noturna", tenant: "Studio Bella", operador: "Lucas", dias: 3 },
  ],
  AGUARDANDO_CLIENTE: [
    { id: "6", titulo: "5 erros no present perfect", tenant: "Prof. Rodger", operador: "Lucas", dias: 1 },
  ],
  APROVADO: [
    { id: "7", titulo: "Benefícios da limpeza de pele", tenant: "Studio Bella", operador: "Eduardo", dias: 0 },
  ],
  AGENDADO: [
    { id: "8", titulo: "Sotaque americano vs britânico", tenant: "Prof. Rodger", operador: "Eduardo", dias: 0 },
    { id: "9", titulo: "Pratos para o inverno", tenant: "Chef Paulo", operador: "Lucas", dias: 1 },
  ],
  PUBLICADO: [
    { id: "10", titulo: "Como pedir comida em inglês", tenant: "Prof. Rodger", operador: "Eduardo", dias: 4 },
  ],
  AJUSTE_PEDIDO: [],
};

export function KanbanBoard() {
  return (
    <div className="flex gap-5 overflow-x-auto pb-4">
      {COLUMN_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          items={mockData[status] ?? []}
        />
      ))}
    </div>
  );
}
