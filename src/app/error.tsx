"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-6xl font-black tracking-tighter" style={{ color: "var(--color-accent)" }}>
        500
      </p>
      <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        Something went wrong
      </h2>
      <p className="max-w-md text-sm" style={{ color: "var(--text-secondary)" }}>
        An unexpected error occurred while loading this page. Please try again — if the problem
        persists, check back a little later.
        <br />
        ページの読み込み中にエラーが発生しました。もう一度お試しください。
      </p>
      <button
        onClick={() => unstable_retry()}
        className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
      >
        Try Again / もう一度試す
      </button>
    </div>
  );
}
