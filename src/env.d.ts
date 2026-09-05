declare global {
	namespace Cloudflare {
		interface Env {
			/** Set as a Cloudflare secret (not a plain var) so it isn't reset on deploy. */
			LASTFM_API_KEY?: string;
		}
	}
}

export {};