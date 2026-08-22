"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import AskModal from "@/components/AskModal";
import { useAskModalOpen } from "@/hooks/useAskModalOpen";

export default function AskModalController() {
  const isOpen = useAskModalOpen();
  const router = useRouter();

  const close = useCallback(() => {
    router.push("/");
  }, [router]);

  return <AskModal open={isOpen} onClose={close} />;
}
