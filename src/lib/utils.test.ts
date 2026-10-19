import { describe, it, expect } from "vitest";
import { generateSlug, slidingWindowHit, escapeXml } from "./utils";

describe("generateSlug", () => {
  it("lowercases and hyphenates a normal title", () => {
    expect(generateSlug("Hello World", 1)).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(generateSlug("C++ & Rust!", 1)).toBe("c-rust");
  });

  it("collapses whitespace and multiple hyphens", () => {
    expect(generateSlug("  A   -- B  ", 1)).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(generateSlug("-hello-", 1)).toBe("hello");
  });

  it("caps the slug at 80 characters", () => {
    const slug = generateSlug("a".repeat(200), 1);
    expect(slug).toHaveLength(80);
  });

  it("falls back to the id for an empty title", () => {
    expect(generateSlug("", 12345)).toBe("12345");
  });

  it("falls back to the id for a symbols-only title", () => {
    expect(generateSlug("!!! ???", 999)).toBe("999");
  });

  it("preserves digits", () => {
    expect(generateSlug("Top 10 Tips 2024", 1)).toBe("top-10-tips-2024");
  });
});

describe("slidingWindowHit", () => {
  it("allows requests up to the max within the window", () => {
    const buckets = new Map<string, number[]>();
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) {
      expect(slidingWindowHit(buckets, "k", now, 5, 60_000)).toBe(true);
    }
  });

  it("blocks requests over the max within the window", () => {
    const buckets = new Map<string, number[]>();
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) slidingWindowHit(buckets, "k", now, 5, 60_000);
    expect(slidingWindowHit(buckets, "k", now, 5, 60_000)).toBe(false);
  });

  it("allows requests again after the window expires", () => {
    const buckets = new Map<string, number[]>();
    const start = 1_000_000;
    for (let i = 0; i < 5; i++) slidingWindowHit(buckets, "k", start, 5, 60_000);
    expect(slidingWindowHit(buckets, "k", start + 60_001, 5, 60_000)).toBe(true);
  });

  it("tracks keys independently", () => {
    const buckets = new Map<string, number[]>();
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) slidingWindowHit(buckets, "a", now, 5, 60_000);
    expect(slidingWindowHit(buckets, "a", now, 5, 60_000)).toBe(false);
    expect(slidingWindowHit(buckets, "b", now, 5, 60_000)).toBe(true);
  });

  it("prunes expired hits so old traffic stops counting", () => {
    const buckets = new Map<string, number[]>();
    const start = 1_000_000;
    for (let i = 0; i < 5; i++) slidingWindowHit(buckets, "k", start, 5, 60_000);
    // All 5 hits are older than the window now — should be allowed again
    expect(slidingWindowHit(buckets, "k", start + 300_000, 5, 60_000)).toBe(true);
    expect(buckets.get("k")).toHaveLength(1);
  });

  it("clears the store when it grows beyond 5000 entries", () => {
    const buckets = new Map<string, number[]>();
    for (let i = 0; i < 5000; i++) buckets.set(`key-${i}`, [1]);
    slidingWindowHit(buckets, "new-key", Date.now(), 5, 60_000);
    expect(buckets.size).toBe(0);
  });
});

describe("escapeXml", () => {
  it("escapes XML special characters", () => {
    expect(escapeXml(`& < > " '`)).toBe("&amp; &lt; &gt; &quot; &apos;");
  });

  it("leaves normal text untouched", () => {
    expect(escapeXml("Hello World 2024")).toBe("Hello World 2024");
  });
});
