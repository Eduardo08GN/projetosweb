import { MasterSidebar, MasterMobileNav } from "@/components/master/master-sidebar";
import { MobileHeader } from "@/components/shared/mobile-nav";

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <MasterSidebar />
      <MobileHeader />
      <main className="flex-1 overflow-y-auto bg-[#FAFAFA] px-4 pb-28 pt-6 lg:px-10 lg:py-8">
        {children}
      </main>
      <MasterMobileNav />
    </div>
  );
}
