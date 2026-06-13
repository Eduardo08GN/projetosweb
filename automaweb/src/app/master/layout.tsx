import { Toaster } from "sonner";
import { MasterSidebar, MasterMobileNav } from "@/components/master/master-sidebar";
import { MobileHeader } from "@/components/shared/mobile-nav";

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] flex-col lg:flex-row">
      <MasterSidebar />
      <MobileHeader />
      {/* pb-24 no mobile: folga pra barra de abas fixa nao cobrir o fim do conteudo */}
      <main className="flex-1 overflow-y-auto bg-[#FAFAFA] px-4 pb-24 pt-6 lg:px-10 lg:py-8">
        {children}
      </main>
      <MasterMobileNav />
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
