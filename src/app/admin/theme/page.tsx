import { getData, defaultTheme, ThemeColors } from "@/lib/data";
import { updateThemeColors } from "@/lib/actions";

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

export default async function AdminThemePage() {
  const data = await getData();
  const theme = data.theme;

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">🎨 Theme Colors</h1>
        <p className="text-gray-500 text-sm">
          Customize every color on your site. Changes are applied instantly across all pages.
        </p>
      </div>

      <form action={updateThemeColors} className="space-y-4">
        {/* Color Swatches Preview */}
        <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 mb-8">
          <h2 className="text-white font-bold text-sm mb-4 tracking-widest uppercase">Current Palette Preview</h2>
          <div className="flex flex-wrap gap-3">
            {colorFields.map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-700 shadow-lg"
                  style={{ background: theme[key] }}
                  title={theme[key]}
                />
                <span className="text-gray-500 text-[9px] text-center leading-tight w-14 truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Fields */}
        <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-[#c9a84c]">⬤</span> Color Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colorFields.map(({ key, label, description }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">
                  {label}
                </label>
                <p className="text-gray-600 text-xs mb-3">{description}</p>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      name={key}
                      defaultValue={theme[key]}
                      className="w-12 h-10 rounded cursor-pointer border border-gray-700 bg-transparent p-0.5"
                    />
                  </div>
                  <input
                    type="text"
                    name={`${key}_text`}
                    defaultValue={theme[key]}
                    readOnly
                    className="flex-1 bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-gray-400 text-sm font-mono rounded-sm focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
          >
            Save Theme
          </button>
          <a
            href="/"
            target="_blank"
            className="border border-gray-700 text-gray-400 font-medium px-8 py-3 text-sm hover:border-gray-500 hover:text-white transition-colors rounded-sm"
          >
            Preview Site ↗
          </a>
        </div>

        {/* Reset to Default hidden inputs */}
      </form>

      {/* Reset Form */}
      <form action={updateThemeColors} className="mt-4">
        {Object.entries(defaultTheme).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <button
          type="submit"
          className="text-gray-600 text-sm hover:text-gray-400 transition-colors underline underline-offset-2"
        >
          Reset to default dark theme
        </button>
      </form>
    </div>
  );
}
