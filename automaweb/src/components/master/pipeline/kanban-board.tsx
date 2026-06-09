"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard, type KanbanItem } from "./kanban-card";
import { ScheduleSheet } from "./schedule-sheet";
import { moveCarrossel } from "@/app/actions/carrossel-actions";

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
  const [columns, setColumns] = useState(data);
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);
  const [scheduleItem, setScheduleItem] = useState<KanbanItem | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function findItemColumn(itemId: string): string | null {
    for (const [status, items] of Object.entries(columns)) {
      if (items.some((i) => i.id === itemId)) return status;
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    const col = findItemColumn(id);
    if (!col) return;
    const item = columns[col]?.find((i) => i.id === id) ?? null;
    setActiveItem(item);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const itemId = active.id as string;
    const sourceCol = findItemColumn(itemId);
    if (!sourceCol) return;

    const targetCol = COLUMN_ORDER.includes(over.id as string)
      ? (over.id as string)
      : findItemColumn(over.id as string);
    if (!targetCol || sourceCol === targetCol) return;

    const item = columns[sourceCol]!.find((i) => i.id === itemId)!;

    setColumns((prev) => {
      const next = { ...prev };
      next[sourceCol] = prev[sourceCol]!.filter((i) => i.id !== itemId);
      next[targetCol] = [{ ...item, dias: 0 }, ...(prev[targetCol] ?? [])];
      return next;
    });

    startTransition(async () => {
      const result = await moveCarrossel(itemId, targetCol);
      if (result.error) {
        setColumns(data);
      }
    });
  }

  function handleCardClick(item: KanbanItem, status: string) {
    if (status === "APROVADO") {
      setScheduleItem(item);
      setScheduleOpen(true);
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 overflow-x-auto pb-4">
          {COLUMN_ORDER.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              items={columns[status] ?? []}
              onCardClick={(item) => handleCardClick(item, status)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeItem ? <KanbanCard item={activeItem} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <ScheduleSheet
        item={scheduleItem}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
      />
    </>
  );
}
