import LastFmSection from "@/components/music/LastFmSection";

export const metadata = {
  title: "music - maple",
};

export default function Music() {
  const lastfmUser = process.env.LASTFM_USER ?? "";

  return (
    <main className="flex min-h-dvh items-center justify-center p-8 pb-28">
      <div className="flex w-full max-w-4xl flex-col gap-10">
        <LastFmSection username={lastfmUser} />
      </div>
    </main>
  );
}
