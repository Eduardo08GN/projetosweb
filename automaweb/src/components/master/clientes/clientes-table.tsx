"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { TenantStatusTag } from "@/components/shared/tenant-status-tag";

type ClienteRow = {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  status: string;
  carrosseis: number;
  createdAt: string;
};

export function ClientesTable({ items }: { items: ClienteRow[] }) {
  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E4E4E7] bg-[#F4F4F5]">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Cliente
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Contato
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Carrosseis
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
                Desde
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {items.map((c) => (
              <tr
                key={c.id}
                className="transition-colors duration-150 hover:bg-[#FAFAFA]"
              >
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-[#09090B]">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#A1A1AA]">{c.slug}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-[#09090B]">{c.email}</p>
                  <p className="mt-0.5 text-xs text-[#A1A1AA]">{c.phone}</p>
                </td>
                <td className="px-5 py-3.5">
                  <TenantStatusTag status={c.status} />
                </td>
                <td
                  className="px-5 py-3.5 text-right text-sm font-medium text-[#09090B]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {c.carrosseis}
                </td>
                <td className="px-5 py-3.5 text-right text-sm text-[#71717A]">
                  {c.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
