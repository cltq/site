import { Home, Music, Code, Cake } from "lucide-react";
import type { NavbarItem } from "./types";

export const defaultNavItems: NavbarItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Music", href: "/music", icon: Music },
  { label: "Development", href: "/development", icon: Code },
  { label: "Birthday", href: "/birthday", icon: Cake },
];
