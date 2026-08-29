import { useEffect, useState } from 'react';

export interface SpotifyData {
	song: string;
	artist: string;
	album?: string | null;
	albumArt: string | null;
	trackUrl: string;
}

function cleanSongTitle(title: string): string {
	return title
		.replace(/\[[^\]]*\]/g, ' ')
		.replace(/\([^)]*(?:feat|ft\.?|featuring)[^)]*\)/gi, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

function mapSpotify(raw: Record<string, any> | null): SpotifyData | null {
	if (!raw || raw.isPlaying === false) return null;
	const song: string | undefined = raw.song ?? raw.title;
	const artist: string | undefined = raw.artist;
	if (!song || !artist) return null;
	return {
		song: cleanSongTitle(song),
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

const POLL_INTERVAL = 2000;

type Listener = () => void;

const listeners = new Set<Listener>();
let sharedData: SpotifyData | null = null;
let sharedError: Error | null = null;
let controller: AbortController | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;
let lastRequestTime = 0;

function notify() {
	for (const listener of listeners) listener();
}

async function load(active: AbortController, pollInterval: number) {
	const now = Date.now();
	if (now - lastRequestTime < pollInterval) return;
	lastRequestTime = now;

	try {
		const res = await fetch('/api/spotify', { signal: active.signal });
		const json = await res.json();
		if (!active.signal.aborted) {
			sharedData = mapSpotify(json ?? null);
			sharedError = null;
			notify();
		}
	} catch (err) {
		if (err instanceof DOMException && err.name === 'AbortError') return;
		if (!active.signal.aborted) {
			sharedError = err instanceof Error ? err : new Error(String(err));
			notify();
		}
	}
}

function startPolling(pollInterval = POLL_INTERVAL) {
	if (intervalId) return;
	lastRequestTime = 0;
	controller = new AbortController();
	load(controller, pollInterval);
	intervalId = setInterval(() => load(controller!, pollInterval), pollInterval);
}

function stopPolling() {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
	lastRequestTime = 0;
	controller?.abort();
	controller = null;
}

export function useSpotify(pollInterval = POLL_INTERVAL, enabled = true) {
	const [, setVersion] = useState(0);

	useEffect(() => {
		if (!enabled) return;
		const listener = () => setVersion((v) => v + 1);
		listeners.add(listener);
		startPolling(pollInterval);
		return () => {
			listeners.delete(listener);
			if (listeners.size === 0) stopPolling();
		};
	}, [enabled, pollInterval]);

	return { spotify: sharedData, error: sharedError };
}