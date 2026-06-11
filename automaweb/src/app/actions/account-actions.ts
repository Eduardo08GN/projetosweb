"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type AccountActionState = { error?: string; success?: boolean } | undefined;

export async function updateProfile(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  const session = await getSession();
  if (!session) return { error: "Nao autorizado" };

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();

  if (!name || !email) return { error: "Nome e email sao obrigatorios" };
  if (!email.includes("@")) return { error: "Email invalido" };

  const emailEmUso = await db.user.findFirst({
    where: { email, id: { not: session.userId } },
  });
  if (emailEmUso) return { error: "Esse email ja esta em uso" };

  await db.user.update({
    where: { id: session.userId },
    data: { name, email },
  });

  if (session.tenantId) {
    await db.tenant.update({
      where: { id: session.tenantId },
      data: { phone: phone || null },
    });
  }

  revalidatePath("/tenant/conta");
  return { success: true };
}

export async function changePassword(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  const session = await getSession();
  if (!session) return { error: "Nao autorizado" };

  const atual = (formData.get("atual") as string) ?? "";
  const nova = (formData.get("nova") as string) ?? "";
  const confirmar = (formData.get("confirmar") as string) ?? "";

  if (nova.length < 8) return { error: "A nova senha precisa de pelo menos 8 caracteres" };
  if (nova !== confirmar) return { error: "As senhas nao conferem" };

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return { error: "Nao autorizado" };

  const confere = await bcrypt.compare(atual, user.password);
  if (!confere) return { error: "Senha atual incorreta" };

  await db.user.update({
    where: { id: session.userId },
    data: { password: await bcrypt.hash(nova, 10) },
  });

  return { success: true };
}
