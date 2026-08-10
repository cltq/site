type CacheEntry = { data: unknown; expires: number };

const cache = new Map<string, CacheEntry>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expires > Date.now()) return entry.data as T;
  cache.delete(key);
  return null;
}

export function setCached(key: string, data: unknown, ttlMs: number): void {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}
