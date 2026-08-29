import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/500.css';
import '@fontsource/noto-sans-thai/700.css';
import DotsBackground from './components/DotsBackground';
import Navbar from './components/Navbar';
import AccentColor from './components/AccentColor';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import '../styles/global.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maplenan.org';

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	title: {
		default: 'maple',
		template: '%s - maple',
	},
	description:
		"maple's personal site — self-taught developer, linux enthusiast, and silly project maker. current discord activity, now playing, and last.fm charts.",
	applicationName: 'maple',
	icons: {
		icon: [{ url: '/link-icon.svg', type: 'image/svg+xml' }],
	},
	openGraph: {
		type: 'website',
		url: BASE_URL,
		siteName: 'maple',
		title: 'maple',
		description:
			"maple's personal site — self-taught developer, linux enthusiast, and silly project maker.",
	},
	twitter: {
		card: 'summary',
		title: 'maple',
		description:
			"maple's personal site — self-taught developer, linux enthusiast, and silly project maker.",
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>
				<AccentColor />
				<DotsBackground />
				<Navbar />
				<main className="content">{children}</main>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}