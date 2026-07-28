"use client";

const links = [
  {
    label: "Instagram",
    handle: "lvfumi._",
    href: "https://instagram.com/lvfumi._",
    hover: "hover:text-[#a3a3a3]",
  },
  {
    label: "TikTok",
    handle: "w.fysk_fumi",
    href: "https://tiktok.com/@w.fysk_fumi",
    hover: "hover:text-[#89dceb]",
  },
  {
    label: "EasyDonate",
    handle: "ivnfumi",
    href: "https://easydonate.app/ivnfumi",
    hover: "hover:text-[#d4d4d4]",
  },
];

function LinkSet() {
  return (
    <span className="flex items-center gap-6 whitespace-nowrap">
      {links.map((link) => (
        <span key={link.label} className="flex items-center gap-1.5">
          <span className="text-[#a3a3a3]">{link.label}:</span>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[#fafafa] ${link.hover} transition-colors duration-200`}
          >
            {link.handle}
          </a>
        </span>
      ))}
      <span className="text-xs text-[#525252]">+</span>
    </span>
  );
}

export default function InfiniteMarquee() {
  return (
    <div className="group overflow-hidden">
      <div
        className="animate-marquee flex w-max items-center text-[13px] will-change-transform group-hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <LinkSet key={i} />
        ))}
      </div>
    </div>
  );
}
