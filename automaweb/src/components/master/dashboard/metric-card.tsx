"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  suffix,
  icon: Icon,
  trend,
  trendLabel,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendLabel?: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;

    const duration = 600;
    const steps = 30;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setDisplayed(Math.round(eased * value));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      className="cursor-default rounded-xl border border-[#E4E4E7] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      transition={transitions.smooth}
      whileHover={{
        y: -3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        transition: { type: "spring", stiffness: 400, damping: 20 },
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.01em] text-[#71717A]">
          {label}
        </span>
        <Icon size={18} strokeWidth={1.5} className="text-[#A1A1AA]" />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <span
            className="text-3xl font-bold tracking-[-0.02em] text-[#09090B]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {displayed}
          </span>
          {suffix && (
            <span className="ml-1 text-sm font-medium text-[#71717A]">
              {suffix}
            </span>
          )}
        </div>
        {trend && trendLabel && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend === "up" ? "text-[#16A34A]" : "text-[#DC2626]"
            }`}
          >
            {trend === "up" ? (
              <ArrowUp size={12} strokeWidth={2} />
            ) : (
              <ArrowDown size={12} strokeWidth={2} />
            )}
            {trendLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}
