interface SpotifyTokenResponse {
	access_token?: string;
	expires_in?: number;
}

interface SpotifySearchResponse {
	tracks?: { items?: Array<{ album?: { images?: Array<{ url?: string }> } }> };
	artists?: { items?: Array<{ images?: Array<{ url?: string }> }> };
}

const TOKEN_CACHE_KEY = 'https://api.spotify.com/v1/token';

interface CacheLike {
	match(info: RequestInfo): Promise<Response | undefined>;
	put(request: RequestInfo, response: Response): Promise<void>;
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string | null> {
	try {
		const cache = 'caches' in globalThis ? (caches as unknown as { default?: CacheLike }).default : null;
		if (cache) {
			const cached = await cache.match(TOKEN_CACHE_KEY);
			if (cached) return await cached.text();
		}

		const basic = btoa(`${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${basic}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'grant_type=client_credentials',
			signal: controller.signal,
		});
		clearTimeout(timeout);

		if (!response.ok) return null;
		const data = (await response.json()) as SpotifyTokenResponse;
		if (!data.access_token) return null;

		if (cache) {
			const ttl = (data.expires_in ?? 3600) - 300;
			const cachedResponse = new Response(data.access_token, {
				headers: { 'Cache-Control': `public, max-age=${Math.max(ttl, 1)}` },
			});
			await cache.put(TOKEN_CACHE_KEY, cachedResponse);
		}
		return data.access_token;
	} catch {
		return null;
	}
}

/** Searches Spotify and returns the best cover/artist image URL from i.scdn.co, or null. */
export async function spotifySearch(
	query: string,
	type: 'track' | 'artist',
	clientId: string,
	clientSecret: string,
): Promise<string | null> {
	if (!query.trim()) return null;

	const token = await getAccessToken(clientId, clientSecret);
	if (!token) return null;

	try {
		const params = new URLSearchParams({ q: query, type, limit: '1' });
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
			headers: { Authorization: `Bearer ${token}` },
			signal: controller.signal,
		});
		clearTimeout(timeout);

		if (!response.ok) return null;
		const data = (await response.json()) as SpotifySearchResponse;

		if (type === 'track') {
			// Medium size (300x300) album art.
			return data.tracks?.items?.[0]?.album?.images?.[1]?.url ?? null;
		}
		const images = data.artists?.items?.[0]?.images ?? [];
		return images[0]?.url ?? images[images.length - 1]?.url ?? null;
	} catch {
		return null;
	}
}

type LastFmItemLike = {
	name: string;
	artist?: string | { name?: string; '#text'?: string };
	spotifyImage?: string;
};

/** Resolves and attaches Spotify CDN images to a list of Last.fm tracks or artists. */
export async function augmentSpotifyImages(
	items: LastFmItemLike[],
	type: 'track' | 'artist',
	clientId: string,
	clientSecret: string,
): Promise<void> {
	await Promise.allSettled(
		items.map(async (item) => {
			const artist =
				typeof item.artist === 'string' ? item.artist : (item.artist?.name ?? item.artist?.['#text'] ?? '');
			const query = type === 'track' ? `${item.name} ${artist}`.trim() : item.name;
			const url = await spotifySearch(query, type, clientId, clientSecret);
			if (url) item.spotifyImage = url;
		}),
	);
}