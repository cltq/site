"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

function formatNumber(num: number, digits = 2) {
  return num.toString().padStart(digits, "0");
}

export default function BirthdayCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const target = new Date(currentYear + 1, 0, 1);

      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((difference % 1000) / 10);

        setTimeLeft({ days, hours, minutes, seconds, milliseconds });
      }

      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
    };

    const interval = setInterval(updateCountdown, 10);
    updateCountdown();
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: formatNumber(timeLeft.days, 3) },
    { label: "Hours", value: formatNumber(timeLeft.hours) },
    { label: "Minutes", value: formatNumber(timeLeft.minutes) },
    { label: "Seconds", value: formatNumber(timeLeft.seconds) },
  ];

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#000000] px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-5xl flex-col items-center gap-10 sm:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <p className="mb-2 text-xs tracking-widest text-[#a3a3a3] uppercase">
            {currentDate} &mdash; {currentTime}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-xl font-semibold tracking-tight text-[#fafafa] sm:text-2xl md:text-3xl">
            Fumi&apos;s Birthday & New Year Countdown
          </h1>
          <p className="mt-3 text-sm text-[#a3a3a3]">Until 31/12/{new Date().getFullYear() + 1}</p>
        </motion.div>

        <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {units.map((unit, i) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.25 + i * 0.08,
                ease: "easeOut",
              }}
              className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 lg:p-8"
            >
              <motion.span
                key={unit.value}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-3xl font-bold text-[#fafafa] tabular-nums sm:text-5xl lg:text-6xl"
              >
                {unit.value}
              </motion.span>
              <span className="text-[10px] tracking-widest text-[#a3a3a3] uppercase sm:text-xs">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
