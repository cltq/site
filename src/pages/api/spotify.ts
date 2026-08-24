export const prerender = false;

const UPSTREAM = 'https://spotify.applefumi.xyz/api/spotify';

export async function GET({ request }: { request: Request }) {
	const res = await fetch(UPSTREAM, {
		headers: { accept: 'application/json' },
		cache: 'no-store',
	});

	if (!res.ok) {
		return new Response(JSON.stringify({ success: false }), {
			status: 502,
			headers: { 'content-type': 'application/json' },
		});
	}

	const data = await res.json();

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'content-type': 'application/json',
			'cache-control': 'public, max-age=5',
		},
	});
}
