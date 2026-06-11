"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { variants, transitions } from "@/lib/animations";
import { StatusTag } from "@/components/shared/status-tag";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
} from "lucide-react";
import { siInstagram } from "simple-icons";

function InstagramIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d={siInstagram.path} />
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { approveCarrossel } from "@/app/actions/tenant-carrossel-actions";
import { EditSheet } from "./edit-sheet";

export type CarouselData = {
  id: string;
  titulo: string;
  angulo: string;
  status: string;
  slides: string[];
  legenda: string;
  operador: string;
  updatedAt: string;
  agendadoParaLabel: string | null;
  publicadoEmLabel: string | null;
  editadoPeloCliente: boolean;
  temEdicaoPendente: boolean;
  conectado: boolean;
};

function SlidePreview({ slides }: { slides: string[] }) {
  const [current, setCurrent] = useState(0);
  const isImage = slides[current]?.startsWith("http");

  return (
    <div className="relative">
      <div className="h-64 w-full overflow-hidden rounded-lg bg-[#F4F4F5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex h-full items-center justify-center"
          >
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slides[current]}
                alt={`Slide ${current + 1}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <p className="p-6 text-center text-sm text-[#71717A]">
                {slides[current]}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] disabled:opacity-30"
          aria-label="Slide anterior"
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
          aria-label="Proximo slide"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

/** Linha que sempre diz quando o post vai (ou foi) pro Instagram. */
function ScheduleLine({ data }: { data: CarouselData }) {
  if (data.status === "PUBLICADO") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#F0FDF4] px-3.5 py-2.5">
        <InstagramIcon size={14} className="text-[#16A34A]" />
        <p className="text-xs font-medium text-[#166534]">
          {data.publicadoEmLabel
            ? `Publicado no seu Instagram em ${data.publicadoEmLabel}`
            : "Publicado no seu Instagram"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#F4F4F5] px-3.5 py-2.5">
      <Calendar size={14} strokeWidth={1.5} className="text-[#71717A]" />
      <p className="text-xs font-medium text-[#52525B]">
        {data.agendadoParaLabel
          ? data.conectado
            ? `Vai pro seu Instagram em ${data.agendadoParaLabel}`
            : `Publicacao prevista pra ${data.agendadoParaLabel}`
          : "Data de publicacao a combinar"}
      </p>
    </div>
  );
}

export function CarouselCard({ data }: { data: CarouselData }) {
  const needsAction = data.status === "APROVACAO";
  const hasSlides = data.slides.some((s) => s.startsWith("http"));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      const result = await approveCarrossel(data.id);
      if ("error" in result && result.error) {
        toast(result.error);
      } else if ("agendado" in result && result.agendado) {
        toast("Aprovado. Vai pro seu Instagram na data marcada");
      } else {
        toast("Aprovado. Baixe quando quiser publicar");
      }
    });
  }

  return (
    <>
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
            {hasSlides ? (
              <SlidePreview slides={data.slides} />
            ) : data.status === "PUBLICADO" ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg bg-[#F4F4F5]">
                <InstagramIcon size={20} className="text-[#A1A1AA]" />
                <p className="text-xs text-[#A1A1AA]">
                  Ja esta no seu Instagram
                </p>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg bg-[#F4F4F5]">
                <p className="text-xs text-[#A1A1AA]">Em producao</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <ScheduleLine data={data} />
          </div>

          {data.temEdicaoPendente && (
            <div className="mt-2 rounded-lg bg-[#FEF9C3] px-3.5 py-2.5">
              <p className="text-xs font-medium text-[#854D0E]">
                Sua alteracao esta sendo aplicada. O preview atualiza aqui
              </p>
            </div>
          )}

          {data.legenda && (
            <div className="mt-4 rounded-lg bg-[#FAFAFA] px-3.5 py-3">
              <p className="text-xs font-medium text-[#A1A1AA]">Legenda</p>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#71717A]">
                {data.legenda}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-[#A1A1AA]">
              por {data.operador} &middot; {data.updatedAt}
            </p>
            {data.editadoPeloCliente && (
              <span className="rounded-md bg-[#F4F4F5] px-2 py-1 text-[10px] font-medium text-[#71717A]">
                Editado por voce
              </span>
            )}
          </div>

          {(needsAction || hasSlides) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#E4E4E7] pt-4">
              {needsAction && (
                <Button
                  onClick={handleApprove}
                  disabled={pending}
                  className="gap-2 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
                >
                  <Check size={14} strokeWidth={2} />
                  {pending ? "Aprovando..." : "Aprovar"}
                </Button>
              )}

              {needsAction && !data.editadoPeloCliente && (
                <button
                  onClick={(e) => {
                    // impede que o base-ui leia este mesmo clique como
                    // "clique fora" e feche o sheet na hora
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    setSheetOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
                >
                  <Pencil size={14} strokeWidth={1.5} />
                  Editar antes de aprovar
                </button>
              )}

              {hasSlides && (
                <a
                  href={`/api/tenant/carrossel/${data.id}/download`}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
                >
                  <Download size={14} strokeWidth={1.5} />
                  Baixar post
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {needsAction && !data.editadoPeloCliente && (
        <EditSheet
          carrosselId={data.id}
          slides={data.slides}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      )}
    </>
  );
}
