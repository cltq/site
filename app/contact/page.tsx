import ContactHero from "@/components/ContactHero";
import SecondDiscordProfile from "@/components/SecondDiscordProfile";
import ContactCard from "@/components/ContactCard";
import AvailabilityStatus from "@/components/AvailabilityStatus";
import { githubPlatform, hauntPlatform } from "@/lib/platforms";

export const metadata = {
  title: "contact - maple",
};

const platforms = [githubPlatform, hauntPlatform];

export default function Contact() {
  return (
    <div className="flex flex-col">
      <section className="flex min-h-svh items-center justify-center px-4 pt-24 pb-24 sm:px-8">
        <div className="flex w-full max-w-2xl flex-col items-start gap-12">
          <div className="flex flex-col items-start gap-2">
            <p className="mb-2 text-xs tracking-widest text-[#a3a3a3]">&mdash; contact</p>
            <p className="text-sm text-gray-400">Reach out anytime. Just a hi is okay...</p>
          </div>

          <div className="flex w-full flex-col gap-6">
            <ContactHero />
            <SecondDiscordProfile />

            <div className="flex flex-col gap-4">
              {platforms.map((platform) => (
                <ContactCard key={platform.href} platform={platform} />
              ))}
            </div>

            <AvailabilityStatus />
          </div>
        </div>
      </section>
    </div>
  );
}
