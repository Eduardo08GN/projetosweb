"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { SiteStatusTag } from "@/components/shared/site-status-tag";
import { ExternalLink } from "lucide-react";

type SiteRow = {
  id: string;
  tenant: string;
  dominio: string | null;
  urlPreview: string | null;
  status: string;
  stack: string;
  notas: string;
};

const preFechamento: SiteRow[] = [
  {
    id: "1",
    tenant: "Chef Paulo",
    dominio: null,
    urlPreview: "chef-paulo.automaweb.com.br",
    status: "RASCUNHO",
    stack: "HTML + CSS + JS",
    notas: "Aguardando briefing do cliente",
  },
  {
    id: "2",
    tenant: "Fit Academy",
    dominio: null,
    urlPreview: "fit-academy.automaweb.com.br",
    status: "EM_DESENVOLVIMENTO",
    stack: "HTML + CSS + JS",
    notas: "Landing page com formulário",
  },
];

const posFechamento: SiteRow[] = [
  {
    id: "3",
    tenant: "Prof. Rodger",
    dominio: "profrodger.com.br",
    urlPreview: "prof-rodger.automaweb.com.br",
    status: "PUBLICADO",
    stack: "Next.js",
    notas: "Blog + landing page",
  },
  {
    id: "4",
    tenant: "Dra. Camila",
    dominio: "dracamilaodonto.com.br",
    urlPreview: "dra-camila.automaweb.com.br",
    status: "REVISAO",
    stack: "HTML + CSS + JS",
    notas: "Ajustando seção de depoimentos",
  },
  {
    id: "5",
    tenant: "Studio Bella",
    dominio: "studiobella.com.br",
    urlPreview: "studio-bella.automaweb.com.br",
    status: "PUBLICADO",
    stack: "HTML + CSS + JS",
    notas: "Catálogo de serviços + agendamento",
  },
];

const tabs = [
  { key: "pre", label: "Pré-fechamento" },
  { key: "pos", label: "Pós-fechamento" },
] as const;

function SiteTable({ data }: { data: SiteRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E4E4E7] bg-[#F4F4F5]">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Cliente
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Domínio
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Previa
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Situacao
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Tecnologia
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
              Notas
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E4E4E7]">
          {data.map((s) => (
            <tr
              key={s.id}
              className="transition-colors duration-150 hover:bg-[#FAFAFA]"
            >
              <td className="px-5 py-3.5 text-sm font-medium text-[#09090B]">
                {s.tenant}
              </td>
              <td className="px-5 py-3.5 text-sm text-[#09090B]">
                {s.dominio ? (
                  <span className="flex items-center gap-1.5">
                    {s.dominio}
                    <ExternalLink size={12} className="text-[#A1A1AA]" />
                  </span>
                ) : (
                  <span className="text-[#A1A1AA]">Sem domínio</span>
                )}
              </td>
              <td className="px-5 py-3.5 text-sm text-[#71717A]">
                {s.urlPreview && (
                  <span className="flex items-center gap-1.5">
                    {s.urlPreview}
                    <ExternalLink size={12} className="text-[#A1A1AA]" />
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <SiteStatusTag status={s.status} />
              </td>
              <td className="px-5 py-3.5 text-sm text-[#71717A]">
                {s.stack}
              </td>
              <td className="max-w-[200px] px-5 py-3.5 text-sm text-[#71717A] truncate">
                {s.notas}
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

export function SitesTabs() {
  const [active, setActive] = useState<"pre" | "pos">("pre");

  return (
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
          <SiteTable data={active === "pre" ? preFechamento : posFechamento} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
