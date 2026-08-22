import type { NextRequest } from "next/server";
import { proxy } from "@/lib/proxy";
import { getApiUrl } from "@/lib/api-config";

/**
 * Catch-all proxy route for API requests.
 * Forwards all HTTP methods to the upstream API.
 *
 * This route is a fallback for requests not handled by specific API routes.
 * Specific routes (like /api/discord/[...path], /api/spotify) take precedence over this catch-all.
 *
 * To change the upstream API, update the `base` value in src/lib/api-config.ts or set UPSTREAM_API env var.
 */

interface CatchAllParams {
  params: Promise<{ path?: string[] }>;
}

async function handler(request: NextRequest, { params }: CatchAllParams): Promise<Response> {
  const { path } = await params;
  const joined = Array.isArray(path) ? path.join("/") : (path ?? "");
  const upstreamUrl = getApiUrl(joined);

  return proxy(upstreamUrl, request);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
