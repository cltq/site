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
    name: "Birthday",
    href: "/birthday",
  },
];
