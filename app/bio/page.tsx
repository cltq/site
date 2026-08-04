interface Biolink {
  name: string;
  url: string;
  description?: string;
}

interface PlatformLink {
  name: string;
  url: string;
  description?: string;
}

const allowedBiolinkDomains = [
  "haunt.gg",
  "guns.lol",
  "linktr.ee",
  "beacons.ai",
  "carrd.co",
  "bio.link",
  "taplink.cc",
  "solo.to",
];

const platformLinks: PlatformLink[] = [
  { name: "Haunt", url: "https://haunt.gg/fumi" },
  { name: "Haunt", url: "https://haunt.gg/miyuki" },
  { name: "Haunt", url: "https://haunt.gg/168" },
  { name: "Guns", url: "https://guns.lol/fumiiz" },
];

function getHostname(url: string) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function renderPlatformIcon(url: string, name: string) {
  const commonClasses = "flex h-10 w-10 items-center justify-center";
  const domain = getHostname(url);

  if (domain) {
    return (
      <div className={commonClasses}>
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=96`}
          alt={`${name} logo`}
          className="h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`${commonClasses} text-sm font-semibold text-[#fafafa] drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]`}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function isAllowedBiolink(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return allowedBiolinkDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

function formatUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "") + new URL(url).pathname;
  } catch {
    return url.replace(/^https?:\/\//i, "");
  }
}

const visibleLinks = platformLinks.filter((link) => isAllowedBiolink(link.url));

export default function BioPage() {
  return (
    <div className="flex flex-col">
      <section
        className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8"
        style={{
          fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div className="flex w-full max-w-lg flex-col items-center gap-10 text-center sm:gap-12">
          <div className="flex w-full flex-col items-center gap-2">
            <p className="mb-2 w-full text-left text-xs tracking-widest text-[#737373]">ー bio</p>
            <p className="text-sm text-[#a3a3a3]">
              All my biolinks. Click on any link to visit it!
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {visibleLinks.map((link) => (
              <a
                key={`${link.name}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex flex-1 items-center gap-3">
                  {renderPlatformIcon(link.url, link.name)}
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-col items-start gap-0.5">
                      <span className="text-sm font-medium text-[#fafafa] transition-colors group-hover:text-white">
                        {link.name}
                      </span>
                      {link.description && (
                        <span className="text-xs text-[#a3a3a3]">{link.description}</span>
                      )}
                    </div>
                    <span className="truncate text-xs text-[#7c7c7c]">{formatUrl(link.url)}</span>
                  </div>
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
        </div>
      </section>
    </div>
  );
}
