"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Globe, ArrowUpRight } from "lucide-react";

type SiteData = { url: string; label: string } | null;

export function SiteLiveCard({ data }: { data: SiteData }) {
  if (!data) return null;

  return (
    <motion.div
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-xl border border-[#E4E4E7] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-150 hover:bg-[#FAFAFA]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4]">
          <Globe size={18} strokeWidth={1.5} className="text-[#16A34A]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#09090B]">
              Seu site esta no ar
            </p>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
          </div>
          <p className="mt-0.5 truncate text-xs text-[#71717A]">{data.label}</p>
        </div>
        <ArrowUpRight
          size={18}
          strokeWidth={1.5}
          className="shrink-0 text-[#A1A1AA] transition-colors duration-150 group-hover:text-[#09090B]"
        />
      </a>
    </motion.div>
  );
}
