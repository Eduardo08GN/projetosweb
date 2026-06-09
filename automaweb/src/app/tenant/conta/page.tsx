import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTenantProfile } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileCard } from "@/components/tenant/conta/profile-card";
import { PlanCard } from "@/components/tenant/conta/plan-card";
import { SecurityCard } from "@/components/tenant/conta/security-card";

export default async function ContaPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await getTenantProfile(session.userId);
  if (!profile) redirect("/login");

  return (
    <div>
      <PageHeader title="Minha conta" description="Perfil e configuracoes" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <ProfileCard data={profile} />
          <SecurityCard />
        </div>
        <div>
          <PlanCard />
        </div>
      </div>
    </div>
  );
}
