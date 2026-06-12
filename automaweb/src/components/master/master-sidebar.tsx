"use client";

import {
  LayoutDashboard,
  Columns3,
  Users,
  Calendar,
  Globe,
} from "lucide-react";
import { AppSidebar, type NavItem } from "@/components/shared/app-sidebar";
import { MobileTabBar } from "@/components/shared/mobile-nav";

const masterNav: NavItem[] = [
  { label: "Inicio", href: "/master", icon: LayoutDashboard },
  { label: "Producao", href: "/master/pipeline", icon: Columns3 },
  { label: "Clientes", href: "/master/clientes", icon: Users },
  { label: "Calendário", href: "/master/calendario", icon: Calendar },
  { label: "Sites", href: "/master/sites", icon: Globe },
];

export function MasterSidebar() {
  return <AppSidebar items={masterNav} />;
}

export function MasterMobileNav() {
  return <MobileTabBar items={masterNav} />;
}
