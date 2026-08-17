export type ContributionDay = {
  date: string;
  count: number;
};

export type CalendarDay = {
  date: Date;
  dateStr: string;
  count: number;
  dayOfWeek: number;
  weekIndex: number;
};

export const LEVEL_COLORS: Record<number, string> = {
  0: "#06000d",
  1: "#160a24",
  2: "#3d2860",
  3: "#523880",
  4: "#6848a0",
};

export function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export function getContributionColor(count: number): string {
  return LEVEL_COLORS[getContributionLevel(count)];
}

export function generateCalendarDays(
  startDate: Date,
  endDate: Date,
  data: ContributionDay[],
): CalendarDay[] {
  const dataMap = new Map<string, number>();
  for (const d of data) {
    dataMap.set(d.date, d.count);
  }

  const days: CalendarDay[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const dateStr = formatDate(current);
    days.push({
      date: new Date(current),
      dateStr,
      count: dataMap.get(dateStr) ?? 0,
      dayOfWeek: current.getDay(),
      weekIndex: 0,
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function groupDaysIntoWeeks(days: CalendarDay[]): CalendarDay[][] {
  if (days.length === 0) return [];

  const firstDayOfWeek = days[0].dayOfWeek;
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = new Array(firstDayOfWeek).fill(null);

  for (const day of days) {
    if (day.dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null as unknown as CalendarDay);
    }
    weeks.push(currentWeek);
  }

  for (let w = 0; w < weeks.length; w++) {
    for (let d = 0; d < weeks[w].length; d++) {
      if (weeks[w][d]) {
        weeks[w][d].weekIndex = w;
      }
    }
  }

  return weeks;
}

export function getMonthLabels(weeks: CalendarDay[][]): { label: string; weekIndex: number }[] {
  const labels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  for (let w = 0; w < weeks.length; w++) {
    const firstDay = weeks[w].find((d) => d !== null);
    if (firstDay) {
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: firstDay.date.toLocaleString("en-US", { month: "short" }),
          weekIndex: w,
        });
        lastMonth = month;
      }
    }
  }

  return labels;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
