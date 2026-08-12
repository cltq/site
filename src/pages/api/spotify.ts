import { proxyGet } from "@/lib/proxy";
import { getSpotifyUrl } from "@/lib/api-config";

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  return proxyGet(getSpotifyUrl("api/spotify"), request);
}
