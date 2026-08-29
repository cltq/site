import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MARKDOWN: Record<string, string> = {
	'/': `# maple

I'm maple, a self-taught developer and linux enthusiast. I love to make silly projects and learning new things.

## Navigation

- [Home](/)
- [Music](/music)

## Links

- [Haunt](https://haunt.gg/fumi)
- [Discord](https://discord.com/users/969088519161139270)
- [GitHub](https://github.com/cltq)

## Source

- [view source](https://github.com/cltq/site)
`,
	'/music': `# music - maple

Songs I've been listening to, tracked via last.fm.

## Navigation

- [Home](/)
- [Music](/music)
`,
};

function wantsMarkdown(request: NextRequest): boolean {
	const accept = request.headers.get('accept') ?? '';
	return accept
		.split(',')
		.some((part) => part.trim().toLowerCase().startsWith('text/markdown'));
}

function estimateTokens(text: string): number {
	return Math.ceil(text.trim().length / 4);
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const key = pathname.replace(/\/+$/, '') || '/';

	if (!wantsMarkdown(request)) return NextResponse.next();

	const markdown = MARKDOWN[key];
	if (!markdown) return NextResponse.next();

	return new NextResponse(markdown, {
		status: 200,
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'x-markdown-tokens': String(estimateTokens(markdown)),
			'Cache-Control': 'public, max-age=3600',
		},
	});
}

export const config = {
	matcher: ['/', '/music'],
};