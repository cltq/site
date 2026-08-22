import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/proxy";
import { getApiUrl } from "@/lib/api-config";

export async function GET(request: NextRequest): Promise<Response> {
  return proxyGet(getApiUrl("health"), request);
}
