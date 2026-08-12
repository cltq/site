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
 * Generic proxy function that supports all HTTP methods and forwards request body.
 * Use this for proxying any method (POST, PUT, DELETE, PATCH, etc).
 */
export async function proxy(
  upstream: string,
  request: Request
): Promise<Response> {
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

    console.log(`[proxy] ${request.method} Upstream: ${url.toString()}`);
    console.log(`[proxy] Headers:`, Object.fromEntries(
      Object.entries(forwardedHeaders).filter(([k]) => !k.toLowerCase().startsWith("authorization"))
    ));

    const res = await fetchWithTimeout(url.toString(), {
      method: request.method,
      headers: forwardedHeaders,
      body,
    });

    console.log(`[proxy] Response status: ${res.status}`);

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
  } catch (error) {
    console.error(`[proxy] Error:`, error);
    return new Response(JSON.stringify({ error: "Upstream service unavailable", details: String(error) }), {
      status: 502,
      statusText: "Bad Gateway",
      headers: { "Content-Type": "application/json" },
    });
  }
}
