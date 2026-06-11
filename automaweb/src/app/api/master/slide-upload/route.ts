import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { r2Put } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "MASTER") {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("imagem");
  const carrosselId = form.get("carrosselId") as string | null;
  const slideIndex = Number(form.get("slide"));

  if (!(file instanceof File) || !carrosselId || !Number.isInteger(slideIndex)) {
    return NextResponse.json({ error: "Envio invalido" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Imagem muito pesada (max 12MB)" },
      { status: 400 }
    );
  }

  const carrossel = await db.carrossel.findUnique({
    where: { id: carrosselId },
    include: { tenant: { select: { slug: true } } },
  });
  if (!carrossel) {
    return NextResponse.json({ error: "Carrossel nao encontrado" }, { status: 404 });
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

  const key = `carrosseis/${carrossel.tenant.slug}/${carrossel.id}/slides/slide-${slideIndex + 1}-${Date.now()}.avif`;

  try {
    const url = await r2Put(key, avif, "image/avif");
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[master-slide-upload] falhou:", err);
    return NextResponse.json(
      { error: "Erro no upload" },
      { status: 500 }
    );
  }
}
