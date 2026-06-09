"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { CheckCircle2, Camera } from "lucide-react";
import Link from "next/link";

export function ConnectionBanner({
  connected,
  username,
}: {
  connected: boolean;
  username?: string;
}) {
  if (connected) {
    return (
      <motion.div
        className="flex items-center gap-3 rounded-xl border border-[#E4E4E7] bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        variants={variants.fadeUpSmall}
        initial="hidden"
        animate="visible"
        transition={transitions.smooth}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCFCE7]">
          <CheckCircle2 size={16} strokeWidth={1.5} className="text-[#166534]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#09090B]">
            Instagram conectado
          </p>
          <p className="text-xs text-[#71717A]">@{username}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-between rounded-xl border border-[#FEF9C3] bg-[#FFFBEB] px-5 py-3.5"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF9C3]">
          <Camera size={16} strokeWidth={1.5} className="text-[#854D0E]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#09090B]">
            Instagram não conectado
          </p>
          <p className="text-xs text-[#854D0E]">
            Conecte para publicar carrosséis automaticamente
          </p>
        </div>
      </div>
      <Link
        href="/tenant/integracoes"
        className="rounded-lg bg-[#18181B] px-4 py-2 text-sm font-medium text-[#FAFAFA] transition-colors duration-150 hover:bg-[#27272A]"
      >
        Conectar
      </Link>
    </motion.div>
  );
}
