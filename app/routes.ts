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
  // {
  //   name: "Music",
  //   href: "/music",
  // },
  // {
  //   name: "BD",
  //   href: "/bd",
  // },
];

export interface HomeSection {
  id: string;
  name: string;
}

export const homeSections: HomeSection[] = [
  { id: "root", name: "Home" },
  { id: "development", name: "Development" },
];
