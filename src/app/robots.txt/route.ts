export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maplenan.org';

function block(agents: string[]): string {
	return agents.map((agent) => `User-agent: ${agent}\nDisallow: /`).join('\n\n');
}

export async function GET() {
	const robots = `# robots.txt for ${BASE_URL}
# Per RFC 9309 — https://www.rfc-editor.org/rfc/rfc9309
# AI usage preferences declared via Content Signals — https://contentsignals.org/

# --- Everyone else ---
User-agent: *
Allow: /

# --- Search / answer engines: crawling allowed ---
User-agent: OAI-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /

# --- AI training / content scrapers: crawling disallowed ---
${block([
	'GPTBot',
	'ChatGPT-User',
	'Claude-Web',
	'ClaudeBot',
	'anthropic-ai',
	'Google-Extended',
	'Amazonbot',
	'Applebot-Extended',
	'Bytespider',
	'CCBot',
	'cohere-ai',
	'meta-externalagent',
])}

# --- Content Signals: training no, search yes, ai-input no ---
Content-Signal: ai-train=no, search=yes, ai-input=no

Sitemap: ${BASE_URL}/sitemap.xml
`;

	return new Response(robots, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}