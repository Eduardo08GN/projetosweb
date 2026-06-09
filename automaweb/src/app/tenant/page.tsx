"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageShell } from "@/components/shared/page-shell";
import { TenantMetrics } from "@/components/tenant/dashboard/tenant-metrics";
import { ConnectionBanner } from "@/components/tenant/dashboard/connection-banner";
import { RecentCarousels } from "@/components/tenant/dashboard/recent-carousels";
import { NextPost } from "@/components/tenant/dashboard/next-post";
import { DmStats } from "@/components/tenant/dashboard/dm-stats";

export default function TenantDashboard() {
  return (
    <PageShell>
      <PageHeader
        title="Dashboard"
        description="Acompanhe o que está acontecendo"
      />
      <div className="space-y-6">
        <ConnectionBanner connected={true} username="prof.rodger" />
        <TenantMetrics />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecentCarousels />
          </div>
          <div className="space-y-6">
            <NextPost />
            <DmStats />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
