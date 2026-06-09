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

export function RecentActivity({ items }: { items: ActivityItem[] }) {
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
        {items.map((item) => (
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
        {items.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-[#A1A1AA]">
            Nenhuma atividade recente
          </div>
        )}
      </div>
    </motion.div>
  );
}
