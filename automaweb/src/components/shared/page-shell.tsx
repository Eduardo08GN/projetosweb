"use client";

import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants.staggerContainer}
      transition={transitions.page}
    >
      {children}
    </motion.div>
  );
}
