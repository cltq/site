'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const icons: Record<string, ReactNode> = {
	home: (
		<>
			<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</>
	),
	music: (
		<>
			<path d="M9 18V5l12-2v13" />
			<circle cx="6" cy="18" r="3" />
			<circle cx="18" cy="16" r="3" />
		</>
	),
};

const items = [
	{ href: '/', label: 'Home', icon: 'home' },
	{ href: '/music', label: 'Music', icon: 'music' },
];

export default function Navbar() {
	const pathname = usePathname();
	const current = pathname.replace(/\/$/, '') || '/';

	return (
		<nav className="dock-nav" aria-label="Main navigation">
			<div className="dock">
				{items.map((item) => {
					const isActive =
						item.href === '/' ? current === '/' : current.startsWith(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							aria-label={item.label}
							title={item.label}
							className={isActive ? 'active' : undefined}
						>
							<span className="pill" aria-hidden="true" />
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								{icons[item.icon]}
							</svg>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}