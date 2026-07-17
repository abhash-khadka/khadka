"use client";

import { useTransition, useState } from "react";
import { updateThemeColors } from "@/lib/actions";
import { ThemeColors } from "@/lib/data";
import SaveAlert from "@/components/SaveAlert";

const colorFields: { key: keyof ThemeColors; label: string; description: string }[] = [
  { key: "bgPrimary",     label: "Primary Background",   description: "Main page & hero background" },
  { key: "bgSecondary",   label: "Secondary Background", description: "Alternate sections (About, Blog)" },
  { key: "bgCard",        label: "Card Background",      description: "Portfolio & Blog cards" },
  { key: "bgNav",         label: "Navbar Background",    description: "Navigation bar when scrolled" },
  { key: "bgFooter",      label: "Footer Background",    description: "Footer section background" },
  { key: "accent",        label: "Accent Color",         description: "Highlight color, buttons, links" },
  { key: "textPrimary",   label: "Primary Text",         description: "Headings & main text" },
  { key: "textSecondary", label: "Secondary Text",       description: "Paragraphs & muted text" },
  { key: "borderColor",   label: "Border Color",         description: "Section & card borders" },
];

function ThemeColorGrid({
  fields,
  theme,
  prefix,
  isDark,
}: {
  fields: typeof colorFields;
  theme: ThemeColors;
  prefix: string;
  isDark: boolean;
}) {
  return (
    <div className={`border rounded-sm p-6 space-y-6 ${isDark ? "bg-[#111111] border-gray-800" : "bg-[#FAFAF9] border-gray-200"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(({ key, label, description }) => (
          <div key={`${prefix}_${key}`}>
            <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {label}
            </label>
            <p className={`text-[10px] mb-3 h-8 ${isDark ? "text-gray-600" : "text-gray-500"}`}>{description}</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name={`${prefix}_${key}`}
                defaultValue={theme[key]}
                className={`w-12 h-10 rounded cursor-pointer bg-transparent p-0.5 ${isDark ? "border border-gray-700" : "border border-gray-300"}`}
              />
              <input
                type="text"
                name={`${prefix}_${key}_text`}
                defaultValue={theme[key]}
                readOnly
                className={`flex-1 px-3 py-2 text-sm font-mono rounded-sm focus:outline-none ${isDark ? "bg-[#0a0a0a] border border-gray-800 text-gray-400" : "bg-white border border-gray-300 text-gray-700"}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThemeForm({
  darkTheme,
  lightTheme,
  defaultDark,
  defaultLight,
}: {
  darkTheme: ThemeColors;
  lightTheme: ThemeColors;
  defaultDark: ThemeColors;
  defaultLight: ThemeColors;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateThemeColors(formData);
      if (result?.success) {
        setSaved(true);
      }
    });
  };

  return (
    <>
      {saved && <SaveAlert message="Theme colors saved successfully!" onDismiss={() => setSaved(false)} />}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Dark Mode Settings */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">🌙 Dark Mode Settings</h2>
          <ThemeColorGrid fields={colorFields} theme={darkTheme} prefix="dark" isDark={true} />
        </div>

        {/* Light Mode Settings */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">☀️ Light Mode Settings</h2>
          <ThemeColorGrid fields={colorFields} theme={lightTheme} prefix="light" isDark={false} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Save Theme"}
          </button>
          <a
            href="/"
            target="_blank"
            className="border border-gray-700 text-gray-400 font-medium px-8 py-3 text-sm hover:border-gray-500 hover:text-white transition-colors rounded-sm flex items-center justify-center w-full sm:w-auto"
          >
            Preview Site ↗
          </a>
        </div>
      </form>

      {/* Reset Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(async () => {
            const result = await updateThemeColors(formData);
            if (result?.success) setSaved(true);
          });
        }}
        className="mt-8 pt-4 border-t border-gray-800"
      >
        {Object.entries(defaultDark).map(([key, value]) => (
          <input key={`reset_dark_${key}`} type="hidden" name={`dark_${key}`} value={value} />
        ))}
        {Object.entries(defaultLight).map(([key, value]) => (
          <input key={`reset_light_${key}`} type="hidden" name={`light_${key}`} value={value} />
        ))}
        <button
          type="submit"
          className="text-gray-600 text-sm hover:text-gray-400 transition-colors underline underline-offset-2"
        >
          Reset both themes to default
        </button>
      </form>
    </>
  );
}
