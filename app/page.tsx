import { Suspense } from "react";

import DiscordWidget from "@/components/DiscordWidget";
import DiscordSkeleton from "@/components/DiscordSkeleton";
import SocialIcons from "@/components/SocialIcons";
import NowPlayingPanel from "@/components/NowPlayingPanel";
import AskModalController from "@/components/AskModalController";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section
        id="root"
        className="relative flex h-svh flex-col items-center justify-center overflow-hidden px-6 sm:px-8"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  <DiscordSkeleton />
                </div>
              }
            >
              <DiscordWidget showSpotify={false} />
            </Suspense>
            <div className="absolute top-1/2 left-full ml-6 hidden w-80 -translate-y-1/2 md:block">
              <NowPlayingPanel />
            </div>
          </div>

          <SocialIcons />
        </div>
        <div className="mx-auto mt-16 block w-full max-w-xs md:hidden">
          <NowPlayingPanel />
        </div>
      </section>

      <Suspense fallback={null}>
        <AskModalController />
      </Suspense>
    </div>
  );
}
