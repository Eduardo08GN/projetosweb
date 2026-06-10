import { cn } from "@/lib/utils";

const statusStyles: Record<string, { bg: string; text: string }> = {
  PRODUZIR: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
  APROVACAO: { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]" },
  APROVADO: { bg: "bg-[#DCFCE7]", text: "text-[#166534]" },
  AGENDADO: { bg: "bg-[#F0F9FF]", text: "text-[#075985]" },
  PUBLICADO: { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]" },
};

const statusLabels: Record<string, string> = {
  PRODUZIR: "Em producao",
  APROVACAO: "Aguardando aprovacao",
  APROVADO: "Aprovado",
  AGENDADO: "Agendado",
  PUBLICADO: "Publicado",
};

export function StatusTag({ status }: { status: string }) {
  const style = statusStyles[status] ?? statusStyles.PRODUZIR;
  const label = statusLabels[status] ?? status;

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
