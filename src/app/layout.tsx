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

export const metadata: Metadata = {
  metadataBase: new URL("https://abhashkhadka.com.np"),
  title: {
    default: "Abhash | Portfolio & Developer Blog",
    template: "%s | Abhash",
  },
  description: "B.S. Information Technology Student - Building web apps, databases, and AI tools.",
  keywords: ["Abhash", "Portfolio", "Web Developer", "Software Engineer", "Next.js", "React", "AI"],
  authors: [{ name: "Abhash Khadka" }],
  creator: "Abhash Khadka",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abhashkhadka.com.np",
    siteName: "Abhash Portfolio",
    title: "Abhash | Portfolio & Developer Blog",
    description: "B.S. Information Technology Student - Building web apps, databases, and AI tools.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Abhash Portfolio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhash | Portfolio & Developer Blog",
    description: "B.S. Information Technology Student - Building web apps, databases, and AI tools.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
