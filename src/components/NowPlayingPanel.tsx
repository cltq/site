import { useEffect, useRef, useState } from 'react';
import { useSpotify, type SpotifyData } from '../hooks/useSpotify';

export default function NowPlayingPanel() {
	const { spotify } = useSpotify(2000);
	const [displayed, setDisplayed] = useState<SpotifyData | null>(null);
	const [leaving, setLeaving] = useState(false);
	const timerRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (timerRef.current !== undefined) clearTimeout(timerRef.current);

		const finish = (next: SpotifyData | null) => {
			timerRef.current = window.setTimeout(() => {
				setDisplayed(next);
				setLeaving(false);
			}, 240);
		};

		if (spotify) {
			const changed = displayed && displayed.trackUrl !== spotify.trackUrl;
			if (!displayed) {
				setDisplayed(spotify);
				setLeaving(false);
			} else if (changed) {
				setLeaving(true);
				finish(spotify);
			}
		} else if (displayed) {
			setLeaving(true);
			finish(null);
		}

		return () => {
			if (timerRef.current !== undefined) clearTimeout(timerRef.current);
		};
	}, [spotify]);

	if (!displayed) return null;

	return (
		<div className={`now-playing ${leaving ? 'now-playing--out' : 'now-playing--in'}`}>
			<div className="now-playing__art">
				{displayed.albumArt && (
					<img src={displayed.albumArt} alt="" referrerPolicy="no-referrer" />
				)}
				<div className="now-playing__ring" />
			</div>
			<p className="now-playing__line">
				<a
					className="now-playing__song"
					href={displayed.trackUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{displayed.song}
				</a>
				<span className="now-playing__by"> By </span>
				<a
					className="now-playing__artist"
					href={`https://open.spotify.com/search/${encodeURIComponent(displayed.artist)}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{displayed.artist}
				</a>
			</p>
		</div>
	);
}
