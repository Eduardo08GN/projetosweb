"use client";

import { motion } from "framer-motion";
import { Users, Layers, CalendarCheck, MessageCircle } from "lucide-react";
import { variants } from "@/lib/animations";
import { MetricCard } from "./metric-card";

type Props = {
  data: {
    clientesAtivos: number;
    emProducao: number;
    agendados: number;
    automacoesAtivas: number;
  };
};

export function MasterMetrics({ data }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
      initial="hidden"
      animate="visible"
      variants={variants.staggerContainer}
    >
      <MetricCard
        label="Clientes ativos"
        value={data.clientesAtivos}
        icon={Users}
      />
      <MetricCard
        label="Carrosseis em producao"
        value={data.emProducao}
        icon={Layers}
      />
      <MetricCard label="Posts agendados" value={data.agendados} icon={CalendarCheck} />
      <MetricCard
        label="Automacoes ativas"
        value={data.automacoesAtivas}
        icon={MessageCircle}
      />
    </motion.div>
  );
}
