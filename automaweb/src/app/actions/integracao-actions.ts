"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Desliga a conexao com o Instagram do proprio tenant. O token sai do
 * banco na hora; reconectar exige passar pelo login da Meta de novo.
 */
export async function desconectarInstagram(): Promise<{
  error?: string;
  success?: boolean;
}> {
  const session = await getSession();
  if (!session?.tenantId) return { error: "Nao autorizado" };

  await db.metaConnection.updateMany({
    where: { tenantId: session.tenantId },
    data: {
      status: "DESCONECTADO",
      accessToken: null,
      tokenExpiresAt: null,
      connectedAt: null,
      ultimoAvisoDias: null,
    },
  });

  revalidatePath("/tenant/integracoes");
  return { success: true };
}
