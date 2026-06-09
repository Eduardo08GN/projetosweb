import { cn } from "@/lib/utils";

const statusStyles: Record<string, { bg: string; text: string }> = {
  BACKLOG: { bg: "bg-[#F4F4F5]", text: "text-[#52525B]" },
  EM_PRODUCAO: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
  REVISAO_INTERNA: { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]" },
  AGUARDANDO_CLIENTE: { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]" },
  APROVADO: { bg: "bg-[#DCFCE7]", text: "text-[#166534]" },
  AGENDADO: { bg: "bg-[#F0F9FF]", text: "text-[#075985]" },
  PUBLICADO: { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]" },
  AJUSTE_PEDIDO: { bg: "bg-[#FEF2F2]", text: "text-[#991B1B]" },
};

const statusLabels: Record<string, string> = {
  BACKLOG: "A fazer",
  EM_PRODUCAO: "Em producao",
  REVISAO_INTERNA: "Revisao interna",
  AGUARDANDO_CLIENTE: "Aguardando cliente",
  APROVADO: "Aprovado",
  AGENDADO: "Agendado",
  PUBLICADO: "Publicado",
  AJUSTE_PEDIDO: "Ajuste pedido",
};

export function StatusTag({ status }: { status: string }) {
  const style = statusStyles[status] ?? statusStyles.BACKLOG;
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
