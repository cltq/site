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
  {
    name: "Redirect",
    href: "/redirect",
  },
];
