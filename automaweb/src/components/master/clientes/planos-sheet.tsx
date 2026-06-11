"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Pencil, Star, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { updatePlanoCatalogo } from "@/app/actions/plano-actions";

type Plano = {
  id: string;
  nome: string;
  valor: number;
  descricao: string;
  destaque: boolean;
};

/* Campo editavel: clique abre input, Enter/blur salva, Esc cancela */
function CampoEditavel({
  value,
  type = "text",
  multiline = false,
  className = "",
  inputClassName = "",
  onSave,
}: {
  value: string;
  type?: "text" | "number";
  multiline?: boolean;
  className?: string;
  inputClassName?: string;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  function commit() {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft.trim());
  }

  if (editing) {
    const shared = `w-full rounded-md border border-[#18181B] bg-white px-2 py-1 text-[#09090B] outline-none ${inputClassName}`;
    return multiline ? (
      <textarea
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        rows={2}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={`resize-none text-xs leading-relaxed ${shared}`}
      />
    ) : (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={shared}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={`group/campo flex items-center gap-1.5 rounded-md text-left transition-colors duration-150 hover:bg-[#F4F4F5] ${className}`}
    >
      <span>{value}</span>
      <Pencil
        size={11}
        strokeWidth={1.5}
        className="shrink-0 text-[#A1A1AA] opacity-0 transition-opacity duration-150 group-hover/campo:opacity-100"
      />
    </button>
  );
}

export function PlanosSheet({ planos }: { planos: Plano[] }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(planos);

  useEffect(() => setRows(planos), [planos]);

  async function save(id: string, field: string, value: string) {
    const anterior = rows;
    setRows((prev) =>
      prev.map((p) => {
        if (field === "destaque" && value === "true") {
          return { ...p, destaque: p.id === id };
        }
        if (p.id !== id) return p;
        if (field === "valor") return { ...p, valor: parseInt(value, 10) || p.valor };
        if (field === "destaque") return { ...p, destaque: value === "true" };
        return { ...p, [field]: value };
      })
    );
    const result = await updatePlanoCatalogo(id, field, value);
    if (result.error) {
      setRows(anterior);
      toast(result.error);
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 rounded-lg border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-medium text-[#09090B] shadow-none hover:bg-[#F4F4F5]"
      >
        <Tags size={16} strokeWidth={1.5} />
        Planos
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="overflow-y-auto bg-white sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-sm font-semibold text-[#09090B]">
              Planos de continuidade
            </SheetTitle>
            <SheetDescription className="text-xs leading-relaxed text-[#71717A]">
              O que voce editar aqui muda na hora o que os clientes veem no
              painel deles. Clique em qualquer campo pra editar.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 pb-6">
            {rows.map((plano) => (
              <div
                key={plano.id}
                className={`rounded-xl border p-5 ${
                  plano.destaque
                    ? "border-[#18181B] bg-[#FAFAFA]"
                    : "border-[#E4E4E7] bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <CampoEditavel
                    value={plano.nome}
                    className="px-1 py-0.5 text-sm font-semibold text-[#09090B]"
                    inputClassName="text-sm font-semibold"
                    onSave={(v) => save(plano.id, "nome", v)}
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#A1A1AA]">R$</span>
                    <CampoEditavel
                      value={String(plano.valor)}
                      type="number"
                      className="px-1 py-0.5 text-xl font-bold tracking-tight text-[#09090B]"
                      inputClassName="max-w-[90px] text-right text-xl font-bold"
                      onSave={(v) => save(plano.id, "valor", v)}
                    />
                    <span className="text-[11px] text-[#71717A]">/mes</span>
                  </div>
                </div>

                <CampoEditavel
                  value={plano.descricao}
                  multiline
                  className="mt-3 w-full px-1 py-0.5 text-xs leading-relaxed text-[#71717A]"
                  onSave={(v) => save(plano.id, "descricao", v)}
                />

                <button
                  onClick={() =>
                    save(plano.id, "destaque", plano.destaque ? "false" : "true")
                  }
                  className={`mt-4 flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors duration-150 ${
                    plano.destaque
                      ? "bg-[#18181B] text-[#FAFAFA]"
                      : "bg-[#F4F4F5] text-[#71717A] hover:text-[#09090B]"
                  }`}
                >
                  <Star
                    size={11}
                    strokeWidth={2}
                    fill={plano.destaque ? "currentColor" : "none"}
                  />
                  {plano.destaque ? "Plano em destaque" : "Marcar como destaque"}
                </button>
              </div>
            ))}

            <p className="text-center text-[11px] text-[#A1A1AA]">
              O plano em destaque define a mensalidade sugerida de clientes novos.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
