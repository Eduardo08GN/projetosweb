import { getMasterMetrics, getRecentActivity, getUpcomingPosts } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";

// o robo publica e pausa contas em segundo plano, sem action que
// revalide: as paginas do master saem sempre frescas do banco
export const dynamic = "force-dynamic";
import { MasterMetrics } from "@/components/master/dashboard/master-metrics";
import { RecentActivity } from "@/components/master/dashboard/recent-activity";
import { UpcomingPosts } from "@/components/master/dashboard/upcoming-posts";

export default async function MasterDashboard() {
  const [metrics, activity, posts] = await Promise.all([
    getMasterMetrics(),
    getRecentActivity(),
    getUpcomingPosts(),
  ]);

  return (
    <div>
      <PageHeader title="Inicio" description="Visao geral da operacao" />
      <MasterMetrics data={metrics} />
      <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentActivity items={activity} />
        </div>
        <div>
          <UpcomingPosts items={posts} />
        </div>
      </div>
    </div>
  );
}
