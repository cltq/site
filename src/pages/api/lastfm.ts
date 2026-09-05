import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import type { LastFmRecentTracksResponse } from '../../lib/integrations';

export const prerender = false;

const LASTFM_URL = 'https://ws.audioscrobbler.com/2.0/';

export const GET: APIRoute = async ({ url }) => {
	const apiKey = env.LASTFM_API_KEY || '';
	const username = env.LASTFM_USERNAME || '';

	if (!apiKey || !username) {
		return new Response(
			JSON.stringify({
				error: 'LASTFM_API_KEY and LASTFM_USERNAME must be configured',
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		);
	}

	const limit = url.searchParams.get('limit') ?? '10';

	const params = new URLSearchParams({
		method: 'user.getrecenttracks',
		user: username,
		api_key: apiKey,
		format: 'json',
		limit,
	});

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const response = await fetch(`${LASTFM_URL}?${params}`, { signal: controller.signal });
		clearTimeout(timeout);

		if (!response.ok) {
			return new Response(
				JSON.stringify({ error: `Last.fm API responded with ${response.status}` }),
				{ status: response.status, headers: { 'Content-Type': 'application/json' } },
			);
		}

		const data = (await response.json()) as LastFmRecentTracksResponse;

		if (data.error) {
			return new Response(
				JSON.stringify({ error: data.message ?? `Last.fm error ${data.error}` }),
				{ status: 502, headers: { 'Content-Type': 'application/json' } },
			);
		}

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30',
			},
		});
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'AbortError'
				? 'Last.fm API request timed out'
				: 'Failed to fetch Last.fm recent tracks';
		return new Response(JSON.stringify({ error: message }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};