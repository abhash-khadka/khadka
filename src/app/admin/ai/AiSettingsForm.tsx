"use client";

import { useState, useTransition } from "react";
import { AiConfigSummary, AvailableModel } from "@/lib/ai";
import { updateAiSettingsAction, testAiTranslationAction, TestAiResult } from "@/lib/actions";
import SaveAlert from "@/components/SaveAlert";

export default function AiSettingsForm({ initialSummary }: { initialSummary: AiConfigSummary }) {
  const isPresetModel = initialSummary.availableModels.some((m) => m.id === initialSummary.primaryModel);

  const [primaryModel, setPrimaryModel] = useState<string>(
    isPresetModel ? initialSummary.primaryModel : "custom"
  );
  const [customModel, setCustomModel] = useState<string>(
    isPresetModel ? "" : initialSummary.primaryModel
  );

  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [clearCustomKey, setClearCustomKey] = useState<boolean>(false);

  const [fallbackModels, setFallbackModels] = useState<string[]>(initialSummary.fallbackModels || []);
  const [customFallback, setCustomFallback] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("AI settings saved successfully!");

  // Test translation playground states
  const [testText, setTestText] = useState<string>(
    "Hello! Welcome to my bilingual personal portfolio website."
  );
  const [sourceLang, setSourceLang] = useState<string>("English");
  const [targetLang, setTargetLang] = useState<string>("Japanese");
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<TestAiResult | null>(null);

  const effectiveModelName = primaryModel === "custom" ? customModel.trim() || "custom" : primaryModel;

  const handleAddFallback = (modelName: string) => {
    const trimmed = modelName.trim();
    if (!trimmed || fallbackModels.includes(trimmed)) return;
    setFallbackModels([...fallbackModels, trimmed]);
    setCustomFallback("");
  };

  const handleRemoveFallback = (modelName: string) => {
    setFallbackModels(fallbackModels.filter((m) => m !== modelName));
  };

  const handleSwapTestLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    if (sourceLang === "English") {
      setTestText("こんにちは！私のバイリンガル個人ポートフォリオへようこそ。");
    } else {
      setTestText("Hello! Welcome to my bilingual personal portfolio website.");
    }
  };

  const handleRunTest = async () => {
    if (!testText.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testAiTranslationAction({
        text: testText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        customApiKey: apiKeyInput.trim() ? apiKeyInput.trim() : undefined,
        customModel: effectiveModelName,
      });
      setTestResult(result);
    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("primaryModel", primaryModel);
    if (primaryModel === "custom") {
      formData.append("customModel", customModel);
    }
    formData.append("fallbackModels", fallbackModels.join(","));
    if (clearCustomKey) {
      formData.append("clearCustomKey", "true");
    } else if (apiKeyInput.trim()) {
      formData.append("apiKey", apiKeyInput.trim());
    }

    startTransition(async () => {
      try {
        await updateAiSettingsAction(formData);
        setSaveMessage("AI settings updated and saved successfully!");
        setShowAlert(true);
        if (clearCustomKey) {
          setClearCustomKey(false);
          setApiKeyInput("");
        }
      } catch (err) {
        alert("Failed to save AI settings: " + (err instanceof Error ? err.message : String(err)));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ─── STATUS OVERVIEW CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status: API Key */}
        <div className="bg-[#111111] border border-gray-800 rounded-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-500">API Key Status</span>
            {initialSummary.hasConfiguredKey ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Missing Key
              </span>
            )}
          </div>
          <p className="text-white font-medium text-sm">
            {initialSummary.hasCustomApiKey
              ? "Custom Database Key"
              : initialSummary.hasEnvApiKey
              ? "Environment Variable (.env)"
              : "No key configured"}
          </p>
          <p className="text-gray-500 text-xs mt-1 font-mono">
            {initialSummary.maskedApiKey || "Set key below to enable AI"}
          </p>
        </div>

        {/* Status: Primary Model */}
        <div className="bg-[#111111] border border-gray-800 rounded-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-500">Active Model</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
              Primary
            </span>
          </div>
          <p className="text-white font-semibold text-sm truncate">{effectiveModelName}</p>
          <p className="text-gray-500 text-xs mt-1">Google Gemini API</p>
        </div>

        {/* Status: Failover Fallbacks */}
        <div className="bg-[#111111] border border-gray-800 rounded-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-500">Failover Chain</span>
            <span className="text-xs text-gray-400">{fallbackModels.length} models</span>
          </div>
          <p className="text-white font-semibold text-sm">
            {fallbackModels.length > 0 ? "Rate-limit Auto Failover" : "No fallback models"}
          </p>
          <p className="text-gray-500 text-xs mt-1 truncate">
            {fallbackModels.join(", ") || "None"}
          </p>
        </div>
      </div>

      {/* ─── SECTION 1: API KEY ─────────────────────────────────────── */}
      <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>Google Gemini API Key</span>
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Enter your Google AI Studio API key. Saved securely in your database and applied to all translations.
            </p>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#c9a84c] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Get Gemini API Key</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                if (clearCustomKey) setClearCustomKey(false);
              }}
              placeholder={
                clearCustomKey
                  ? "Custom key will be cleared (falls back to .env)"
                  : initialSummary.hasCustomApiKey
                  ? `Keep current saved key (${initialSummary.customKeyMasked}) or enter new key`
                  : initialSummary.hasEnvApiKey
                  ? `Using environment variable (${initialSummary.maskedApiKey}). Enter new key to override.`
                  : "AIzaSy..."
              }
              disabled={clearCustomKey}
              className={`w-full bg-[#0a0a0a] border rounded-sm px-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c] transition-colors pr-12 ${
                clearCustomKey ? "opacity-50 border-gray-800" : "border-gray-800"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1"
              title={showApiKey ? "Hide API Key" : "Show API Key"}
            >
              {showApiKey ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 flex-wrap gap-2">
            <p>
              💡 If left blank, the app uses <code className="bg-[#1a1a1a] px-1 py-0.5 rounded text-gray-300">GOOGLE_AI_STUDIO_API_KEY</code> from your server environment.
            </p>

            {initialSummary.hasCustomApiKey && (
              <button
                type="button"
                onClick={() => setClearCustomKey(!clearCustomKey)}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${
                  clearCustomKey
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "text-gray-400 hover:text-red-400 underline"
                }`}
              >
                {clearCustomKey ? "Cancel (Keep custom key)" : "Revert to environment variable"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: MODEL SELECTION ─────────────────────────────── */}
      <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Primary Gemini Model</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Select the primary AI model used for high-speed automated translations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {initialSummary.availableModels.map((model: AvailableModel) => {
            const isSelected = primaryModel === model.id;
            return (
              <button
                type="button"
                key={model.id}
                onClick={() => setPrimaryModel(model.id)}
                className={`text-left p-4 rounded-sm border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#c9a84c]/5 border-[#c9a84c] shadow-sm shadow-[#c9a84c]/10"
                    : "bg-[#0a0a0a] border-gray-800 hover:border-gray-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm text-white">{model.name}</span>
                    {model.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30">
                        {model.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3">{model.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-900 text-[11px] font-mono text-gray-500">
                  <span>{model.id}</span>
                  {isSelected && <span className="text-[#c9a84c] font-bold">✓ Selected</span>}
                </div>
              </button>
            );
          })}

          {/* Custom Model Card */}
          <button
            type="button"
            onClick={() => setPrimaryModel("custom")}
            className={`text-left p-4 rounded-sm border transition-all relative flex flex-col justify-between ${
              primaryModel === "custom"
                ? "bg-[#c9a84c]/5 border-[#c9a84c] shadow-sm shadow-[#c9a84c]/10"
                : "bg-[#0a0a0a] border-gray-800 hover:border-gray-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-sm text-white">Custom Model</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                  Advanced
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Specify any custom or future Gemini model identifier (e.g. preview versions).
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-900 text-[11px] font-mono text-gray-500">
              <span>custom identifier</span>
              {primaryModel === "custom" && <span className="text-[#c9a84c] font-bold">✓ Selected</span>}
            </div>
          </button>
        </div>

        {/* Custom model input if "custom" is active */}
        {primaryModel === "custom" && (
          <div className="p-4 bg-[#0a0a0a] border border-gray-800 rounded-sm space-y-2 mt-3 animate-fadeIn">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Custom Model Identifier
            </label>
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="e.g. gemini-2.5-flash-preview-05-20"
              required={primaryModel === "custom"}
              className="w-full bg-[#111111] border border-gray-800 rounded-sm px-4 py-2.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]"
            />
            <p className="text-xs text-gray-500">
              Ensure the model name exists in the Google Generative AI API for your API key.
            </p>
          </div>
        )}
      </div>

      {/* ─── SECTION 3: FALLBACK MODELS ─────────────────────────────── */}
      <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Rate Limit Fallback Models (Failover Chain)</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            If the primary model returns a quota or rate-limit error (HTTP 429), the translation automatically retries using these models in sequence.
          </p>
        </div>

        {/* Current fallback chips */}
        <div className="flex flex-wrap gap-2 items-center min-h-[40px] p-3 bg-[#0a0a0a] border border-gray-800 rounded-sm">
          {fallbackModels.length === 0 ? (
            <span className="text-xs text-gray-500 italic">No fallback models configured.</span>
          ) : (
            fallbackModels.map((model) => (
              <span
                key={model}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1a1a1a] text-xs font-mono text-gray-200 border border-gray-700"
              >
                <span>{model}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFallback(model)}
                  className="text-gray-400 hover:text-red-400 transition-colors ml-1"
                  title={`Remove ${model}`}
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>

        {/* Quick add suggestions */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
          <span>Quick add:</span>
          {["gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.8-flash"].map((preset) => {
            const alreadyAdded = fallbackModels.includes(preset);
            return (
              <button
                type="button"
                key={preset}
                disabled={alreadyAdded}
                onClick={() => handleAddFallback(preset)}
                className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                  alreadyAdded
                    ? "opacity-40 border-gray-800 bg-transparent text-gray-600 cursor-not-allowed"
                    : "border-gray-800 bg-[#161616] hover:border-gray-600 text-gray-300"
                }`}
              >
                + {preset}
              </button>
            );
          })}
        </div>

        {/* Add custom fallback */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customFallback}
            onChange={(e) => setCustomFallback(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFallback(customFallback);
              }
            }}
            placeholder="Add custom fallback model name (e.g. gemini-1.5-pro)..."
            className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]"
          />
          <button
            type="button"
            onClick={() => handleAddFallback(customFallback)}
            disabled={!customFallback.trim()}
            className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] disabled:opacity-50 text-white text-xs font-semibold rounded-sm transition-colors"
          >
            Add Fallback
          </button>
        </div>
      </div>

      {/* ─── SECTION 4: LIVE AI PLAYGROUND (CONNECTION TEST) ───────── */}
      <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-[#c9a84c]">⚡</span>
              <span>Test AI Connection & Translation</span>
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Verify your API key and chosen model immediately with a real-time translation request.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSwapTestLanguages}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] rounded border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <span>{sourceLang} → {targetLang}</span>
            <span className="text-[#c9a84c]">⇄ Swap</span>
          </button>
        </div>

        <div className="space-y-3">
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={2}
            placeholder="Enter sample text to translate..."
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c] transition-colors"
          />

          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-gray-500">
              Testing with: <strong className="text-gray-300 font-mono">{effectiveModelName}</strong>
            </span>

            <button
              type="button"
              onClick={handleRunTest}
              disabled={isTesting || !testText.trim()}
              className="px-5 py-2.5 bg-[#c9a84c] hover:bg-[#b8973f] disabled:opacity-50 text-black text-xs font-bold tracking-wider uppercase rounded-sm transition-all duration-200 flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <span>Test Connection</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test Result Box */}
        {testResult && (
          <div
            className={`p-4 rounded-sm border transition-all animate-fadeIn ${
              testResult.success
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/20 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                {testResult.success ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Success</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span>Translation Error</span>
                  </>
                )}
              </span>
              {testResult.latencyMs !== undefined && (
                <span className="text-[11px] font-mono text-gray-400">
                  Latency: {testResult.latencyMs}ms {testResult.modelUsed && `• Model: ${testResult.modelUsed}`}
                </span>
              )}
            </div>

            {testResult.success ? (
              <p className="text-sm font-medium text-white bg-black/40 p-3 rounded border border-emerald-500/20">
                {testResult.translatedText}
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-red-200 font-mono bg-black/40 p-3 rounded border border-red-500/20">
                  {testResult.error}
                </p>
                <p className="text-[11px] text-gray-400 pt-1">
                  💡 Check that your API key is valid and has Gemini API enabled in Google AI Studio.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── SAVE BUTTON BAR ────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Saved configuration applies immediately across all admin forms.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-[#c9a84c] hover:bg-[#b8973f] disabled:opacity-50 text-black text-xs font-bold tracking-wider uppercase rounded-sm transition-all shadow-lg hover:shadow-[#c9a84c]/20"
        >
          {isPending ? "Saving..." : "Save AI Settings"}
        </button>
      </div>

      {/* Save Notification Alert */}
      {showAlert && (
        <SaveAlert
          message={saveMessage}
          onDismiss={() => setShowAlert(false)}
        />
      )}
    </form>
  );
}
