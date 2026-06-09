"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { StatusTag } from "@/components/shared/status-tag";
import { ChevronLeft, ChevronRight, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type CarouselData = {
  id: string;
  titulo: string;
  angulo: string;
  status: string;
  slides: string[];
  legenda: string;
  operador: string;
  updatedAt: string;
};

function SlidePreview({ slides }: { slides: string[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative">
      <div className="h-40 w-full overflow-hidden rounded-lg bg-[#F4F4F5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex h-full items-center justify-center p-6"
          >
            <p className="text-center text-sm text-[#71717A]">
              {slides[current]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] disabled:opacity-30"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <span className="text-xs text-[#A1A1AA]">
          {current + 1} de {slides.length}
        </span>
        <button
          onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))}
          disabled={current === slides.length - 1}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] disabled:opacity-30"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export function CarouselCard({ data }: { data: CarouselData }) {
  const needsAction =
    data.status === "AGUARDANDO_CLIENTE" || data.status === "REVISAO_INTERNA";

  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      transition={transitions.smooth}
      whileHover={{
        y: -3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        transition: { type: "spring", stiffness: 400, damping: 20 },
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold text-[#09090B]">
              {data.titulo}
            </h4>
            <p className="mt-0.5 text-xs text-[#71717A]">{data.angulo}</p>
          </div>
          <StatusTag status={data.status} />
        </div>

        <div className="mt-4">
          <SlidePreview slides={data.slides} />
        </div>

        <div className="mt-4 rounded-lg bg-[#FAFAFA] px-3.5 py-3">
          <p className="text-xs font-medium text-[#A1A1AA]">Legenda</p>
          <p className="mt-1 text-xs leading-relaxed text-[#71717A]">
            {data.legenda}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#A1A1AA]">
            por {data.operador} &middot; {data.updatedAt}
          </p>
        </div>

        {needsAction && (
          <div className="mt-4 flex items-center gap-2 border-t border-[#E4E4E7] pt-4">
            <Button className="gap-2 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-medium text-[#FAFAFA] hover:bg-[#27272A]">
              <Check size={14} strokeWidth={2} />
              Aprovar
            </Button>
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]">
              <MessageSquare size={14} strokeWidth={1.5} />
              Pedir ajuste
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
