import ContactHero from "@/app/components/ContactHero";
import ContactCard, { githubPlatform, hauntPlatform } from "@/app/components/ContactCard";
import AvailabilityStatus from "@/app/components/AvailabilityStatus";

export default function ContactPage() {
  const platforms = [githubPlatform, hauntPlatform];

  return (
    <div className="flex flex-col">
      <section className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8">
        <div className="flex w-full max-w-2xl flex-col items-start gap-12">
          <div className="flex flex-col items-start gap-2">
            <p className="mb-2 text-xs tracking-widest text-[#737373]">ー contact</p>
            <p className="text-sm text-gray-400">Reach out anytime. Just a hi is okay...</p>
          </div>

          <div className="flex w-full flex-col gap-6">
            <ContactHero />

            <div className="flex flex-col gap-4">
              {platforms.map((platform) => (
                <ContactCard key={platform.name} platform={platform} />
              ))}
            </div>

            <AvailabilityStatus />
          </div>
        </div>
      </section>
    </div>
  );
}
