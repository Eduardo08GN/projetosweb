"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <motion.div
      className="flex items-start justify-between pb-8"
      initial="hidden"
      animate="visible"
      variants={variants.fadeUp}
      transition={transitions.page}
    >
      <div>
        <h1 className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#09090B]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[#71717A]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </motion.div>
  );
}
