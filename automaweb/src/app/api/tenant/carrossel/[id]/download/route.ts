import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Baixa o post completo num ZIP: slides em PNG (1080x1350, prontos pro
 * Instagram) + legenda.txt com texto e hashtags. E a rota manual de
 * publicacao enquanto a conta nao esta conectada.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.tenantId) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const carrossel = await db.carrossel.findUnique({ where: { id } });

  if (!carrossel || carrossel.tenantId !== session.tenantId) {
    return NextResponse.json({ error: "Post nao encontrado" }, { status: 404 });
  }

  const slides = ((carrossel.slides as string[] | null) ?? []).filter(
    (s) => typeof s === "string" && s.startsWith("http")
  );
  if (slides.length === 0) {
    return NextResponse.json(
      { error: "Este post nao tem imagens disponiveis" },
      { status: 400 }
    );
  }

  const zip = new JSZip();

  for (let i = 0; i < slides.length; i++) {
    const res = await fetch(slides[i]);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Nao consegui montar o arquivo. Tente de novo" },
        { status: 502 }
      );
    }
    zip.file(
      `slide-${String(i + 1).padStart(2, "0")}.png`,
      await res.arrayBuffer()
    );
  }

  const legenda = [carrossel.legendaBody, carrossel.hashtags]
    .filter(Boolean)
    .join("\n\n");
  if (legenda) zip.file("legenda.txt", legenda);

  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "STORE", // PNG ja e comprimido; STORE = zip instantaneo
  });

  const nomeArquivo = carrossel.titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${nomeArquivo || "post"}.zip"`,
    },
  });
}
