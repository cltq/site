import Reveal from "@/app/components/Reveal";

const contactMethods = [
  {
    name: "Email",
    value: "me@applefumi.xyz",
    href: "mailto:me@applefumi.xyz",
  },
  {
    name: "GitHub",
    value: "@cltq",
    href: "https://github.com/cltq",
  },
  {
    name: "Discord",
    value: "@fumiiz",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section
        className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8"
        style={{
          fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <Reveal className="flex w-full max-w-lg flex-col items-center gap-10 sm:gap-12">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-[#fafafa] sm:text-2xl">
              Contact
            </h2>
            <p className="text-sm text-[#a3a3a3]">
              Reach out anytime.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {contactMethods.map((method) => {
              const Tag = method.href ? "a" : "div";
              return (
                <Tag
                  key={method.name}
                  {...(method.href ? { href: method.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="text-sm font-medium text-[#fafafa] transition-colors group-hover:text-white">
                        {method.name}
                      </span>
                      <span className="text-xs text-[#7c7c7c]">{method.value}</span>
                    </div>
                  </div>
                  {method.href && (
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
                  )}
                </Tag>
              );
            })}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
