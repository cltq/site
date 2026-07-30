import Reveal from "@/app/components/Reveal";
import TechStack from "@/app/components/TechStack";
import GitHubContributions from "@/app/components/GitHubContributions";

export default function DevelopmentPage() {
  const githubUser = process.env.GITHUB_USERNAME ?? "";

  return (
    <div className="flex flex-col">
      <section className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8">
        <Reveal className="flex w-full max-w-4xl flex-col items-start gap-12 sm:gap-16">
          <h2 className="text-xl font-semibold tracking-tight text-[#fafafa] sm:text-2xl">
            Development
          </h2>

          <div className="flex w-full flex-col items-start gap-3 sm:gap-4">
            <h3 className="text-xs font-medium tracking-wide text-[#a3a3a3] uppercase sm:text-sm">
              Stacks
            </h3>
            <TechStack />
          </div>

          <div className="flex w-full flex-col items-start gap-4 sm:gap-6">
            <h3 className="text-xs font-medium tracking-wide text-[#a3a3a3] uppercase sm:text-sm">
              Contributions
            </h3>
            <GitHubContributions username={githubUser} />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
