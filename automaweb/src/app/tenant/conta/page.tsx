"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ProfileCard } from "@/components/tenant/conta/profile-card";
import { PlanCard } from "@/components/tenant/conta/plan-card";
import { SecurityCard } from "@/components/tenant/conta/security-card";

export default function ContaPage() {
  return (
    <div>
      <PageHeader
        title="Minha conta"
        description="Perfil e configurações"
      />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <ProfileCard />
          <SecurityCard />
        </div>
        <div>
          <PlanCard />
        </div>
      </div>
    </div>
  );
}
