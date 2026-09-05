import { useEffect, useState } from 'react';
import {
	lastfmImage,
	lastfmNowPlaying,
	type LastFmRecentTracksResponse,
	type LastFmTrack,
} from '../lib/integrations';

interface LastFmRecentTracksProps {
	endpoint?: string;
	trackCount?: number;
	refreshIntervalMs?: number;
}

function TrackRow({ track }: { track: LastFmTrack }) {
	const nowPlaying = lastfmNowPlaying(track);

	return (
		<a
			href={track.url}
			target="_blank"
			rel="noreferrer"
			className="flex items-center gap-3 py-2 text-zinc-200 no-underline transition hover:bg-zinc-800/50"
		>
			{track.image?.length ? (
				<img
					src={lastfmImage(track.image, 'small')}
					alt=""
					width={36}
					height={36}
					className="h-9 w-9 shrink-0 rounded object-cover"
				/>
			) : (
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-500">
					{track.name.charAt(0)}
				</div>
			)}
			<div className="min-w-0 flex-1">
				<p
					className={`truncate text-xs font-semibold ${nowPlaying ? 'text-red-400' : 'text-zinc-200'}`}
				>
					{nowPlaying ? '▶ ' : ''}
					{track.name}
				</p>
				<p className="truncate text-[11px] text-zinc-500">
					{track.artist['#text']}
					{track.album?.['#text'] ? ` — ${track.album['#text']}` : ''}
				</p>
			</div>
		</a>
	);
}

export default function LastFmRecentTracks({
	endpoint = '/api/lastfm',
	trackCount = 10,
	refreshIntervalMs = 60_000,
}: LastFmRecentTracksProps) {
	const [data, setData] = useState<LastFmRecentTracksResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const response = await fetch(`${endpoint}?limit=${trackCount}`);
				if (!response.ok) {
					const body = (await response.json().catch(() => null)) as { error?: string } | null;
					throw new Error(body?.error ?? `Request failed with ${response.status}`);
				}
				const json = (await response.json()) as LastFmRecentTracksResponse | { error: string };
				if (cancelled) return;

				if ('error' in json) {
					setError(json.error?.toString() ?? 'Last.fm returned an error');
				} else {
					setData(json);
					setError(null);
				}
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : 'Failed to load Last.fm data');
			}
		}

		void load();
		const timer = setInterval(() => void load(), refreshIntervalMs);

		return () => {
			cancelled = true;
			clearInterval(timer);
		};
	}, [endpoint, trackCount, refreshIntervalMs]);

	if (error) {
		return (
			<div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
				<span className="font-semibold text-zinc-500">Last.fm</span>
				<p className="mt-1">Unable to load: {error}</p>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
				<span className="font-semibold text-zinc-500">Last.fm</span>
				<p className="mt-1">Loading recent tracks…</p>
			</div>
		);
	}

	const tracks = Array.isArray(data.recenttracks.track)
		? data.recenttracks.track
		: [data.recenttracks.track].filter(Boolean);

	return (
		<div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
					Last.fm — Recent Tracks
				</h3>
				<span className="text-[11px] text-zinc-600">@{data.recenttracks['@attr'].user}</span>
			</div>
			<div className="mt-2 divide-y divide-zinc-800/70">
				{tracks.map((track, index) => (
					<TrackRow key={track.url + track.date?.uts + index} track={track} />
				))}
			</div>
		</div>
	);
}