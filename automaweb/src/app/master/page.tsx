"use client";

import { motion } from "framer-motion";
import { Users, Layers, CalendarCheck, MessageCircle } from "lucide-react";
import { variants, transitions } from "@/lib/animations";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/master/dashboard/metric-card";
import { RecentActivity } from "@/components/master/dashboard/recent-activity";
import { UpcomingPosts } from "@/components/master/dashboard/upcoming-posts";

export default function MasterDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral da operação"
      />

      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={variants.staggerContainer}
      >
        <MetricCard
          label="Clientes ativos"
          value={5}
          icon={Users}
          trend="up"
          trendLabel="+2 este mês"
        />
        <MetricCard
          label="Carrosséis em produção"
          value={8}
          icon={Layers}
          trend="up"
          trendLabel="+3"
        />
        <MetricCard
          label="Posts agendados"
          value={12}
          icon={CalendarCheck}
        />
        <MetricCard
          label="Automações ativas"
          value={4}
          icon={MessageCircle}
          trend="up"
          trendLabel="+1"
        />
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={variants.staggerContainer}
      >
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <UpcomingPosts />
        </div>
      </motion.div>
    </div>
  );
}
