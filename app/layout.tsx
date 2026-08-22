import type { Metadata, Viewport } from "next";

import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/geist-mono";
import "@fontsource/chakra-petch/300.css";
import "@fontsource/chakra-petch/400.css";
import "@fontsource/chakra-petch/500.css";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";

import "@/styles/global.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import CursorTrail from "@/components/CursorTrail";
import Navbar from "@/components/navbar/Navbar";
import WebMCP from "@/components/WebMCP";
import UtmTracker from "@/components/UtmTracker";

export const metadata: Metadata = {
  title: "maple",
  description: "Maple's Portfolio/Personal Website",
  icons: {
    icon: "/favicon.png",
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
    <html lang="en" className="h-svh antialiased">
      <body className="relative h-full bg-[#0a0a0a] font-sans text-[#d4d4d4]">
        <Navbar />
        <div className="relative z-10 flex h-full flex-col">
          <div id="scroll-container" className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
        <WebMCP />
        <SpeedInsights />
        <Analytics />
        <UtmTracker />
      </body>
    </html>
  );
}
