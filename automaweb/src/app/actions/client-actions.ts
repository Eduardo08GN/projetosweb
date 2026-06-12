"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifyTenant } from "@/lib/email";
import { emailBoasVindas } from "@/lib/email-templates";

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

  // primeiros clientes: pacote Completo com 6 meses de carrosseis inclusos.
  // A mensalidade sugerida vem do plano em destaque do catalogo.
  const inicio = new Date();
  const validoAte = new Date(inicio);
  validoAte.setMonth(validoAte.getMonth() + 6);

  const planoDestaque = await db.planoCatalogo.findFirst({
    where: { destaque: true, ativo: true },
  });

  const tenant = await db.tenant.create({
    data: {
      name,
      slug,
      email,
      phone: phone || null,
      status: "ATIVO",
      plano: "Completo",
      planoInicio: inicio,
      planoValidoAte: validoAte,
      planoMensalidade: planoDestaque?.valor ?? 215,
    },
  });

  const senhaInicial = password || slug + "2026";
  const hashedPassword = await bcrypt.hash(senhaInicial, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "TENANT",
      tenantId: tenant.id,
    },
  });

  // entrega o acesso direto na caixa de entrada do cliente
  const boasVindas = emailBoasVindas({ nome: name, email, senha: senhaInicial });
  after(() => notifyTenant(tenant.id, boasVindas.subject, boasVindas.html));

  revalidatePath("/master/clientes");
  revalidatePath("/master");
  return { success: true };
}

/** Edicao inline da tabela de clientes (campos comerciais). */
export async function updateClientField(
  tenantId: string,
  field: string,
  value: string
): Promise<{ error?: string; success?: boolean }> {
  const allowed = ["status", "phone", "plano", "planoValidoAte", "planoMensalidade", "documento", "horaPublicacaoPadrao"];
  if (!allowed.includes(field)) return { error: "Campo nao permitido" };

  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return { error: "Cliente nao encontrado" };

  let data: Record<string, unknown>;
  if (field === "status") {
    if (!["PROSPECT", "ATIVO", "PAUSADO", "CANCELADO"].includes(value)) {
      return { error: "Situacao invalida" };
    }
    data = { status: value };
  } else if (field === "planoValidoAte") {
    if (!value) {
      data = { planoValidoAte: null };
    } else {
      const date = new Date(value + "T12:00:00");
      if (isNaN(date.getTime())) return { error: "Data invalida" };
      data = { planoValidoAte: date };
      // validade estendida pro futuro = renovacao: zera a regua de avisos
      // e reativa a conta se estava pausada por vencimento
      if (date.getTime() > Date.now()) {
        data.planoAvisoDias = null;
        if (tenant.status === "PAUSADO") data.status = "ATIVO";
      }
    }
  } else if (field === "planoMensalidade") {
    if (!value) {
      data = { planoMensalidade: null };
    } else {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) return { error: "Valor invalido" };
      data = { planoMensalidade: num };
    }
  } else if (field === "horaPublicacaoPadrao") {
    if (!value) {
      data = { horaPublicacaoPadrao: null }; // volta pro padrao global (13h)
    } else {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0 || num > 23) return { error: "Hora invalida (0 a 23)" };
      data = { horaPublicacaoPadrao: num };
    }
  } else {
    data = { [field]: value || null };
  }

  await db.tenant.update({ where: { id: tenantId }, data });

  revalidatePath("/master/clientes");
  revalidatePath("/tenant/conta");
  return { success: true };
}
