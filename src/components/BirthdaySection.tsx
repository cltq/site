"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function formatNumber(num: number, digits = 2) {
  return num.toString().padStart(digits, "0");
}

function FlipDigit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06]">
        <div className="flex h-28 w-28 items-center justify-center sm:h-24 sm:w-24">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute text-3xl font-bold text-[#f0e8ff] tabular-nums sm:text-5xl"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.06]" />
      </div>
      <span className="text-[10px] tracking-widest text-[#c8b8e0] uppercase sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function BirthdaySection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const target = new Date(now.getFullYear() + 1, 0, 1);
      const diff = target.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    const interval = setInterval(update, 1000);
    update();
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: formatNumber(timeLeft.days, 3) },
    { label: "Hours", value: formatNumber(timeLeft.hours) },
    { label: "Minutes", value: formatNumber(timeLeft.minutes) },
    { label: "Seconds", value: formatNumber(timeLeft.seconds) },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="text-center">
        <p className="mb-2 text-xs tracking-widest text-[#c8b8e0]">
          — Fumi&apos;s Birthday &amp; New Year Countdown
        </p>
        <p className="mt-2 text-xs text-[#c8b8e0]">Until 31/12/{new Date().getFullYear() + 1}</p>
      </div>

      <div className="grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-4 sm:gap-4">
        {units.map((unit) => (
          <FlipDigit key={unit.label} value={unit.value} label={unit.label} />
        ))}
      </div>
    </div>
  );
}
