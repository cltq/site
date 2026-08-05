import type { Metadata } from "next";
import BirthdayCountdown from "@/app/components/BirthdayCountdown";

export const metadata: Metadata = {
  title: "Birthday Countdown - Maple",
};

export default function BdPage() {
  return <BirthdayCountdown />;
}
