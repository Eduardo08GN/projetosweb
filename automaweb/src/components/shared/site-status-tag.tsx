import { cn } from "@/lib/utils";

const styles: Record<string, { bg: string; text: string }> = {
  RASCUNHO: { bg: "bg-[#F4F4F5]", text: "text-[#52525B]" },
  EM_DESENVOLVIMENTO: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
  REVISAO: { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]" },
  PUBLICADO: { bg: "bg-[#DCFCE7]", text: "text-[#166534]" },
  ARQUIVADO: { bg: "bg-[#F4F4F5]", text: "text-[#A1A1AA]" },
};

const labels: Record<string, string> = {
  RASCUNHO: "Rascunho",
  EM_DESENVOLVIMENTO: "Em desenvolvimento",
  REVISAO: "Revisão",
  PUBLICADO: "Publicado",
  ARQUIVADO: "Arquivado",
};

export function SiteStatusTag({ status }: { status: string }) {
  const style = styles[status] ?? styles.RASCUNHO;
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
