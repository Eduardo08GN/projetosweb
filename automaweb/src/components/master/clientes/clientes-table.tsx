"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { variants, transitions } from "@/lib/animations";
import { TenantStatusTag } from "@/components/shared/tenant-status-tag";
import { updateClientField } from "@/app/actions/client-actions";
import {
  cancelarAssinatura,
  criarAssinatura,
  linkFaturaAssinatura,
} from "@/app/actions/assinatura-actions";
import { Check, Copy, Link2, Loader2, Pencil, Repeat, X } from "lucide-react";

type ClienteRow = {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  documento: string;
  status: string;
  plano: string;
  planoValidoAte: string; // yyyy-mm-dd ou ""
  planoMensalidade: number | null;
  assinaturaAtiva: boolean;
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

/* ── Celula de recorrencia ──
   Sem assinatura: botao gera no Asaas e copia o link da fatura.
   Com assinatura: tag Ativa + copiar link + cancelar com confirmacao. */
/* Chip com a URL de pagamento da assinatura: aparece na celula depois
   de gerar (ou ao buscar a fatura), pronto pra copiar e mandar. */
function LinkFaturaChip({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      onClick={copiar}
      title={url}
      className="group/chip flex max-w-[210px] items-center gap-1.5 rounded-md bg-[#F4F4F5] px-2 py-1 text-[11px] text-[#52525B] transition-colors duration-150 hover:bg-[#E4E4E7]"
    >
      {copiado ? (
        <Check size={11} strokeWidth={2} className="shrink-0 text-[#166534]" />
      ) : (
        <Copy size={11} strokeWidth={1.5} className="shrink-0 text-[#A1A1AA] group-hover/chip:text-[#09090B]" />
      )}
      <span className="truncate">
        {copiado ? "Link copiado" : url.replace(/^https?:\/\//, "")}
      </span>
    </button>
  );
}

function RecorrenciaCell({ cliente }: { cliente: ClienteRow }) {
  const [pending, startTransition] = useTransition();
  const [confirmando, setConfirmando] = useState(false);
  const [linkFatura, setLinkFatura] = useState<string | null>(null);

  if (!cliente.assinaturaAtiva) {
    return (
      <div className="flex flex-col items-start gap-1.5">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await criarAssinatura(cliente.id);
              if (result.error) {
                toast(result.error);
              } else {
                setLinkFatura(result.linkFatura ?? null);
                toast(
                  result.linkFatura
                    ? "Assinatura criada. Link de pagamento pronto"
                    : "Assinatura criada"
                );
              }
            })
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs font-medium text-[#09090B] transition-colors duration-150 hover:bg-[#F4F4F5] disabled:opacity-50"
        >
          {pending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Repeat size={12} strokeWidth={1.5} />
          )}
          {pending ? "Gerando..." : "Gerar assinatura"}
        </button>
        {linkFatura && <LinkFaturaChip url={linkFatura} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="inline-flex items-center gap-1.5">
      <span className="rounded-md bg-[#DCFCE7] px-2 py-1 text-xs font-semibold text-[#166534]">
        Ativa
      </span>
      <button
        disabled={pending}
        title="Buscar link da fatura em aberto"
        onClick={() =>
          startTransition(async () => {
            const result = await linkFaturaAssinatura(cliente.id);
            if (result.error) toast(result.error);
            else if (result.linkFatura) setLinkFatura(result.linkFatura);
            else toast("Nenhuma fatura em aberto");
          })
        }
        className="rounded-md p-1 text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B] disabled:opacity-50"
      >
        {pending ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Link2 size={13} strokeWidth={1.5} />
        )}
      </button>
      {confirmando ? (
        <span className="inline-flex items-center gap-1">
          <button
            disabled={pending}
            title="Confirmar cancelamento"
            onClick={() =>
              startTransition(async () => {
                const result = await cancelarAssinatura(cliente.id);
                setConfirmando(false);
                if (result.error) toast(result.error);
                else toast("Assinatura cancelada");
              })
            }
            className="rounded-md p-1 text-[#DC2626] transition-colors duration-150 hover:bg-[#FEF2F2]"
          >
            <Check size={13} strokeWidth={2} />
          </button>
          <button
            onClick={() => setConfirmando(false)}
            className="rounded-md p-1 text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5]"
          >
            <X size={13} strokeWidth={2} />
          </button>
        </span>
      ) : (
        <button
          title="Cancelar assinatura"
          onClick={() => setConfirmando(true)}
          className="rounded-md p-1 text-[#A1A1AA] transition-colors duration-150 hover:bg-[#FEF2F2] hover:text-[#DC2626]"
        >
          <X size={13} strokeWidth={1.5} />
        </button>
      )}
      </div>
      {linkFatura && <LinkFaturaChip url={linkFatura} />}
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
              {["Cliente", "Contato", "Situacao", "Plano", "Mensalidade", "Valido ate", "Recorrencia"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A] ${
                      i >= 4 && h !== "Recorrencia" ? "text-right" : "text-left"
                    }`}
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
                  <InlineEdit
                    value={c.documento}
                    display={
                      <span
                        className={`text-xs ${c.documento ? "text-[#A1A1AA]" : "text-[#D4D4D8]"}`}
                      >
                        {c.documento || "CPF ou CNPJ"}
                      </span>
                    }
                    onSave={(v) => save(c.id, "documento", v)}
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
                <td className="px-5 py-3.5">
                  <RecorrenciaCell cliente={c} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
