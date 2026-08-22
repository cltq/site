export async function POST(request: Request): Promise<Response> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.json();
  const name = (body.name as string)?.trim() || "Anonymous";
  const message = (body.message as string)?.trim();

  if (!message) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  const embed: Record<string, unknown> = {
    title: "New Question",
    description: message,
    color: 0xffffff,
    author: { name },
    timestamp: new Date().toISOString(),
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: "Failed to send webhook", detail: text }, { status: 502 });
  }

  return Response.json({ ok: true });
}
