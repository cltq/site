export async function GET() {
  const body = {
    serverInfo: {
      name: "fumi-site",
      version: "1.0.0",
    },
    endpoint: "/mcp",
    capabilities: {
      tools: {},
      resources: {},
    },
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
