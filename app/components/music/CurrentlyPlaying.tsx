"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface SpotifyNowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  progressMs: number;
  durationMs: number;
  trackUrl: string;
}

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function CurrentlyPlaying() {
  const [track, setTrack] = useState<SpotifyNowPlaying | null>(null);
  const [loading, setLoading] = useState(true);
  const progressRef = useRef<number>(0);
  const lastTick = useRef<number>(0);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) throw new Error("not ok");
        const data: SpotifyNowPlaying = await res.json();
        if (data.isPlaying) {
          progressRef.current = data.progressMs;
          lastTick.current = Date.now();
        }
        setTrack(data);
      } catch {
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 15000);
    return () => clearInterval(interval);
  }, []);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!track?.isPlaying) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - lastTick.current;
      setProgress(Math.min(progressRef.current + elapsed, track.durationMs));
    }, 500);
    return () => clearInterval(id);
  }, [track]);

  return (
    <div>
      <p className="mb-3 text-base text-[#a3a3a3]">Currently playing song on Spotify</p>
      <div className="rounded-xl border border-white/10 p-4">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-[#1a1a1a]" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-[#1a1a1a]" />
              <div className="h-3 w-24 animate-pulse rounded bg-[#1a1a1a]" />
            </div>
          </div>
        ) : track?.isPlaying ? (
          <motion.div
            key={track.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <a
              href={track.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-opacity duration-200 hover:opacity-80"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={track.albumImageUrl}
                    alt={`${track.album} album art`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-white/10 ring-inset" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold leading-tight text-[#fafafa]">
                    {track.title}
                  </p>
                  <p className="truncate text-[14px] leading-tight text-[#a3a3a3]">
                    {track.artist}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-[#a3a3a3]">{track.album}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] tabular-nums text-[#737373]">
                      {formatTime(progress)}
                    </span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#2a2a2a]">
                      <div
                        className="h-full rounded-full bg-[#1db954]"
                        style={{
                          width: `${(progress / track.durationMs) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] tabular-nums text-[#737373]">
                      {formatTime(track.durationMs)}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ) : (
          <p className="text-sm text-[#a3a3a3]">Not playing anything right now</p>
        )}
      </div>
    </div>
  );
}
