"use client";

import { memo } from "react";
import { LEVEL_COLORS } from "./utils";

const LEVELS = [0, 1, 2, 3, 4];

function LegendInner() {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-[#a3a3a3]" aria-label="Contribution legend">
      <span>Less</span>
      {LEVELS.map((level) => (
        <div
          key={level}
          className="h-[12px] w-[12px] rounded-[2px]"
          style={{ backgroundColor: LEVEL_COLORS[level] }}
        />
      ))}
      <span>More</span>
    </div>
  );
}

const Legend = memo(LegendInner);
export default Legend;
