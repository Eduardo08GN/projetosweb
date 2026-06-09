import { getKanbanData } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { KanbanBoard } from "@/components/master/pipeline/kanban-board";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function PipelinePage() {
  const kanbanData = await getKanbanData();

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Producao de conteudo"
        actions={
          <Button className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]">
            <Plus size={16} strokeWidth={2} />
            Novo carrossel
          </Button>
        }
      />
      <KanbanBoard data={kanbanData} />
    </div>
  );
}
