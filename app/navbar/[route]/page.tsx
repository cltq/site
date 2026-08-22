import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appRoutes } from "@/lib/routes";

interface RoutePageProps {
  params: Promise<{ route: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return appRoutes.filter((r) => r.href !== "/").map((r) => ({ route: r.href.replace("/", "") }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { route } = await params;
  const matched = appRoutes.find((r) => r.href === `/${route}`);
  return {
    title: matched ? `${matched.name.toLowerCase()} - maple` : "maple",
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { route } = await params;
  const matched = appRoutes.find((r) => r.href === `/${route}`);

  if (!matched) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-white">
        {matched.name.toLowerCase()}
      </h1>
      {matched.description && <p className="text-[#d4d4d4]">{matched.description}</p>}
    </main>
  );
}
