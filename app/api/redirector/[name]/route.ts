interface RedirectorParams {
  params: Promise<{ name: string }>;
}

const links: Record<string, string> = {
  github: "https://github.com/cltq",
  discord: "https://discord.com/users/969088519161139270",
  haunt: "https://haunt.gg/fumi",
  easydonate: "https://easydonate.com/ivnfumi",
  instagram: "https://www.instagram.com/lnfumi._",
};

export async function GET(_request: Request, { params }: RedirectorParams): Promise<Response> {
  const { name } = await params;
  const url = links[name.toLowerCase()];

  if (!url) {
    return Response.json({ error: "Unknown link" }, { status: 404 });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: url },
  });
}
