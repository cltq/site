"use client";

import { useEffect, useMemo, useState } from "react";
import Heatmap from "./heatmap/Heatmap";
import type { ContributionDay } from "./heatmap/utils";
import { getCached, setCached } from "@/lib/data-cache";
import Skeleton from "@/components/Skeleton";

const CACHE_TTL = 6 * 60 * 60 * 1000;

export default function GitHubContributions({ username }: { username: string }) {
  const [data, setData] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    const cacheKey = `github-contributions:${username}`;
    const cached = getCached<ContributionDay[]>(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setCached(cacheKey, data, CACHE_TTL);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [username]);

  const now = new Date();
  const startDate = useMemo(() => new Date(now.getFullYear(), 0, 1), []);
  const endDate = useMemo(() => new Date(now.getFullYear(), 11, 31), []);

  if (!username) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
      {loading ? (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="inline-flex items-start">
            <div className="flex flex-col gap-[2px] pt-[18px] pr-2">
              {Array.from({ length: 3 }).map((_, r) => (
                <Skeleton
                  key={r}
                  className="h-[12px] w-[12px] rounded-[2px] sm:h-[13px] sm:w-[13px]"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="mb-1 flex gap-[2px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-2 w-4" />
                ))}
              </div>
              <div className="flex gap-[2px]">
                {Array.from({ length: 30 }).map((_, w) => (
                  <div key={w} className="flex flex-col gap-[2px]">
                    {Array.from({ length: 7 }).map((_, d) => (
                      <Skeleton
                        key={d}
                        className="h-[12px] w-[12px] rounded-[2px] sm:h-[13px] sm:w-[13px]"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-2.5 w-2.5 rounded-[2px]" />
            <Skeleton className="h-2.5 w-2.5 rounded-[2px]" />
            <Skeleton className="h-2.5 w-2.5 rounded-[2px]" />
            <Skeleton className="h-2.5 w-2.5 rounded-[2px]" />
            <Skeleton className="h-2.5 w-2.5 rounded-[2px]" />
            <Skeleton className="h-2.5 w-12" />
          </div>
        </div>
      ) : (
        <Heatmap data={data} startDate={startDate} endDate={endDate} />
      )}
    </div>
  );
}
