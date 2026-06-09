import { getClientes } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { ClientesTable } from "@/components/master/clientes/clientes-table";
import { NewClientModal } from "@/components/master/clientes/new-client-modal";

export default async function ClientesPage() {
  const clientes = await getClientes();

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestao de contas"
        actions={<NewClientModal />}
      />
      <ClientesTable items={clientes} />
    </div>
  );
}
