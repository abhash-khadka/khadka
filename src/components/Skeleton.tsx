import React from "react";

export function Skeleton({
  className = "",
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`skeleton-shimmer animate-pulse bg-white/[0.06] rounded-sm ${className}`}
      style={style}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-sm overflow-hidden border border-white/[0.06] bg-white/[0.02] flex flex-col h-full">
      {/* Image Area */}
      <Skeleton className="h-44 md:h-48 w-full rounded-none" />
      {/* Content Area */}
      <div className="p-5 md:p-6 flex flex-col flex-grow space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/[0.04]">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-6" />
        </div>
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-[#111111] border border-gray-800 rounded-sm overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <Skeleton className="h-6 w-32 bg-gray-800" />
        <Skeleton className="h-8 w-28 bg-gray-800" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
            <div className="space-y-2 flex-1 max-w-md">
              <Skeleton className="h-4 w-4/5 bg-gray-800" />
              <Skeleton className="h-3 w-1/2 bg-gray-800/60" />
            </div>
            <Skeleton className="h-6 w-20 bg-gray-800" />
            <Skeleton className="h-4 w-16 bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 bg-gray-800" />
        <Skeleton className="h-10 w-full bg-gray-900 border border-gray-800" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 bg-gray-800" />
        <Skeleton className="h-28 w-full bg-gray-900 border border-gray-800" />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <Skeleton className="h-10 w-24 bg-gray-800" />
        <Skeleton className="h-10 w-32 bg-[#c9a84c]/20" />
      </div>
    </div>
  );
}
