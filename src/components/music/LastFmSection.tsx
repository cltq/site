"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTopTracks, fetchTopArtists } from "@/lib/lastfm/api";
import type { LastFmTrack, LastFmArtist, LastFmImage, TopItemType } from "@/lib/lastfm/types";
import { getCached, setCached } from "@/lib/data-cache";
import Skeleton from "@/components/Skeleton";

const CACHE_KEY = "lastfm-top";
const CACHE_TTL = 30 * 60 * 1000;

function proxyImage(src: string) {
  return `/api/lastfm?img=${encodeURIComponent(src)}`;
}

function TrackImage({ images }: { images: LastFmImage[] }) {
  const src = images?.find((i) => i["#text"])?.["#text"];
  if (!src) return <div className="h-12 w-12 shrink-0 rounded bg-[#160a24]" />;
  return (
    <img
      src={proxyImage(src)}
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      className="h-12 w-12 shrink-0 rounded object-cover"
    />
  );
}

function ArtistImage({ images }: { images: LastFmImage[] }) {
  const src = images?.find((i) => i["#text"])?.["#text"];
  if (!src) return <div className="h-12 w-12 shrink-0 rounded-full bg-[#160a24]" />;
  return (
    <img
      src={proxyImage(src)}
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      className="h-12 w-12 shrink-0 rounded-full object-cover"
    />
  );
}

function TopTracksList({ tracks }: { tracks: LastFmTrack[] }) {
  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {tracks.map((track, i) => (
          <motion.div
            key={track.name + track.artist.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="w-5 shrink-0 text-right text-sm text-[#7868a0]">{i + 1}</span>
            <TrackImage images={track.image} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base text-[#f0e8ff]">{track.name}</p>
              <p className="truncate text-sm text-[#c8b8e0]">{track.artist.name}</p>
            </div>
            <span className="shrink-0 text-sm text-[#7868a0]">{track.playcount}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function TopArtistsList({ artists }: { artists: LastFmArtist[] }) {
  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {artists.map((artist, i) => (
          <motion.div
            key={artist.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="w-5 shrink-0 text-right text-sm text-[#7868a0]">{i + 1}</span>
            <ArtistImage images={artist.image} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base text-[#f0e8ff]">{artist.name}</p>
            </div>
            <span className="shrink-0 text-sm text-[#7868a0]">{artist.playcount}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function LastFmSection({ username }: { username: string }) {
  const [type, setType] = useState<TopItemType>("tracks");
  const [tracks, setTracks] = useState<LastFmTrack[]>([]);
  const [artists, setArtists] = useState<LastFmArtist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const cached = getCached<{ tracks: LastFmTrack[]; artists: LastFmArtist[] }>(CACHE_KEY);
      if (cached) {
        setTracks(cached.tracks);
        setArtists(cached.artists);
        setLoading(false);
        return;
      }
      try {
        const [tracksRes, artistsRes] = await Promise.all([
          fetchTopTracks("1month", 20),
          fetchTopArtists("1month", 10),
        ]);
        const tracks = tracksRes.toptracks.track;
        const artists = artistsRes.topartists.artist;
        setTracks(tracks);
        setArtists(artists);
        setCached(CACHE_KEY, { tracks, artists }, CACHE_TTL);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <p className="mb-2 text-xs tracking-widest text-[#7868a0]">&mdash; music</p>
      <p className="mb-1 text-base text-[#c8b8e0]">songs that ive been listening</p>
      <div className="mb-4 inline-flex rounded-lg border border-white/10 p-0.5">
        <button
          onClick={() => setType("tracks")}
          className={`rounded-md px-3 py-1 text-xs transition-colors duration-200 ${
            type === "tracks"
              ? "bg-[#160a24] text-[#f0e8ff]"
              : "text-[#c8b8e0] hover:text-[#ddd0f0]"
          }`}
        >
          tracks
        </button>
        <button
          onClick={() => setType("artists")}
          className={`rounded-md px-3 py-1 text-xs transition-colors duration-200 ${
            type === "artists"
              ? "bg-[#160a24] text-[#f0e8ff]"
              : "text-[#c8b8e0] hover:text-[#ddd0f0]"
          }`}
        >
          artists
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3.5 w-5" />
              <Skeleton className="h-12 w-12 shrink-0 rounded" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
              <Skeleton className="h-3.5 w-8" />
            </div>
          ))}
        </div>
      ) : type === "tracks" ? (
        <TopTracksList tracks={tracks} />
      ) : type === "artists" ? (
        <TopArtistsList artists={artists} />
      ) : (
        <div className="mt-4"></div>
      )}

      <a
        href={`https://www.last.fm/user/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs text-[#7868a0] transition-colors duration-200 hover:text-[#c8b8e0]"
      >
        tracked via last.fm
      </a>
    </div>
  );
}
