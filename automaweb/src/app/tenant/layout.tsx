import { TenantSidebar } from "@/components/tenant/tenant-sidebar";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <TenantSidebar />
      <main className="flex-1 overflow-y-auto bg-[#FAFAFA] px-10 py-8">
        {children}
      </main>
    </div>
  );
}
