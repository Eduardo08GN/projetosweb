"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageCropper({
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
        Arraste pra enquadrar e use o zoom se precisar. Proporcao 4:5.
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
          type="button"
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
