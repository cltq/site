"use client";

import { useState, useEffect } from "react";

const TARGET_DOMAIN = "mapleji.xyz";
const NEXTJS_DOMAIN = "site-nextjs.mapleji.xyz";

export default function Home() {
  const [showNextjsLink, setShowNextjsLink] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Start countdown from 3
    let seconds = 3;
    const display = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(display);
          // Auto-redirect after countdown
          const redirectTimer = setTimeout(() => {
            window.location.href = `https://${TARGET_DOMAIN}`;
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(display);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[0b0b0f] text-[9ca3af]">
      <div className="text-center">
        <p className="mb-6 text-3xl font-semibold tracking-wider">
          Redirecting to {TARGET_DOMAIN}
        </p>

        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="text-4xl font-bold text-zinc-500">{countdown}</span>
          <span className="text-2xl text-zinc-500">.</span>
          <span className="text-2xl text-zinc-500">.</span>
          <span className="text-2xl text-zinc-500">.</span>
        </div>

        <p className="mb-8 text-lg text-zinc-400">
          Please wait while we redirect you to the main site...
        </p>

        {/* Clickable link to Next.js site */}
        {showNextjsLink && (
          <p className="mt-8">
            <a
              href={`https://${NEXTJS_DOMAIN}`}
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