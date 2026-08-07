import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font";
import { Chakra_Petch, Instrument_Sans } from "next/font/google";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import ContextMenuGuard from "@/app/components/ContextMenuGuard";
import WebMCP from "@/app/components/WebMCP";
import CursorTrail from "@/app/components/CursorTrail";

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

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "maple",
  description: "Maple's Portfolio/Personal Website",
  icons: { icon: "/favicon.png" },
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
    <html
      lang="en"
      className={`${GeistMono.variable} ${chakraPetch.variable} ${instrumentSans.variable} h-svh antialiased`}
    >
      <body className="relative h-full bg-[#000000] font-sans text-[#a3a3a3]">
        <CursorTrail />
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