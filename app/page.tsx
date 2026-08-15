"use client";

import { useState, useEffect } from "react";

const TARGET_DOMAIN = "mapleji.xyz";

export default function Home() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
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
    <div
      className="min-h-screen bg-[0b0b0f] overflow-hidden relative"
    >
      <div
        className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-12"
      >
        <div
          className="bg-[#1a1a2e] rounded-xl border border-white/10 border-t border-b w-full max-w-md mx-auto p-8 sm:p-10 lg:p-12"
        >
          <p className="text-base text-zinc-400 mb-6 text-center">
            Redirecting to <span className="text-white font-medium">{TARGET_DOMAIN}</span>
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <span
              className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse"
            />
            <span
              className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse"
            />
            <span
              className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse"
            />
          </div>

          <div className="text-center mb-6">
            {countdown > 0 && (
              <p className="text-5xl font-bold text-zinc-500">
                {countdown}
              </p>
            )}
          </div>

          <p className="text-xs text-zinc-600/60">
            Click
            <a
              href="#"
              className="underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `https://${TARGET_DOMAIN}`;
              }}
            >
              here
            </a>
            if redirect does not work
          </p>
        </div>
      </div>
    </div>
  );
}