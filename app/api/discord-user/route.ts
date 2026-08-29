export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const res = await fetch('https://api.mapleji.xyz/v2/discord/user/1/', {
			cache: 'no-store',
		});
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
}