"use client";

import { useCallback } from "react";
import AskModal from "@/components/AskModal";
import { useAskModalOpen } from "@/hooks/useAskModalOpen";

export default function AskModalController() {
  const isOpen = useAskModalOpen();

  const close = useCallback(() => {
    window.location.href = "/";
  }, []);

  return <AskModal open={isOpen} onClose={close} />;
}
