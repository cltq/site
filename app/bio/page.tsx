import Reveal from "@/app/components/Reveal";

interface Biolink {
  name: string;
  url: string;
  description?: string;
}

const biolinks: Biolink[] = [
  { name: "GitHub", url: "https://github.com/cltq", description: "Code & open source" },
  { name: "Discord", url: "https://discord.com/users/969088519161139270", description: "Chat & community" },
  { name: "Instagram", url: "https://instagram.com/lvfumi._", description: "Photography & daily" },
  { name: "TikTok", url: "https://tiktok.com/@w.fysk_fumi", description: "Videos & clips" },
  { name: "Haunt", url: "https://haunt.gg/fumi", description: "Gaming profile" },
  { name: "EasyDonate", url: "https://easydonate.app/ivnfumi", description: "Donations & support" },
];

export default function BioPage() {
  return (
    <div className="flex flex-col">
      <section className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8">
        <Reveal className="flex w-full max-w-lg flex-col items-center gap-10 sm:gap-12">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-[#fafafa] sm:text-2xl">
              Bio Links
            </h2>
            <p className="text-sm text-[#a3a3a3]">
              All the places you can find me
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {biolinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium text-[#fafafa] transition-colors group-hover:text-white">
                    {link.name}
                  </span>
                  {link.description && (
                    <span className="text-xs text-[#a3a3a3]">{link.description}</span>
                  )}
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-[#525252] transition-colors group-hover:text-[#a3a3a3]"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
