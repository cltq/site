import CurrentlyPlaying from "@/app/components/music/CurrentlyPlaying";

export default function MusicPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-8">
      <div className="flex w-full max-w-4xl flex-col gap-10">
        <CurrentlyPlaying />
      </div>
    </main>
  );
}