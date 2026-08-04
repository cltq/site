"use client";

import { ExternalLink, Mail } from "lucide-react";
interface ContactCardPlatform {
  name: string;
  icon: React.ReactNode;
  username: string;
  description: string;
  href: string;
  copyValue: string;
}

interface ContactCardProps {
  platform: ContactCardPlatform;
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export const githubPlatform: ContactCardPlatform = {
  name: "GitHub",
  icon: <GitHubIcon />,
  username: "@cltq",
  description: "repos & projects",
  href: "https://github.com/cltq",
  copyValue: "cltq",
};

export const discordPlatform: ContactCardPlatform = {
  name: "Discord",
  icon: <DiscordIcon />,
  username: "@fumiiz",
  description: "fastest way to reach me",
  href: "https://discord.com/users/969088519161139270",
  copyValue: "fumiiz",
};

export const emailPlatform: ContactCardPlatform = {
  name: "Email",
  icon: <Mail size={20} />,
  username: "me@applefumi.xyz",
  description: "email me anytime",
  href: "mailto:me@applefumi.xyz",
  copyValue: "me@applefumi.xyz",
};

const iconContainerClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-300";

export default function ContactCard({ platform }: ContactCardProps) {
  return (
    <div
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#111] via-[#151515] to-[#1a1a1a] px-5 py-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/[0.12]"
      style={{ boxShadow: "0 10px 40px rgba(0,0,0,.35)" }}
    >
      <div className={iconContainerClass}>
        {platform.icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-white">{platform.username}</span>
        <span className="text-xs text-gray-500">{platform.description}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <a
          href={platform.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${platform.name} profile`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[#9C9C9C] outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-[#c4c4c4] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
