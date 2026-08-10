import { proxyGet } from "@/lib/proxy";

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  return proxyGet("https://api.applefumi.xyz/health", request);
}
