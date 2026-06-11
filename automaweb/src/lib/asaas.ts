/* ── Cliente Asaas ──
   Cobranca recorrente da plataforma. Padrao minimo consultado no
   appkash: um gateway so, sem roteador. A fonte de verdade do acesso
   continua sendo Tenant.planoValidoAte — o webhook so a estende. */

const ASAAS_URL = "https://api.asaas.com/v3";

type AsaasErro = { errors?: Array<{ description?: string }> };

async function asaasFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error("Cobranca nao configurada (ASAAS_API_KEY ausente)");

  const res = await fetch(`${ASAAS_URL}${path}`, {
    ...init,
    headers: {
      access_token: apiKey,
      "content-type": "application/json",
      accept: "application/json",
      ...init?.headers,
    },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });

  const data = (await res.json().catch(() => ({}))) as T & AsaasErro;
  if (!res.ok) {
    const motivo = data.errors?.[0]?.description ?? `Asaas respondeu ${res.status}`;
    throw new Error(motivo);
  }
  return data;
}

/** Garante o cliente no Asaas e devolve o id (busca por CPF/CNPJ antes de criar). */
export async function ensureAsaasCustomer(dados: {
  nome: string;
  email: string | null;
  telefone: string | null;
  documento: string;
  referencia: string; // tenantId
}): Promise<string> {
  const doc = dados.documento.replace(/\D/g, "");

  const existentes = await asaasFetch<{ data: Array<{ id: string }> }>(
    `/customers?cpfCnpj=${doc}&limit=1`
  );
  if (existentes.data.length > 0) return existentes.data[0].id;

  const criado = await asaasFetch<{ id: string }>("/customers", {
    method: "POST",
    json: {
      name: dados.nome,
      cpfCnpj: doc,
      email: dados.email ?? undefined,
      mobilePhone: dados.telefone?.replace(/\D/g, "") || undefined,
      externalReference: dados.referencia,
      notificationDisabled: false,
    },
  });
  return criado.id;
}

/** Cria a assinatura mensal. O cliente escolhe Pix ou cartao na fatura. */
export async function createAsaasSubscription(dados: {
  customerId: string;
  valor: number;
  primeiroVencimento: Date;
  descricao: string;
  referencia: string; // tenantId
}): Promise<string> {
  const sub = await asaasFetch<{ id: string }>("/subscriptions", {
    method: "POST",
    json: {
      customer: dados.customerId,
      billingType: "UNDEFINED",
      value: dados.valor,
      nextDueDate: dados.primeiroVencimento.toISOString().slice(0, 10),
      cycle: "MONTHLY",
      description: dados.descricao,
      externalReference: dados.referencia,
    },
  });
  return sub.id;
}

/**
 * Cobranca avulsa de uma mensalidade (sem recorrencia). Devolve o link
 * da fatura pro master mandar manualmente. Quando paga, o webhook
 * estende a validade do plano igual ao pagamento da assinatura.
 */
export async function createOneOffPayment(dados: {
  customerId: string;
  valor: number;
  vencimento: Date;
  descricao: string;
  referencia: string; // tenantId
}): Promise<string | null> {
  const pagamento = await asaasFetch<{ invoiceUrl: string | null }>("/payments", {
    method: "POST",
    json: {
      customer: dados.customerId,
      billingType: "UNDEFINED",
      value: dados.valor,
      dueDate: dados.vencimento.toISOString().slice(0, 10),
      description: dados.descricao,
      externalReference: dados.referencia,
    },
  });
  return pagamento.invoiceUrl;
}

export async function cancelAsaasSubscription(subscriptionId: string) {
  await asaasFetch(`/subscriptions/${subscriptionId}`, { method: "DELETE" });
}

/** Link da proxima fatura em aberto da assinatura (pra mandar pro cliente). */
export async function getInvoiceUrl(subscriptionId: string): Promise<string | null> {
  const pagamentos = await asaasFetch<{
    data: Array<{ status: string; invoiceUrl: string | null; dueDate: string }>;
  }>(`/payments?subscription=${subscriptionId}&limit=10`);

  const aberto = pagamentos.data
    .filter((p) => ["PENDING", "OVERDUE"].includes(p.status))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  return aberto?.invoiceUrl ?? pagamentos.data[0]?.invoiceUrl ?? null;
}
