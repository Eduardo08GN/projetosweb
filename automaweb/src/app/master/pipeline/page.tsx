import { getKanbanData, getActiveTenants } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { KanbanBoard } from "@/components/master/pipeline/kanban-board";
import { NewCarrosselModal } from "@/components/master/pipeline/new-carrossel-modal";

export default async function PipelinePage() {
  const [kanbanData, tenants] = await Promise.all([
    getKanbanData(),
    getActiveTenants(),
  ]);

  return (
    <div>
      <PageHeader
        title="Producao"
        description="Producao de conteudo"
        actions={<NewCarrosselModal tenants={tenants} />}
      />
      <KanbanBoard data={kanbanData} />
    </div>
  );
}
