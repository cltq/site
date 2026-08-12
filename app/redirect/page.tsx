"use client";

import { useState, useEffect } from "react";

const TARGET_DOMAIN = "mapleji.xyz";
const NEXTJS_DOMAIN = "v2.fumi.xyz"; // The Next.js site domain

export default function RedirectPage() {
  const [showNextjsLink, setShowNextjsLink] = useState(false);

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = `https://${TARGET_DOMAIN}`;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[0b0b0f] text-[9ca3af]">
      <div className="text-center">
        <p className="mb-6 text-3xl font-semibold tracking-wider">
          Redirecting to {TARGET_DOMAIN}
        </p>

        <p className="mb-8 text-lg text-zinc-400">
          Please wait while we redirect you to the main site...
        </p>

        {/* Auto-redirect countdown */}
        <p id="countdown" className="mb-8 text-xl text-zinc-500">
          3
        </p>

        {/* Clickable link to Next.js site (initially hidden, shown after redirect or on click) */}
        {showNextjsLink && (
          <p className="mt-8">
            <a
              href="https://{NEXTJS_DOMAIN}"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9ca3af] underline underline-offset-2 transition-colors hover:text-white"
            >
              Visit the Next.js site
            </a>
          </p>
        )}

        {/* Alternative: immediate link if user wants to skip wait */}
        <p
          onClick={() => {
            window.location.href = `https://${NEXTJS_DOMAIN}`;
            setShowNextjsLink(true);
          }}
          className="mt-6 cursor-pointer text-zinc-400 hover:text-[9ca3af] transition-colors text-sm"
        >
          Click here to visit the Next.js site instead
        </p>
      </div>
    </div>
  );
}