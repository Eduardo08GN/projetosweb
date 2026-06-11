import Image from "next/image";
import { Toaster } from "sonner";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logout } from "@/app/actions/auth-actions";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";

/* Conta fora do estado ATIVO nao navega: cai na tela de regularizacao.
   Nada e apagado; o acesso volta sozinho quando o estado virar ATIVO. */
async function ContaEmEspera({ cancelada }: { cancelada: boolean }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#FAFAFA] px-6">
      <Image
        src="/automaweb_logo_preta_horizontal.png"
        alt="AutomaWeb"
        width={160}
        height={32}
        priority
      />
      <div className="mt-10 w-full max-w-md rounded-xl border border-[#E4E4E7] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h1 className="text-lg font-semibold text-[#09090B]">
          {cancelada ? "Sua conta foi encerrada" : "Sua conta esta em espera"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#71717A]">
          {cancelada
            ? "O acesso ao painel foi encerrado. Se quiser voltar, e so falar com a gente."
            : "Suas publicacoes estao pausadas e o acesso ao painel ficou limitado. Nada foi apagado: assim que voce regularizar, tudo volta de onde parou."}
        </p>
        <a
          href="mailto:contato@automaweb.pro?subject=Quero regularizar minha conta"
          className="mt-6 inline-block w-full rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] transition-colors duration-150 hover:bg-[#27272A]"
        >
          Falar com a gente
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="mt-3 w-full rounded-lg px-5 py-2.5 text-sm font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
          >
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.tenantId) {
    const tenant = await db.tenant.findUnique({
      where: { id: session.tenantId },
      select: { status: true },
    });
    if (tenant && tenant.status !== "ATIVO" && tenant.status !== "PROSPECT") {
      return <ContaEmEspera cancelada={tenant.status === "CANCELADO"} />;
    }
  }

  return (
    <div className="flex h-screen">
      <TenantSidebar />
      <main className="flex-1 overflow-y-auto bg-[#FAFAFA] px-10 py-8">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#18181B",
            color: "#FAFAFA",
            border: "none",
            borderRadius: "10px",
          },
        }}
      />
    </div>
  );
}
