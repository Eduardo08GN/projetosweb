"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KanbanBoard } from "@/components/master/pipeline/kanban-board";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PipelinePage() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Produção de conteúdo"
        actions={
          <Button className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]">
            <Plus size={16} strokeWidth={2} />
            Novo carrossel
          </Button>
        }
      />
      <KanbanBoard />
    </div>
  );
}
