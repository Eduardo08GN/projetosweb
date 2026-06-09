"use client";

import { motion } from "framer-motion";
import { variants } from "@/lib/animations";
import { MetricCard } from "@/components/master/dashboard/metric-card";
import { Layers, CheckCircle2, Clock, CalendarCheck } from "lucide-react";

type Props = {
  data: {
    total: number;
    publicados: number;
    emProducao: number;
    agendados: number;
  };
};

export function TenantMetrics({ data }: Props) {
  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      variants={variants.staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <MetricCard
        label="Total de carrosseis"
        value={data.total}
        icon={Layers}
      />
      <MetricCard
        label="Publicados"
        value={data.publicados}
        icon={CheckCircle2}
      />
      <MetricCard
        label="Em producao"
        value={data.emProducao}
        icon={Clock}
      />
      <MetricCard
        label="Agendados"
        value={data.agendados}
        icon={CalendarCheck}
      />
    </motion.div>
  );
}
