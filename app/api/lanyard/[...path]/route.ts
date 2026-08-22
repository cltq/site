import type { NextRequest } from "next/server";
import { proxy } from "@/lib/proxy";
import { getLanyardUrl } from "@/lib/api-config";

/**
 * Lanyard API proxy route - Discord presence backup
 *
 * Example:
 *   GET /api/lanyard/v1/users/{discord_user_id}
 *   -> https://api.lanyard.rest/v1/users/{discord_user_id}
 */

interface CatchAllParams {
  params: Promise<{ path?: string[] }>;
}

async function handler(request: NextRequest, { params }: CatchAllParams): Promise<Response> {
  const { path } = await params;
  const joined = Array.isArray(path) ? path.join("/") : (path ?? "");
  const upstreamUrl = getLanyardUrl(joined);

  return proxy(upstreamUrl, request);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
