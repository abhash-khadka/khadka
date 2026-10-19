import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export type AiSettings = {
  apiKey?: string;
  primaryModel?: string;
  fallbackModels?: string[];
  updatedAt?: string;
};

export type AvailableModel = {
  id: string;
  name: string;
  description: string;
  badge?: string;
};

export const AVAILABLE_AI_MODELS: AvailableModel[] = [
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    description: "Latest generation model with high speed and state-of-the-art translation accuracy (Recommended)",
    badge: "Recommended",
  },
  {
    id: "gemini-flash-latest",
    name: "Gemini Flash Latest",
    description: "Always points to the latest stable Google Flash model automatically",
    badge: "Auto Updating",
  },
  {
    id: "gemini-3.5-flash-lite",
    name: "Gemini 3.5 Flash Lite",
    description: "Ultra-fast response times with generous free tier rate limits",
    badge: "Fast & Light",
  },
  {
    id: "gemini-flash-lite-latest",
    name: "Gemini Flash Lite Latest",
    description: "Always points to the latest stable lightweight Flash model",
  },
  {
    id: "gemini-3.8-pro",
    name: "Gemini 3.8 Pro",
    description: "Maximum intelligence and reasoning for complex or nuanced literature",
    badge: "Most Capable",
  },
  {
    id: "gemini-pro-latest",
    name: "Gemini Pro Latest",
    description: "Always points to the latest stable Google Pro reasoning model",
  },
];

export const DEFAULT_PRIMARY_MODEL = "gemini-3.8-flash";
export const DEFAULT_FALLBACK_MODELS = [
  "gemini-flash-latest",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
];

/**
 * Masks an API key for safe display in the admin interface.
 * Shows first 4 and last 4 chars if long enough, otherwise masked bullets.
 */
export function maskApiKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 8) {
    return "••••••••";
  }
  return `${trimmed.slice(0, 4)}••••••••${trimmed.slice(-4)}`;
}

export type ResolvedAiConfig = {
  apiKey: string;
  primaryModel: string;
  fallbackModels: string[];
  apiKeySource: "database" | "env" | "none";
  hasCustomApiKey: boolean;
  hasEnvApiKey: boolean;
  maskedApiKey: string;
};

/**
 * Returns the effective AI configuration by merging Firestore `/site/ai`
 * with process.env fallbacks. Used by server actions for translations.
 */
export async function getEffectiveAiConfig(): Promise<ResolvedAiConfig> {
  const envKey = (process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
  const envModel = (process.env.GOOGLE_AI_STUDIO_MODEL || "").trim();
  const envFallbacks = process.env.GOOGLE_AI_STUDIO_FALLBACK_MODELS
    ? process.env.GOOGLE_AI_STUDIO_FALLBACK_MODELS.split(",").map((m) => m.trim()).filter(Boolean)
    : [];

  let dbSettings: AiSettings = {};

  try {
    const snap = await getDoc(doc(db, "site", "ai"));
    if (snap.exists()) {
      dbSettings = snap.data() as AiSettings;
    }
  } catch (err) {
    console.error("Error reading AI settings from Firestore (using env fallback):", err);
  }

  const customKey = (dbSettings.apiKey || "").trim();
  const hasCustomApiKey = Boolean(customKey);
  const hasEnvApiKey = Boolean(envKey);

  const effectiveKey = customKey || envKey;
  const apiKeySource: "database" | "env" | "none" = hasCustomApiKey
    ? "database"
    : hasEnvApiKey
    ? "env"
    : "none";

  const primaryModel =
    (dbSettings.primaryModel || "").trim() ||
    envModel ||
    DEFAULT_PRIMARY_MODEL;

  let fallbackModels: string[];
  if (Array.isArray(dbSettings.fallbackModels) && dbSettings.fallbackModels.length > 0) {
    fallbackModels = dbSettings.fallbackModels.map((m) => m.trim()).filter(Boolean);
  } else if (envFallbacks.length > 0) {
    fallbackModels = envFallbacks;
  } else {
    fallbackModels = [...DEFAULT_FALLBACK_MODELS];
  }

  return {
    apiKey: effectiveKey,
    primaryModel,
    fallbackModels,
    apiKeySource,
    hasCustomApiKey,
    hasEnvApiKey,
    maskedApiKey: maskApiKey(effectiveKey),
  };
}

export type AiConfigSummary = {
  hasConfiguredKey: boolean;
  hasCustomApiKey: boolean;
  hasEnvApiKey: boolean;
  apiKeySource: "database" | "env" | "none";
  maskedApiKey: string;
  customKeyMasked: string;
  primaryModel: string;
  fallbackModels: string[];
  updatedAt?: string;
  availableModels: AvailableModel[];
};

/**
 * Returns a safe summary of AI configuration for the Admin UI.
 * Does NOT expose raw secret keys to the client.
 */
export async function getAiConfigSummary(): Promise<AiConfigSummary> {
  const envKey = (process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
  const envModel = (process.env.GOOGLE_AI_STUDIO_MODEL || "").trim();
  const envFallbacks = process.env.GOOGLE_AI_STUDIO_FALLBACK_MODELS
    ? process.env.GOOGLE_AI_STUDIO_FALLBACK_MODELS.split(",").map((m) => m.trim()).filter(Boolean)
    : [];

  let dbSettings: AiSettings = {};

  try {
    const snap = await getDoc(doc(db, "site", "ai"));
    if (snap.exists()) {
      dbSettings = snap.data() as AiSettings;
    }
  } catch (err) {
    console.error("Error reading AI config summary from Firestore:", err);
  }

  const customKey = (dbSettings.apiKey || "").trim();
  const hasCustomApiKey = Boolean(customKey);
  const hasEnvApiKey = Boolean(envKey);
  const effectiveKey = customKey || envKey;

  const primaryModel =
    (dbSettings.primaryModel || "").trim() ||
    envModel ||
    DEFAULT_PRIMARY_MODEL;

  let fallbackModels: string[];
  if (Array.isArray(dbSettings.fallbackModels) && dbSettings.fallbackModels.length > 0) {
    fallbackModels = dbSettings.fallbackModels.map((m) => m.trim()).filter(Boolean);
  } else if (envFallbacks.length > 0) {
    fallbackModels = envFallbacks;
  } else {
    fallbackModels = [...DEFAULT_FALLBACK_MODELS];
  }

  return {
    hasConfiguredKey: Boolean(effectiveKey),
    hasCustomApiKey,
    hasEnvApiKey,
    apiKeySource: hasCustomApiKey ? "database" : hasEnvApiKey ? "env" : "none",
    maskedApiKey: maskApiKey(effectiveKey),
    customKeyMasked: maskApiKey(customKey),
    primaryModel,
    fallbackModels,
    updatedAt: dbSettings.updatedAt,
    availableModels: AVAILABLE_AI_MODELS,
  };
}

export function isQuotaOrRateLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /429|quota|rate limit|resource has been exhausted|too many requests/i.test(message);
}
