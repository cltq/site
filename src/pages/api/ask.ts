export const prerender = false;

export async function POST({ request }: { request: Request }) {
  const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL as string | undefined;
  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: "Webhook not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const name = (body.name as string)?.trim() || "Anonymous";
  const message = (body.message as string)?.trim();

  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
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
    return new Response(JSON.stringify({ error: "Failed to send webhook", detail: text }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
