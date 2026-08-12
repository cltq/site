import type { APIRoute } from "astro";
import { proxy } from "@/lib/proxy";
import { getLanyardUrl } from "@/lib/api-config";

export const prerender = false;

/**
 * Lanyard API proxy route - Discord presence backup
 * 
 * Lanyard provides real-time Discord presence data via REST API.
 * Use this as a backup when your primary Discord API is unavailable.
 * 
 * Example:
 *   GET /api/lanyard/v1/users/{discord_user_id}
 *   -> https://api.lanyard.rest/v1/users/{discord_user_id}
 * 
 * Response includes Discord presence, activities, Spotify, and more.
 */

export const ALL: APIRoute = async ({ request, params }) => {
  const path = Array.isArray(params.path) ? params.path.join("/") : (params.path ?? "");
  const upstreamUrl = getLanyardUrl(path);

  return proxy(upstreamUrl, request);
};

// Explicitly export all HTTP methods
export const GET = ALL;
export const POST = ALL;
export const PUT = ALL;
export const DELETE = ALL;
export const PATCH = ALL;
export const HEAD = ALL;
export const OPTIONS = ALL;
