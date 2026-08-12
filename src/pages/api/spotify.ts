import { proxyGet } from "@/lib/proxy";
import { getSpotifyUrl } from "@/lib/api-config";
import { fetchDiscordPresence } from "@/lib/discord/api";

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  const { searchParams } = new URL(request.url);
  const backup = searchParams.get("backup");

  // If backup mode is explicitly requested, use Discord API directly
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

  // Primary: try Spotify upstream first, fall back to Discord
  try {
    const res = await proxyGet(getSpotifyUrl("api/spotify"), request);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      statusText: res.statusText,
      headers: { "Content-Type": "application/json" },
    });
  } catch (proxyError) {
    console.error("[spotify] Primary upstream failed, falling back to Discord:", proxyError);

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
    } catch (discordError) {
      console.error("[spotify] Discord backup also failed:", discordError);
      return new Response(
        JSON.stringify({ error: "Spotify API unavailable" }),
        {
          status: 502,
          statusText: "Bad Gateway",
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
