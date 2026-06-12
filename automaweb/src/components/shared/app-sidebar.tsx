"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth-actions";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export function AppSidebar({
  items,
  logo,
}: {
  items: NavItem[];
  logo?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-[#E4E4E7] bg-white lg:flex">
      <div className="flex h-16 items-center px-5">
        {logo ?? (
          <Image
            src="/automaweb_logo_preta_horizontal.png"
            alt="AutomaWeb"
            width={140}
            height={28}
            priority
          />
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                active
                  ? "bg-[#F4F4F5] font-medium text-[#09090B]"
                  : "font-normal text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#09090B]"
              )}
            >
              <item.icon size={18} strokeWidth={1.5} />
              {item.label}
              {item.badge && (
                <span className="ml-auto rounded-md bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-semibold text-[#92400E]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E4E4E7] px-3 py-3">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-normal text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Sair
        </button>
      </div>
    </aside>
  );
}
