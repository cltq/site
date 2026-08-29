'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type FocusEvent, type MouseEvent, type ReactNode } from 'react';

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
	const dockRef = useRef<HTMLDivElement | null>(null);
	const [tip, setTip] = useState<string | null>(null);
	const [activeRect, setActiveRect] = useState<{
		top: number;
		left: number;
		width: number;
		height: number;
	} | null>(null);

	useEffect(() => {
		const dock = dockRef.current;
		const active = dock?.querySelector<HTMLAnchorElement>('a.active');
		if (!dock || !active) return;
		const measure = () => {
			const r = active.getBoundingClientRect();
			const d = dock.getBoundingClientRect();
			setActiveRect({
				top: r.top - d.top,
				left: r.left - d.left,
				width: r.width,
				height: r.height,
			});
		};
		measure();
		const id = requestAnimationFrame(measure);
		window.addEventListener('resize', measure);
		return () => {
			cancelAnimationFrame(id);
			window.removeEventListener('resize', measure);
		};
	}, [pathname]);

	const showTip = (label: string | null) => {
		if (label === null) {
			setTip(null);
			return;
		}
		const dock = dockRef.current;
		const link = dock?.querySelector<HTMLAnchorElement>(`a[aria-label="${label}"]`);
		if (!dock || !link) {
			setTip(null);
			return;
		}
		setTip(label);
		dock.style.setProperty('--tip-top', `${link.offsetTop + link.offsetHeight / 2}px`);
	};

	const updateTip = (target: EventTarget | null) => {
		if (target instanceof Element) {
			const link = target.closest('a[href]');
			showTip(link?.getAttribute('aria-label') ?? null);
		} else {
			showTip(null);
		}
	};

	const handleOver = (e: MouseEvent<HTMLDivElement>) => updateTip(e.target);

	const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
		if (!e.currentTarget.contains(e.relatedTarget as Node | null)) showTip(null);
	};

	return (
		<nav className="dock-nav" aria-label="Main navigation">
			<div
				className="dock"
				ref={dockRef}
				onMouseOver={handleOver}
				onMouseLeave={() => showTip(null)}
				onFocusCapture={(e) => updateTip(e.target)}
				onBlurCapture={handleBlur}
			>
				{activeRect && (
					<span
						className="pill"
						aria-hidden="true"
						style={{
							top: activeRect.top,
							left: activeRect.left,
							width: activeRect.width,
							height: activeRect.height,
						}}
					/>
				)}
				{items.map((item) => {
					const isActive =
						item.href === '/' ? current === '/' : current.startsWith(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							aria-label={item.label}
							className={isActive ? 'active' : undefined}
						>
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
				<span className={`dock-label${tip ? ' dock-label--show' : ''}`} aria-hidden={!tip}>
					{tip ?? ''}
				</span>
			</div>
		</nav>
	);
}