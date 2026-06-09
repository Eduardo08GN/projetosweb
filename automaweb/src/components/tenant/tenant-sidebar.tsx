"use client";

import {
  LayoutDashboard,
  Layers,
  MessageCircle,
  Plug,
  UserCircle,
} from "lucide-react";
import { AppSidebar, type NavItem } from "@/components/shared/app-sidebar";

const tenantNav: NavItem[] = [
  { label: "Dashboard", href: "/tenant", icon: LayoutDashboard },
  { label: "Carrossel", href: "/tenant/carrossel", icon: Layers },
  { label: "Manychat", href: "/tenant/manychat", icon: MessageCircle },
  { label: "Integrações", href: "/tenant/integracoes", icon: Plug },
  { label: "Minha conta", href: "/tenant/conta", icon: UserCircle },
];

export function TenantSidebar() {
  return <AppSidebar items={tenantNav} />;
}
