"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-zinc-500">Something went wrong.</p>
        <button
          onClick={() => reset()}
          className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
