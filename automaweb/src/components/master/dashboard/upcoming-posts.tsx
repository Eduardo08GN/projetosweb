"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Calendar } from "lucide-react";

type UpcomingPost = {
  id: string;
  titulo: string;
  tenant: string;
  plataforma: string;
  data: string;
  hora: string;
};

export function UpcomingPosts({ items }: { items: UpcomingPost[] }) {
  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      transition={transitions.smooth}
    >
      <div className="border-b border-[#E4E4E7] px-5 py-4">
        <h3 className="text-base font-semibold tracking-tight text-[#09090B]">
          Proximas publicacoes
        </h3>
      </div>
      <div className="divide-y divide-[#E4E4E7]">
        {items.map((post) => (
          <div
            key={post.id}
            className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-[#FAFAFA]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F5]">
              <Calendar size={18} strokeWidth={1.5} className="text-[#71717A]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#09090B]">
                {post.titulo}
              </p>
              <p className="mt-0.5 text-xs text-[#71717A]">
                {post.tenant} · {post.plataforma}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#09090B]">{post.data}</p>
              <p className="text-xs text-[#A1A1AA]">{post.hora}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-[#A1A1AA]">
            Nenhuma publicacao agendada
          </div>
        )}
      </div>
    </motion.div>
  );
}
