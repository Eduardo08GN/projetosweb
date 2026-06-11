"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import {
  Save,
  CalendarCheck,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Upload,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { ImageCropper } from "@/components/shared/image-cropper";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  updateCarrosselContent,
  scheduleCarrossel,
} from "@/app/actions/carrossel-actions";
import { StatusTag } from "@/components/shared/status-tag";
import type { KanbanItem } from "./kanban-card";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium text-[#A1A1AA]">{children}</label>
  );
}

function isImageUrl(url: string) {
  if (!url) return false;
  return url.startsWith("http") || url.startsWith("/");
}

function SlideItem({
  index,
  url,
  carrosselId,
  onUpdate,
  onRemove,
  canRemove,
}: {
  index: number;
  url: string;
  carrosselId: string;
  onUpdate: (url: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleCropped(blob: Blob) {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.set("imagem", new File([blob], "slide.jpg", { type: "image/jpeg" }));
    form.set("carrosselId", carrosselId);
    form.set("slide", String(index));

    try {
      const res = await fetch("/api/master/slide-upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro no upload");
      } else {
        onUpdate(data.url);
        setCropFile(null);
      }
    } catch {
      setError("Falha na conexao");
    } finally {
      setUploading(false);
    }
  }

  if (cropFile) {
    return (
      <div className="rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] p-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F4F4F5] text-xs font-semibold text-[#71717A]">
            {index + 1}
          </div>
          <span className="text-xs font-medium text-[#09090B]">Enquadrar imagem</span>
        </div>
        <ImageCropper
          file={cropFile}
          uploading={uploading}
          onConfirm={handleCropped}
          onCancel={() => setCropFile(null)}
        />
        {error && <p className="mt-2 text-xs text-[#991B1B]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F4F4F5] text-xs font-semibold text-[#71717A]">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {isImageUrl(url) ? (
            <div className="relative aspect-[4/5] w-full max-w-[160px] overflow-hidden rounded-lg border border-[#E4E4E7] bg-white">
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : url ? (
            <p className="truncate text-xs text-[#71717A]">{url}</p>
          ) : (
            <div className="flex aspect-[4/5] w-full max-w-[160px] items-center justify-center rounded-lg border border-dashed border-[#E4E4E7] bg-white">
              <ImageIcon size={20} className="text-[#D4D4D8]" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setCropFile(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-[#09090B] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#E4E4E7] transition-all duration-150 hover:bg-[#F4F4F5]"
            >
              <Upload size={12} strokeWidth={2} />
              Enviar imagem
            </button>
            {canRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-md p-1.5 text-[#A1A1AA] transition-colors duration-150 hover:bg-[#FEE2E2] hover:text-[#991B1B]"
              >
                <Trash2 size={12} strokeWidth={1.5} />
              </button>
            )}
          </div>
          {error && <p className="text-xs text-[#991B1B]">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function SlideEditor({
  slides,
  carrosselId,
  onChange,
}: {
  slides: string[];
  carrosselId: string;
  onChange: (slides: string[]) => void;
}) {
  function updateSlide(index: number, value: string) {
    const next = [...slides];
    next[index] = value;
    onChange(next);
  }

  function addSlide() {
    onChange([...slides, ""]);
  }

  function removeSlide(index: number) {
    onChange(slides.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel>Slides ({slides.length})</FieldLabel>
        <button
          type="button"
          onClick={addSlide}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
        >
          <Plus size={12} strokeWidth={2} />
          Adicionar
        </button>
      </div>
      {slides.map((slide, i) => (
        <SlideItem
          key={i}
          index={i}
          url={slide}
          carrosselId={carrosselId}
          onUpdate={(url) => updateSlide(i, url)}
          onRemove={() => removeSlide(i)}
          canRemove={slides.length > 1}
        />
      ))}
      {slides.length === 0 && (
        <button
          type="button"
          onClick={addSlide}
          className="flex h-16 w-full items-center justify-center rounded-lg border border-dashed border-[#E4E4E7] text-xs text-[#A1A1AA] transition-colors duration-150 hover:border-[#18181B] hover:text-[#09090B]"
        >
          Adicionar primeiro slide
        </button>
      )}
    </div>
  );
}

export function CarrosselDetailSheet({
  item,
  status,
  open,
  onOpenChange,
}: {
  item: KanbanItem | null;
  status: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [angulo, setAngulo] = useState("");
  const [slides, setSlides] = useState<string[]>([]);
  const [legendaBody, setLegendaBody] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savePending, startSaveTransition] = useTransition();
  const [schedulePending, startScheduleTransition] = useTransition();

  useEffect(() => {
    if (open && item) {
      setTitulo(item.titulo);
      setAngulo(item.angulo ?? "");
      setSlides([...item.slides]);
      setLegendaBody(item.legendaBody);
      setHashtags(item.hashtags);
      setScheduleDate("");
      setScheduleTime("10:00");
      setError("");
      setSaved(false);
    }
  }, [open, item]);

  function handleSave() {
    if (!item) return;
    setError("");
    setSaved(false);
    startSaveTransition(async () => {
      const result = await updateCarrosselContent(item.id, {
        titulo,
        angulo,
        slides,
        legendaBody,
        hashtags,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  function handleSchedule() {
    if (!item || !scheduleDate || !scheduleTime) return;
    setError("");
    const dateTime = `${scheduleDate}T${scheduleTime}:00`;
    startScheduleTransition(async () => {
      const result = await scheduleCarrossel(item.id, dateTime);
      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
      }
    });
  }

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <SheetTitle className="text-sm font-semibold text-[#09090B]">
              Editar carrossel
            </SheetTitle>
            <StatusTag status={status} />
          </div>
          <SheetDescription className="text-xs text-[#71717A]">
            {item.tenant}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-6">
          {item.edicaoPendente && item.edicaoPendente.length > 0 && (
            <div className="rounded-lg bg-[#FEF9C3] px-3.5 py-3">
              <div className="flex items-center gap-2">
                <Pencil size={14} className="shrink-0 text-[#854D0E]" />
                <p className="text-xs font-semibold text-[#854D0E]">
                  Edicao do cliente pra aplicar
                </p>
              </div>
              <div className="mt-2 space-y-2">
                {item.edicaoPendente.map((edit) => (
                  <div key={edit.slide} className="text-xs text-[#854D0E]">
                    <span className="font-semibold">
                      Slide {edit.slide + 1}:
                    </span>
                    {edit.texto && (
                      <p className="mt-0.5 leading-relaxed">
                        &ldquo;{edit.texto}&rdquo;
                      </p>
                    )}
                    {edit.imagemUrl && (
                      <a
                        href={edit.imagemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex items-center gap-1 font-medium underline underline-offset-2"
                      >
                        Foto de fundo nova
                        <ExternalLink size={10} strokeWidth={2} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#854D0E]/80">
                A publicacao automatica fica travada ate a fabrica
                re-renderizar e dar baixa nesta edicao
              </p>
            </div>
          )}

          <div>
            <FieldLabel>Titulo</FieldLabel>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
            />
          </div>

          <div>
            <FieldLabel>Angulo</FieldLabel>
            <input
              value={angulo}
              onChange={(e) => setAngulo(e.target.value)}
              placeholder="Ex: Dor do aluno intermediario que trava"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>

          <SlideEditor slides={slides} carrosselId={item.id} onChange={setSlides} />

          <div>
            <FieldLabel>Legenda</FieldLabel>
            <textarea
              value={legendaBody}
              onChange={(e) => setLegendaBody(e.target.value)}
              rows={4}
              placeholder="Legenda que acompanha o carrossel no Instagram"
              className="mt-1.5 w-full resize-none rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-3 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>

          <div>
            <FieldLabel>Hashtags</FieldLabel>
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#ingles #fluencia #pronunciation"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 placeholder:text-[#D4D4D8] focus:border-[#18181B]"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-[#FEE2E2] px-3.5 py-2.5 text-sm text-[#991B1B]">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={savePending}
              className="gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
            >
              <Save size={14} strokeWidth={2} />
              {savePending ? "Salvando..." : saved ? "Salvo" : "Salvar"}
            </Button>
          </div>

          {status === "APROVADO" && (
            <div className="border-t border-[#E4E4E7] pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Agendamento
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Data</FieldLabel>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
                  />
                </div>
                <div>
                  <FieldLabel>Horario</FieldLabel>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#09090B] outline-none transition-colors duration-150 focus:border-[#18181B]"
                  />
                </div>
              </div>
              <Button
                onClick={handleSchedule}
                disabled={schedulePending || !scheduleDate}
                className="mt-3 gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50"
              >
                <CalendarCheck size={14} strokeWidth={2} />
                {schedulePending ? "Agendando..." : "Agendar publicacao"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
