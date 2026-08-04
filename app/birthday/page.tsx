import BirthdaySection from "@/app/components/BirthdaySection";

export default function BirthdayPage() {
  return (
    <div className="flex flex-col">
      <section className="flex min-h-svh items-center justify-center px-4 pt-24 pb-16 sm:px-8">
        <div className="flex w-full max-w-4xl flex-col items-start gap-12 sm:gap-16">
          <p className="mb-2 text-xs tracking-widest text-[#737373]">ー birthday</p>
          <BirthdaySection />
        </div>
      </section>
    </div>
  );
}
