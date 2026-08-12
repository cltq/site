import { proxyGet } from "@/lib/proxy";
import { getSpotifyUrl } from "@/lib/api-config";
import { fetchDiscordPresence } from "@/lib/discord/api";

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  const { searchParams } = new URL(request.url);
  const backup = searchParams.get("backup");

  if (backup) {
    try {
      const presence = await fetchDiscordPresence();
      const spotify = presence.spotify ?? null;
      return new Response(
        JSON.stringify({ spotify }),
        {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("[spotify/backup] Error fetching Discord presence:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch Spotify backup from Discord API" }),
        {
          status: 502,
          statusText: "Bad Gateway",
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return proxyGet(getSpotifyUrl("api/spotify"), request);
}
