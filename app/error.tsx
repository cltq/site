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
        <p className="text-sm text-[#9399b2]">Something went wrong.</p>
        <button
          onClick={() => reset()}
          className="text-xs text-[#7f849c] transition-colors hover:text-[#bac2de]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
