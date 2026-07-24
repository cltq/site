"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setVisible(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
    >
      {children}
    </div>
  );
}
