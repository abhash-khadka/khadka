import { getData, defaultTheme, defaultLightTheme, ThemeColors } from "@/lib/data";
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
  const darkTheme = data.theme;
  const lightTheme = data.lightTheme || defaultLightTheme;

  return (
    <div className="max-w-4xl pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">🎨 Theme Colors</h1>
        <p className="text-gray-500 text-sm">
          Customize every color on your site. Changes are applied instantly across all pages.
        </p>
      </div>

      <form action={updateThemeColors} className="space-y-12">
        
        {/* Dark Mode Settings */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">🌙 Dark Mode Settings</h2>
          <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorFields.map(({ key, label, description }) => (
                <div key={`dark_${key}`}>
                  <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">
                    {label}
                  </label>
                  <p className="text-gray-600 text-[10px] mb-3 h-8">{description}</p>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        name={`dark_${key}`}
                        defaultValue={darkTheme[key]}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-700 bg-transparent p-0.5"
                      />
                    </div>
                    <input
                      type="text"
                      name={`dark_${key}_text`}
                      defaultValue={darkTheme[key]}
                      readOnly
                      className="flex-1 bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-gray-400 text-sm font-mono rounded-sm focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Light Mode Settings */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">☀️ Light Mode Settings</h2>
          <div className="bg-[#FAFAF9] border border-gray-200 rounded-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorFields.map(({ key, label, description }) => (
                <div key={`light_${key}`}>
                  <label className="block text-xs font-semibold text-gray-600 tracking-widest uppercase mb-2">
                    {label}
                  </label>
                  <p className="text-gray-500 text-[10px] mb-3 h-8">{description}</p>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        name={`light_${key}`}
                        defaultValue={lightTheme[key]}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-300 bg-transparent p-0.5"
                      />
                    </div>
                    <input
                      type="text"
                      name={`light_${key}_text`}
                      defaultValue={lightTheme[key]}
                      readOnly
                      className="flex-1 bg-white border border-gray-300 px-3 py-2 text-gray-700 text-sm font-mono rounded-sm focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-800">
          <button
            type="submit"
            className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
          >
            Save Theme
          </button>
          <a
            href="/"
            target="_blank"
            className="border border-gray-700 text-gray-400 font-medium px-8 py-3 text-sm hover:border-gray-500 hover:text-white transition-colors rounded-sm flex items-center justify-center"
          >
            Preview Site ↗
          </a>
        </div>
      </form>

      {/* Reset Form */}
      <form action={updateThemeColors} className="mt-8 pt-4 border-t border-gray-800">
        {Object.entries(defaultTheme).map(([key, value]) => (
          <input key={`reset_dark_${key}`} type="hidden" name={`dark_${key}`} value={value} />
        ))}
        {Object.entries(defaultLightTheme).map(([key, value]) => (
          <input key={`reset_light_${key}`} type="hidden" name={`light_${key}`} value={value} />
        ))}
        <button
          type="submit"
          className="text-gray-600 text-sm hover:text-gray-400 transition-colors underline underline-offset-2"
        >
          Reset both themes to default
        </button>
      </form>
    </div>
  );
}
