export interface AppRoute {
  name: string;
  href: string;
  description?: string;
}

export const appRoutes: AppRoute[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Bio",
    href: "/bio",
  },
  {
    name: "Development",
    href: "/development",
  },
  {
    name: "Project",
    href: "/project",
  },
  {
    name: "Birthday",
    href: "/birthday",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];
