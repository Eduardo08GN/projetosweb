"use server";

import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const DEMO_USERS = [
  {
    id: "master-1",
    email: "admin@automaweb.com.br",
    name: "Eduardo",
    password: bcrypt.hashSync("admin123", 10),
    role: "MASTER" as const,
  },
  {
    id: "tenant-1",
    email: "rodger@profrodger.com.br",
    name: "Prof. Rodger Koller",
    password: bcrypt.hashSync("rodger123", 10),
    role: "TENANT" as const,
    tenantId: "tenant-profrodger",
    tenantSlug: "prof-rodger",
  },
  {
    id: "tenant-2",
    email: "camila@dracamilaodonto.com.br",
    name: "Dra. Camila",
    password: bcrypt.hashSync("camila123", 10),
    role: "TENANT" as const,
    tenantId: "tenant-dracamila",
    tenantSlug: "dra-camila",
  },
];

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

  const user = DEMO_USERS.find((u) => u.email === email);
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
    tenantId: user.tenantId,
    tenantSlug: user.tenantSlug,
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
