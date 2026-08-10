export async function proxyGet(upstream: string, request: Request): Promise<Response> {
  const url = new URL(upstream);
  url.search = new URL(request.url).search;
  const res = await fetch(url, {
    headers: { accept: request.headers.get("accept") ?? "*/*" },
  });
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": res.headers.get("Cache-Control") ?? "no-store",
    },
  });
}
