import Reveal from "@/app/components/Reveal";
import BirthdaySection from "@/app/components/BirthdaySection";

export default function BirthdayPage() {
  return (
    <div className="flex flex-col">
      <section className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8">
        <Reveal className="flex w-full max-w-4xl flex-col items-center gap-12 text-center sm:gap-16">
          <p className="mb-2 w-full text-left text-xs tracking-widest text-[#737373]">
            — birthday
          </p>
          <BirthdaySection />
        </Reveal>
      </section>
    </div>
  );
}
