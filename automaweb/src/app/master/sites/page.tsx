"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SitesTabs } from "@/components/master/sites/sites-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SitesPage() {
  return (
    <div>
      <PageHeader
        title="Sites"
        description="Domínios e entregas"
        actions={
          <Button className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]">
            <Plus size={16} strokeWidth={2} />
            Novo site
          </Button>
        }
      />
      <SitesTabs />
    </div>
  );
}
