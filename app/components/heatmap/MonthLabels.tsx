"use client";

import { memo } from "react";

interface MonthLabelsProps {
  labels: { label: string; weekIndex: number }[];
}

function MonthLabelsInner({ labels }: MonthLabelsProps) {
  return (
    <div className="relative h-4 w-full" aria-hidden="true">
      {labels.map((item) => (
        <span
          key={`${item.label}-${item.weekIndex}`}
          className="absolute text-[10px] text-[#8b949e]"
          style={{
            left: `${item.weekIndex * 15}px`,
          }}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}

const MonthLabels = memo(MonthLabelsInner);
export default MonthLabels;
