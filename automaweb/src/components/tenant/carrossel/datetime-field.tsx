"use client";

import { Calendar } from "lucide-react";

/* Campo de data e hora da publicacao. O valor e a hora-relogio de
   Brasilia ("YYYY-MM-DDTHH:mm"); o servidor valida o minimo de 5h de
   antecedencia. O min aqui e so a dica visual. */

function minAgora() {
  const d = new Date(Date.now() + 5 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function DateTimeField({
  value,
  onChange,
  label = "Quando publicar",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-[#71717A]">
        <Calendar size={13} strokeWidth={1.5} />
        {label}
      </label>
      <input
        type="datetime-local"
        value={value}
        min={minAgora()}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-base text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B] sm:text-sm"
      />
    </div>
  );
}
