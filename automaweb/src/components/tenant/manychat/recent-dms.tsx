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

export function RecentDms({ items }: { items: DmInteraction[] }) {
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
        {items.map((dm) => (
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
        {items.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-[#A1A1AA]">
            Nenhuma mensagem recente
          </div>
        )}
      </div>
    </motion.div>
  );
}
