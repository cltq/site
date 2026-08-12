import type { APIRoute } from "astro";
import { proxy } from "@/lib/proxy";
import { getApiUrl } from "@/lib/api-config";

export const prerender = false;

/**
 * Catch-all proxy route for API requests.
 * Forwards all HTTP methods to the upstream API.
 * 
 * This route is a fallback for requests not handled by specific API routes.
 * Specific routes (like /api/discord/[...path].ts, /api/spotify.ts) take precedence over this catch-all.
 * 
 * To change the upstream API, update the `base` value in src/lib/api-config.ts or set UPSTREAM_API env var.
 */

export const ALL: APIRoute = async ({ request, params }) => {
  const path = Array.isArray(params.path) ? params.path.join("/") : (params.path ?? "");
  const upstreamUrl = getApiUrl(path);

  return proxy(upstreamUrl, request);
};

// Explicitly export all HTTP methods to handle any method
export const GET = ALL;
export const POST = ALL;
export const PUT = ALL;
export const DELETE = ALL;
export const PATCH = ALL;
export const HEAD = ALL;
export const OPTIONS = ALL;
