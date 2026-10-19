import { Skeleton, CardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: "var(--bg-primary, #050505)", color: "var(--text-primary, #ffffff)" }}
      role="status"
      aria-label="Loading page content"
    >
      {/* ─── Mock Navbar Skeleton ─────────────────────────────────── */}
      <div
        className="w-full h-20 border-b flex items-center justify-between px-6 md:px-12 fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{ borderColor: "var(--border-color, rgba(255,255,255,0.06))", background: "var(--bg-nav, rgba(0,0,0,0.6))" }}
      >
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-7 rounded-sm" />
          <Skeleton className="h-5 w-24 hidden sm:block" />
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* ─── Hero Section Skeleton ────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 max-w-4xl mx-auto w-full">
        {/* Tagline Pill */}
        <Skeleton className="h-4 w-36 mb-6 rounded-full" style={{ background: "var(--color-accent, #c9a84c)", opacity: 0.25 }} />

        {/* Big Bold Headline Skeleton */}
        <div className="w-full flex flex-col items-center space-y-3 mb-6">
          <Skeleton className="h-14 sm:h-20 md:h-24 w-4/5 max-w-2xl" />
          <Skeleton className="h-10 sm:h-14 md:h-16 w-3/5 max-w-lg" />
        </div>

        {/* Subtitle Lines */}
        <div className="w-full max-w-xl mx-auto space-y-2.5 mb-10">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <Skeleton className="h-4 w-3/5 mx-auto" />
        </div>

        {/* Call to Action Button */}
        <Skeleton
          className="h-12 w-48 rounded-sm"
          style={{ border: "1px solid var(--color-accent, #c9a84c)", background: "transparent", opacity: 0.4 }}
        />
      </section>

      {/* ─── Content Grid Skeleton (Portfolio & Work) ─────────────── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 w-full space-y-10">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-3 w-24" style={{ background: "var(--color-accent, #c9a84c)", opacity: 0.3 }} />
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    </div>
  );
}
