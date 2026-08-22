import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-[#d4d4d4]">Page not found.</p>
        <Link href="/" className="text-xs text-[#a3a3a3] transition-colors hover:text-[#e5e5e5]">
          Go home
        </Link>
      </div>
    </div>
  );
}
