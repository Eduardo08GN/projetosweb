"use client";

import { useState, useTransition, useRef, useEffect, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { SiteStatusTag } from "@/components/shared/site-status-tag";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Plus,
  ExternalLink,
  Pencil,
  Check,
  X,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  createSite,
  updateSiteField,
  deleteSite,
  type SiteActionState,
} from "@/app/actions/site-actions";

type SiteRow = {
  id: string;
  tenant: string;
  tenantId: string;
  dominio: string | null;
  urlPreview: string | null;
  status: string;
  stack: string;
  notas: string;
};

type SitesData = { pre: SiteRow[]; pos: SiteRow[] };

const tabs = [
  { key: "pre" as const, label: "Pré-fechamento" },
  { key: "pos" as const, label: "Pós-fechamento" },
];

const STATUS_OPTIONS = [
  { value: "RASCUNHO", label: "Rascunho" },
  { value: "EM_DESENVOLVIMENTO", label: "Em desenvolvimento" },
  { value: "REVISAO", label: "Revisão" },
  { value: "PUBLICADO", label: "Publicado" },
  { value: "ARQUIVADO", label: "Arquivado" },
];

const STACK_OPTIONS = ["Next.js", "HTML + CSS + JS", "WordPress", "Outro"];

function InlineEdit({
  value,
  siteId,
  field,
  placeholder,
}: {
  value: string;
  siteId: string;
  field: string;
  placeholder: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function save() {
    if (draft === value) {
      setEditing(false);
      return;
    }
    startTransition(async () => {
      await updateSiteField(siteId, field, draft);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          onBlur={save}
          disabled={saving}
          className="w-full min-w-0 rounded border border-[#E4E4E7] bg-white px-2 py-1 text-sm text-[#09090B] outline-none focus:border-[#18181B]"
        />
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-1.5">
      <span className={value ? "text-sm text-[#09090B]" : "text-sm text-[#A1A1AA]"}>
        {value || placeholder}
      </span>
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className="shrink-0 rounded p-0.5 text-[#A1A1AA] opacity-0 transition-opacity duration-150 hover:text-[#09090B] group-hover:opacity-100"
      >
        <Pencil size={12} strokeWidth={2} />
      </button>
    </div>
  );
}

function StatusDropdown({
  value,
  siteId,
}: {
  value: string;
  siteId: string;
}) {
  const [open, setOpen] = useState(false);
  const [saving, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function select(newStatus: string) {
    if (newStatus === value) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      await updateSiteField(siteId, "status", newStatus);
      setOpen(false);
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={saving}
        className="group flex items-center gap-1"
      >
        <SiteStatusTag status={value} />
        <ChevronDown
          size={12}
          className="text-[#A1A1AA] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-lg border border-[#E4E4E7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-100 hover:bg-[#F4F4F5] ${
                opt.value === value ? "font-medium text-[#09090B]" : "text-[#52525B]"
              }`}
            >
              {opt.value === value && <Check size={12} strokeWidth={2} />}
              <span className={opt.value === value ? "" : "pl-5"}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SiteTable({
  data,
  showDominio,
}: {
  data: SiteRow[];
  showDominio: boolean;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete(siteId: string) {
    startTransition(async () => {
      await deleteSite(siteId);
      setDeleting(null);
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E4E4E7] bg-[#F4F4F5]">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Cliente
            </th>
            {showDominio && (
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Dominio
              </th>
            )}
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Previa
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Situacao
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Stack
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Notas
            </th>
            <th className="w-10 px-3 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E4E4E7]">
          {data.map((s) => (
            <tr
              key={s.id}
              className="group/row transition-colors duration-150 hover:bg-[#FAFAFA]"
            >
              <td className="px-5 py-3.5 text-sm font-medium text-[#09090B]">
                {s.tenant}
              </td>
              {showDominio && (
                <td className="px-5 py-3.5">
                  <InlineEdit
                    value={s.dominio ?? ""}
                    siteId={s.id}
                    field="dominio"
                    placeholder="Sem dominio"
                  />
                </td>
              )}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <InlineEdit
                    value={s.urlPreview ?? ""}
                    siteId={s.id}
                    field="urlPreview"
                    placeholder="Sem URL"
                  />
                  {s.urlPreview && (
                    <a
                      href={
                        s.urlPreview.startsWith("http")
                          ? s.urlPreview
                          : `https://${s.urlPreview}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[#A1A1AA] transition-colors hover:text-[#09090B]"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </td>
              <td className="px-5 py-3.5">
                <StatusDropdown value={s.status} siteId={s.id} />
              </td>
              <td className="px-5 py-3.5">
                <InlineEdit
                  value={s.stack}
                  siteId={s.id}
                  field="stack"
                  placeholder="—"
                />
              </td>
              <td className="max-w-[220px] px-5 py-3.5">
                <InlineEdit
                  value={s.notas}
                  siteId={s.id}
                  field="notas"
                  placeholder="Sem notas"
                />
              </td>
              <td className="px-3 py-3.5">
                {deleting === s.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      disabled={pending}
                      className="rounded p-1 text-[#991B1B] transition-colors hover:bg-[#FEE2E2]"
                    >
                      <Check size={12} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(null)}
                      className="rounded p-1 text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
                    >
                      <X size={12} strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleting(s.id)}
                    className="rounded p-1 text-[#A1A1AA] opacity-0 transition-all duration-150 hover:bg-[#FEE2E2] hover:text-[#991B1B] group-hover/row:opacity-100"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="flex h-32 items-center justify-center">
          <span className="text-sm text-[#A1A1AA]">Nenhum site nesta fase</span>
        </div>
      )}
    </div>
  );
}

