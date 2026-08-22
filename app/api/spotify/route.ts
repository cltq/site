import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/proxy";
import { getSpotifyUrl } from "@/lib/api-config";
import { fetchDiscordPresence } from "@/lib/discord/api";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const backup = searchParams.get("backup");

  // If backup mode is explicitly requested, use Discord API directly
  if (backup) {
    try {
      const presence = await fetchDiscordPresence();
      const spotify = presence.spotify ?? null;
      return Response.json({ spotify });
    } catch (error) {
      console.error("[spotify/backup] Error fetching Discord presence:", error);
      return Response.json(
        { error: "Failed to fetch Spotify backup from Discord API" },
        { status: 502 },
      );
    }
  }

  // Primary: try Spotify upstream first, fall back to Discord
  try {
    const res = await proxyGet(getSpotifyUrl("api/spotify"), request);
    const data = await res.json();
    return Response.json(data, { status: res.status, statusText: res.statusText });
  } catch (proxyError) {
    console.error("[spotify] Primary upstream failed, falling back to Discord:", proxyError);

    try {
      const presence = await fetchDiscordPresence();
      const spotify = presence.spotify ?? null;
      return Response.json({ spotify });
    } catch (discordError) {
      console.error("[spotify] Discord backup also failed:", discordError);
      return Response.json({ error: "Spotify API unavailable" }, { status: 502 });
    }
  }
}
