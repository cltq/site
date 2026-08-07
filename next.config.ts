import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/biolinks",
        destination: "/bio",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/project",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '</robots.txt>; rel="robots", </sitemap.xml>; rel="sitemap", </.well-known/api-catalog>; rel="api-catalog", </.well-known/mcp/server-card.json>; rel="mcp-server-card"',
          },
        ],
      },
      // Add caching headers for static assets
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year for static assets
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year for next static assets
          },
        ],
      },
      {
        source: "/(.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate", // 1 day for images
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/discord",
        destination: "https://api.applefumi.xyz/v2/discord/user/1/",
      },
      {
        source: "/api/discord/:path+",
        destination: "https://api.applefumi.xyz/v2/discord/user/1/:path+",
      },
      {
        source: "/api/health",
        destination: "https://api.applefumi.xyz/health",
      },
      {
        source: "/api/spotify",
        destination: "https://spotify.applefumi.xyz/api/spotify",
      },
    ];
  },
  env: {
    DISCORD_USERID: process.env.DISCORD_USERID,
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_BLACKLIST: process.env.GITHUB_BLACKLIST,
  },
  allowedDevOrigins: ["192.168.1.34", "192.168.1.35", "192.168.1.44"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.applefumi.xyz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'spotify.applefumi.xyz',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true, // Optimize CSS for smaller bundle size
    scrollRestoration: true, // Restore scroll position on navigation
    // swcMinify is enabled by default in Next.js 16+
  },
};

// Add bundle analysis in development or when explicitly enabled
if (process.env.ANALYZE === 'true') {
  const { withBundleAnalyzer } = require('@next/bundle-analyzer');
  module.exports = withBundleAnalyzer({
    eslint: {
      enabled: true,
    },
    typescript: {
      enabled: true,
    },
  })(nextConfig);
} else {
  module.exports = nextConfig;
}