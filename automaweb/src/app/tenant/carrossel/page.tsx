"use client";

import { PageHeader } from "@/components/shared/page-header";
import { CarouselList } from "@/components/tenant/carrossel/carousel-list";

export default function CarrosselPage() {
  return (
    <div>
      <PageHeader
        title="Carrosséis"
        description="Acompanhe, aprove ou peça ajustes"
      />
      <CarouselList />
    </div>
  );
}
