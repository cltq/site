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
    background: "rgba(20,20,20,0.8)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  } as React.CSSProperties;

  return (
    <>
      {/* Desktop — fixed left, vertically centered */}
      <nav
        aria-label="Main navigation"
        className="fixed top-1/2 left-5 z-50 hidden -translate-y-1/2 md:block"
      >
        <div className="flex flex-col gap-0.5 rounded-xl p-1.5" style={containerStyle}>
          {items.map((item) => (
            <NavItem key={item.href} item={item} isActive={isActive(item.href)} pillId="nav-pill" />
          ))}
        </div>
      </nav>

      {/* Mobile — fixed bottom, horizontal */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:hidden"
      >
        <div className="flex gap-0.5 rounded-xl p-1.5" style={containerStyle}>
          {items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              pillId="nav-pill-mobile"
            />
          ))}
        </div>
      </nav>
    </>
  );
}
