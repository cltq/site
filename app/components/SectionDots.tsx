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
      className="fixed right-5 top-1/2 z-30 -translate-y-1/2 flex-col items-center gap-3 font-mono md:flex"
      aria-label="Section navigation"
    >
      {homeSections.map((section) => {
        const active = section.id === activeId;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group relative flex items-center justify-center"
            aria-label={section.name}
          >
            <motion.span
              className="block rounded-full"
              animate={
                active
                  ? { width: 10, height: 10, backgroundColor: "#ffffff" }
                  : { width: 6, height: 6, backgroundColor: "rgba(255,255,255,0.2)" }
              }
              whileHover={
                active
                  ? {}
                  : { backgroundColor: "rgba(255,255,255,0.4)" }
              }
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-md bg-[#0b0b0f]/80 px-2.5 py-1 text-xs text-zinc-400 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
              {section.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
