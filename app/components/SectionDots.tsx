"use client";

import { useEffect, useState } from "react";
import { homeSections } from "@/app/routes";
import { motion } from "framer-motion";

export default function SectionDots() {
  const [activeId, setActiveId] = useState(homeSections[0].id);

  useEffect(() => {
    const root = document.getElementById("scroll-container");
    if (!root) return;

    const observers: IntersectionObserver[] = [];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    };

    for (const section of homeSections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const observer = new IntersectionObserver(handleIntersect, {
        root,
        threshold: 0.5,
      });
      observer.observe(el);
      observers.push(observer);
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      className="fixed left-3 top-0 z-30 flex h-full flex-col items-center justify-center gap-[10rem] font-mono md:left-5"
      aria-label="Section navigation"
    >
      {homeSections.map((section) => {
        const active = section.id === activeId;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="relative flex items-center"
            aria-label={section.name}
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-white/20" />
            {active && (
              <motion.span
                layoutId="active-dot"
                className="absolute left-0 top-1/2 block h-2 w-2 -translate-y-1/2 rounded-full bg-white sm:h-2.5 sm:w-2.5"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            {active && (
              <motion.span
                layoutId="section-label"
                className="pointer-events-none absolute left-5 whitespace-nowrap text-xs text-zinc-400"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {section.name}
              </motion.span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
