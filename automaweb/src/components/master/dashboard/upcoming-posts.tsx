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

const mockPosts: UpcomingPost[] = [
  {
    id: "1",
    titulo: "Sotaque americano vs britânico",
    tenant: "Prof. Rodger",
    plataforma: "Instagram",
    data: "10 jun",
    hora: "18:00",
  },
  {
    id: "2",
    titulo: "Clareamento x facetas",
    tenant: "Dra. Camila",
    plataforma: "Instagram",
    data: "11 jun",
    hora: "12:00",
  },
  {
    id: "3",
    titulo: "Rotina de skincare noturna",
    tenant: "Studio Bella",
    plataforma: "Instagram",
    data: "12 jun",
    hora: "19:00",
  },
];

export function UpcomingPosts() {
  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      transition={transitions.smooth}
    >
      <div className="border-b border-[#E4E4E7] px-5 py-4">
        <h3 className="text-base font-semibold tracking-tight text-[#09090B]">
          Próximas publicações
        </h3>
      </div>
      <div className="divide-y divide-[#E4E4E7]">
        {mockPosts.map((post) => (
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
      </div>
    </motion.div>
  );
}
