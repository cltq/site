"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NavbarItem } from "./types";

interface NavItemProps {
  item: NavbarItem;
  isActive: boolean;
  pillId: string;
}

export default function NavItem({ item, isActive, pillId }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      prefetch={true}
      aria-label={item.label}
      title={item.label}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      {isActive && (
        <motion.span
          layoutId={pillId}
          className="absolute inset-0 rounded-lg bg-white"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
          transition={{ type: "spring", stiffness: 450, damping: 32, mass: 0.7 }}
        />
      )}

      <motion.span
        className="relative z-10 flex h-full w-full items-center justify-center"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <Icon
          size={16}
          strokeWidth={2}
          style={{
            color: isActive ? "#111111" : "#8E8E93",
            opacity: isActive ? 1 : 0.65,
            transition: "color 0.22s ease-out, opacity 0.22s ease-out",
          }}
        />
      </motion.span>
    </Link>
  );
}
