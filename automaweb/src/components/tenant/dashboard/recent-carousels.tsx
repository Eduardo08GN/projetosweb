"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { StatusTag } from "@/components/shared/status-tag";

type CarouselItem = {
  id: string;
  titulo: string;
  status: string;
  autor: string;
  updatedAt: string;
};

export function RecentCarousels({ items }: { items: CarouselItem[] }) {
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
          Carrosseis recentes
        </h3>
      </div>
      <div className="divide-y divide-[#E4E4E7]">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-[#FAFAFA]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#09090B]">
                {item.titulo}
              </p>
              <p className="mt-0.5 text-xs text-[#A1A1AA]">
                por {item.autor} &middot; {item.updatedAt}
              </p>
            </div>
            <div className="shrink-0 whitespace-nowrap pt-0.5">
              <StatusTag status={item.status} />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-[#A1A1AA]">
            Nenhum carrossel ainda
          </div>
        )}
      </div>
    </motion.div>
  );
}
