"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { DiscordPresence } from "@/lib/discord/types";
import { fetchDiscordPresence, getBaseUrl } from "@/lib/discord/api";
import { SSEManager } from "@/lib/discord/sse";

interface UseDiscordPresenceOptions {
  apiBaseUrl?: string;
  pollInterval?: number;
  paused?: boolean;
}

interface UseDiscordPresenceReturn {
  presence: DiscordPresence | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDiscordPresence(
  options: UseDiscordPresenceOptions = {},
): UseDiscordPresenceReturn {
  const [presence, setPresence] = useState<DiscordPresence | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const sseRef = useRef<SSEManager<DiscordPresence> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const baseUrl = options.apiBaseUrl;

  const fetchInitial = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const data = await fetchDiscordPresence(baseUrl, signal);
        setPresence(data);
        setError(null);
        return data;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return null;
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      }
    },
    [baseUrl],
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchInitial();
    setLoading(false);
  }, [fetchInitial]);

  useEffect(() => {
    if (options.paused) return;

    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    fetchInitial(abortController.signal).then(() => {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    });

    const sse = new SSEManager<DiscordPresence>();
    sseRef.current = sse;

    const sseUrl = `${getBaseUrl(baseUrl)}/live`;

    sse.connect(
      sseUrl,
      {
        onMessage: (data) => {
          setPresence(data);
          setError(null);
        },
        onError: () => {
          setError(new Error("Discord presence connection failed"));
        },
      },
      "presence_update",
    );

    const startPolling = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      const pollInterval = options.pollInterval ?? 60000;
      pollRef.current = setInterval(() => {
        if (!abortController.signal.aborted) {
          fetchInitial(abortController.signal);
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
      sse.destroy();
      sseRef.current = null;
      abortController.abort();
      abortRef.current = null;
    };
  }, [options.paused, baseUrl, fetchInitial, options.pollInterval]);

  return { presence, loading, error, refetch };
}
