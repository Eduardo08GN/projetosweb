"use server";

import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export type LoginState = {
  error?: string;
} | undefined;

/* Freio de forca bruta: 5 erros seguidos por email travam o login por
   1 minuto. Em memoria mesmo — a plataforma roda em container unico. */
const tentativas = new Map<string, { erros: number; bloqueadoAte: number }>();
const MAX_ERROS = 5;
const BLOQUEIO_MS = 60_000;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Preencha todos os campos" };
  }

  const freio = tentativas.get(email);
  if (freio && freio.bloqueadoAte > Date.now()) {
    return { error: "Muitas tentativas. Aguarde um minuto e tente de novo" };
  }

  function registraErro() {
    const atual = tentativas.get(email) ?? { erros: 0, bloqueadoAte: 0 };
    atual.erros += 1;
    if (atual.erros >= MAX_ERROS) {
      atual.erros = 0;
      atual.bloqueadoAte = Date.now() + BLOQUEIO_MS;
    }
    tentativas.set(email, atual);
  }

  const user = await db.user.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user) {
    registraErro();
    return { error: "Email ou senha incorretos" };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    registraErro();
    return { error: "Email ou senha incorretos" };
  }

  tentativas.delete(email);

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
