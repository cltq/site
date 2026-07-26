import { NextResponse } from "next/server";
import { fetchContributions } from "@/app/lib/github/contributions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }
  try {
    const data = await fetchContributions(username);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 502 });
  }
}
