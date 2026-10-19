import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  maskApiKey,
  isQuotaOrRateLimitError,
  DEFAULT_PRIMARY_MODEL,
  DEFAULT_FALLBACK_MODELS,
  AVAILABLE_AI_MODELS,
} from "./ai";

describe("maskApiKey", () => {
  it("returns empty string for empty or whitespace input", () => {
    expect(maskApiKey("")).toBe("");
    expect(maskApiKey("   ")).toBe("");
  });

  it("masks short keys completely with bullets", () => {
    expect(maskApiKey("1234")).toBe("••••••••");
    expect(maskApiKey("12345678")).toBe("••••••••");
  });

  it("shows first 4 and last 4 characters for longer keys", () => {
    const key = "AIzaSyD1234567890AbcZ";
    const masked = maskApiKey(key);
    expect(masked.startsWith("AIza")).toBe(true);
    expect(masked.endsWith("AbcZ")).toBe(true);
    expect(masked).toContain("••••••••");
  });
});

describe("isQuotaOrRateLimitError", () => {
  it("detects HTTP 429 status", () => {
    expect(isQuotaOrRateLimitError(new Error("Request failed with status 429"))).toBe(true);
  });

  it("detects quota errors", () => {
    expect(isQuotaOrRateLimitError(new Error("Quota exceeded for quota metric 'Queries'"))).toBe(true);
  });

  it("detects rate limit messages", () => {
    expect(isQuotaOrRateLimitError(new Error("Rate limit reached for model gemini-2.5-flash"))).toBe(true);
  });

  it("detects resource exhausted messages", () => {
    expect(isQuotaOrRateLimitError(new Error("Resource has been exhausted (e.g. check quota)"))).toBe(true);
  });

  it("detects too many requests", () => {
    expect(isQuotaOrRateLimitError(new Error("Too many requests, try again later"))).toBe(true);
  });

  it("returns false for regular or syntax errors", () => {
    expect(isQuotaOrRateLimitError(new Error("Invalid API key provided"))).toBe(false);
    expect(isQuotaOrRateLimitError(new Error("Model not found"))).toBe(false);
    expect(isQuotaOrRateLimitError(new Error("Network connection dropped"))).toBe(false);
  });
});

describe("Constants & Presets", () => {
  it("has gemini-3.8-flash as the default primary model", () => {
    expect(DEFAULT_PRIMARY_MODEL).toBe("gemini-3.8-flash");
  });

  it("has valid fallback models list", () => {
    expect(DEFAULT_FALLBACK_MODELS).toContain("gemini-flash-latest");
    expect(DEFAULT_FALLBACK_MODELS).toContain("gemini-3.5-flash-lite");
  });

  it("includes recommended models in available presets", () => {
    const modelIds = AVAILABLE_AI_MODELS.map((m) => m.id);
    expect(modelIds).toContain("gemini-3.8-flash");
    expect(modelIds).toContain("gemini-flash-latest");
    expect(modelIds).toContain("gemini-3.5-flash-lite");
    expect(modelIds).toContain("gemini-3.8-pro");
  });
});
