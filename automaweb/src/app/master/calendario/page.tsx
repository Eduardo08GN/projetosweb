"use client";

import { PageHeader } from "@/components/shared/page-header";
import { CalendarGrid } from "@/components/master/calendario/calendar-grid";

export default function CalendarioPage() {
  return (
    <div>
      <PageHeader
        title="Calendário"
        description="Agenda de publicações"
      />
      <CalendarGrid />
    </div>
  );
}
