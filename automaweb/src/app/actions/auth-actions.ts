"use server";

import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export type LoginState = {
  error?: string;
} | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Preencha todos os campos" };
  }

  const user = await db.user.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user) {
    return { error: "Email ou senha incorretos" };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: "Email ou senha incorretos" };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId ?? undefined,
    tenantSlug: user.tenant?.slug,
  });

  if (user.role === "MASTER") {
    redirect("/master");
  } else {
    redirect("/tenant");
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
