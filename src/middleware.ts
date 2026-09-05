import { defineMiddleware } from 'astro:middleware';
import { htmlToMarkdown } from './lib/markdown';

const API_CATALOG_LINK = '</.well-known/api-catalog>; rel="api-catalog"';

export const onRequest = defineMiddleware(async ({ request }, next) => {
	const response = await next();

	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.includes('text/html')) {
		return response;
	}

	const headers = new Headers(response.headers);

	if (!headers.get('Link')) {
		headers.append('Link', API_CATALOG_LINK);
	}

	const existingVary = headers.get('Vary');
	headers.set('Vary', existingVary ? `${existingVary}, Accept` : 'Accept');
	headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=60');
	headers.set('Content-Signal', 'ai-train=yes, search=yes, ai-input=yes');

	const accept = request.headers.get('accept') ?? '';
	if (accept.includes('text/markdown')) {
		const html = await response.text();
		const { markdown, originalTokens, markdownTokens } = htmlToMarkdown(html);

		headers.set('Content-Type', 'text/markdown; charset=utf-8');
		headers.set('X-Markdown-Tokens', String(markdownTokens));
		headers.set('X-Original-Tokens', String(originalTokens));

		return new Response(markdown, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});