"use client";

import { useState, useEffect } from "react";

const TARGET_DOMAIN = "mapleji.xyz";

export default function RedirectPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = `https://${TARGET_DOMAIN}`;
    }, 2000);

    return () => clearTimeout(timer);
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