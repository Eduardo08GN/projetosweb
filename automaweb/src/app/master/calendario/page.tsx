import { getCalendarEvents } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { CalendarGrid } from "@/components/master/calendario/calendar-grid";

// o robo publica em segundo plano, sem passar por action que revalide:
// a agenda precisa sair sempre fresca do banco
export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const { hoje, events } = await getCalendarEvents();

  return (
    <div>
      <PageHeader
        title="Calendário"
        description="Agenda de publicações"
      />
      <CalendarGrid hoje={hoje} events={events} />
    </div>
  );
}
