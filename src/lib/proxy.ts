/**
 * Forward request headers that should be passed to the upstream API.
 * Excludes headers that should not be forwarded (host, connection, etc).
 */
function getForwardedHeaders(request: Request): Record<string, string> {
  const headersToForward = new Headers();
  const headersToSkip = new Set([
    "host",
    "connection",
    "content-length",
    "transfer-encoding",
    "expect",
    // Don't forward authorization to avoid leaking credentials if not needed
    // but we'll allow it - the caller should be careful
  ]);

  for (const [key, value] of request.headers.entries()) {
    if (!headersToSkip.has(key.toLowerCase())) {
      headersToForward.set(key, value);
    }
  }

  // Ensure User-Agent is present (Cloudflare requires this)
  if (!headersToForward.has("user-agent")) {
    headersToForward.set(
      "user-agent",
      "Mozilla/5.0 (compatible; Astro-Proxy/1.0)"
    );
  }

  return Object.fromEntries(headersToForward.entries());
}

/**
 * Fetch with timeout and retries for resilience against slow upstreams
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Proxy a GET request to an upstream URL, preserving query params and headers.
 */
export async function proxyGet(
  upstream: string,
  request: Request
): Promise<Response> {
  try {
    const url = new URL(upstream);
    url.search = new URL(request.url).search;

    const forwardedHeaders = getForwardedHeaders(request);

    console.log(`[proxyGet] Upstream: ${url.toString()}`);
    console.log(`[proxyGet] Headers:`, Object.fromEntries(
      Object.entries(forwardedHeaders).filter(([k]) => !k.toLowerCase().startsWith("authorization"))
    ));

    const res = await fetchWithTimeout(url.toString(), {
      method: "GET",
      headers: forwardedHeaders,
    });

    console.log(`[proxyGet] Response status: ${res.status}`);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
        "Cache-Control": res.headers.get("Cache-Control") ?? "no-store",
      },
    });
  } catch (error) {
    console.error(`[proxyGet] Error:`, error);
    return new Response(JSON.stringify({ error: "Upstream service unavailable", details: String(error) }), {
      status: 502,
      statusText: "Bad Gateway",
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Proxy to one of multiple upstream URLs, trying them in order until one succeeds.
 * Useful for having backup/fallback APIs.
 * 
 * @param upstreams - Array of upstream URLs to try in order
 * @param request - The original request
 * @returns Response from first successful upstream, or 502 if all fail
 */
export async function proxyWithFallback(
  upstreams: string[],
  request: Request
): Promise<Response> {
  if (upstreams.length === 0) {
    return new Response(JSON.stringify({ error: "No upstream URLs configured" }), {
      status: 502,
      statusText: "Bad Gateway",
      headers: { "Content-Type": "application/json" },
    });
  }

  const errors: string[] = [];

  for (let i = 0; i < upstreams.length; i++) {
    const upstream = upstreams[i];
    console.log(`[proxyWithFallback] Trying upstream ${i + 1}/${upstreams.length}: ${upstream}`);

    try {
      const url = new URL(upstream);
      // Preserve query parameters from original request
      url.search = new URL(request.url).search;

      const forwardedHeaders = getForwardedHeaders(request);

      // For methods that can have a body, read and forward it
      let body: BodyInit | undefined;
      if (
        request.method !== "GET" &&
        request.method !== "HEAD" &&
        request.method !== "OPTIONS"
      ) {
        body = await request.blob();
      }

      const res = await fetchWithTimeout(url.toString(), {
        method: request.method,
        headers: forwardedHeaders,
        body,
      });

      // Check if we got a successful response (2xx status)
      if (res.status >= 200 && res.status < 300) {
        console.log(`[proxyWithFallback] Success on upstream ${i + 1}: ${res.status}`);

        // Forward response headers (selectively)
        const responseHeaders = new Headers();
        const headersToForward = [
          "content-type",
          "content-length",
          "cache-control",
          "etag",
          "last-modified",
          "set-cookie",
          "access-control-allow-origin",
          "access-control-allow-methods",
          "access-control-allow-headers",
          "access-control-allow-credentials",
        ];

        for (const header of headersToForward) {
          const value = res.headers.get(header);
          if (value !== null) {
            responseHeaders.set(header, value);
          }
        }

        return new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
        });
      }

      // If we got a 4xx error, don't try the next one (likely a client error)
      if (res.status >= 400 && res.status < 500) {
        console.log(`[proxyWithFallback] Client error ${res.status}, not trying next upstream`);
        const responseHeaders = new Headers();
        const headersToForward = ["content-type", "cache-control"];

        for (const header of headersToForward) {
          const value = res.headers.get(header);
          if (value !== null) {
            responseHeaders.set(header, value);
          }
        }

        return new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
        });
      }

      // 5xx errors, try next upstream
      errors.push(`Upstream ${i + 1} (${upstream}): ${res.status}`);
      console.log(`[proxyWithFallback] Server error ${res.status}, trying next upstream...`);
    } catch (error) {
      errors.push(`Upstream ${i + 1} (${upstream}): ${String(error)}`);
      console.error(`[proxyWithFallback] Error on upstream ${i + 1}:`, error);
    }
  }

  // All upstreams failed
  console.error(`[proxyWithFallback] All upstreams failed:`, errors);
  return new Response(
    JSON.stringify({ error: "All upstream services unavailable", details: errors }),
    {
      status: 502,
      statusText: "Bad Gateway",
      headers: { "Content-Type": "application/json" },
    }
  );
}

