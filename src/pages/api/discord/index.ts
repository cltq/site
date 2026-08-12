import type { APIRoute } from "astro";
import { proxyGet } from "@/lib/proxy";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return proxyGet("https://api.applefumi.xyz/v2/discord/user/1/", request);
};
