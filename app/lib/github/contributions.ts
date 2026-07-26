import type { ContributionDay } from "@/app/components/heatmap/utils";

const API_URL = "https://github-contributions-api.jacob.cool";

export async function fetchContributions(username: string): Promise<ContributionDay[]> {
  const res = await fetch(`${API_URL}/${username}.json`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch contributions");
  const json = await res.json();
  const contributions: { date: string; count: number }[] = json.contributions ?? [];
  return contributions.map((c) => ({ date: c.date, count: c.count }));
}
