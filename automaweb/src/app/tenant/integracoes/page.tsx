import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTenantConnection } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { MetaConnectionCard } from "@/components/tenant/integracoes/meta-connection-card";
import { OAuthFlowCard } from "@/components/tenant/integracoes/oauth-flow-card";

export default async function IntegracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session?.tenantId) redirect("/login");

  const [connection, { error }] = await Promise.all([
    getTenantConnection(session.tenantId),
    searchParams,
  ]);

  return (
    <div>
      <PageHeader
        title="Integracoes"
        description="Conecte suas contas para publicacao automatica"
      />
      <div className="space-y-6">
        <MetaConnectionCard initialData={connection} erroConexao={error} />
        <OAuthFlowCard />
      </div>
    </div>
  );
}
