"use client";

import { useCallback } from "react";
import AskModal from "@/components/AskModal";
import { usePathname } from "@/hooks/usePathname";

export default function AskModalController() {
  const pathname = usePathname();
  const isOpen = pathname === "/ask";

  const close = useCallback(() => {
    window.location.href = "/";
  }, []);

  return <AskModal open={isOpen} onClose={close} />;
}
