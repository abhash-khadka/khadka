import { Skeleton } from "@/components/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-10 animate-fadeIn" role="status" aria-label="Loading admin dashboard">
      {/* Title & subtitle skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64 bg-gray-800" />
        <Skeleton className="h-4 w-96 bg-gray-900" />
      </div>

      {/* Stats Cards Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 bg-gray-800" />
              <Skeleton className="h-8 w-8 rounded-sm bg-gray-800/80" />
            </div>
            <Skeleton className="h-10 w-16 bg-gray-800" />
          </div>
        ))}
      </div>

      {/* Main Content / Table Skeleton */}
      <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <Skeleton className="h-6 w-40 bg-gray-800" />
          <Skeleton className="h-8 w-24 bg-gray-800" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
              <div className="space-y-2 flex-1 max-w-md">
                <Skeleton className="h-4 w-3/4 bg-gray-800" />
                <Skeleton className="h-3 w-1/2 bg-gray-800/60" />
              </div>
              <Skeleton className="h-5 w-20 bg-gray-800 rounded-full" />
              <Skeleton className="h-4 w-12 bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
