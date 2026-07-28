import type { Metadata, Viewport } from "next";
import { GeistSans, GeistMono } from "geist/font";
import { Chakra_Petch } from "next/font/google";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import ContextMenuGuard from "@/app/components/ContextMenuGuard";
import WebMCP from "@/app/components/WebMCP";
import DynamicBackgrounds from "@/app/components/DynamicBackgrounds";

import TitleUpdater from "@/app/components/TitleUpdater";
import UtmTracker from "@/app/components/UtmTracker";
import { Navbar } from "@/components/navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra-petch",
  display: "swap",
});

export const metadata: Metadata = {
  description: "Maple's Portfolio/Personal Website",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "Maple",
    description: "Maple's Portfolio/Personal Website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, type: "image/png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maple",
    description: "Maple's Portfolio/Personal Website",
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${chakraPetch.variable} h-svh antialiased`}>
      <head>
        <title>Maple</title>
      </head>
      <body className="relative h-full bg-[#000000] font-sans text-[#a3a3a3]">
        <DynamicBackgrounds />
        <Navbar />
        <div className="relative z-10 flex h-full flex-col">
          <div id="scroll-container" className="flex-1 overflow-y-auto">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </div>
        <ContextMenuGuard />
        <WebMCP />
        <SpeedInsights />
        <Analytics />
        <UtmTracker />
      </body>
    </html>
  );
}
