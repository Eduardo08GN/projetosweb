"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { variants, transitions } from "@/lib/animations";

type CalendarEvent = {
  id: string;
  titulo: string;
  tenant: string;
  date: Date;
  color: string;
  textColor: string;
};

const tenantColors: Record<string, { bg: string; text: string }> = {
  "Prof. Rodger": { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
  "Dra. Camila": { bg: "bg-[#FCE7F3]", text: "text-[#9D174D]" },
  "Studio Bella": { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]" },
  "Chef Paulo": { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]" },
  "Fit Academy": { bg: "bg-[#DCFCE7]", text: "text-[#166534]" },
};

const mockEvents: CalendarEvent[] = [
  { id: "1", titulo: "Sotaque americano", tenant: "Prof. Rodger", date: new Date(2026, 5, 10), color: "bg-[#DBEAFE]", textColor: "text-[#1E40AF]" },
  { id: "2", titulo: "Clareamento x facetas", tenant: "Dra. Camila", date: new Date(2026, 5, 11), color: "bg-[#FCE7F3]", textColor: "text-[#9D174D]" },
  { id: "3", titulo: "Skincare noturna", tenant: "Studio Bella", date: new Date(2026, 5, 12), color: "bg-[#E0E7FF]", textColor: "text-[#3730A3]" },
  { id: "4", titulo: "Phrasal verbs", tenant: "Prof. Rodger", date: new Date(2026, 5, 15), color: "bg-[#DBEAFE]", textColor: "text-[#1E40AF]" },
  { id: "5", titulo: "Pratos de inverno", tenant: "Chef Paulo", date: new Date(2026, 5, 17), color: "bg-[#FEF9C3]", textColor: "text-[#854D0E]" },
  { id: "6", titulo: "Present perfect", tenant: "Prof. Rodger", date: new Date(2026, 5, 20), color: "bg-[#DBEAFE]", textColor: "text-[#1E40AF]" },
  { id: "7", titulo: "Treino funcional", tenant: "Fit Academy", date: new Date(2026, 5, 22), color: "bg-[#DCFCE7]", textColor: "text-[#166534]" },
  { id: "8", titulo: "Limpeza de pele", tenant: "Studio Bella", date: new Date(2026, 5, 25), color: "bg-[#E0E7FF]", textColor: "text-[#3730A3]" },
  { id: "9", titulo: "Implante dentário", tenant: "Dra. Camila", date: new Date(2026, 5, 27), color: "bg-[#FCE7F3]", textColor: "text-[#9D174D]" },
];

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function CalendarGrid() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function getEventsForDay(day: Date) {
    return mockEvents.filter((e) => isSameDay(e.date, day));
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
        <h3 className="text-base font-semibold tracking-tight text-[#09090B] capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="border-b border-[#E4E4E7] px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]"
          >
            {day}
          </div>
        ))}

        {days.map((day, i) => {
          const inMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);
          const events = getEventsForDay(day);

          return (
            <div
              key={i}
              className={`min-h-[100px] border-b border-r border-[#E4E4E7] p-1.5 ${
                i % 7 === 0 ? "border-l-0" : ""
              } ${!inMonth ? "bg-[#FAFAFA]" : ""}`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isToday
                    ? "bg-[#18181B] text-white"
                    : inMonth
                    ? "text-[#09090B]"
                    : "text-[#D4D4D8]"
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 flex flex-col gap-0.5">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`truncate rounded px-1.5 py-0.5 text-[11px] font-medium ${event.color} ${event.textColor}`}
                    title={`${event.titulo} — ${event.tenant}`}
                  >
                    {event.titulo}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
