"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { SpotifyData } from "@/lib/discord/types";
import { fetchSpotify } from "@/lib/spotify/api";

interface UseSpotifyReturn {
  spotify: SpotifyData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSpotify(pollInterval = 30000, enabled = true): UseSpotifyReturn {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastRequestTime = useRef<number>(0);

  const load = useCallback(async (signal?: AbortSignal) => {
    // Prevent too frequent requests (minimum 2 seconds between requests)
    const now = Date.now();
    if (now - lastRequestTime.current < 2000) {
      // If we're called too frequently, just return the last known data
      return;
    }
    lastRequestTime.current = now;

    try {
      setLoading(true);
      const data = await fetchSpotify(signal);
      // Only update state if the request wasn't aborted
      if (!signal?.aborted) {
        setSpotify(data);
        setError(null);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (!signal?.aborted) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const startPolling = (ctrl: AbortController) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      if (!ctrl.signal.aborted) {
        load(ctrl.signal);
      }
    }, pollInterval);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const refetch = useCallback(async () => {
    // Clear any existing poll to prevent conflicts
    stopPolling();

    const controller = new AbortController();
    abortRef.current = controller;
    await load(controller.signal);

    // Restart polling if enabled
    if (enabled) {
      startPolling(controller);
    }
  }, [enabled, load]);

  useEffect(() => {
    if (!enabled) {
      setSpotify(null);
      setLoading(false);
      setError(null);
      stopPolling();
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    load(controller.signal);
    startPolling(controller);

    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling(controller);
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

  return { spotify, loading, error, refetch };
}
