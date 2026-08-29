import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maplenan.org';

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	return [
		{
			url: `${BASE_URL}/`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${BASE_URL}/music`,
			lastModified: now,
			changeFrequency: 'daily',
			priority: 0.8,
		},
	];
}
