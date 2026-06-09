"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
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
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-[#E4E4E7] bg-white">
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
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
