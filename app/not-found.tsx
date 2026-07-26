export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-zinc-500">Page not found.</p>
        <a
          href="/"
          className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
