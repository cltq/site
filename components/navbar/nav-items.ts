import { Home, Music, Code, Cake, Folder, Link } from "lucide-react";
import type { NavbarItem } from "./types";

export const defaultNavItems: NavbarItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Bio", href: "/bio", icon: Link },
  { label: "Music", href: "/music", icon: Music },
  { label: "Development", href: "/development", icon: Code },
  { label: "Project", href: "/project", icon: Folder },
  { label: "Birthday", href: "/birthday", icon: Cake },
];
