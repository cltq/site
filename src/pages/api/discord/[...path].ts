import type { APIRoute } from "astro";
import { proxyGet } from "@/lib/proxy";
import { getApiUrl } from "@/lib/api-config";

export const prerender = false;

export const GET: APIRoute = async ({ request, params }) => {
  const path = Array.isArray(params.path) ? params.path.join("/") : (params.path ?? "");
  return proxyGet(getApiUrl(`v2/discord/user/1/${path}`), request);
};
