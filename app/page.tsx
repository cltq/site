"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import DiscordSkeleton from "@/app/components/DiscordSkeleton";

const DiscordWidget = dynamic(() => import("@/app/components/DiscordWidget"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center">
      <DiscordSkeleton />
    </div>
  ),
});

import HeroText from "@/app/components/HeroText";
import SocialIcons from "@/app/components/SocialIcons";
import NowPlayingPanel from "@/app/components/NowPlayingPanel";
import AskModalController from "@/app/components/AskModalController";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section
        id="root"
        className="relative flex min-h-svh flex-col items-center justify-center px-6 sm:px-8"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <DiscordWidget showSpotify={false} />
            <div className="absolute top-1/2 left-full ml-6 hidden w-80 -translate-y-1/2 md:block">
              <NowPlayingPanel />
            </div>
          </div>
          <HeroText />
          <SocialIcons />
        </div>
        <div className="mx-auto mt-16 block w-full max-w-xs md:hidden">
          <NowPlayingPanel />
        </div>
      </section>

      <Suspense>
        <AskModalController />
      </Suspense>
    </div>
  );
}
