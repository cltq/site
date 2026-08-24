import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const res = await fetch('https://api.mapleji.xyz/v2/discord/user/1/');
		const json = await res.json();
		return new Response(JSON.stringify(json), {
			status: res.ok ? 200 : 502,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch {
		return new Response(JSON.stringify({ success: false }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
