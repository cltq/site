import type { APIRoute } from "astro";
import { proxyWithFallback } from "@/lib/proxy";
import { getApiUrl, getLanyardUrl } from "@/lib/api-config";

export const prerender = false;

/**
 * Discord API with Lanyard fallback
 * 
 * This route tries your primary Discord API first, and falls back to Lanyard if it fails.
 * Useful for ensuring Discord presence is always available even if your primary API is down.
 * 
 * Example:
 *   GET /api/discord-fallback/v1/users/123456
 *   1. Try: https://api.mapleji.xyz/v2/discord/user/1/v1/users/123456
 *   2. If that fails, try: https://api.lanyard.rest/v1/users/123456
 * 
 * Note: For Lanyard, the path structure is slightly different.
 * You may want to use this endpoint only for specific paths.
 */

export const ALL: APIRoute = async ({ request, params }) => {
  const path = Array.isArray(params.path) ? params.path.join("/") : (params.path ?? "");
  
  // Try primary API first, then Lanyard as fallback
  const upstreams = [
    getApiUrl(`v2/discord/user/1/${path}`),
    getLanyardUrl(path),
  ];

  return proxyWithFallback(upstreams, request);
};

// Explicitly export all HTTP methods
export const GET = ALL;
export const POST = ALL;
export const PUT = ALL;
export const DELETE = ALL;
export const PATCH = ALL;
export const HEAD = ALL;
export const OPTIONS = ALL;
