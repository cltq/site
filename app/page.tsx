"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import LoadingSquares from "@/app/components/LoadingSquares";

const DiscordWidget = dynamic(() => import("@/app/components/DiscordWidget"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center">
      <LoadingSquares />
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
          <DiscordWidget showSpotify={false} />
          <HeroText />
          <SocialIcons />
        </div>
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 md:block">
          <NowPlayingPanel />
        </div>
        <div className="mt-16 block md:hidden">
          <NowPlayingPanel />
        </div>
      </section>

      <Suspense>
        <AskModalController />
      </Suspense>
    </div>
  );
}
