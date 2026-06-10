"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { transitions } from "@/lib/animations";
import { NAV_LINKS, WHATSAPP_URL } from "./landing-config";

const mobileItem = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const link of NAV_LINKS) {
      const el = document.getElementById(link.href.slice(1));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50" role="navigation" aria-label="Navegação principal">
      <div
        className={cn(
          "mx-auto flex items-center justify-between px-5 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6",
          scrolled
            ? "mt-3 max-w-4xl rounded-full border border-[#E4E4E7] bg-white/90 py-2 shadow-sm backdrop-blur-sm"
            : "max-w-6xl border border-transparent bg-transparent py-4"
        )}
      >
        <a href="#inicio" aria-label="AutomaWeb, voltar ao início">
          <Image
            src="/automaweb_logo_preta_horizontal.png"
            alt="AutomaWeb"
            width={1067}
            height={148}
            priority
            className="h-6 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]",
                active === link.href
                  ? "font-medium text-[#09090B]"
                  : "text-[#52525B] hover:text-[#09090B]"
              )}
            >
              {link.label}
              {active === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  transition={transitions.smooth}
                  className="absolute inset-x-3 -bottom-0.5 h-px bg-[#18181B]"
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition-colors duration-150 hover:bg-[#27272A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B] sm:inline-flex"
          >
            Agendar reunião
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#09090B] transition-colors hover:bg-[#F4F4F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B] md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FAFAFA] px-6 pt-16">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <motion.nav
                initial="hidden"
                animate={open ? "visible" : "hidden"}
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
                  },
                }}
                className="flex flex-col gap-1"
              >
                {NAV_LINKS.map((link) => (
                  <motion.div key={link.href} variants={mobileItem}>
                    <SheetClose
                      render={
                        <a
                          href={link.href}
                          className="block rounded-lg px-3 py-3 text-lg font-medium text-[#09090B] transition-colors hover:bg-[#F4F4F5]"
                        >
                          {link.label}
                        </a>
                      }
                    />
                  </motion.div>
                ))}
                <motion.div variants={mobileItem} className="mt-4">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg bg-[#18181B] px-4 py-3.5 text-center text-base font-medium text-[#FAFAFA] transition-colors hover:bg-[#27272A]"
                  >
                    Agendar reunião
                  </a>
                </motion.div>
              </motion.nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
