import { useSpotify } from '../hooks/useSpotify';

export default function NowPlayingPanel() {
	const { spotify } = useSpotify(2000);

	if (!spotify) return null;

	return (
		<div className="now-playing">
			<div className="now-playing__art">
				{spotify.albumArt && <img src={spotify.albumArt} alt="" referrerPolicy="no-referrer" />}
				<div className="now-playing__ring" />
			</div>
			<p className="now-playing__line">
				<a
					className="now-playing__song"
					href={spotify.trackUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{spotify.song}
				</a>
				<span className="now-playing__by"> By </span>
				<a
					className="now-playing__artist"
					href={`https://open.spotify.com/search/${encodeURIComponent(spotify.artist)}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{spotify.artist}
				</a>
			</p>
		</div>
	);
}
