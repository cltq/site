export const dynamic = 'force-static';

const catalog = {
	catalogVersion: '2026-08-29',
	apis: [
		{
			title: 'Discord user presence',
			description: 'Current Discord profile, status, and activity.',
			href: '/api/discord-user',
		},
		{
			title: 'Spotify now playing',
			description: 'Currently playing song from Spotify.',
			href: '/api/spotify',
		},
		{
			title: 'Last.fm charts and images',
			description: 'Last.fm top tracks, artists, user stats, and album artwork proxy.',
			href: '/api/lastfm',
		},
	],
};

export async function GET() {
	return new Response(JSON.stringify(catalog, null, 2), {
		status: 200,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}