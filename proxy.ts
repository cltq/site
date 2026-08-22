import { NextResponse, type NextRequest } from "next/server";

const MARKDOWN_MATCHER =
  /^(?!.*(_next\/static|_next\/image|favicon\.png|robots\.txt|sitemap\.xml|api\/)).*$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ask") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("modal", "ask");
    return NextResponse.rewrite(url);
  }

  const accept = request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) {
    return NextResponse.next();
  }
  if (!MARKDOWN_MATCHER.test(pathname)) {
    return NextResponse.next();
  }

  const markdownUrl = request.nextUrl.clone();
  markdownUrl.pathname = "/api/markdown";
  markdownUrl.searchParams.set("path", pathname + request.nextUrl.search);
  return NextResponse.rewrite(markdownUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.png|robots.txt|sitemap.xml|api/).*)"],
};
