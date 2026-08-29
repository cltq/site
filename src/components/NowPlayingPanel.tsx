'use client';

import { useEffect, useRef, useState } from 'react';
import { useSpotify, type SpotifyData } from '../hooks/useSpotify';

export default function NowPlayingPanel() {
	const { spotify } = useSpotify(2000);
	const [displayed, setDisplayed] = useState<SpotifyData | null>(null);
	const [leaving, setLeaving] = useState(false);
	const [overflowing, setOverflowing] = useState(false);
	const timerRef = useRef<number | undefined>(undefined);
	const viewportRef = useRef<HTMLSpanElement | null>(null);
	const innerRef = useRef<HTMLAnchorElement | null>(null);

	useEffect(() => {
		const measure = () => {
			const inner = innerRef.current;
			const viewport = viewportRef.current;
			if (!inner || !viewport) return;
			const overflow = inner.getBoundingClientRect().width - viewport.clientWidth;
			setOverflowing(overflow > 1);
			if (viewport.style) {
				viewport.style.setProperty('--scroll-dist', `${overflow + 16}px`);
			}
		};
		measure();
		const id = requestAnimationFrame(measure);
		window.addEventListener('resize', measure);
		return () => {
			cancelAnimationFrame(id);
			window.removeEventListener('resize', measure);
		};
	}, [displayed]);

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
				<span
					className={`now-playing__song-scroll${overflowing ? ' now-playing__song-scroll--long' : ''}`}
					ref={viewportRef}
				>
					<a
						className="now-playing__song"
						href={displayed.trackUrl}
						target="_blank"
						rel="noopener noreferrer"
						ref={innerRef}
					>
						{displayed.song}
					</a>
				</span>
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