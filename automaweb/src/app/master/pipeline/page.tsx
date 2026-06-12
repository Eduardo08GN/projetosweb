import { getKanbanData, getActiveTenants } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { KanbanBoard } from "@/components/master/pipeline/kanban-board";
import { NewCarrosselModal } from "@/components/master/pipeline/new-carrossel-modal";

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ carrossel?: string }>;
}) {
  const [kanbanData, tenants, { carrossel }] = await Promise.all([
    getKanbanData(),
    getActiveTenants(),
    searchParams,
  ]);

  return (
    <div>
      <PageHeader
        title="Producao"
        description="Producao de conteudo"
        actions={<NewCarrosselModal tenants={tenants} />}
      />
      <KanbanBoard data={kanbanData} abrirId={carrossel} />
    </div>
  );
}
