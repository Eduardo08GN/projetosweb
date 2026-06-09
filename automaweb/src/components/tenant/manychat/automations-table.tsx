"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Zap, ZapOff } from "lucide-react";

type Automation = {
  id: string;
  keyword: string;
  resposta: string;
  ativo: boolean;
  disparos: number;
};

const mockAutomations: Automation[] = [
  {
    id: "1",
    keyword: "EBOOK",
    resposta: "Opa! Aqui está o link do seu e-book gratuito: https://link.com/ebook",
    ativo: true,
    disparos: 87,
  },
  {
    id: "2",
    keyword: "AULA",
    resposta: "Que bom que você quer participar! Acesse a aula gratuita aqui: https://link.com/aula",
    ativo: true,
    disparos: 42,
  },
  {
    id: "3",
    keyword: "PREÇO",
    resposta: "Vou te mandar todos os detalhes por aqui. Qual curso te interessa mais?",
    ativo: true,
    disparos: 18,
  },
  {
    id: "4",
    keyword: "LISTA",
    resposta: "Pronto! Você está na lista VIP. Vou te avisar em primeira mão quando abrir as vagas.",
    ativo: false,
    disparos: 156,
  },
];

export function AutomationsTable() {
  const [automations, setAutomations] = useState(mockAutomations);

  function toggleAutomation(id: string) {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ativo: !a.ativo } : a))
    );
  }

  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="border-b border-[#E4E4E7] px-5 py-4">
        <h3 className="text-sm font-semibold text-[#09090B]">
          Respostas automáticas
        </h3>
        <p className="mt-0.5 text-xs text-[#71717A]">
          Quando alguém enviar a palavra-chave no seu Direct, a resposta é
          enviada automaticamente
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E4E4E7] bg-[#F4F4F5]">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Palavra-chave
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Resposta
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Envios
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {automations.map((a) => (
              <tr
                key={a.id}
                className="transition-colors duration-150 hover:bg-[#FAFAFA]"
              >
                <td className="px-5 py-3.5">
                  <span className="inline-block rounded-md bg-[#F4F4F5] px-2.5 py-1 text-xs font-semibold tracking-wide text-[#09090B]">
                    {a.keyword}
                  </span>
                </td>
                <td className="max-w-[360px] px-5 py-3.5 text-sm text-[#71717A] truncate">
                  {a.resposta}
                </td>
                <td
                  className="px-5 py-3.5 text-right text-sm font-medium text-[#09090B]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {a.disparos}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    onClick={() => toggleAutomation(a.id)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150"
                  >
                    {a.ativo ? (
                      <span className="flex items-center gap-1.5 text-[#166534]">
                        <Zap size={12} strokeWidth={2} />
                        Ativa
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[#A1A1AA]">
                        <ZapOff size={12} strokeWidth={2} />
                        Pausada
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
