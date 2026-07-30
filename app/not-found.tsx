export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-[#a3a3a3]">Page not found.</p>
        <a href="/" className="text-xs text-[#737373] transition-colors hover:text-[#d4d4d4]">
          Go home
        </a>
      </div>
    </div>
  );
}
