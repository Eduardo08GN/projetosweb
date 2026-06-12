import { getSites, getActiveTenants } from "@/lib/queries";
import { SitesClient } from "@/components/master/sites/sites-client";

// consistencia com as demais paginas do master: sempre fresco do banco
export const dynamic = "force-dynamic";

export default async function SitesPage() {
  const [sites, tenants] = await Promise.all([getSites(), getActiveTenants()]);

  return <SitesClient sites={sites} tenants={tenants} />;
}
