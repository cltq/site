"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { SpotifyData } from "@/app/lib/discord/types";
import { fetchSpotify } from "@/app/lib/spotify/api";

interface UseSpotifyReturn {
  spotify: SpotifyData | null;
  loading: boolean;
  error: Error | null;
}

export function useSpotify(pollInterval = 15000, enabled = true): UseSpotifyReturn {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await fetchSpotify(signal);
      setSpotify(data);
      setError(null);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!enabled) return;

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    load(controller.signal);

    pollRef.current = setInterval(() => {
      if (!controller.signal.aborted) {
        load(controller.signal);
      }
    }, pollInterval);
  }, [enabled, pollInterval, load]);

  useEffect(() => {
    if (!enabled) {
      setSpotify(null);
      setLoading(false);
      setError(null);
      return;
    }

    start();

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stop();
    };
  }, [enabled, start, stop]);

  return { spotify, loading, error };
}
