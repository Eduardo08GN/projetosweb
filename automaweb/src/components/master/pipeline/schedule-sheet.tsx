"use client";

import { useState, useTransition } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { scheduleCarrossel } from "@/app/actions/carrossel-actions";
import type { KanbanItem } from "./kanban-card";

export function ScheduleSheet({
  item,
  open,
  onOpenChange,
}: {
  item: KanbanItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSchedule() {
    if (!item || !date || !time) return;
    setError("");

    const dateTime = `${date}T${time}:00`;
    startTransition(async () => {
      const result = await scheduleCarrossel(item.id, dateTime);
      if (result.error) {
        setError(result.error);
      } else {
        setDate("");
        setTime("10:00");
        onOpenChange(false);
      }
    });
  }

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold text-[#09090B]">
            Agendar publicacao
          </SheetTitle>
          <SheetDescription className="text-xs text-[#71717A]">
            Defina quando este carrossel sera publicado
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 px-4">
          <div className="rounded-lg bg-[#FAFAFA] px-4 py-3">
            <p className="text-sm font-medium text-[#09090B]">{item.titulo}</p>
            <p className="mt-0.5 text-xs text-[#71717A]">{item.tenant}</p>
            {item.angulo && (
              <p className="mt-1 text-xs text-[#A1A1AA]">{item.angulo}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="schedule-date"
                className="text-xs font-medium text-[#A1A1AA]"
              >
                Data
              </label>
              <input
                id="schedule-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
              />
            </div>
            <div>
              <label
                htmlFor="schedule-time"
                className="text-xs font-medium text-[#A1A1AA]"
              >
                Horario
              </label>
              <input
                id="schedule-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-[#FEE2E2] px-3.5 py-2.5 text-sm text-[#991B1B]">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSchedule}
              disabled={pending || !date}
              className="gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
            >
              <CalendarCheck size={14} strokeWidth={2} />
              {pending ? "Agendando..." : "Agendar"}
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
            >
              Cancelar
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
