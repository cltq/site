"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

const visitedPages = new Set<string>();

export default function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFirstVisit = !visitedPages.has(pathname);

  useEffect(() => {
    visitedPages.add(pathname);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={isFirstVisit ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
