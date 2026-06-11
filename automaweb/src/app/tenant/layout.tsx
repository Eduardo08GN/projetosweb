import { Toaster } from "sonner";
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
