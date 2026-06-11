import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { r2Put } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12MB de entrada e mais que suficiente

/**
 * Recebe a imagem de fundo ja cortada (4:5) pelo cliente, converte pra
 * AVIF e sobe pro R2. Devolve a URL pra entrar no pedido de edicao.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.tenantId) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const carrossel = await db.carrossel.findUnique({
    where: { id },
    include: { tenant: { select: { slug: true } } },
  });

  if (!carrossel || carrossel.tenantId !== session.tenantId) {
    return NextResponse.json({ error: "Post nao encontrado" }, { status: 404 });
  }
  if (carrossel.status !== "APROVACAO" || carrossel.editadoPeloCliente) {
    return NextResponse.json(
      { error: "Este post nao esta aberto pra edicao" },
      { status: 400 }
    );
  }

  const form = await request.formData();
  const file = form.get("imagem");
  const slideRaw = form.get("slide");
  const slide = Number(slideRaw);

  if (!(file instanceof File) || !Number.isInteger(slide) || slide < 0) {
    return NextResponse.json({ error: "Envio invalido" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Imagem muito pesada. Use uma foto de ate 12MB" },
      { status: 400 }
    );
  }

  const input = Buffer.from(await file.arrayBuffer());

  let avif: Buffer;
  try {
    avif = await sharp(input)
      .resize(1080, 1350, { fit: "cover", position: "centre" })
      .avif({ quality: 60 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Nao consegui ler essa imagem. Tente JPG ou PNG" },
      { status: 400 }
    );
  }

  const key = `carrosseis/${carrossel.tenant.slug}/${carrossel.id}/fundos/slide-${slide + 1}-${Date.now()}.avif`;

  try {
    const url = await r2Put(key, avif, "image/avif");
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[fundo] upload falhou:", err);
    return NextResponse.json(
      { error: "Nao consegui salvar a imagem. Tente de novo" },
      { status: 500 }
    );
  }
}
