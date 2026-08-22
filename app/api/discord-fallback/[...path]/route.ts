import type { NextRequest } from "next/server";
import { proxyWithFallback } from "@/lib/proxy";
import { getApiUrl, getLanyardUrl } from "@/lib/api-config";

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
 */

interface CatchAllParams {
  params: Promise<{ path?: string[] }>;
}

async function handler(request: NextRequest, { params }: CatchAllParams): Promise<Response> {
  const { path } = await params;
  const joined = Array.isArray(path) ? path.join("/") : (path ?? "");

  // Try primary API first, then Lanyard as fallback
  const upstreams = [getApiUrl(`v2/discord/user/1/${joined}`), getLanyardUrl(joined)];

  return proxyWithFallback(upstreams, request);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
