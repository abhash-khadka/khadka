import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center pt-24">
      <p className="text-7xl font-black tracking-tighter" style={{ color: "var(--color-accent)" }}>
        404
      </p>
      <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
        Page Not Found
      </h1>
      <p className="max-w-md text-sm" style={{ color: "var(--text-secondary)" }}>
        The page you are looking for does not exist or may have been moved.
        <br />
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <Link
        href="/"
        className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
      >
        Back Home / ホームへ
      </Link>
    </div>
  );
}
