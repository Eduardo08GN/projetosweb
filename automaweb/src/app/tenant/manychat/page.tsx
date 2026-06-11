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
import { Sparkles } from "lucide-react";

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
          <span className="rounded-lg bg-[#FEF3C7] px-3 py-1.5 text-xs font-semibold text-[#92400E]">
            Em breve
          </span>
        }
      />
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-5 py-4">
          <Sparkles size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#92400E]" />
          <div>
            <p className="text-sm font-medium text-[#78350F]">
              Em fase final de testes
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#92400E]">
              Quem comentar nos seus posts vai receber resposta automatica no
              Direct, do jeito que voce definir aqui. Assim que for liberada,
              voce sera avisado e ja encontra tudo pronto nesta tela.
            </p>
          </div>
        </div>
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