function NewSiteSheet({
  open,
  onOpenChange,
  tenants,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tenants: { id: string; name: string }[];
}) {
  const [state, formAction, formPending] = useActionState(createSite, undefined);

  useEffect(() => {
    if (state?.success) onOpenChange(false);
  }, [state?.success, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold text-[#09090B]">
            Novo site
          </SheetTitle>
          <SheetDescription className="text-xs text-[#71717A]">
            Vincule um site a um cliente
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className="flex flex-col gap-5 px-4 pb-6">
          <div>
            <label className="text-xs font-medium text-[#A1A1AA]">
              Cliente
            </label>
            <select
              name="tenantId"
              required
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none focus:border-[#18181B]"
            >
              <option value="">Selecione...</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A1A1AA]">Fase</label>
            <select
              name="fase"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none focus:border-[#18181B]"
            >
              <option value="PRE_FECHAMENTO">Pré-fechamento</option>
              <option value="POS_FECHAMENTO">Pós-fechamento</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A1A1AA]">
              URL de previa
            </label>
            <input
              name="urlPreview"
              placeholder="cliente.automaweb.com.br"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#A1A1AA]">Stack</label>
            <select
              name="stack"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none focus:border-[#18181B]"
            >
              <option value="">Selecione...</option>
              {STACK_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A1A1AA]">Notas</label>
            <textarea
              name="notas"
              rows={3}
              placeholder="Observacoes sobre o projeto"
              className="mt-1.5 w-full resize-none rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-3 text-sm text-[#09090B] outline-none placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-[#FEE2E2] px-3.5 py-2.5 text-sm text-[#991B1B]">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            disabled={formPending}
            className="gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
          >
            <Plus size={14} strokeWidth={2} />
            {formPending ? "Criando..." : "Criar site"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function SitesClient({
  sites,
  tenants,
}: {
  sites: SitesData;
  tenants: { id: string; name: string }[];
}) {
  const [active, setActive] = useState<"pre" | "pos">("pre");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Sites"
        description="Dominios e entregas"
        actions={
          <Button
            onClick={() => setSheetOpen(true)}
            className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]"
          >
            <Plus size={16} strokeWidth={2} />
            Novo site
          </Button>
        }
      />

      <motion.div
        className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        variants={variants.fadeUpSmall}
        initial="hidden"
        animate="visible"
        transition={transitions.smooth}
      >
        <div className="flex border-b border-[#E4E4E7]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className="relative px-5 py-3.5 text-sm font-medium transition-colors duration-150"
            >
              <span
                className={
                  active === tab.key ? "text-[#09090B]" : "text-[#71717A]"
                }
              >
                {tab.label}
              </span>
              {active === tab.key && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#18181B]"
                  layoutId="sites-tab-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <SiteTable
              data={active === "pre" ? sites.pre : sites.pos}
              showDominio={active === "pos"}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <NewSiteSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        tenants={tenants}
      />
    </div>
  );
}
