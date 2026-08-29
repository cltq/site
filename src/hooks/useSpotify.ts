import { useCallback, useEffect, useRef, useState } from 'react';

export interface SpotifyData {
	song: string;
	artist: string;
	album?: string | null;
	albumArt: string | null;
	trackUrl: string;
}

function mapSpotify(raw: Record<string, any> | null): SpotifyData | null {
	if (!raw || raw.isPlaying === false) return null;
	const song: string | undefined = raw.song ?? raw.title;
	const artist: string | undefined = raw.artist;
	if (!song || !artist) return null;
	return {
		song,
		artist: artist.split(/[;,]/)[0].trim(),
		album: raw.album ?? null,
		albumArt:
			raw.albumImageUrl ?? raw.album_art_url ?? raw.albumArtUrl ?? raw.albumImageUrl ?? raw.cover ?? null,
		trackUrl:
			raw.trackUrl ??
			raw.track_url ??
			(raw.track_id ? `https://open.spotify.com/track/${raw.track_id}` : '#'),
	};
}

export function useSpotify(pollInterval = 30000, enabled = true) {
	const [spotify, setSpotify] = useState<SpotifyData | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const lastRequestTime = useRef(0);

	const load = useCallback(async (signal?: AbortSignal) => {
		const now = Date.now();
		if (now - lastRequestTime.current < 2000) return;
		lastRequestTime.current = now;

		try {
			const res = await fetch('/api/spotify', { signal });
			const json = await res.json();
			if (!signal?.aborted) {
				setSpotify(mapSpotify(json ?? null));
				setError(null);
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') return;
			if (!signal?.aborted) {
				setError(err instanceof Error ? err : new Error(String(err)));
			}
		}
	}, []);

	useEffect(() => {
		if (!enabled) {
			setSpotify(null);
			setError(null);
			return;
		}

		const controller = new AbortController();

		load(controller.signal);
		pollRef.current = setInterval(() => {
			if (!controller.signal.aborted) load(controller.signal);
		}, pollInterval);

		const handleVisibility = () => {
			if (document.hidden) {
				if (pollRef.current) clearInterval(pollRef.current);
				pollRef.current = null;
			} else if (!pollRef.current) {
				load(controller.signal);
				pollRef.current = setInterval(() => {
					if (!controller.signal.aborted) load(controller.signal);
				}, pollInterval);
			}
		};
		document.addEventListener('visibilitychange', handleVisibility);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibility);
			if (pollRef.current) clearInterval(pollRef.current);
			pollRef.current = null;
			controller.abort();
		};
	}, [enabled, pollInterval, load]);

	return { spotify, error };
}
