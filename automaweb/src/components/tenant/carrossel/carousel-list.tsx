"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { variants } from "@/lib/animations";
import { CarouselCard, type CarouselData } from "./carousel-card";

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "action", label: "Aguardando voce" },
  { key: "production", label: "Em producao" },
  { key: "done", label: "Publicados" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

type CarouselItem = CarouselData;

function filterCarousels(items: CarouselItem[], key: FilterKey) {
  if (key === "all") return items;
  if (key === "action")
    return items.filter((c) => c.status === "APROVACAO");
  if (key === "production")
    return items.filter(
      (c) =>
        c.status === "PRODUZIR" ||
        c.status === "APROVADO" ||
        c.status === "AGENDADO"
    );
  return items.filter((c) => c.status === "PUBLICADO");
}

export function CarouselList({ items }: { items: CarouselItem[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const filtered = filterCarousels(items, filter);

  return (
    <div className="space-y-5">
      <div className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
              filter === f.key
                ? "bg-[#18181B] text-[#FAFAFA]"
                : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#09090B]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        variants={variants.staggerContainer}
        initial="hidden"
        animate="visible"
        key={filter}
      >
        {filtered.map((c) => (
          <CarouselCard key={c.id} data={c} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white">
          <p className="text-sm text-[#A1A1AA]">Nenhum carrossel nesta categoria</p>
        </div>
      )}
    </div>
  );
}
