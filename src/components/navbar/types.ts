import type { LucideIcon } from "lucide-react";

export interface NavbarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavbarProps {
  items: NavbarItem[];
}
