"use client";

import { motion } from "framer-motion";
import type { NavbarItem } from "./types";

interface NavItemProps {
  item: NavbarItem;
  isActive: boolean;
}

export default function NavItem({ item, isActive }: NavItemProps) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      aria-label={item.label}
      title={item.label}
      className="relative flex h-[36px] w-[36px] items-center justify-center rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
    >
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-[7px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}

      <motion.span
        className="relative z-10 flex items-center justify-center"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon
          size={18}
          strokeWidth={2}
          className={isActive ? "text-[#111111]" : "text-[#8E8E93]"}
          style={{ transition: "color 200ms ease" }}
        />
      </motion.span>
    </a>
  );
}
