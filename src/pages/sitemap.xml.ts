import { appRoutes } from "@/lib/routes";

export const prerender = true;

const domains = ["https://applefumi.xyz", "https://w.vreni.xyz"];

export async function GET() {
  const entries: string[] = [];

  for (const domain of domains) {
    for (const route of appRoutes) {
      entries.push(
        `<url><loc>${domain}${route.href}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>${route.href === "/" ? 1 : 0.8}</priority></url>`,
      );
    }
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`,
    {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    },
  );
}
