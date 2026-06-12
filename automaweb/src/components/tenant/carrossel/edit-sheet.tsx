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
import { ImageCropper } from "@/components/shared/image-cropper";
import { SlideImage } from "@/components/shared/slide-image";
import { DateTimeField } from "./datetime-field";
import { submitEdit } from "@/app/actions/tenant-carrossel-actions";
import { MAX_TEXTO_SLIDE, type EdicaoSlide } from "@/lib/carrossel-edicao";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type SlideEdit = { texto: string; imagemUrl?: string; previewUrl?: string };

/* ── Sheet de edicao ──
   Regra da casa: edicao acontece UMA vez. Enviar a alteracao ja aprova
   o post. Texto e foto de fundo, por slide. */
export function EditSheet({
  carrosselId,
  slides,
  versao,
  agendadoParaInput,
  open,
  onOpenChange,
}: {
  carrosselId: string;
  slides: string[];
  versao: number;
  agendadoParaInput: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [edits, setEdits] = useState<Record<number, SlideEdit>>({});
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState(agendadoParaInput);
  const [confirmando, setConfirmando] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dataMudou = data !== "" && data !== agendadoParaInput;

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
      const result = await submitEdit(
        carrosselId,
        payload,
        dataMudou ? data : undefined
      );
      setConfirmando(false);
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
                  className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-md border transition-colors duration-150 sm:h-16 sm:w-[51px] ${
                    current === i
                      ? "border-[#18181B]"
                      : "border-[#E4E4E7] opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                >
                  {slide.startsWith("http") ? (
                    <SlideImage
                      src={slide}
                      alt=""
                      sizes="64px"
                      versao={versao}
                      className="object-cover"
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
              <SlideImage
                src={slides[current]}
                alt={`Slide ${current + 1}`}
                sizes="(max-width: 640px) 100vw, 448px"
                versao={versao}
                className="object-contain"
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
              className="mt-1.5 w-full resize-none rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-3 text-base text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B] sm:text-sm"
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

          {/* data de publicacao */}
          <div className="border-t border-[#E4E4E7] pt-5">
            <DateTimeField value={data} onChange={setData} />
            <p className="mt-1.5 text-[11px] text-[#A1A1AA]">
              Padrao definido pela gente. Mude se quiser outra data.
            </p>
          </div>

          {/* envio */}
          <div className="mt-auto border-t border-[#E4E4E7] pt-4">
            <Button
              onClick={() => setConfirmando(true)}
              disabled={pending || uploading || (totalEdits === 0 && !dataMudou)}
              className="w-full gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
            >
              <Check size={14} strokeWidth={2} />
              {totalEdits > 0
                ? `Enviar alteracao e aprovar (${totalEdits} slide${totalEdits > 1 ? "s" : ""})`
                : "Aprovar e agendar"}
            </Button>
            <p className="mt-2 text-center text-[11px] text-[#A1A1AA]">
              {totalEdits > 0
                ? "Essa e sua unica edicao. Ao enviar, o post fica aprovado."
                : "Ao aprovar, o post entra na fila pra publicar."}
            </p>
          </div>
        </div>
      </SheetContent>

      <Dialog open={confirmando} onOpenChange={setConfirmando}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Aprovar e publicar?</DialogTitle>
            <DialogDescription>
              Depois de publicado, nao da mais pra editar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmando(false)}
              disabled={pending}
              className="rounded-lg"
            >
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={pending}
              className="gap-2 rounded-lg bg-[#18181B] text-[#FAFAFA] hover:bg-[#27272A]"
            >
              {pending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={2} />}
              {pending ? "Enviando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
