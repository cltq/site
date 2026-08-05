import Skeleton from "@/app/components/Skeleton";

export default function DiscordSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading presence">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="mt-2 h-3 w-40" />
      </div>
    </div>
  );
}
