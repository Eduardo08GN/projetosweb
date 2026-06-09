"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateCarrosselState =
  | { error?: string; success?: boolean }
  | undefined;

export async function createCarrossel(
  _prev: CreateCarrosselState,
  formData: FormData
): Promise<CreateCarrosselState> {
  const titulo = (formData.get("titulo") as string)?.trim();
  const tenantId = (formData.get("tenantId") as string)?.trim();
  const angulo = (formData.get("angulo") as string)?.trim();

  if (!titulo || !tenantId) {
    return { error: "Titulo e cliente sao obrigatorios" };
  }

  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    return { error: "Cliente nao encontrado" };
  }

  await db.carrossel.create({
    data: {
      tenantId,
      titulo,
      angulo: angulo || null,
      status: "BACKLOG",
    },
  });

  revalidatePath("/master/pipeline");
  revalidatePath("/master");
  return { success: true };
}

export async function moveCarrossel(
  carrosselId: string,
  newStatus: string
): Promise<{ error?: string; success?: boolean }> {
  const validStatuses = [
    "BACKLOG",
    "EM_PRODUCAO",
    "REVISAO_INTERNA",
    "AGUARDANDO_CLIENTE",
    "APROVADO",
    "AGENDADO",
    "PUBLICADO",
    "AJUSTE_PEDIDO",
  ];

  if (!validStatuses.includes(newStatus)) {
    return { error: "Status invalido" };
  }

  const carrossel = await db.carrossel.findUnique({
    where: { id: carrosselId },
  });
  if (!carrossel) {
    return { error: "Carrossel nao encontrado" };
  }

  await db.carrossel.update({
    where: { id: carrosselId },
    data: { status: newStatus as typeof carrossel.status },
  });

  revalidatePath("/master/pipeline");
  revalidatePath("/master");
  return { success: true };
}

export async function updateCarrosselContent(
  carrosselId: string,
  data: {
    titulo?: string;
    angulo?: string;
    slides?: string[];
    legendaBody?: string;
    hashtags?: string;
  }
): Promise<{ error?: string; success?: boolean }> {
  const carrossel = await db.carrossel.findUnique({
    where: { id: carrosselId },
  });
  if (!carrossel) {
    return { error: "Carrossel nao encontrado" };
  }

  await db.carrossel.update({
    where: { id: carrosselId },
    data: {
      titulo: data.titulo?.trim() || carrossel.titulo,
      angulo: data.angulo?.trim() || carrossel.angulo,
      slides: data.slides && data.slides.length > 0 ? data.slides : undefined,
      legendaBody: data.legendaBody !== undefined ? data.legendaBody.trim() || null : carrossel.legendaBody,
      hashtags: data.hashtags !== undefined ? data.hashtags.trim() || null : carrossel.hashtags,
    },
  });

  revalidatePath("/master/pipeline");
  revalidatePath("/master");
  revalidatePath("/tenant/carrossel");
  return { success: true };
}

export async function scheduleCarrossel(
  carrosselId: string,
  dateTime: string
): Promise<{ error?: string; success?: boolean }> {
  const agendadoPara = new Date(dateTime);
  if (isNaN(agendadoPara.getTime())) {
    return { error: "Data invalida" };
  }

  if (agendadoPara.getTime() < Date.now()) {
    return { error: "A data precisa ser no futuro" };
  }

  const carrossel = await db.carrossel.findUnique({
    where: { id: carrosselId },
  });
  if (!carrossel) {
    return { error: "Carrossel nao encontrado" };
  }

  if (carrossel.status !== "APROVADO") {
    return { error: "Somente carrosseis aprovados podem ser agendados" };
  }

  await db.carrossel.update({
    where: { id: carrosselId },
    data: { status: "AGENDADO", agendadoPara },
  });

  revalidatePath("/master/pipeline");
  revalidatePath("/master");
  revalidatePath("/tenant/carrossel");
  return { success: true };
}
