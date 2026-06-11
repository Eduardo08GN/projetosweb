"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function revalidatePlanos() {
  revalidatePath("/master/clientes");
  revalidatePath("/tenant/conta");
}

/** Edicao inline do catalogo de planos (so master). */
export async function updatePlanoCatalogo(
  planoId: string,
  field: string,
  value: string
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (session?.role !== "MASTER") return { error: "Nao autorizado" };

  const allowed = ["nome", "valor", "descricao", "destaque"];
  if (!allowed.includes(field)) return { error: "Campo nao permitido" };

  const plano = await db.planoCatalogo.findUnique({ where: { id: planoId } });
  if (!plano) return { error: "Plano nao encontrado" };

  let data: Record<string, unknown>;
  if (field === "valor") {
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) return { error: "Valor invalido" };
    data = { valor: num };
  } else if (field === "destaque") {
    const ligado = value === "true";
    if (ligado) {
      // um destaque por vez: apaga o anterior
      await db.planoCatalogo.updateMany({ data: { destaque: false } });
    }
    data = { destaque: ligado };
  } else {
    const texto = value.trim();
    if (!texto) return { error: "Nao pode ficar vazio" };
    if (field === "nome") {
      const existe = await db.planoCatalogo.findFirst({
        where: { nome: texto, id: { not: planoId } },
      });
      if (existe) return { error: "Ja existe um plano com esse nome" };
    }
    data = { [field]: texto };
  }

  await db.planoCatalogo.update({ where: { id: planoId }, data });

  revalidatePlanos();
  return { success: true };
}
