import GitHubRepos from "@/app/components/GitHubRepos";

export default function ProjectPage() {
  const githubUser = process.env.GITHUB_USERNAME ?? "";
  const githubBlacklist =
    process.env.GITHUB_BLACKLIST?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <div className="flex flex-col">
      <section className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8">
        <div className="flex w-full max-w-4xl flex-col items-start gap-12 sm:gap-16">
          <p className="mb-2 text-xs tracking-widest text-[#737373]">ー projects</p>

          <p className="max-w-lg text-sm text-[#a3a3a3] sm:text-base">
            Most of my projects are on{" "}
            <a
              href={`https://github.com/${githubUser}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fafafa] underline underline-offset-2 transition-colors hover:text-white"
            >
              GitHub
            </a>
            .
          </p>

          <GitHubRepos username={githubUser} blacklist={githubBlacklist} />
        </div>
      </section>
    </div>
  );
}
