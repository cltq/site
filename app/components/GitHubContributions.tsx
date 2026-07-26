"use client";

import { useEffect, useMemo, useState } from "react";
import Heatmap from "./heatmap/Heatmap";
import type { ContributionDay } from "./heatmap/utils";
import { fetchContributions } from "@/app/lib/github/contributions";

export default function GitHubContributions({ username }: { username: string }) {
  const [data, setData] = useState<ContributionDay[]>([]);

  useEffect(() => {
    if (!username) return;
    fetchContributions(username).then(setData).catch(() => setData([]));
  }, [username]);

  const now = new Date();
  const startDate = useMemo(() => new Date(now.getFullYear(), 0, 1), []);
  const endDate = useMemo(() => new Date(now.getFullYear(), 11, 31), []);

  if (!username) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
      <Heatmap data={data} startDate={startDate} endDate={endDate} />
    </div>
  );
}
