"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDiscordPresence } from "@/app/hooks/useDiscordPresence";
import { useSpotify } from "@/app/hooks/useSpotify";
import { useModalOpen } from "@/app/components/ModalOpenContext";
import { StatusBadge } from "@/app/components/discord/StatusBadge";
import { SpotifyCard } from "@/app/components/discord/SpotifyCard";
import { ActivityCycle } from "@/app/components/discord/ActivityCard";
import type { DiscordWidgetProps } from "@/app/lib/discord/types";
import { normalizeDiscordCdnUrl } from "@/app/lib/discord/url";
import LoadingSquares from "@/app/components/LoadingSquares";

function parseCustomStatus(
  cs: string | { text?: string; emoji?: { name?: string } | null } | null | undefined,
): { text: string; emoji?: string } | null {
  if (!cs) return null;
  if (typeof cs === "string") {
    return cs ? { text: cs } : null;
  }
  const text = cs.text || "";
  if (!text) return null;
  return {
    text,
    emoji: cs.emoji?.name || undefined,
  };
}

export default function DiscordWidget({
  showSpotify = true,
  showActivities = true,
  showCustomStatus = true,
  animated = true,
  compact = false,
  className = "",
  apiBaseUrl,
}: DiscordWidgetProps) {
  const modalOpen = useModalOpen();
  const { presence, loading, error } = useDiscordPresence({
    apiBaseUrl,
    paused: modalOpen,
  });
  const { spotify: spotifyData } = useSpotify(15000, showSpotify && !modalOpen);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LoadingSquares />
      </div>
    );
  }

  if (error || !presence) {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-lg text-[#a3a3a3]">
            ?
          </div>
          <div>
            <p className="text-[13px] text-[#a3a3a3]">
              {error ? "Failed to load presence" : "No presence data"}
            </p>
            <p className="mt-0.5 text-[11px] text-[#a3a3a3]">
              {error?.message ?? "User may not exist"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const customStatus = showCustomStatus ? parseCustomStatus(presence.customStatus) : null;

  const showSpotifySection = showSpotify && spotifyData;
  const showActivitySection = showActivities && (presence.activities?.length ?? 0) > 0;
  const hasPresence = customStatus || showSpotifySection || showActivitySection;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={presence.id}
        className={`relative flex flex-col items-center gap-4 ${className}`}
        initial={animated ? { opacity: 0, y: 20 } : undefined}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={animated ? { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } : undefined}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={normalizeDiscordCdnUrl(presence.avatar)}
                alt={`${presence.username}'s avatar`}
                width={compact ? 44 : 64}
                height={compact ? 44 : 64}
                loading="lazy"
                className="rounded-full object-cover"
                style={{ width: compact ? 44 : 64, height: compact ? 44 : 64 }}
              />
              <span className="absolute -right-0.5 -bottom-0.5">
                <StatusBadge
                  status={presence.status}
                  animated={animated}
                  size={compact ? 12 : 13}
                />
              </span>
            </div>

            <div>
              <p className="text-[15px] leading-tight font-semibold text-[#fafafa]">
                {presence.displayName || presence.username}
              </p>
              {presence.displayName && presence.displayName !== presence.username && (
                <p className="text-[14px] leading-tight text-[#a3a3a3]">@{presence.username}</p>
              )}
            </div>
          </div>

          {customStatus && (
            <p className="truncate text-center text-[13px] leading-tight text-[#a3a3a3]">
              {customStatus.emoji && <span className="mr-1">{customStatus.emoji}</span>}
              {customStatus.text}
            </p>
          )}
        </div>

        {(showSpotifySection || showActivitySection) && (
          <div className="w-full max-w-xs rounded-xl p-4 max-md:p-3 md:absolute md:top-1/2 md:right-full md:mr-6 md:w-80 md:-translate-y-1/2">
            <div className="flex flex-col items-center gap-4 max-md:gap-3">
              <AnimatePresence mode="sync">
                {showSpotifySection && (
                  <SpotifyCard key="spotify" spotify={spotifyData!} animated={animated} />
                )}
              </AnimatePresence>
              <AnimatePresence mode="sync">
                {showActivitySection && (
                  <motion.div
                    key="activities"
                    initial={animated ? { opacity: 0 } : undefined}
                    animate={animated ? { opacity: 1 } : undefined}
                    transition={animated ? { duration: 0.3, delay: 0.1 } : undefined}
                  >
                    <ActivityCycle activities={presence.activities} animated={animated} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
