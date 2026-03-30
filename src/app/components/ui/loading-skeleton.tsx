import { cn } from "./utils";

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-5",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mb-4 h-4 w-full animate-pulse rounded bg-muted" />
      <div className="mb-4 flex gap-3">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-auto h-10 w-full animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

interface ListSkeletonProps {
  count?: number;
  className?: string;
}

export function ListSkeleton({ count = 3, className }: ListSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="flex-1">
            <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

interface GridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function GridSkeleton({
  count = 6,
  columns = 3,
  className,
}: GridSkeletonProps) {
  const colsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5",
        colsClass[columns],
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

interface PageSkeletonProps {
  hasHero?: boolean;
  className?: string;
}

export function PageSkeleton({ hasHero = true, className }: PageSkeletonProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {hasHero && (
        <div className="bg-primary py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-4 h-8 w-64 animate-pulse rounded bg-primary-foreground/20" />
            <div className="mb-2 h-10 w-80 animate-pulse rounded bg-primary-foreground/10" />
            <div className="h-5 w-[480px] max-w-full animate-pulse rounded bg-primary-foreground/10" />
          </div>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <GridSkeleton count={6} />
      </div>
    </div>
  );
}
