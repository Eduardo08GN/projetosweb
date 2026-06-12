"use client";

import { useState } from "react";
import Link from "next/link";
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
  dia: string; // "AAAA-MM-DD" ja no fuso de Brasilia, resolvido no servidor
  publicado: boolean;
};

const COLOR_PALETTE = [
  { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
  { bg: "bg-[#FCE7F3]", text: "text-[#9D174D]" },
  { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]" },
  { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]" },
  { bg: "bg-[#DCFCE7]", text: "text-[#166534]" },
];

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function CalendarGrid({
  hoje,
  events,
}: {
  hoje: string;
  events: CalendarEvent[];
}) {
  // o "hoje" vem do servidor (fuso de Brasilia): servidor e navegador
  // renderizam o mesmo mes e o mesmo dia marcado, sem divergencia
  const today = new Date(`${hoje}T12:00:00`);
  const [currentMonth, setCurrentMonth] = useState(today);
  const [filtroTenant, setFiltroTenant] = useState<string | null>(null);

  // cada cliente ganha uma cor fixa, na ordem alfabetica do nome
  const tenantColors = new Map<string, (typeof COLOR_PALETTE)[number]>();
  for (const name of [...new Set(events.map((e) => e.tenant))].sort()) {
    tenantColors.set(name, COLOR_PALETTE[tenantColors.size % COLOR_PALETTE.length]);
  }
  const tenants = [...tenantColors.keys()];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function getEventsForDay(day: Date) {
    const chave = format(day, "yyyy-MM-dd");
    return events.filter(
      (e) => e.dia === chave && (!filtroTenant || e.tenant === filtroTenant)
    );
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

      {tenants.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto border-b border-[#E4E4E7] px-5 py-3">
          <button
            onClick={() => setFiltroTenant(null)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
              filtroTenant === null
                ? "bg-[#18181B] text-[#FAFAFA]"
                : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#09090B]"
            }`}
          >
            Todos
          </button>
          {tenants.map((name) => {
            const ativo = filtroTenant === name;
            const cor = tenantColors.get(name)!;
            return (
              <button
                key={name}
                onClick={() => setFiltroTenant(ativo ? null : name)}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
                  ativo
                    ? "bg-[#18181B] text-[#FAFAFA]"
                    : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#09090B]"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${cor.bg}`} />
                {name}
              </button>
            );
          })}
        </div>
      )}

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
          const dayEvents = getEventsForDay(day);

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
                {dayEvents.map((event) => {
                  const color = tenantColors.get(event.tenant)!;
                  return (
                    <Link
                      key={event.id}
                      href={`/master/pipeline?carrossel=${event.id}`}
                      className={`block truncate rounded px-1.5 py-0.5 text-[11px] font-medium transition-opacity duration-150 hover:opacity-70 ${color.bg} ${color.text} ${
                        event.publicado ? "" : "opacity-80"
                      }`}
                      title={`${event.titulo} — ${event.tenant} (${event.publicado ? "publicado" : "agendado"})`}
                    >
                      {event.titulo}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
