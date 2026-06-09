"use client";

import { motion } from "framer-motion";
import { variants } from "@/lib/animations";
import { MetricCard } from "@/components/master/dashboard/metric-card";
import { Layers, CheckCircle2, Clock, CalendarCheck } from "lucide-react";

export function TenantMetrics() {
  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      variants={variants.staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <MetricCard
        label="Total de carrosséis"
        value={24}
        icon={Layers}
        trend="up"
        trendLabel="+3 este mês"
      />
      <MetricCard
        label="Publicados"
        value={18}
        icon={CheckCircle2}
        trend="up"
        trendLabel="+2 esta semana"
      />
      <MetricCard
        label="Em produção"
        value={4}
        icon={Clock}
      />
      <MetricCard
        label="Agendados"
        value={2}
        icon={CalendarCheck}
      />
    </motion.div>
  );
}
