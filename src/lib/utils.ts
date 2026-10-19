// Pure, dependency-free helpers shared across the app.
// Kept in their own module (no "use server", no Firebase/Next imports) so
// they can be unit-tested directly with Vitest.

/**
 * Turn a title into a URL-safe slug. Always returns a non-empty string —
 * falls back to the numeric id when the title is empty or symbols-only.
 */
export function generateSlug(title: string, fallbackId: number): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-")            // spaces to hyphens
    .replace(/-+/g, "-")             // collapse multiple hyphens
    .replace(/^-+|-+$/g, "")         // trim leading/trailing hyphens
    .substring(0, 80);               // max 80 chars
  return slug || fallbackId.toString();
}

/**
 * Sliding-window rate limiter. Records an attempt for `key` and returns
 * `false` when the caller has exceeded `max` hits within `windowMs`.
 *
 * Pure so it can be unit-tested; the caller supplies the clock and the
 * (in-memory) bucket store.
 */
export function slidingWindowHit(
  buckets: Map<string, number[]>,
  key: string,
  now: number,
  max: number,
  windowMs: number
): boolean {
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  buckets.set(key, hits);
  // Prevent unbounded growth on long-lived processes
  if (buckets.size > 5000) buckets.clear();
  return true;
}

/** Escape a string for safe interpolation into XML/RSS output. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
