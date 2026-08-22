import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/proxy";
import { getApiUrl } from "@/lib/api-config";

interface CatchAllParams {
  params: Promise<{ path?: string[] }>;
}

export async function GET(request: NextRequest, { params }: CatchAllParams): Promise<Response> {
  const { path } = await params;
  const joined = Array.isArray(path) ? path.join("/") : (path ?? "");
  return proxyGet(getApiUrl(`v2/discord/user/1/${joined}`), request);
}
