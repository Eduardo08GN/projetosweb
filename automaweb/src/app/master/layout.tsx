import { MasterSidebar } from "@/components/master/master-sidebar";

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <MasterSidebar />
      <main className="flex-1 overflow-y-auto bg-[#FAFAFA] px-10 py-8">
        {children}
      </main>
    </div>
  );
}
