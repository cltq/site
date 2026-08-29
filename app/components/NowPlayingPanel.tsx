'use client';

import { useEffect, useRef, useState } from 'react';
import { useSpotify, type SpotifyData } from '../../hooks/useSpotify';

function NowPlayingCard({ data, state }: { data: SpotifyData; state: 'in' | 'out' }) {
	return (
		<div className={`now-playing now-playing--${state}`}>
			<div className="now-playing__art">
				{data.albumArt && (
					<img src={data.albumArt} alt="" width={20} height={20} referrerPolicy="no-referrer" />
				)}
				<div className="now-playing__ring" />
			</div>
			<p className="now-playing__line">
				<span className="now-playing__prefix">Listening to </span>
				<span className="now-playing__song-scroll">
					<a
						className="now-playing__song"
						href={data.trackUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						{data.song}
					</a>
				</span>
				<span className="now-playing__by"> By </span>
				<a
					className="now-playing__artist"
					href={`https://open.spotify.com/search/${encodeURIComponent(data.artist)}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{data.artist}
				</a>
			</p>
		</div>
	);
}

export default function NowPlayingPanel() {
	const { spotify } = useSpotify(2000);
	const [current, setCurrent] = useState<SpotifyData | null>(null);
	const [outgoing, setOutgoing] = useState<SpotifyData | null>(null);
	const timerRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		const finish = () => {
			setOutgoing(null);
			timerRef.current = undefined;
		};

		if (spotify) {
			if (!current) {
				setCurrent(spotify);
			} else if (current.trackUrl !== spotify.trackUrl) {
				setOutgoing(current);
				setCurrent(spotify);
				timerRef.current = window.setTimeout(finish, 500);
			}
		} else if (current) {
			setOutgoing(current);
			setCurrent(null);
			timerRef.current = window.setTimeout(finish, 500);
		}

		return () => {
			if (timerRef.current !== undefined) clearTimeout(timerRef.current);
		};
	}, [spotify]);

	return (
		<>
			{outgoing && <NowPlayingCard key={`out-${outgoing.trackUrl}`} data={outgoing} state="out" />}
			{current && <NowPlayingCard key={`in-${current.trackUrl}`} data={current} state="in" />}
		</>
	);
}