"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const DiscordWidget = dynamic(() => import("@/app/components/DiscordWidget"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-[#1a1a1a]" />
        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-[#1a1a1a]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[#1a1a1a]" />
        </div>
      </div>
    </div>
  ),
});

const InfiniteMarquee = dynamic(() => import("@/app/components/InfiniteMarquee"), {
  ssr: false,
});

import HeroText from "@/app/components/HeroText";
import SocialIcons from "@/app/components/SocialIcons";
import AskModalController from "@/app/components/AskModalController";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section
        id="root"
        className="relative flex min-h-svh flex-col items-center justify-center px-6 sm:px-8"
      >
        <div className="absolute top-12 left-0 w-full pb-2 md:top-16">
          <InfiniteMarquee />
        </div>
        <div className="flex flex-col items-center gap-6">
          <DiscordWidget showSpotify={false} />
          <HeroText />
          <SocialIcons />
        </div>
      </section>

      <Suspense>
        <AskModalController />
      </Suspense>
    </div>
  );
}
