import type { APIRoute } from "astro";

export const prerender = false;

const LASTFM_API = "https://ws.audioscrobbler.com/2.0/";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 30 * 60 * 1000;

function cacheGet(key: string) {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  cache.delete(key);
  return null;
}

function cacheSet(key: string, data: unknown) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

function lastfmUrl(method: string, apiKey: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ method, api_key: apiKey, format: "json", ...extra });
  return `${LASTFM_API}?${params}`;
}

function isAlbumPlaceholder(url: string) {
  return url.includes("2a96cbd8b46e442fc41c2b86b821562f") || !url;
}

function filterImages(images: { "#text"?: string }[]) {
  return images.filter((i) => i["#text"] && !isAlbumPlaceholder(i["#text"]));
}

async function fetchItunesArtwork(artist: string, track: string): Promise<string | null> {
  try {
    const term = encodeURIComponent(`${artist} ${track}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&limit=1`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const artwork = data.results?.[0]?.artworkUrl100;
    if (!artwork) return null;
    return artwork.replace("100x100", "600x600");
  } catch {
    return null;
  }
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const GET: APIRoute = async ({ url }) => {
  const searchParams = url.searchParams;
  const headers = { "Content-Type": "application/json", ...corsHeaders };

  if (searchParams.has("img")) {
    const imgUrl = searchParams.get("img")!;
    const cached = cacheGet(`img:${imgUrl}`) as { buffer: ArrayBuffer; type: string } | null;
    if (cached) {
      return new Response(cached.buffer, {
        headers: {
          "Content-Type": cached.type,
          "Cache-Control": "public, max-age=86400",
          ...corsHeaders,
        },
      });
    }
    try {
      const res = await fetch(imgUrl);
      if (!res.ok) return new Response(null, { status: 404, headers: corsHeaders });
      const contentType = res.headers.get("Content-Type") || "image/jpeg";
      const buffer = await res.arrayBuffer();
      cacheSet(`img:${imgUrl}`, { buffer, type: contentType });
      return new Response(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
          ...corsHeaders,
        },
      });
    } catch {
      return new Response(null, { status: 404, headers: corsHeaders });
    }
  }

  const apiKey = import.meta.env.LASTFM_API_KEY as string | undefined;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Last.fm API key not configured" }), {
      status: 500,
      headers,
    });
  }

  const user = import.meta.env.LASTFM_USER as string | undefined;
  if (!user) {
    return new Response(JSON.stringify({ error: "Last.fm user not configured" }), {
      status: 500,
      headers,
    });
  }

  const method = searchParams.get("method") || "user.gettoptracks";
  const period = searchParams.get("period") || "1month";
  const limit = Number(searchParams.get("limit")) || 5;

  const cacheKey = `${method}:${period}:${limit}`;
  const cached = cacheGet(cacheKey);
  if (cached) return new Response(JSON.stringify(cached), { headers });

  const dataUrl = lastfmUrl(method, apiKey, { user, period, limit: String(limit) });

  try {
    const res = await fetch(dataUrl);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Last.fm API error" }), {
        status: res.status,
        headers,
      });
    }
    const data = (await res.json()) as any;

    if (method === "user.gettoptracks" && data.toptracks?.track) {
      const enriched = await Promise.all(
        data.toptracks.track.map(async (track: any) => {
          const originalImages = filterImages(track.image || []);

          try {
            const infoRes = await fetch(
              lastfmUrl("track.getInfo", apiKey, {
                artist: track.artist.name,
                track: track.name,
                user,
              }),
            );
            if (infoRes.ok) {
              const info = await infoRes.json();
              const album = info.track?.album;
              if (album?.image) {
                const realImages = filterImages(album.image);
                if (realImages.length > 0) {
                  return { ...track, image: realImages };
                }
              }
            }
          } catch {}

          if (originalImages.length === 0) {
            const artwork = await fetchItunesArtwork(track.artist.name, track.name);
            if (artwork) {
              return { ...track, image: [{ "#text": artwork, size: "extralarge" }] };
            }
          }

          return { ...track, image: originalImages };
        }),
      );
      data.toptracks.track = enriched;
    }

    if (method === "user.gettopartists" && data.topartists?.artist) {
      const enriched = await Promise.all(
        data.topartists.artist.map(async (artist: any) => {
          const originalImages = filterImages(artist.image || []);
          try {
            const infoRes = await fetch(
              lastfmUrl("artist.getInfo", apiKey, { artist: artist.name, user }),
            );
            if (infoRes.ok) {
              const info = await infoRes.json();
              const artistInfo = info.artist;
              if (artistInfo?.image) {
                const realImages = filterImages(artistInfo.image);
                if (realImages.length > 0) {
                  return { ...artist, image: realImages };
                }
              }
            }
          } catch {}
          return { ...artist, image: originalImages };
        }),
      );
      data.topartists.artist = enriched;
    }

    cacheSet(cacheKey, data);
    return new Response(JSON.stringify(data), { headers });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch from Last.fm" }), {
      status: 500,
      headers,
    });
  }
};
