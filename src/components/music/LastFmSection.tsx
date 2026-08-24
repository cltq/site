import { useEffect, useState } from 'react';
import type { LastFmTrack, LastFmArtist, LastFmImage, TopItemType } from '../../lib/lastfm-types';

type Tab = TopItemType | 'stats';

interface CacheEntry {
	data: { tracks: LastFmTrack[]; artists: LastFmArtist[] };
	expires: number;
}

interface UserStats {
	playcount: string;
	trackCount: string;
	artistCount: string;
	registeredYear: string;
}

const CACHE_KEY = 'lastfm-top';
const CACHE_TTL = 30 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

function getCached(): { tracks: LastFmTrack[]; artists: LastFmArtist[] } | null {
	const entry = cache.get(CACHE_KEY);
	if (!entry) return null;
	if (entry.expires > Date.now()) return entry.data;
	cache.delete(CACHE_KEY);
	return null;
}

function proxyImage(src: string) {
	return `/api/lastfm?img=${encodeURIComponent(src)}`;
}

function pickImage(images?: LastFmImage[]): string | null {
	return images?.find((i) => i['#text'])?.['#text'] ?? null;
}

function formatNumber(value?: string | number): string {
	const n = Number(value);
	return Number.isFinite(n) ? n.toLocaleString('en-US') : '-';
}

function Row({
	index,
	image,
	round,
	primary,
	secondary,
	count,
	href,
}: {
	index: number;
	image: string | null;
	round?: boolean;
	primary: string;
	secondary?: string;
	count?: string;
	href?: string;
}) {
	const cls = `lastfm__art${round ? ' lastfm__art--round' : ''}`;
	const row = (
		<>
			<span className="lastfm__rank">{index + 1}</span>
			{image ? (
				<img className={cls} src={proxyImage(image)} alt="" referrerPolicy="no-referrer" loading="lazy" />
			) : (
				<span className={`${cls} lastfm__art--empty`} />
			)}
			<div className="lastfm__meta">
				<p className="lastfm__name">{primary}</p>
				{secondary && <p className="lastfm__artist">{secondary}</p>}
			</div>
			{count !== undefined && <span className="lastfm__count">{count}</span>}
		</>
	);
	const style = { animationDelay: `${index * 50}ms` } as const;

	if (href) {
		return (
			<a
				className="lastfm__row lastfm__row--link"
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				style={style}
			>
				{row}
			</a>
		);
	}

	return (
		<div className="lastfm__row" style={style}>
			{row}
		</div>
	);
}

