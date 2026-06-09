"use client";

import { PageHeader } from "@/components/shared/page-header";
import { MetaConnectionCard } from "@/components/tenant/integracoes/meta-connection-card";
import { OAuthFlowCard } from "@/components/tenant/integracoes/oauth-flow-card";

export default function IntegracoesPage() {
  return (
    <div>
      <PageHeader
        title="Integrações"
        description="Conecte suas contas para publicação automática"
      />
      <div className="space-y-6">
        <MetaConnectionCard />
        <OAuthFlowCard />
      </div>
    </div>
  );
}
