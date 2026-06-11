"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/** Liga ou pausa uma resposta automatica do proprio cliente. */
export async function toggleAutomacao(
  automacaoId: string,
  ativo: boolean
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (!session?.tenantId) return { error: "Nao autorizado" };

  const automacao = await db.automacaoDM.findUnique({
    where: { id: automacaoId },
  });
  if (!automacao || automacao.tenantId !== session.tenantId) {
    return { error: "Automacao nao encontrada" };
  }

  await db.automacaoDM.update({
    where: { id: automacaoId },
    data: { ativo },
  });

  revalidatePath("/tenant/manychat");
  return { success: true };
}
