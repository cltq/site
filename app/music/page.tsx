import type { Metadata } from 'next';
import LastFmSection from '../components/music/LastFmSection';

export const metadata: Metadata = {
	title: 'music',
};

export default function MusicPage() {
	const lastfmUser = process.env.LASTFM_USER ?? '';

	return (
		<main className="music-page">
			<div className="music-content">
				<LastFmSection username={lastfmUser} />
			</div>
		</main>
	);
}