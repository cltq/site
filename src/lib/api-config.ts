/**
 * Centralized API configuration
 * Update these URLs to change the upstream API endpoints
 */

export const API_CONFIG = {
  // Base API upstream
  base: process.env.UPSTREAM_API || "https://api.mapleji.xyz",
  
  // Spotify API upstream (different host)
  spotify: process.env.SPOTIFY_API || "https://spotify.mapleji.xyz",
};

/**
 * Helper to build API URLs with the configured base
 */
export function getApiUrl(path: string): string {
  return `${API_CONFIG.base}/${path}`.replace(/\/+/g, "/").replace(/:\/$/, "");
}

export function getSpotifyUrl(path: string): string {
  return `${API_CONFIG.spotify}/${path}`.replace(/\/+/g, "/").replace(/:\/$/, "");
}
