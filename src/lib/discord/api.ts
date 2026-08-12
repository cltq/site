import type {
  ApiResponse,
  DiscordPresence,
  DiscordProfile,
  DiscordStatusData,
  DiscordBadgeData,
  DiscordGuildData,
} from "@/lib/discord/types";

const DEFAULT_BASE = "/api/discord";
const REQUEST_TIMEOUT = 10000; // 10 second timeout

export function getBaseUrl(customBase?: string): string {
  if (customBase) return customBase;
  return DEFAULT_BASE;
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  const mergedSignal = signal || controller.signal;
  // Handle both signals - if either aborts, we abort
  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) {
throw new Error(`API error: ${res.status}`);
    }
    return res.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("API request timeout or was cancelled");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchDiscordPresence(
  baseUrl?: string,
  signal?: AbortSignal,
): Promise<DiscordPresence> {
  const url = getBaseUrl(baseUrl);
  const json = await fetchJson<ApiResponse<DiscordPresence>>(url, signal);
  return json.data;
}

export async function fetchDiscordProfile(
  baseUrl?: string,
  signal?: AbortSignal,
): Promise<DiscordProfile> {
  const url = `${getBaseUrl(baseUrl)}/profile`;
  const json = await fetchJson<ApiResponse<DiscordProfile>>(url, signal);
  return json.data;
}

export async function fetchDiscordStatus(
  baseUrl?: string,
  signal?: AbortSignal,
): Promise<DiscordStatusData> {
  const url = `${getBaseUrl(baseUrl)}/status`;
  const json = await fetchJson<ApiResponse<DiscordStatusData>>(url, signal);
  return json.data;
}

export async function fetchDiscordBadges(
  baseUrl?: string,
  signal?: AbortSignal,
): Promise<DiscordBadgeData> {
  const url = `${getBaseUrl(baseUrl)}/badges`;
  const json = await fetchJson<ApiResponse<DiscordBadgeData>>(url, signal);
  return json.data;
}

export async function fetchDiscordGuild(
  baseUrl?: string,
  signal?: AbortSignal,
): Promise<DiscordGuildData> {
  const url = `${getBaseUrl(baseUrl)}/guild`;
  const json = await fetchJson<ApiResponse<DiscordGuildData>>(url, signal);
  return json.data;
}

export async function fetchDiscordHealth(
  baseUrl?: string,
  signal?: AbortSignal,
): Promise<{ status: string }> {
  const url = `${getBaseUrl(baseUrl)}/../health`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return { status: await res.text() };
}
