"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function useAskModalOpen(): boolean {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return pathname === "/ask" || searchParams.get("modal") === "ask";
}
