"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Calendar, Clock } from "lucide-react";

export function NextPost() {
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
          Próxima publicação
        </h3>
      </div>
      <div className="px-5 py-5">
        <p className="text-base font-medium text-[#09090B]">
          Phrasal verbs do dia a dia
        </p>
        <p className="mt-1 text-xs text-[#71717A]">7 slides</p>

        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar size={14} strokeWidth={1.5} className="text-[#A1A1AA]" />
            <span className="text-sm text-[#71717A]">10 jun 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} strokeWidth={1.5} className="text-[#A1A1AA]" />
            <span className="text-sm text-[#71717A]">09:00</span>
          </div>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#F4F4F5]">
          <motion.div
            className="h-full rounded-full bg-[#18181B]"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          />
        </div>
        <p className="mt-1.5 text-xs text-[#A1A1AA]">75% pronto</p>
      </div>
    </motion.div>
  );
}
