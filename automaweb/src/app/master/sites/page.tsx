import { getSites, getActiveTenants } from "@/lib/queries";
import { SitesClient } from "@/components/master/sites/sites-client";

export default async function SitesPage() {
  const [sites, tenants] = await Promise.all([getSites(), getActiveTenants()]);

  return <SitesClient sites={sites} tenants={tenants} />;
}
