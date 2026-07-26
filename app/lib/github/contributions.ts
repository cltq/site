import type { ContributionDay } from "@/app/components/heatmap/utils";

const GITHUB_URL = "https://github.com/users";

export async function fetchContributions(username: string): Promise<ContributionDay[]> {
  const res = await fetch(`${GITHUB_URL}/${username}/contributions`, {
    headers: {
      "User-Agent": "reni-web",
      Accept: "text/html",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch contributions");
  const html = await res.text();
  const LEVEL_TO_COUNT: Record<number, number> = {
    0: 0,
    1: 2,
    2: 5,
    3: 8,
    4: 12,
  };
  const days: ContributionDay[] = [];
  const regex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[2], 10);
    days.push({ date: match[1], count: LEVEL_TO_COUNT[level] ?? 0 });
  }
  return days;
}
