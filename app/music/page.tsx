import type { Metadata } from "next";
import LastFmSection from "@/app/components/music/LastFmSection";

export const metadata: Metadata = {
  title: "Music - Maple",
};

export default function MusicPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-8">
      <div className="flex w-full max-w-4xl flex-col gap-10">
        <LastFmSection username={process.env.LASTFM_USER ?? ""} />
      </div>
    </main>
  );
}
