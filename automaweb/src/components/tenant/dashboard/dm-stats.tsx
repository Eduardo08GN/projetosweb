"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { MessageCircle, Zap, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Automações ativas",
    value: "3",
    icon: Zap,
  },
  {
    label: "DMs respondidas",
    value: "147",
    icon: MessageCircle,
  },
  {
    label: "Taxa de resposta",
    value: "94%",
    icon: TrendingUp,
  },
];

export function DmStats() {
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
          Automação de DMs
        </h3>
      </div>
      <div className="divide-y divide-[#E4E4E7]">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between px-5 py-3.5"
          >
            <div className="flex items-center gap-3">
              <stat.icon
                size={16}
                strokeWidth={1.5}
                className="text-[#A1A1AA]"
              />
              <span className="text-sm text-[#71717A]">{stat.label}</span>
            </div>
            <span
              className="text-sm font-semibold text-[#09090B]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
