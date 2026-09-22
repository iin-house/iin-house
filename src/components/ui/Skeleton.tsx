"use client";

"use client";

import { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`
        rounded-xl bg-gradient-to-r from-white/[0.04] via-white/[0.06] to-white/[0.04]
        bg-[length:200%_100%]
        animate-[shimmer_1.6s_ease-in-out_infinite]
        ${className}
      `}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#1c1c1e] border border-white/[0.06] rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-3/5" />
          <Skeleton className="h-2.5 w-2/5" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-2.5 w-4/5" />
    </div>
  );
}
