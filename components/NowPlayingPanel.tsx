"use client";

import { motion } from "framer-motion";
import { useSpotify } from "@/hooks/useSpotify";

export default function NowPlayingPanel() {
  // Poll every 2s so the currently-playing track stays fresh
  const { spotify } = useSpotify(2000);

  if (!spotify) return null;

  return (
    <motion.a
      href={spotify.trackUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group mx-auto flex w-full items-center gap-3 px-4 py-3 transition-all duration-300 ease-out hover:opacity-80"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#171717]">
        <img
          src={spotify.albumArt || spotify.cover || ""}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 rounded-lg ring-1 ring-white/10 ring-inset" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{spotify.song}</p>
        <p className="mt-0.5 truncate text-xs text-gray-500">{spotify.artist}</p>
      </div>
    </motion.a>
  );
}
