export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-[#9399b2]">Page not found.</p>
        <a
          href="/"
          className="text-xs text-[#7f849c] transition-colors hover:text-[#bac2de]"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
