"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  type ContributionDay,
  generateCalendarDays,
  groupDaysIntoWeeks,
  getMonthLabels,
} from "./utils";
import HeatmapCell from "./HeatmapCell";
import MonthLabels from "./MonthLabels";
import WeekLabels from "./WeekLabels";
import Legend from "./Legend";

export interface HeatmapProps {
  data: ContributionDay[];
  startDate?: Date;
  endDate?: Date;
}

export default function Heatmap({ data, startDate, endDate }: HeatmapProps) {
  const now = new Date();
  const end = endDate ?? now;
  const start = startDate
    ? new Date(startDate)
    : (() => { const d = new Date(end); d.setFullYear(d.getFullYear() - 1); d.setDate(d.getDate() + 1); return d; })();

  const weeks = useMemo(() => {
    const days = generateCalendarDays(start, end, data);
    return groupDaysIntoWeeks(days);
  }, [data, start.getTime(), end.getTime()]);

  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full flex-col items-center gap-4"
    >
      <div className="mx-auto w-full max-w-fit overflow-x-auto">
        <div className="inline-flex items-start px-1">
          <WeekLabels />
          <div className="flex flex-col">
            <MonthLabels labels={monthLabels} />
            <div
              role="grid"
              aria-label="GitHub contribution heatmap"
              className="flex gap-[2px]"
            >
              {weeks.map((week, w) => (
                <div key={w} className="flex flex-col gap-[2px]">
                  {week.map((day, d) =>
                    day ? (
                      <HeatmapCell key={day.dateStr} day={day} />
                    ) : (
                      <div key={`empty-${w}-${d}`} className="h-[12px] w-[12px] sm:h-[13px] sm:w-[13px]" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Legend />
    </motion.div>
  );
}
