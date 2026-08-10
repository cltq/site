import { defineMiddleware } from "astro:middleware";

const MARKDOWN_MATCHER = /^(?!.*(_astro\/|favicon\.png|robots\.txt|sitemap\.xml|api\/)).*$/;

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname === "/ask") {
    const url = new URL(context.url);
    url.pathname = "/";
    url.searchParams.set("modal", "ask");
    return context.rewrite(url);
  }

  const accept = context.request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) {
    return next();
  }
  if (!MARKDOWN_MATCHER.test(pathname)) {
    return next();
  }

  const markdownUrl = new URL(context.url);
  markdownUrl.pathname = "/api/markdown";
  markdownUrl.searchParams.set("path", pathname + context.url.search);
  return context.rewrite(markdownUrl);
});
