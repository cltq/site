"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

export default function CopyButton({ text, label, compact, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [text]);

  const size = compact
    ? { h: "h-8", gap: "gap-1.5", rounded: "rounded-lg", px: "px-3", text: "text-xs", icon: 14 }
    : { h: "h-10", gap: "gap-2", rounded: "rounded-xl", px: "px-4", text: "text-sm", icon: 16 };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label || text}`}
      className={`inline-flex ${size.h} items-center ${size.gap} ${size.rounded} border border-white/[0.08] bg-white/[0.03] ${size.px} ${size.text} font-medium text-[#9C9C9C] transition-all duration-200 ease-out outline-none hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-[#c4c4c4] focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98] ${className}`}
    >
      {copied ? (
        <>
          <Check size={size.icon} className="text-green-400" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={size.icon} />
          {label || "Copy"}
        </>
      )}
    </button>
  );
}
