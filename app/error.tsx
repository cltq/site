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
        <p className="text-sm text-[#a3a3a3]">Something went wrong.</p>
        <button
          onClick={() => reset()}
          className="text-xs text-[#737373] transition-colors hover:text-[#d4d4d4]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
