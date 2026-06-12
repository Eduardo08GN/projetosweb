import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPlanosCatalogo, getTenantPlan, getTenantProfile } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileCard } from "@/components/tenant/conta/profile-card";
import { PlanCard } from "@/components/tenant/conta/plan-card";
import { SecurityCard } from "@/components/tenant/conta/security-card";
import { InstallAppCard } from "@/components/tenant/conta/install-app-card";

export default async function ContaPage() {
  const session = await getSession();
  if (!session?.tenantId) redirect("/login");

  const [profile, plan, planos] = await Promise.all([
    getTenantProfile(session.userId),
    getTenantPlan(session.tenantId),
    getPlanosCatalogo(),
  ]);
  if (!profile || !plan) redirect("/login");

  return (
    <div>
      <PageHeader title="Minha conta" description="Perfil e configuracoes" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileCard data={profile} />
          <SecurityCard />
        </div>
        <div className="space-y-6">
          <PlanCard data={plan} planos={planos} />
          <InstallAppCard />
        </div>
      </div>
    </div>
  );
}
