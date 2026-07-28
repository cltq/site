"use client";

import { usePathname } from "next/navigation";
import type { NavbarItem, NavbarProps } from "./types";
import { defaultNavItems } from "./nav-items";
import NavItem from "./NavItem";

export default function Navbar({ items = defaultNavItems }: Partial<NavbarProps> & { items?: NavbarItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop — fixed left, vertically centered */}
      <nav
        aria-label="Main navigation"
        className="fixed left-5 top-1/2 z-50 hidden -translate-y-1/2 md:block"
      >
        <div className="flex flex-col gap-1.5 rounded-[12px] border border-[#2B2B2B] bg-[#171717] p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
            />
          ))}
        </div>
      </nav>

      {/* Mobile — fixed bottom, horizontal */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:hidden"
      >
        <div className="flex gap-1.5 rounded-[12px] border border-[#2B2B2B] bg-[#171717] p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
            />
          ))}
        </div>
      </nav>
    </>
  );
}
