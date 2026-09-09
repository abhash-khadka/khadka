import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import PublicLayout from "@/components/PublicLayout";
import { getData, defaultTheme, defaultLightTheme } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  const seo = data.seo;

  // Use English as the primary title/description for the main meta tags.
  // Mixing EN and JA in a single title/description looks broken in SERPs.
  const title = seo.title_en || "Abhash Khadka | Portfolio";
  const description = seo.description_en || "B.S. Information Technology Student. Building web apps, databases, and AI tools.";
  const siteName = seo.siteName_en || "Abhash Khadka Portfolio";

  // English keywords for <meta name="keywords">
  const keywords = (seo.keywords_en || "Abhash, Portfolio, Web Developer, Software Engineer")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL("https://abhashkhadka.com.np"),
    title: {
      default: title,
      template: "%s | Abhash Khadka",
    },
    description,
    keywords,
    authors: [{ name: "Abhash Khadka" }],
    creator: "Abhash Khadka",
    // hreflang: tells Google this page serves both English and Japanese.
    // Since the site uses a single URL with a language toggle, both lang
    // codes point to the same URL. "x-default" is the fallback for all
    // other locales.
    alternates: {
      canonical: "https://abhashkhadka.com.np",
      languages: {
        "en": "https://abhashkhadka.com.np",
        "ja": "https://abhashkhadka.com.np",
        "x-default": "https://abhashkhadka.com.np",
      },
    },
    openGraph: {
      type: "website",
      // Primary locale is English; ja_JP is declared as an alternate so
      // Japanese crawlers and social platforms know JA content exists.
      locale: "en_US",
      alternateLocale: ["ja_JP"],
      url: "https://abhashkhadka.com.np",
      siteName,
      title,
      description,
      images: [
        {
          url: "https://abhashkhadka.com.np/logo.png",
          width: 1200,
          height: 630,
          alt: siteName + " Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://abhashkhadka.com.np/logo.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let theme = defaultTheme;
  let lightTheme = defaultLightTheme;
  try {
    const data = await getData();
    theme = data.theme;
    lightTheme = data.lightTheme || defaultLightTheme;
  } catch {
    // fallback to default
  }

  const cssVars = `
    :root {
      --bg-primary: ${theme.bgPrimary};
      --bg-secondary: ${theme.bgSecondary};
      --bg-card: ${theme.bgCard};
      --bg-nav: ${theme.bgNav};
      --bg-footer: ${theme.bgFooter};
      --color-accent: ${theme.accent};
      --text-primary: ${theme.textPrimary};
      --text-secondary: ${theme.textSecondary};
      --border-color: ${theme.borderColor};
      --background: ${theme.bgPrimary};
      --foreground: ${theme.textPrimary};
    }
    
    :root.light {
      --bg-primary: ${lightTheme.bgPrimary};
      --bg-secondary: ${lightTheme.bgSecondary};
      --bg-card: ${lightTheme.bgCard};
      --bg-nav: ${lightTheme.bgNav};
      --bg-footer: ${lightTheme.bgFooter};
      --color-accent: ${lightTheme.accent};
      --text-primary: ${lightTheme.textPrimary};
      --text-secondary: ${lightTheme.textSecondary};
      --border-color: ${lightTheme.borderColor};
      --background: ${lightTheme.bgPrimary};
      --foreground: ${lightTheme.textPrimary};
    }
  `;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.add('light');
                }
              } catch (_) {}
            `,
          }}
        />
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
