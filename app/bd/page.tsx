import type { Metadata } from "next";
import BirthdayCountdown from "@/app/components/BirthdayCountdown";

export const metadata: Metadata = {
  title: "birthday countdown - maple",
};

export default function BdPage() {
  return <BirthdayCountdown />;
}
