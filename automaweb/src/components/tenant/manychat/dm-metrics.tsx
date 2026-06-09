"use client";

import { motion } from "framer-motion";
import { variants } from "@/lib/animations";
import { MetricCard } from "@/components/master/dashboard/metric-card";
import { MessageCircle, Zap, UserPlus, TrendingUp } from "lucide-react";

type Props = {
  data: {
    totalMensagens: number;
    totalRespondidas: number;
    taxa: string;
    contatos: number;
    automacoesAtivas: number;
  };
};

export function DmMetrics({ data }: Props) {
  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      variants={variants.staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <MetricCard
        label="Total de mensagens"
        value={data.totalMensagens}
        icon={MessageCircle}
      />
      <MetricCard
        label="Respostas enviadas"
        value={data.totalRespondidas}
        icon={Zap}
        trendLabel={data.taxa}
      />
      <MetricCard
        label="Contatos captados"
        value={data.contatos}
        icon={UserPlus}
      />
      <MetricCard
        label="Automacoes ativas"
        value={data.automacoesAtivas}
        icon={TrendingUp}
      />
    </motion.div>
  );
}
