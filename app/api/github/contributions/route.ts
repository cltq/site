import { fetchContributions } from "@/lib/github/contributions";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  if (!username) {
    return Response.json({ error: "username required" }, { status: 400 });
  }
  try {
    const data = await fetchContributions(username);
    return Response.json(data);
  } catch {
    return Response.json({ error: "Failed to fetch contributions" }, { status: 502 });
  }
}
