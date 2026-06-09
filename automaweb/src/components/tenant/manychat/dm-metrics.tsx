"use client";

import { motion } from "framer-motion";
import { variants } from "@/lib/animations";
import { MetricCard } from "@/components/master/dashboard/metric-card";
import { MessageCircle, Zap, UserPlus, TrendingUp } from "lucide-react";

export function DmMetrics() {
  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      variants={variants.staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <MetricCard
        label="Total de mensagens"
        value={303}
        icon={MessageCircle}
        trend="up"
        trendLabel="+24 hoje"
      />
      <MetricCard
        label="Respostas enviadas"
        value={289}
        icon={Zap}
        trend="up"
        trendLabel="95%"
      />
      <MetricCard
        label="Contatos captados"
        value={147}
        icon={UserPlus}
        trend="up"
        trendLabel="+12 esta semana"
      />
      <MetricCard
        label="Automações ativas"
        value={3}
        icon={TrendingUp}
      />
    </motion.div>
  );
}