export default function LastFmSection({ username }: { username: string }) {
	const [type, setType] = useState<Tab>('tracks');
	const [tracks, setTracks] = useState<LastFmTrack[]>([]);
	const [artists, setArtists] = useState<LastFmArtist[]>([]);
	const [stats, setStats] = useState<UserStats | null>(null);
	const [topOverall, setTopOverall] = useState<LastFmTrack[]>([]);
	const [loading, setLoading] = useState(true);
	const [enterAnim, setEnterAnim] = useState(true);

	useEffect(() => {
		if (loading) return;
		const t = setTimeout(() => setEnterAnim(false), 1200);
		return () => clearTimeout(t);
	}, [loading]);

	useEffect(() => {
		if (!username) {
			setLoading(false);
			return;
		}
		(async () => {
			const cached = getCached();
			if (cached) {
				setTracks(cached.tracks);
				setArtists(cached.artists);
				setLoading(false);
				return;
			}
			try {
				const [tracksRes, artistsRes] = await Promise.all([
					fetch('/api/lastfm?method=user.gettoptracks&period=1month&limit=20'),
					fetch('/api/lastfm?method=user.gettopartists&period=1month&limit=10'),
				]);
				if (!tracksRes.ok || !artistsRes.ok) throw new Error('failed');
				const tracksJson = await tracksRes.json();
				const artistsJson = await artistsRes.json();
				const tracks: LastFmTrack[] = tracksJson.toptracks.track;
				const artists: LastFmArtist[] = artistsJson.topartists.artist;
				setTracks(tracks);
				setArtists(artists);
				cache.set(CACHE_KEY, { data: { tracks, artists }, expires: Date.now() + CACHE_TTL });
			} catch {
				// ignore
			} finally {
				setLoading(false);
			}
		})();
	}, [username]);

	useEffect(() => {
		if (type !== 'stats' || !username) return;
		if (stats && topOverall.length > 0) return;
		(async () => {
			try {
				const [infoRes, tracksRes, artistsRes, overallRes] = await Promise.all([
					stats ? Promise.resolve(null) : fetch('/api/lastfm?method=user.getinfo'),
					fetch('/api/lastfm?method=user.gettoptracks&period=overall&limit=1'),
					fetch('/api/lastfm?method=user.gettopartists&period=overall&limit=1'),
					topOverall.length > 0
						? Promise.resolve(null)
						: fetch('/api/lastfm?method=user.gettoptracks&period=overall&limit=10'),
				]);
				if (infoRes) {
					const info = await infoRes.json();
					const tracksJson = await tracksRes.json();
					const artistsJson = await artistsRes.json();
					const u = info.user;
					if (u) {
						const registeredUnix = Number(u.registered?.unixtime ?? u.registered?.['#text'] ?? NaN);
						setStats({
							playcount: formatNumber(u.playcount),
							artistCount: formatNumber(artistsJson.topartists?.['@attr']?.total),
							trackCount: formatNumber(tracksJson.toptracks?.['@attr']?.total),
							registeredYear: Number.isFinite(registeredUnix)
								? String(new Date(registeredUnix * 1000).getFullYear())
								: '-',
						});
					}
				}
				if (overallRes) {
					const overall = await overallRes.json();
					setTopOverall(overall.toptracks?.track ?? []);
				}
			} catch {
				// ignore
			}
		})();
	}, [type, stats, topOverall, username]);

	return (
		<div className="lastfm">
			<p className="lastfm__subtitle">songs that ive been listening</p>
			<div className="lastfm__toggle">
				<button
					type="button"
					onClick={() => setType('tracks')}
					className={type === 'tracks' ? 'active' : ''}
				>
					tracks
				</button>
				<button
					type="button"
					onClick={() => setType('artists')}
					className={type === 'artists' ? 'active' : ''}
				>
					artists
				</button>
				<button
					type="button"
					onClick={() => setType('stats')}
					className={type === 'stats' ? 'active' : ''}
				>
					stats
				</button>
			</div>

			{loading ? (
				<div className="lastfm__list">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="lastfm__row">
							<span className="lastfm__rank">
								<span className="skeleton skeleton--rank" />
							</span>
							<span className="skeleton skeleton--art" />
							<div className="lastfm__meta">
								<span className="skeleton skeleton--name" />
								<span className="skeleton skeleton--artist" />
							</div>
							<span className="skeleton skeleton--count" />
						</div>
					))}
				</div>
			) : type === 'tracks' ? (
				<div className={`lastfm__list${enterAnim ? ' lastfm__list--enter' : ''}`}>
					{tracks.map((track, i) => (
						<Row
							key={`${track.name}-${track.artist.name}`}
							index={i}
							image={pickImage(track.image)}
							primary={track.name}
							secondary={track.artist.name}
							count={track.playcount}
							href={track.url}
						/>
					))}
				</div>
			) : type === 'artists' ? (
				<div className={`lastfm__list${enterAnim ? ' lastfm__list--enter' : ''}`}>
					{artists.map((artist, i) => (
						<Row
							key={artist.name}
							index={i}
							image={pickImage(artist.image)}
							round
							primary={artist.name}
							count={artist.playcount}
							href={artist.url}
						/>
					))}
				</div>
			) : (
				<>
					<div className="lastfm__stats">
						{(
							[
								['scrobbles', stats?.playcount],
								['artists', stats?.artistCount],
								['tracks', stats?.trackCount],
								['listening since', stats?.registeredYear],
							] as const
						).map(([label, value]) => (
							<div key={label} className="lastfm__stat">
								{value ? (
									<p className="lastfm__stat-value">{value}</p>
								) : (
									<span className="skeleton skeleton--stat" />
								)}
								<p className="lastfm__stat-label">{label}</p>
							</div>
						))}
					</div>
					{topOverall.length > 0 && (
						<div className={`lastfm__list lastfm__list--overall${enterAnim ? ' lastfm__list--enter' : ''}`}>
							{topOverall.map((track, i) => (
								<Row
									key={`overall-${track.name}-${track.artist.name}`}
									index={i}
									image={pickImage(track.image)}
									primary={track.name}
									secondary={track.artist.name}
									count={track.playcount}
									href={track.url}
								/>
							))}
						</div>
					)}
				</>
			)}

			<a
				href={`https://www.last.fm/user/${username}`}
				target="_blank"
				rel="noopener noreferrer"
				className="lastfm__credit"
			>
				tracked via last.fm
			</a>
		</div>
	);
}
