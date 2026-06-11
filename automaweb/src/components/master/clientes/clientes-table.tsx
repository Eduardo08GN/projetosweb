"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { variants, transitions } from "@/lib/animations";
import { TenantStatusTag } from "@/components/shared/tenant-status-tag";
import { updateClientField } from "@/app/actions/client-actions";
import { Pencil } from "lucide-react";

type ClienteRow = {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  status: string;
  plano: string;
  planoValidoAte: string; // yyyy-mm-dd ou ""
  planoMensalidade: number | null;
  carrosseis: number;
};

const STATUS_OPTIONS = ["PROSPECT", "ATIVO", "PAUSADO", "CANCELADO"];
const PLANO_OPTIONS = ["Completo", "Basico"];

/* ── Celula editavel ──
   Lapis no hover, clique abre input, Enter/blur salva, Esc cancela.
   Mesmo padrao da guia Sites. */
function InlineEdit({
  value,
  display,
  type = "text",
  align = "left",
  onSave,
}: {
  value: string;
  display?: React.ReactNode;
  type?: "text" | "date" | "number";
  align?: "left" | "right";
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft !== value) onSave(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={`w-full max-w-[150px] rounded-md border border-[#18181B] bg-white px-2 py-1 text-sm text-[#09090B] outline-none ${
          align === "right" ? "text-right" : ""
        }`}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={`group/edit flex w-full items-center gap-1.5 rounded-md px-1 py-0.5 text-sm transition-colors duration-150 hover:bg-[#F4F4F5] ${
        align === "right" ? "justify-end" : ""
      }`}
    >
      {display ?? (
        <span className={value ? "text-[#09090B]" : "text-[#D4D4D8]"}>
          {value || "Definir"}
        </span>
      )}
      <Pencil
        size={11}
        strokeWidth={1.5}
        className="shrink-0 text-[#A1A1AA] opacity-0 transition-opacity duration-150 group-hover/edit:opacity-100"
      />
    </button>
  );
}

/* Dropdown leve pra valores fechados (situacao, plano) */
function SelectCell({
  current,
  options,
  render,
  onSelect,
}: {
  current: string;
  options: string[];
  render: (value: string) => React.ReactNode;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md transition-opacity duration-150 hover:opacity-75"
      >
        {render(current)}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 min-w-[150px] rounded-lg border border-[#E4E4E7] bg-white p-1 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setOpen(false);
                if (opt !== current) onSelect(opt);
              }}
              className={`flex w-full items-center rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-[#F4F4F5] ${
                opt === current ? "bg-[#FAFAFA]" : ""
              }`}
            >
              {render(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ClientesTable({ items }: { items: ClienteRow[] }) {
  const [rows, setRows] = useState(items);

  useEffect(() => setRows(items), [items]);

  async function save(tenantId: string, field: string, value: string) {
    const anterior = rows;
    setRows((prev) =>
      prev.map((r) =>
        r.id === tenantId
          ? {
              ...r,
              [field === "planoValidoAte"
                ? "planoValidoAte"
                : field === "planoMensalidade"
                  ? "planoMensalidade"
                  : field]:
                field === "planoMensalidade"
                  ? value
                    ? parseInt(value, 10)
                    : null
                  : value,
            }
          : r
      )
    );
    const result = await updateClientField(tenantId, field, value);
    if (result.error) {
      setRows(anterior);
      toast(result.error);
    }
  }

  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E4E4E7] bg-[#F4F4F5]">
              {["Cliente", "Contato", "Situacao", "Plano", "Mensalidade", "Valido ate", "Carrosseis"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A] ${
                      i >= 4 ? "text-right" : "text-left"
                    } ${h === "Carrosseis" ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {rows.map((c) => (
              <tr
                key={c.id}
                className="transition-colors duration-150 hover:bg-[#FAFAFA]"
              >
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-[#09090B]">{c.name}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-[#09090B]">{c.email}</p>
                  <InlineEdit
                    value={c.phone}
                    display={
                      <span
                        className={`text-xs ${c.phone ? "text-[#A1A1AA]" : "text-[#D4D4D8]"}`}
                      >
                        {c.phone || "Telefone"}
                      </span>
                    }
                    onSave={(v) => save(c.id, "phone", v)}
                  />
                </td>
                <td className="px-5 py-3.5">
                  <SelectCell
                    current={c.status}
                    options={STATUS_OPTIONS}
                    render={(s) => <TenantStatusTag status={s} />}
                    onSelect={(v) => save(c.id, "status", v)}
                  />
                </td>
                <td className="px-5 py-3.5">
                  <SelectCell
                    current={c.plano}
                    options={PLANO_OPTIONS}
                    render={(p) =>
                      p ? (
                        <span className="inline-block rounded-md bg-[#F4F4F5] px-2.5 py-1 text-xs font-semibold text-[#09090B]">
                          {p}
                        </span>
                      ) : (
                        <span className="text-xs text-[#D4D4D8]">Definir</span>
                      )
                    }
                    onSelect={(v) => save(c.id, "plano", v)}
                  />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <InlineEdit
                    value={c.planoMensalidade !== null ? String(c.planoMensalidade) : ""}
                    type="number"
                    align="right"
                    display={
                      <span
                        className={`text-sm ${
                          c.planoMensalidade !== null
                            ? "text-[#09090B]"
                            : "text-[#D4D4D8]"
                        }`}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {c.planoMensalidade !== null
                          ? `R$ ${c.planoMensalidade}/mes`
                          : "Definir"}
                      </span>
                    }
                    onSave={(v) => save(c.id, "planoMensalidade", v)}
                  />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <InlineEdit
                    value={c.planoValidoAte}
                    type="date"
                    align="right"
                    display={
                      <span
                        className={`text-sm ${
                          c.planoValidoAte ? "text-[#09090B]" : "text-[#D4D4D8]"
                        }`}
                      >
                        {c.planoValidoAte
                          ? new Date(c.planoValidoAte + "T12:00:00").toLocaleDateString(
                              "pt-BR",
                              { day: "2-digit", month: "short", year: "numeric" }
                            )
                          : "Definir"}
                      </span>
                    }
                    onSave={(v) => save(c.id, "planoValidoAte", v)}
                  />
                </td>
                <td
                  className="px-5 py-3.5 text-right text-sm font-medium text-[#09090B]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {c.carrosseis}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
