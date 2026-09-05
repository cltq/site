declare global {
	namespace Cloudflare {
		interface Env {
			/** Set as a Cloudflare secret (not a plain var) so it isn't reset on deploy. */
			LASTFM_API_KEY?: string;
			/** Optional — used to resolve Spotify CDN cover art for the Last.fm widget. */
			SPOTIFY_CLIENT_ID?: string;
			SPOTIFY_CLIENT_SECRET?: string;
		}
	}
}

export {};