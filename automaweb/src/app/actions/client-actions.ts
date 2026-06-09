"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateClientState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createClient(
  _prev: CreateClientState,
  formData: FormData
): Promise<CreateClientState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!name || !email) {
    return { error: "Nome e email sao obrigatorios" };
  }

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existing = await db.tenant.findFirst({
    where: { OR: [{ slug }, { email }] },
  });

  if (existing) {
    return { error: "Ja existe um cliente com esse nome ou email" };
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Ja existe um usuario com esse email" };
  }

  const tenant = await db.tenant.create({
    data: {
      name,
      slug,
      email,
      phone: phone || null,
      status: "ATIVO",
    },
  });

  const hashedPassword = password
    ? await bcrypt.hash(password, 10)
    : await bcrypt.hash(slug + "2026", 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "TENANT",
      tenantId: tenant.id,
    },
  });

  revalidatePath("/master/clientes");
  revalidatePath("/master");
  return { success: true };
}
