"use client";

const links = [
  {
    label: "Instagram",
    handle: "lvfumi._",
    href: "https://instagram.com/lvfumi._",
    hover: "hover:text-[#f5c2e7]",
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
    hover: "hover:text-[#a6e3a1]",
  },
];

function LinkSet() {
  return (
    <span className="flex items-center gap-6 whitespace-nowrap">
      {links.map((link) => (
        <span key={link.label} className="flex items-center gap-1.5">
          <span className="text-[#9399b2]">{link.label}:</span>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[#cdd6f4] ${link.hover} transition-colors duration-200`}
          >
            {link.handle}
          </a>
        </span>
      ))}
      <span className="text-xs text-[#6c7086]">+</span>
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
