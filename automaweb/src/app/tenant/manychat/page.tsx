import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTenantDmMetrics,
  getTenantAutomations,
  getTenantRecentDms,
} from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { DmMetrics } from "@/components/tenant/manychat/dm-metrics";
import { AutomationsTable } from "@/components/tenant/manychat/automations-table";
import { RecentDms } from "@/components/tenant/manychat/recent-dms";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ManychatPage() {
  const session = await getSession();
  if (!session?.tenantId) redirect("/login");

  const [dmMetrics, automations, recentDms] = await Promise.all([
    getTenantDmMetrics(session.tenantId),
    getTenantAutomations(session.tenantId),
    getTenantRecentDms(session.tenantId),
  ]);

  return (
    <div>
      <PageHeader
        title="Mensagens automaticas"
        description="Respostas automaticas no seu Direct"
        actions={
          <Button className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]">
            <Plus size={16} strokeWidth={2} />
            Nova automacao
          </Button>
        }
      />
      <div className="space-y-6">
        <DmMetrics data={dmMetrics} />
        <AutomationsTable
          items={automations.map((a) => ({
            id: a.id,
            keyword: a.keyword,
            resposta: a.resposta,
            ativo: a.ativo,
            disparos: a.disparos,
          }))}
        />
        <RecentDms items={recentDms} />
      </div>
    </div>
  );
}
