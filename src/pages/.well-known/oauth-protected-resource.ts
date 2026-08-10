const domains = ["https://applefumi.xyz", "https://w.vreni.xyz"];

export async function GET() {
  const body = {
    resource: domains[0],
    authorization_servers: domains,
    scopes_supported: ["read"],
    bearer_methods_supported: ["header"],
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
