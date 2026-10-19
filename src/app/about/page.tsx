import About from "@/components/About";
import Quote from "@/components/Quote";
import { getData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn more about my journey, skills, and experience as an IT student and developer.",
  alternates: {
    canonical: "/about",
    languages: {
      "en": "https://abhashkhadka.com.np/about",
      "ja": "https://abhashkhadka.com.np/about",
      "x-default": "https://abhashkhadka.com.np/about",
    },
  },
  openGraph: {
    title: "About Me | Abhash Khadka",
    description: "Learn more about my journey, skills, and experience as an IT student and developer.",
    url: "https://abhashkhadka.com.np/about",
    siteName: "Abhash Khadka Portfolio",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    images: [{ url: "https://abhashkhadka.com.np/logo.png", width: 1200, height: 630, alt: "Abhash Khadka - About" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me | Abhash Khadka",
    description: "Learn more about my journey, skills, and experience as an IT student and developer.",
    images: ["https://abhashkhadka.com.np/logo.png"],
  },
};

export default async function AboutPage() {
  const data = await getData();
  return (
    <div className="pt-24 min-h-screen">
      <About data={data.landing} />
      <Quote data={data.landing} />
    </div>
  );
}
