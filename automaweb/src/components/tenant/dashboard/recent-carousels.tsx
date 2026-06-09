"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { StatusTag } from "@/components/shared/status-tag";

type CarouselItem = {
  id: string;
  titulo: string;
  status: string;
  operador: string;
  updatedAt: string;
};

const mockCarousels: CarouselItem[] = [
  {
    id: "1",
    titulo: "5 erros de pronúncia",
    status: "PUBLICADO",
    operador: "Ana",
    updatedAt: "Hoje, 14:30",
  },
  {
    id: "2",
    titulo: "Phrasal verbs do dia a dia",
    status: "AGENDADO",
    operador: "Ana",
    updatedAt: "Hoje, 10:15",
  },
  {
    id: "3",
    titulo: "Sotaque americano vs britânico",
    status: "APROVADO",
    operador: "Carlos",
    updatedAt: "Ontem, 18:00",
  },
  {
    id: "4",
    titulo: "Present perfect simplificado",
    status: "AGUARDANDO_CLIENTE",
    operador: "Ana",
    updatedAt: "Ontem, 09:45",
  },
  {
    id: "5",
    titulo: "Gírias americanas 2026",
    status: "EM_PRODUCAO",
    operador: "Carlos",
    updatedAt: "05 jun, 16:20",
  },
];

export function RecentCarousels() {
  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="border-b border-[#E4E4E7] px-5 py-4">
        <h3 className="text-sm font-semibold text-[#09090B]">
          Carrosséis recentes
        </h3>
      </div>
      <div className="divide-y divide-[#E4E4E7]">
        {mockCarousels.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-5 py-3.5 transition-colors duration-150 hover:bg-[#FAFAFA]"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-[#09090B]">
                  {item.titulo}
                </p>
                <p className="mt-0.5 text-xs text-[#A1A1AA]">
                  por {item.operador}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusTag status={item.status} />
              <span className="min-w-[100px] text-right text-xs text-[#A1A1AA]">
                {item.updatedAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
