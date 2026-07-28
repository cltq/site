import { NextRequest, NextResponse } from "next/server";

const links: Record<string, string> = {
  github: "https://github.com/cltq",
  discord: "https://discord.com/users/969088519161139270",
  haunt: "https://haunt.gg/fumi",
  easydonate: "https://easydonate.com/ivnfumi",
  instagram: "https://www.instagram.com/lnfumi._",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const url = links[name.toLowerCase()];

  if (!url) {
    return NextResponse.json({ error: "Unknown link" }, { status: 404 });
  }

  return NextResponse.redirect(url, 302);
}
