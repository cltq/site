"use client";

import { motion } from "framer-motion";
import { useSpotify } from "@/app/hooks/useSpotify";

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function NowPlayingPanel() {
  const { spotify } = useSpotify(1000);

  if (!spotify) return null;

  return (
    <motion.a
      href={spotify.trackUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group flex items-center gap-3 px-4 py-3 transition-all duration-300 ease-out hover:opacity-80 md:min-w-[280px]"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <img
          src={spotify.albumArt || spotify.cover || ""}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 rounded-lg ring-1 ring-white/10 ring-inset" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{spotify.song}</p>
        <p className="truncate text-xs text-gray-500">{spotify.artist}</p>
        {spotify.duration && spotify.progressMs && (
          <div className="mt-1.5">
            <div className="h-1 overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: `${(spotify.progressMs / spotify.duration) * 100}%`,
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-500">
              <span>{formatTime(spotify.progressMs)}</span>
              <span>{formatTime(spotify.duration)}</span>
            </div>
          </div>
        )}
      </div>
    </motion.a>
  );
}
