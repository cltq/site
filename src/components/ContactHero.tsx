"use client";

import { ExternalLink } from "lucide-react";
import { useDiscordPresence } from "@/hooks/useDiscordPresence";
import { normalizeDiscordCdnUrl } from "@/lib/discord/url";
import CopyButton from "@/components/CopyButton";
import Skeleton from "@/components/Skeleton";

export default function ContactHero() {
  const { presence, loading } = useDiscordPresence();

  if (loading) {
    return (
      <div
        className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#0f0618] via-[#120820] to-[#160a24] px-4 py-3"
        style={{ boxShadow: "0 10px 40px rgba(0,0,0,.35)" }}
      >
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    );
  }

  const handle = presence?.username ?? "fumiiz";
  const avatar = presence ? normalizeDiscordCdnUrl(presence.avatar) : null;
  const profileUrl = presence ? `https://discord.com/users/${presence.id}` : null;

  return (
    <div
      className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#0f0618] via-[#120820] to-[#160a24] px-4 py-3 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/[0.12]"
      style={{ boxShadow: "0 10px 40px rgba(0,0,0,.35)" }}
    >
      <img
        src={avatar || ""}
        alt=""
        width={36}
        height={36}
        className="shrink-0 rounded-full object-cover"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 0 0 2px rgba(255,255,255,0.04)",
        }}
      />

      <h1 className="min-w-0 flex-1 text-base leading-none font-bold tracking-tight text-white">
        @{handle}
      </h1>

      <div className="flex shrink-0 items-center gap-2">
        <CopyButton text={handle} label="Copy" compact />
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Discord profile"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-[#9C9C9C] transition-all duration-200 ease-out outline-none hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-[#c4c4c4] focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
          >
            <ExternalLink size={14} />
            Open
          </a>
        )}
      </div>
    </div>
  );
}
