# maple

Personal site built with [Next.js](https://nextjs.org), React, and TypeScript.

Live presence widgets — Discord status, Spotify now-playing, and Last.fm charts — with a dark, minimal design.

## Getting started

Prerequisites: Node.js >= 20 and a package manager (this repo uses [bun](https://bun.sh)).

```bash
bun install
cp .env.example .env.local   # fill in your values
bun run dev
```

Open http://localhost:3000.

## Scripts

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `bun run dev`        | Start the development server    |
| `bun run build`      | Create a production build       |
| `bun run start`      | Serve the production build      |
| `bun run typecheck`  | Run the TypeScript type checker |

## Environment variables

| Variable                 | Description                              |
| ------------------------ | ---------------------------------------- |
| `LASTFM_USER`            | Last.fm username shown on the music page |
| `LASTFM_API_KEY`         | Last.fm API key for the music API        |
| `NEXT_PUBLIC_SITE_URL`   | Base URL used in the sitemap             |

All optional — the site runs fine without them; the widgets just won't have data.

## Structure

- `app/` — routes, layout, metadata, and API routes
  - `api/discord-user` — Discord presence proxy
  - `api/spotify` — Spotify now-playing proxy
  - `api/lastfm` — Last.fm charts/images proxy with caching
  - `sitemap.ts` — generated sitemap
- `components/` — React components (navbar, presence widgets, Last.fm sections)
- `hooks/` — data-fetching hooks (`useDiscordUser`, `useSpotify`)
- `styles/global.css` — all site styling
- `public/` — static assets (favicons, logo)

## Agent discovery

The site is reachable by AI agents via several standards:

- **robots.txt** — generated from `app/robots.txt/route.ts`, with explicit
  `User-agent` groups for AI crawlers and a `Content-Signal` declaration
  (`ai-train=no, search=yes, ai-input=no`).
- **Link headers** — every page sends `Link` headers (see `next.config.ts`)
  pointing at `/sitemap.xml` (`rel="sitemap"`) and `/.well-known/api-catalog`
  (`rel="api-catalog"`).
- **Markdown for agents** — requests with `Accept: text/markdown` (see
  `proxy.ts`) get a markdown version of `/` and `/music` with
  `Content-Type: text/markdown` and an `x-markdown-tokens` header.

### DNS-AID (requires DNS provider access)

Publish these authoritative records so agents can discover the site via DNS.
Sign the lookup zone with DNSSEC so validating resolvers get authenticated data:

```dns
_a2a._agents.maplenan.org.  3600 IN SVCB 1 maple.maplenan.org. alpn="a2a" port=443
_index._agents.maplenan.org. 3600 IN SVCB 1 maple.maplenan.org. alpn="index" port=443
```

Verify afterwards:

```bash
dig +short SVCB _a2a._agents.maplenan.org
```

## Credits

- Fonts: [Geist](https://vercel.com/font) and Noto Sans Thai
- Presence data: personal Discord/Spotify/Last.fm APIs

## License

MIT — see [LICENSE](./LICENSE).