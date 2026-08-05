"use client";

import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";

const roles = ["Developer", "Photographer", "Normal Person"];

export default function HeroText() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [paused, setPaused] = useState(false);

  const current = roles[roleIndex];

  useEffect(() => {
    const handleVisibility = () => {
      setPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (paused) return;

    const speed = deleting ? 50 : 100;

    if (!deleting && charIndex === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 1500);
      return () => clearTimeout(timeoutRef.current!);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return () => {};
    }

    timeoutRef.current = setTimeout(() => {
      setCharIndex((prev) => prev + (deleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeoutRef.current!);
  }, [charIndex, deleting, current.length, roleIndex, paused]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center">
        <p className="text-base text-[#a3a3a3]">
          <span className="font-medium text-[#fafafa]">{current.slice(0, charIndex)}</span>
          <span className="animate-blink ml-0.5 inline-block h-[1.1em] w-[2px] bg-[#fafafa] align-middle" />
        </p>
      </div>
      <Separator className="w-16 bg-white/10" />
    </div>
  );
}
