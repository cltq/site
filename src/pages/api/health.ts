import { proxyGet } from "@/lib/proxy";
import { getApiUrl } from "@/lib/api-config";

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  return proxyGet(getApiUrl("health"), request);
}
