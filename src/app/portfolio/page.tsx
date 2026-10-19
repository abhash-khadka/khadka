import Portfolio from "@/components/Portfolio";
import { getData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A showcase of my recent web development, design, and software projects.",
  alternates: {
    canonical: "/portfolio",
    languages: {
      "en": "https://abhashkhadka.com.np/portfolio",
      "ja": "https://abhashkhadka.com.np/portfolio",
      "x-default": "https://abhashkhadka.com.np/portfolio",
    },
  },
  openGraph: {
    title: "Portfolio | Abhash Khadka",
    description: "A showcase of my recent web development, design, and software projects.",
    url: "https://abhashkhadka.com.np/portfolio",
    siteName: "Abhash Khadka Portfolio",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    images: [{ url: "https://abhashkhadka.com.np/logo.png", width: 1200, height: 630, alt: "Abhash Khadka - Portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Abhash Khadka",
    description: "A showcase of my recent web development, design, and software projects.",
    images: ["https://abhashkhadka.com.np/logo.png"],
  },
};

export default async function PortfolioPage() {
  const data = await getData();
  return (
    <div className="pt-24 min-h-screen">
      <Portfolio projects={data.portfolio} />
    </div>
  );
}
