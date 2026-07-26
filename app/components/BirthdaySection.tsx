"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function formatNumber(num: number, digits = 2) {
  return num.toString().padStart(digits, "0");
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Fumi&apos;s Birthday & New Year Countdown
        </h3>
        <p className="mt-2 text-xs text-zinc-500">
          Until 31/12/{new Date().getFullYear() + 1}
        </p>
      </motion.div>

      <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {units.map((unit, i) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
            whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.2)" }}
            className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5"
          >
            <motion.span
              key={unit.value}
              initial={{ opacity: 0.6, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-3xl font-bold tabular-nums text-white sm:text-4xl"
            >
              {unit.value}
            </motion.span>
            <span className="text-xs tracking-widest text-zinc-500 uppercase">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
