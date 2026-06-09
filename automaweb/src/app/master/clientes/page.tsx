import { getClientes } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { ClientesTable } from "@/components/master/clientes/clientes-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ClientesPage() {
  const clientes = await getClientes();

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestao de contas"
        actions={
          <Button className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]">
            <Plus size={16} strokeWidth={2} />
            Novo cliente
          </Button>
        }
      />
      <ClientesTable items={clientes} />
    </div>
  );
}
