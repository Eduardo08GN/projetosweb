"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Check, Clock } from "lucide-react";

type DmInteraction = {
  id: string;
  username: string;
  keyword: string;
  respondido: boolean;
  createdAt: string;
};

const mockDms: DmInteraction[] = [
  {
    id: "1",
    username: "maria.silva",
    keyword: "EBOOK",
    respondido: true,
    createdAt: "Hoje, 15:42",
  },
  {
    id: "2",
    username: "joao.santos",
    keyword: "AULA",
    respondido: true,
    createdAt: "Hoje, 14:18",
  },
  {
    id: "3",
    username: "ana.costa",
    keyword: "PREÇO",
    respondido: true,
    createdAt: "Hoje, 12:05",
  },
  {
    id: "4",
    username: "pedro.lima",
    keyword: "EBOOK",
    respondido: true,
    createdAt: "Hoje, 10:33",
  },
  {
    id: "5",
    username: "lucas.oliveira",
    keyword: "AULA",
    respondido: true,
    createdAt: "Ontem, 22:15",
  },
  {
    id: "6",
    username: "carla.mendes",
    keyword: "EBOOK",
    respondido: false,
    createdAt: "Ontem, 20:48",
  },
  {
    id: "7",
    username: "rafael.alves",
    keyword: "PREÇO",
    respondido: true,
    createdAt: "Ontem, 18:30",
  },
  {
    id: "8",
    username: "julia.ferreira",
    keyword: "LISTA",
    respondido: false,
    createdAt: "Ontem, 16:12",
  },
];

export function RecentDms() {
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
          Mensagens recentes
        </h3>
      </div>

      <div className="divide-y divide-[#E4E4E7]">
        {mockDms.map((dm) => (
          <div
            key={dm.id}
            className="flex items-center justify-between px-5 py-3 transition-colors duration-150 hover:bg-[#FAFAFA]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F5] text-xs font-semibold text-[#09090B]">
                {dm.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-[#09090B]">@{dm.username}</p>
                <p className="text-xs text-[#A1A1AA]">
                  enviou{" "}
                  <span className="font-medium text-[#71717A]">
                    {dm.keyword}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {dm.respondido ? (
                <span className="flex items-center gap-1 text-xs text-[#166534]">
                  <Check size={12} strokeWidth={2} />
                  Respondido
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
                  <Clock size={12} strokeWidth={2} />
                  Pausada
                </span>
              )}
              <span className="text-xs text-[#A1A1AA]">{dm.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
