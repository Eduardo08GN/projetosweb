import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTenantCarousels } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { CarouselList } from "@/components/tenant/carrossel/carousel-list";

export default async function CarrosselPage() {
  const session = await getSession();
  if (!session?.tenantId) redirect("/login");

  const carousels = await getTenantCarousels(session.tenantId);

  return (
    <div>
      <PageHeader
        title="Carrosseis"
        description="Acompanhe, aprove ou peca ajustes"
      />
      <CarouselList items={carousels} />
    </div>
  );
}
