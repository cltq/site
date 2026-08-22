import { Home, Music, Code, Cake, Folder, Mail } from "lucide-react";
import type { NavbarItem } from "./types";

export const defaultNavItems: NavbarItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Music", href: "/music", icon: Music },
  { label: "Contact", href: "/contact", icon: Mail },
];
