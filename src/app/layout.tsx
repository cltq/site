import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/500.css';
import '@fontsource/noto-sans-thai/700.css';
import DotsBackground from '../components/DotsBackground';
import Navbar from '../components/Navbar';
import '../styles/global.css';

export const metadata: Metadata = {
	title: "Maple's site",
	icons: { icon: [{ url: '/link-icon.svg', type: 'image/svg+xml' }] },
};

export const viewport: Viewport = {
	width: 'device-width',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>
				<DotsBackground />
				<Navbar />
				<main className="content">{children}</main>
				<footer className="site-footer">
					<img className="site-footer__logo" src="/logo_hori_cropped.png" alt="maple" />
					<div className="site-footer__right">
						<span className="site-footer__copyright">© {new Date().getFullYear()} Mapleji</span>
						<a href="https://github.com/cltq/site" target="_blank" rel="noopener noreferrer">
							view source
						</a>
					</div>
				</footer>
			</body>
		</html>
	);
}