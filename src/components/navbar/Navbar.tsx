"use client";

import { usePathname } from "@/hooks/usePathname";
import type { NavbarItem, NavbarProps } from "./types";
import { defaultNavItems } from "./nav-items";
import NavItem from "./NavItem";

export default function Navbar({
  items = defaultNavItems,
}: Partial<NavbarProps> & { items?: NavbarItem[] }) {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const containerStyle = {
    background: "rgba(18,8,30,0.8)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  } as React.CSSProperties;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex gap-0.5 rounded-xl p-1.5" style={containerStyle}>
        {items.map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} pillId="nav-pill" />
        ))}
      </div>
    </nav>
  );
}
