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

  useEffect(() => {
    if (!enabled) {
      setSpotify(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    load(controller.signal);

    const startPolling = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => {
        if (!controller.signal.aborted) {
          load(controller.signal);
        }
      }, pollInterval);
    };

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    startPolling();

    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stopPolling();
      controller.abort();
      abortRef.current = null;
    };
  }, [enabled, pollInterval, load]);

  return { spotify, loading, error };
}
