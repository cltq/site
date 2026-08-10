import type { APIRoute } from "astro";

export const prerender = false;

const links: Record<string, string> = {
  github: "https://github.com/cltq",
  discord: "https://discord.com/users/969088519161139270",
  haunt: "https://haunt.gg/fumi",
  easydonate: "https://easydonate.com/ivnfumi",
  instagram: "https://www.instagram.com/lnfumi._",
};

export const GET: APIRoute = async ({ params }) => {
  const name = params.name ?? "";
  const url = links[name.toLowerCase()];

  if (!url) {
    return new Response(JSON.stringify({ error: "Unknown link" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: url },
  });
};
