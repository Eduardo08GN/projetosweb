"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { submitEdit } from "@/app/actions/tenant-carrossel-actions";
import { MAX_TEXTO_SLIDE, type EdicaoSlide } from "@/lib/carrossel-edicao";

type SlideEdit = { texto: string; imagemUrl?: string; previewUrl?: string };

/* ── Cropper 4:5 ──
   A foto aparece dentro da moldura na proporcao exata do slide.
   O cliente arrasta e da zoom; o corte final sai em 1080x1350. */
function ImageCropper({
  file,
  uploading,
  onConfirm,
  onCancel,
}: {
  file: File;
  uploading: boolean;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const [url] = useState(() => URL.createObjectURL(file));
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  function frameSize() {
    const w = frameRef.current?.offsetWidth ?? 300;
    return { w, h: w * 1.25 };
  }

  function coverScale() {
    if (!natural) return 1;
    const { w, h } = frameSize();
    return Math.max(w / natural.w, h / natural.h);
  }

  function clampOffset(x: number, y: number, z = zoom) {
    if (!natural) return { x: 0, y: 0 };
    const { w, h } = frameSize();
    const scale = coverScale() * z;
    const maxX = Math.max(0, (natural.w * scale - w) / 2);
    const maxY = Math.max(0, (natural.h * scale - h) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    setOffset(
      clampOffset(
        drag.current.ox + (e.clientX - drag.current.startX),
        drag.current.oy + (e.clientY - drag.current.startY)
      )
    );
  }

  function handleZoom(z: number) {
    setZoom(z);
    setOffset((o) => clampOffset(o.x, o.y, z));
  }

  function confirm() {
    if (!natural || !imgRef.current) return;
    const { w: frameW, h: frameH } = frameSize();
    const scale = coverScale() * zoom;
    const sw = frameW / scale;
    const sh = frameH / scale;
    const sx = natural.w / 2 - offset.x / scale - sw / 2;
    const sy = natural.h / 2 - offset.y / scale - sh / 2;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, 1080, 1350);
    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/jpeg",
      0.92
    );
  }

  const scale = coverScale() * zoom;

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-[#71717A]">
        A foto preenche o slide inteiro, em pe (proporcao 4:5). Arraste pra
        enquadrar e use o zoom se precisar.
      </p>

      <div
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => (drag.current = null)}
        className="relative aspect-[4/5] w-full cursor-grab touch-none select-none overflow-hidden rounded-lg bg-[#F4F4F5] active:cursor-grabbing"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={url}
          alt="Enquadrar foto"
          draggable={false}
          onLoad={(e) =>
            setNatural({
              w: e.currentTarget.naturalWidth,
              h: e.currentTarget.naturalHeight,
            })
          }
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            width: natural ? natural.w * scale : undefined,
            maxWidth: "none",
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10" />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[#A1A1AA]">Zoom</span>
        <input
          type="range"
          min={1}
          max={2.5}
          step={0.01}
          value={zoom}
          onChange={(e) => handleZoom(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer accent-[#18181B]"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={confirm}
          disabled={uploading || !natural}
          className="gap-2 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} strokeWidth={2} />
          )}
          {uploading ? "Salvando..." : "Usar esta foto"}
        </Button>
        <button
          onClick={onCancel}
          disabled={uploading}
          className="rounded-lg px-3 py-2 text-xs font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* ── Sheet de edicao ──
   Regra da casa: edicao acontece UMA vez. Enviar a alteracao ja aprova
   o post. Texto e foto de fundo, por slide. */
export function EditSheet({
  carrosselId,
  slides,
  open,
  onOpenChange,
}: {
  carrosselId: string;
  slides: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [edits, setEdits] = useState<Record<number, SlideEdit>>({});
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentEdit = edits[current] ?? { texto: "" };
  const totalEdits = Object.values(edits).filter(
    (e) => e.texto.trim() || e.imagemUrl
  ).length;

  function setTexto(value: string) {
    if (value.length > MAX_TEXTO_SLIDE) {
      toast(
        `Limite de ${MAX_TEXTO_SLIDE} caracteres por slide. Texto demais dificulta a leitura no Instagram`
      );
      value = value.slice(0, MAX_TEXTO_SLIDE);
    }
    setEdits((prev) => ({
      ...prev,
      [current]: { ...currentEdit, texto: value },
    }));
  }

  async function uploadCropped(blob: Blob) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("imagem", blob, "fundo.jpg");
      form.append("slide", String(current));
      const res = await fetch(`/api/tenant/carrossel/${carrosselId}/fundo`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Nao consegui salvar a imagem");
        return;
      }
      setEdits((prev) => ({
        ...prev,
        [current]: {
          ...currentEdit,
          imagemUrl: data.url,
          previewUrl: URL.createObjectURL(blob),
        },
      }));
      setCropFile(null);
      toast("Foto de fundo pronta");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit() {
    const payload: EdicaoSlide[] = Object.entries(edits)
      .map(([slide, e]) => ({
        slide: Number(slide),
        texto: e.texto.trim() || undefined,
        imagemUrl: e.imagemUrl,
      }))
      .filter((e) => e.texto || e.imagemUrl);

    startTransition(async () => {
      const result = await submitEdit(carrosselId, payload);
      if (result.error) {
        toast(result.error);
      } else {
        toast("Alteracao enviada. Post aprovado, a gente aplica e atualiza aqui");
        onOpenChange(false);
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="overflow-y-auto bg-white sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold text-[#09090B]">
            Editar antes de aprovar
          </SheetTitle>
          <SheetDescription className="text-xs leading-relaxed text-[#71717A]">
            Ajuste o texto ou a foto de fundo dos slides que quiser. Voce pode
            editar uma unica vez, e ao enviar o post ja fica aprovado.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 px-4 pb-6">
          {/* seletor de slide */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {slides.map((slide, i) => {
              const edited = !!(edits[i]?.texto.trim() || edits[i]?.imagemUrl);
              return (
                <button
                  key={i}
                  onClick={() => {
                    setCurrent(i);
                    setCropFile(null);
                  }}
                  className={`relative h-16 w-[51px] shrink-0 overflow-hidden rounded-md border transition-colors duration-150 ${
                    current === i
                      ? "border-[#18181B]"
                      : "border-[#E4E4E7] opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                >
                  {slide.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-[#A1A1AA]">
                      {i + 1}
                    </span>
                  )}
                  {edited && (
                    <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-[#16A34A]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* preview do slide selecionado */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#F4F4F5]">
            {currentEdit.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentEdit.previewUrl}
                alt={`Novo fundo do slide ${current + 1}`}
                className="h-full w-full object-cover"
              />
            ) : slides[current]?.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slides[current]}
                alt={`Slide ${current + 1}`}
                className="h-full w-full object-contain"
              />
            ) : null}
            {currentEdit.previewUrl && (
              <span className="absolute left-2 top-2 rounded-md bg-[#18181B] px-2 py-1 text-[10px] font-medium text-[#FAFAFA]">
                Fundo novo
              </span>
            )}
          </div>

          {/* texto */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="novo-texto"
                className="text-xs font-medium text-[#71717A]"
              >
                Novo texto deste slide (opcional)
              </label>
              <span
                className={`text-xs ${
                  currentEdit.texto.length >= MAX_TEXTO_SLIDE
                    ? "font-medium text-[#DC2626]"
                    : "text-[#A1A1AA]"
                }`}
              >
                {currentEdit.texto.length}/{MAX_TEXTO_SLIDE}
              </span>
            </div>
            <textarea
              id="novo-texto"
              value={currentEdit.texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva como o texto deve ficar"
              rows={3}
              className="mt-1.5 w-full resize-none rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-3 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>

          {/* foto de fundo */}
          {cropFile ? (
            <ImageCropper
              file={cropFile}
              uploading={uploading}
              onConfirm={uploadCropped}
              onCancel={() => setCropFile(null)}
            />
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCropFile(file);
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#D4D4D8] px-4 py-3 text-xs font-medium text-[#71717A] transition-colors duration-150 hover:border-[#A1A1AA] hover:text-[#09090B]"
              >
                <ImagePlus size={14} strokeWidth={1.5} />
                {currentEdit.imagemUrl
                  ? "Trocar a foto escolhida"
                  : "Trocar foto de fundo (opcional)"}
              </button>
              {currentEdit.imagemUrl && (
                <button
                  onClick={() =>
                    setEdits((prev) => ({
                      ...prev,
                      [current]: {
                        ...currentEdit,
                        imagemUrl: undefined,
                        previewUrl: undefined,
                      },
                    }))
                  }
                  className="mt-1.5 flex items-center gap-1 text-xs text-[#A1A1AA] transition-colors hover:text-[#DC2626]"
                >
                  <X size={12} />
                  Remover foto nova
                </button>
              )}
            </div>
          )}

          {/* envio */}
          <div className="mt-auto border-t border-[#E4E4E7] pt-4">
            <Button
              onClick={handleSubmit}
              disabled={pending || uploading || totalEdits === 0}
              className="w-full gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
            >
              <Check size={14} strokeWidth={2} />
              {pending
                ? "Enviando..."
                : totalEdits > 0
                  ? `Enviar alteracao e aprovar (${totalEdits} slide${totalEdits > 1 ? "s" : ""})`
                  : "Enviar alteracao e aprovar"}
            </Button>
            <p className="mt-2 text-center text-[11px] text-[#A1A1AA]">
              Essa e sua unica edicao. Ao enviar, o post fica aprovado.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
