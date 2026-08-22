"use client";

import { memo } from "react";

const WEEKDAYS = [
  { label: "Sun", index: 0 },
  { label: "Mon", index: 1 },
  { label: "Tue", index: 2 },
  { label: "Wed", index: 3 },
  { label: "Thu", index: 4 },
  { label: "Fri", index: 5 },
  { label: "Sat", index: 6 },
];

function WeekLabelsInner() {
  return (
    <div className="flex flex-col gap-[2px] pt-[18px] pr-2" aria-hidden="true">
      {WEEKDAYS.filter((_, i) => i % 2 === 1).map((day) => (
        <span
          key={day.index}
          className="flex h-[12px] items-center text-[10px] text-[#d4d4d4] sm:h-[13px]"
        >
          {day.label}
        </span>
      ))}
    </div>
  );
}

const WeekLabels = memo(WeekLabelsInner);
export default WeekLabels;
