import Contact from "@/components/Contact";
import { Metadata } from "next";
import { getData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for freelance projects, collaborations, or just to say hi.",
  alternates: {
    canonical: "/contact",
    languages: {
      "en": "https://abhashkhadka.com.np/contact",
      "ja": "https://abhashkhadka.com.np/contact",
      "x-default": "https://abhashkhadka.com.np/contact",
    },
  },
  openGraph: {
    title: "Contact | Abhash Khadka",
    description: "Get in touch with me for freelance projects, collaborations, or just to say hi.",
    url: "https://abhashkhadka.com.np/contact",
    siteName: "Abhash Khadka Portfolio",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    images: [{ url: "https://abhashkhadka.com.np/logo.png", width: 1200, height: 630, alt: "Abhash Khadka - Contact" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Abhash Khadka",
    description: "Get in touch with me for freelance projects, collaborations, or just to say hi.",
    images: ["https://abhashkhadka.com.np/logo.png"],
  },
};

export default async function ContactPage() {
  const data = await getData();
  
  return (
    <div className="pt-24 min-h-screen flex items-center bg-background">
      <div className="w-full">
        <Contact data={data.contact} />
      </div>
    </div>
  );
}
