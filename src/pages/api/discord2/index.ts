import type { APIRoute } from "astro";
import { proxyGet } from "@/lib/proxy";
import { getApiUrl } from "@/lib/api-config";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return proxyGet(getApiUrl("v2/discord/user/2/"), request);
};
