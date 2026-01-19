import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-8 w-3/4 rounded-md" />
        <Skeleton className="h-32 w-full rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
    </div>
  );
}
