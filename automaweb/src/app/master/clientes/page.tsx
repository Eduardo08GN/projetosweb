import { getClientes, getPlanosCatalogo } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { ClientesTable } from "@/components/master/clientes/clientes-table";
import { NewClientModal } from "@/components/master/clientes/new-client-modal";
import { PlanosSheet } from "@/components/master/clientes/planos-sheet";

export default async function ClientesPage() {
  const [clientes, planos] = await Promise.all([
    getClientes(),
    getPlanosCatalogo(),
  ]);

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestao de contas"
        actions={
          <div className="flex items-center gap-2">
            <PlanosSheet planos={planos} />
            <NewClientModal />
          </div>
        }
      />
      <ClientesTable items={clientes} />
    </div>
  );
}
