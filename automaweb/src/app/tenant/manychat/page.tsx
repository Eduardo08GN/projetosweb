"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DmMetrics } from "@/components/tenant/manychat/dm-metrics";
import { AutomationsTable } from "@/components/tenant/manychat/automations-table";
import { RecentDms } from "@/components/tenant/manychat/recent-dms";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ManychatPage() {
  return (
    <div>
      <PageHeader
        title="Mensagens automáticas"
        description="Respostas automáticas no seu Direct"
        actions={
          <Button className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]">
            <Plus size={16} strokeWidth={2} />
            Nova automação
          </Button>
        }
      />
      <div className="space-y-6">
        <DmMetrics />
        <AutomationsTable />
        <RecentDms />
      </div>
    </div>
  );
}
