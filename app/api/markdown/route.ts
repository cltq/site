import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

turndown.remove(["script", "style", "nav", "footer", "noscript"]);

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") || "/";

  try {
    const origin = url.origin;
    const res = await fetch(`${origin}${path}`, {
      headers: { Accept: "text/html" },
    });

    if (!res.ok) {
      return new Response("Not Found", { status: 404 });
    }

    const html = await res.text();
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : html;

    const markdown = turndown.turndown(bodyHtml);
    const tokens = markdown.split(/\s+/).length;

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(tokens),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Conversion failed", { status: 500 });
  }
}
