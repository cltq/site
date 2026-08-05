import type { Metadata } from "next";
import TechStack from "@/app/components/TechStack";
import GitHubContributions from "@/app/components/GitHubContributions";

export const metadata: Metadata = {
  title: "development - maple",
};

export default function DevelopmentPage() {
  const githubUser = process.env.GITHUB_USERNAME ?? "";

  return (
    <div className="flex flex-col">
      <section className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8">
        <div className="flex w-full max-w-4xl flex-col items-center gap-12 text-center sm:gap-16">
          <p className="mb-2 w-full text-left text-xs tracking-widest text-[#737373]">
            ー development
          </p>

          <div className="flex w-full flex-col items-center gap-3 sm:gap-4">
            <p className="text-xs tracking-widest text-[#737373]">stacks</p>
            <TechStack />
          </div>

          <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
            <p className="text-xs tracking-widest text-[#737373]">contributions</p>
            <GitHubContributions username={githubUser} />
          </div>
        </div>
      </section>
    </div>
  );
}
