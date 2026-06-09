import { cn } from "@/lib/utils";

const styles: Record<string, { bg: string; text: string }> = {
  PROSPECT: { bg: "bg-[#F4F4F5]", text: "text-[#52525B]" },
  ATIVO: { bg: "bg-[#DCFCE7]", text: "text-[#166534]" },
  PAUSADO: { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]" },
  CANCELADO: { bg: "bg-[#FEF2F2]", text: "text-[#991B1B]" },
};

const labels: Record<string, string> = {
  PROSPECT: "Prospect",
  ATIVO: "Ativo",
  PAUSADO: "Pausado",
  CANCELADO: "Cancelado",
};

export function TenantStatusTag({ status }: { status: string }) {
  const style = styles[status] ?? styles.PROSPECT;
  const label = labels[status] ?? status;

  return (
    <span
      className={cn(
        "inline-block rounded-md px-2.5 py-1 text-xs font-medium",
        style.bg,
        style.text
      )}
    >
      {label}
    </span>
  );
}
