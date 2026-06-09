"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function approveCarrossel(carrosselId: string) {
  const session = await getSession();
  if (!session?.tenantId) return { error: "Nao autorizado" };

  const carrossel = await db.carrossel.findUnique({
    where: { id: carrosselId },
  });

  if (!carrossel || carrossel.tenantId !== session.tenantId) {
    return { error: "Carrossel nao encontrado" };
  }

  if (carrossel.status !== "AGUARDANDO_CLIENTE") {
    return { error: "Este carrossel nao esta aguardando aprovacao" };
  }

  await db.carrossel.update({
    where: { id: carrosselId },
    data: { status: "APROVADO", feedbackCliente: null },
  });

  revalidatePath("/tenant/carrossel");
  revalidatePath("/tenant");
  revalidatePath("/master/pipeline");
  revalidatePath("/master");
  return { success: true };
}

export async function requestAdjustment(
  carrosselId: string,
  feedback: string
) {
  const session = await getSession();
  if (!session?.tenantId) return { error: "Nao autorizado" };

  const trimmed = feedback.trim();
  if (!trimmed) return { error: "Descreva o que precisa ser ajustado" };

  const carrossel = await db.carrossel.findUnique({
    where: { id: carrosselId },
  });

  if (!carrossel || carrossel.tenantId !== session.tenantId) {
    return { error: "Carrossel nao encontrado" };
  }

  if (carrossel.status !== "AGUARDANDO_CLIENTE") {
    return { error: "Este carrossel nao esta aguardando aprovacao" };
  }

  await db.carrossel.update({
    where: { id: carrosselId },
    data: { status: "AJUSTE_PEDIDO", feedbackCliente: trimmed },
  });

  revalidatePath("/tenant/carrossel");
  revalidatePath("/tenant");
  revalidatePath("/master/pipeline");
  revalidatePath("/master");
  return { success: true };
}
