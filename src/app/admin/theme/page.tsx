import { getData, defaultTheme, defaultLightTheme } from "@/lib/data";
import ThemeForm from "./ThemeForm";

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

      <ThemeForm
        darkTheme={darkTheme}
        lightTheme={lightTheme}
        defaultDark={defaultTheme}
        defaultLight={defaultLightTheme}
      />
    </div>
  );
}
