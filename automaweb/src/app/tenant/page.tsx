import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTenantMetrics,
  getTenantConnection,
  getTenantRecentCarousels,
  getTenantNextPost,
  getTenantDmStats,
} from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { PageShell } from "@/components/shared/page-shell";
import { TenantMetrics } from "@/components/tenant/dashboard/tenant-metrics";
import { ConnectionBanner } from "@/components/tenant/dashboard/connection-banner";
import { RecentCarousels } from "@/components/tenant/dashboard/recent-carousels";
import { NextPost } from "@/components/tenant/dashboard/next-post";
import { DmStats } from "@/components/tenant/dashboard/dm-stats";

export default async function TenantDashboard() {
  const session = await getSession();
  if (!session?.tenantId) redirect("/login");

  const [metrics, connection, carousels, nextPost, dmStats] = await Promise.all(
    [
      getTenantMetrics(session.tenantId),
      getTenantConnection(session.tenantId),
      getTenantRecentCarousels(session.tenantId),
      getTenantNextPost(session.tenantId),
      getTenantDmStats(session.tenantId),
    ]
  );

  return (
    <PageShell>
      <PageHeader
        title="Dashboard"
        description="Acompanhe o que esta acontecendo"
      />
      <div className="space-y-6">
        <ConnectionBanner
          connected={connection?.status === "CONECTADO"}
          username={connection?.igUsername ?? undefined}
        />
        <TenantMetrics data={metrics} />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecentCarousels items={carousels} />
          </div>
          <div className="space-y-6">
            <NextPost data={nextPost} />
            <DmStats data={dmStats} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
