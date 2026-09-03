import "@fontsource/noto-sans-thai/400.css";
import "@fontsource/noto-sans-thai/500.css";
import "@fontsource/noto-sans-thai/700.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../styles/global.css";
import AccentColor from "./components/AccentColor";
import DynamicDotBackground from "./components/DynamicDotBackground";
import Navbar from "./components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maplenan.org";

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "maple",
        template: "%s - maple",
    },
    description:
        "maple's personal site — self-taught developer, linux enthusiast, and silly project maker. current discord activity, now playing, and last.fm charts.",
    applicationName: "maple",
    icons: {
        icon: [{ url: "/link-icon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
        type: "website",
        url: BASE_URL,
        siteName: "maple",
        title: "maple",
        description: "maple's personal site — self-taught developer, linux enthusiast, and silly project maker.",
    },
    twitter: {
        card: "summary",
        title: "maple",
        description: "maple's personal site — self-taught developer, linux enthusiast, and silly project maker.",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
            <head>
                <Script defer src="https://portus.sh/p.js" data-site="prt_nxgu2pp2a3ygw7jvp6wn" />
            </head>
            <body>
                {children}
                <AccentColor />
                <DynamicDotBackground />
                <Navbar />
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
