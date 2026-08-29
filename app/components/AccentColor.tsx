'use client';

import { useEffect } from 'react';
import { useSpotify } from '../../hooks/useSpotify';

const ACCENT_PROP = '--accent';
const ACCENT_RGB_PROP = '--accent-rgb';

function extractAccent(img: HTMLImageElement): { color: string; rgb: string } | null {
	const size = 24;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) return null;
	ctx.drawImage(img, 0, 0, size, size);
	const { data } = ctx.getImageData(0, 0, size, size);

	let r = 0;
	let g = 0;
	let b = 0;
	let weight = 0;
	for (let i = 0; i < data.length; i += 4) {
		const alpha = data[i + 3];
		if (alpha < 128) continue;
		const cr = data[i];
		const cg = data[i + 1];
		const cb = data[i + 2];
		const max = Math.max(cr, cg, cb);
		const min = Math.min(cr, cg, cb);
		const saturation = max === 0 ? 0 : (max - min) / max;
		const w = 0.3 + saturation;
		r += cr * w;
		g += cg * w;
		b += cb * w;
		weight += w;
	}
	if (weight <= 0) return null;
	let rr = Math.round(r / weight);
	let rg = Math.round(g / weight);
	let rb = Math.round(b / weight);

	const luminance = 0.2126 * rr + 0.7152 * rg + 0.0722 * rb;
	if (luminance < 115) {
		const k = 115 / luminance;
		rr = Math.round(Math.min(255, rr * k));
		rg = Math.round(Math.min(255, rg * k));
		rb = Math.round(Math.min(255, rb * k));
	}

	return { color: `rgb(${rr}, ${rg}, ${rb})`, rgb: `${rr}, ${rg}, ${rb}` };
}

function loadAccent(src: string): Promise<{ color: string; rgb: string } | null> {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => {
			try {
				resolve(extractAccent(img));
			} catch {
				resolve(null);
			}
		};
		img.onerror = () => resolve(null);
		img.src = src;
	});
}

export default function AccentColor() {
	const { spotify } = useSpotify();

	useEffect(() => {
		const root = document.documentElement;
		const reset = () => {
			root.style.removeProperty(ACCENT_PROP);
			root.style.removeProperty(ACCENT_RGB_PROP);
		};

		if (!spotify?.albumArt) {
			reset();
			return;
		}

		let cancelled = false;
		loadAccent(spotify.albumArt).then((accent) => {
			if (cancelled) return;
			if (accent) {
				root.style.setProperty(ACCENT_PROP, accent.color);
				root.style.setProperty(ACCENT_RGB_PROP, accent.rgb);
			} else {
				reset();
			}
		});
		return () => {
			cancelled = true;
		};
	}, [spotify?.albumArt]);

	return null;
}