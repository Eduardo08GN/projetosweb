"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { StatusTag } from "@/components/shared/status-tag";

type ActivityItem = {
  id: string;
  titulo: string;
  tenant: string;
  status: string;
  operador: string;
  updatedAt: string;
};

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    titulo: "Sotaque americano vs britânico",
    tenant: "Prof. Rodger",
    status: "PUBLICADO",
    operador: "Eduardo",
    updatedAt: "Hoje",
  },
  {
    id: "2",
    titulo: "5 erros no present perfect",
    tenant: "Prof. Rodger",
    status: "AGUARDANDO_CLIENTE",
    operador: "Lucas",
    updatedAt: "Ontem",
  },
  {
    id: "3",
    titulo: "Clareamento x facetas",
    tenant: "Dra. Camila",
    status: "EM_PRODUCAO",
    operador: "Eduardo",
    updatedAt: "Ontem",
  },
  {
    id: "4",
    titulo: "Rotina de skincare noturna",
    tenant: "Studio Bella",
    status: "REVISAO_INTERNA",
    operador: "Lucas",
    updatedAt: "3 dias",
  },
  {
    id: "5",
    titulo: "Marketing local para restaurantes",
    tenant: "Chef Paulo",
    status: "BACKLOG",
    operador: "Eduardo",
    updatedAt: "5 dias",
  },
];

export function RecentActivity() {
  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      transition={transitions.smooth}
    >
      <div className="border-b border-[#E4E4E7] px-5 py-4">
        <h3 className="text-base font-semibold tracking-tight text-[#09090B]">
          Atividade recente
        </h3>
      </div>
      <div className="divide-y divide-[#E4E4E7]">
        {mockActivity.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-5 py-3.5 transition-colors duration-150 hover:bg-[#FAFAFA]"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#09090B]">
                {item.titulo}
              </p>
              <p className="mt-0.5 text-xs text-[#71717A]">
                {item.tenant} · {item.operador}
              </p>
            </div>
            <div className="ml-4 flex items-center gap-3">
              <StatusTag status={item.status} />
              <span className="w-14 text-right text-xs text-[#A1A1AA]">
                {item.updatedAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
