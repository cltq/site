"use client";

import { memo } from "react";
import { getContributionColor, formatDateLong } from "./utils";
import type { CalendarDay } from "./utils";

interface HeatmapCellProps {
  day: CalendarDay;
}

function HeatmapCellInner({ day }: HeatmapCellProps) {
  const color = getContributionColor(day.count);
  const label = `${formatDateLong(day.date)}, ${day.count} contribution${day.count !== 1 ? "s" : ""}`;

  return (
    <div
      role="gridcell"
      tabIndex={0}
      aria-label={label}
      title={label}
      className="h-[12px] w-[12px] rounded-[2px] transition-all duration-150 outline-none hover:scale-150 hover:brightness-125 focus:ring-1 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-[#06000d] sm:h-[13px] sm:w-[13px]"
      style={{ backgroundColor: color }}
    />
  );
}

const HeatmapCell = memo(HeatmapCellInner);
export default HeatmapCell;
