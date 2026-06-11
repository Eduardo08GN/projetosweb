"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifyTenant } from "@/lib/email";
import { emailSitePublicado } from "@/lib/email-templates";

export type SiteActionState = { error?: string; success?: boolean } | undefined;

export async function createSite(
  _prev: SiteActionState,
  formData: FormData
): Promise<SiteActionState> {
  const tenantId = (formData.get("tenantId") as string)?.trim();
  const fase = (formData.get("fase") as string)?.trim();
  const urlPreview = (formData.get("urlPreview") as string)?.trim();
  const stack = (formData.get("stack") as string)?.trim();
  const notas = (formData.get("notas") as string)?.trim();

  if (!tenantId) return { error: "Selecione um cliente" };

  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return { error: "Cliente nao encontrado" };

  const validFases = ["PRE_FECHAMENTO", "POS_FECHAMENTO"];
  const safeFase = validFases.includes(fase) ? fase : "PRE_FECHAMENTO";

  await db.site.create({
    data: {
      tenantId,
      fase: safeFase as "PRE_FECHAMENTO" | "POS_FECHAMENTO",
      urlPreview: urlPreview || null,
      stack: stack || null,
      notas: notas || null,
    },
  });

  revalidatePath("/master/sites");
  return { success: true };
}

export async function updateSiteField(
  siteId: string,
  field: string,
  value: string
): Promise<{ error?: string; success?: boolean }> {
  const allowedFields = [
    "dominio",
    "urlPreview",
    "status",
    "stack",
    "notas",
    "fase",
  ];
  if (!allowedFields.includes(field)) {
    return { error: "Campo nao permitido" };
  }

  const site = await db.site.findUnique({ where: { id: siteId } });
  if (!site) return { error: "Site nao encontrado" };

  if (field === "status") {
    const validStatuses = [
      "RASCUNHO",
      "EM_DESENVOLVIMENTO",
      "REVISAO",
      "PUBLICADO",
      "ARQUIVADO",
    ];
    if (!validStatuses.includes(value)) {
      return { error: "Status invalido" };
    }
  }

  if (field === "fase") {
    const validFases = ["PRE_FECHAMENTO", "POS_FECHAMENTO"];
    if (!validFases.includes(value)) {
      return { error: "Fase invalida" };
    }
  }

  await db.site.update({
    where: { id: siteId },
    data: { [field]: value || null },
  });

  // virou PUBLICADO agora: o cliente merece saber na hora
  if (field === "status" && value === "PUBLICADO" && site.status !== "PUBLICADO") {
    const { subject, html } = emailSitePublicado({ dominio: site.dominio });
    after(() => notifyTenant(site.tenantId, subject, html));
  }

  revalidatePath("/master/sites");
  return { success: true };
}

export async function deleteSite(
  siteId: string
): Promise<{ error?: string; success?: boolean }> {
  const site = await db.site.findUnique({ where: { id: siteId } });
  if (!site) return { error: "Site nao encontrado" };

  await db.site.delete({ where: { id: siteId } });

  revalidatePath("/master/sites");
  return { success: true };
}
