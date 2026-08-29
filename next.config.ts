import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Link',
						value: '</sitemap.xml>; rel="sitemap", </.well-known/api-catalog>; rel="api-catalog"',
					},
				],
			},
		];
	},
};

export default nextConfig;