"use client";

import { useEffect, useState } from "react";

function useTime(timeZone?: string) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          ...(timeZone ? { timeZone } : {}),
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}

export default function AvailabilityStatus() {
  const myTime = useTime("Asia/Bangkok");
  const visitorTime = useTime();

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
      <span className="text-gray-500">{myTime || "--:--"}</span>
      {visitorTime && (
        <>
          <span className="text-gray-600">|</span>
          <span className="text-gray-500">{visitorTime}</span>
        </>
      )}
    </div>
  );
}
