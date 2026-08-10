import type { APIRoute } from "astro";
import { fetchContributions } from "@/lib/github/contributions";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const username = url.searchParams.get("username");
  if (!username) {
    return new Response(JSON.stringify({ error: "username required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const data = await fetchContributions(username);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch contributions" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
