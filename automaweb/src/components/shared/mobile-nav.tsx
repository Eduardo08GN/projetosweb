"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth-actions";
import type { NavItem } from "./app-sidebar";

/* Navegacao mobile: header fino no topo + barra de abas fixa embaixo,
   padrao de aplicativo. So existe abaixo de lg; no desktop a sidebar
   continua exatamente igual. */

export function MobileHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#E4E4E7] bg-white px-4 lg:hidden">
      <Image
        src="/automaweb_logo_preta_horizontal.png"
        alt="AutomaWeb"
        width={118}
        height={24}
        priority
      />
      <button
        onClick={() => logout()}
        title="Sair"
        className="rounded-lg p-2 text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
      >
        <LogOut size={18} strokeWidth={1.5} />
      </button>
    </header>
  );
}

export function MobileTabBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E4E4E7] bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      style={{ boxShadow: "0 -1px 2px rgba(0,0,0,0.04)" }}
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/master" &&
              item.href !== "/tenant" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-150",
                active ? "text-[#09090B]" : "text-[#A1A1AA]"
              )}
            >
              <span className="relative">
                <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
                {item.badge && (
                  <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
