"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Receipt, Download, Loader2 } from "lucide-react";
import { listarMeusPagamentos } from "@/app/actions/account-actions";
import type { PagamentoAsaas } from "@/lib/asaas";

const PAGO = ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"];

function rotulo(status: string): { texto: string; cor: string } {
  if (PAGO.includes(status)) return { texto: "Pago", cor: "text-[#166534]" };
  if (status === "OVERDUE") return { texto: "Vencida", cor: "text-[#B91C1C]" };
  if (status === "REFUNDED") return { texto: "Estornado", cor: "text-[#71717A]" };
  return { texto: "Em aberto", cor: "text-[#92400E]" };
}

function dataBR(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function PaymentsCard() {
  const [pagamentos, setPagamentos] = useState<PagamentoAsaas[] | null>(null);

  useEffect(() => {
    let vivo = true;
    listarMeusPagamentos().then((r) => {
      if (vivo) setPagamentos(r.pagamentos ?? []);
    });
    return () => {
      vivo = false;
    };
  }, []);

  // sem assinatura ou sem cobranca ainda: nada a mostrar
  if (pagamentos !== null && pagamentos.length === 0) return null;

  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="flex items-center gap-3 border-b border-[#E4E4E7] px-6 py-4">
        <Receipt size={18} strokeWidth={1.5} className="text-[#71717A]" />
        <h3 className="text-sm font-semibold text-[#09090B]">Pagamentos</h3>
      </div>

      {pagamentos === null ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={18} className="animate-spin text-[#A1A1AA]" />
        </div>
      ) : (
        <div className="divide-y divide-[#E4E4E7]">
          {pagamentos.map((p) => {
            const r = rotulo(p.status);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 px-6 py-3.5"
              >
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold text-[#09090B]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    R$ {p.valor}
                  </p>
                  <p className="mt-0.5 text-xs text-[#A1A1AA]">
                    <span className={r.cor}>{r.texto}</span>
                    {" · "}
                    {dataBR(p.pagoEm ?? p.vencimento)}
                  </p>
                </div>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#09090B] transition-colors duration-150 hover:bg-[#F4F4F5]"
                  >
                    <Download size={13} strokeWidth={1.5} />
                    {PAGO.includes(p.status) ? "Comprovante" : "Pagar"}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
