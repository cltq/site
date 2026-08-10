import { proxyGet } from "@/lib/proxy";

export async function GET({ request }: { request: Request }) {
  return proxyGet("https://api.applefumi.xyz/v2/discord/user/1/", request);
}
