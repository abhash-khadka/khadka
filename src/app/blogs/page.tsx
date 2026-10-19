import Blog from "@/components/Blog";
import { getData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights on software development and technology.",
  alternates: {
    canonical: "/blogs",
    languages: {
      "en": "https://abhashkhadka.com.np/blogs",
      "ja": "https://abhashkhadka.com.np/blogs",
      "x-default": "https://abhashkhadka.com.np/blogs",
    },
  },
  openGraph: {
    title: "Blog | Abhash Khadka",
    description: "Thoughts, tutorials, and insights on software development and technology.",
    url: "https://abhashkhadka.com.np/blogs",
    siteName: "Abhash Khadka Portfolio",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    images: [{ url: "https://abhashkhadka.com.np/logo.png", width: 1200, height: 630, alt: "Abhash Khadka - Blog" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Abhash Khadka",
    description: "Thoughts, tutorials, and insights on software development and technology.",
    images: ["https://abhashkhadka.com.np/logo.png"],
  },
};

export default async function BlogsPage() {
  const data = await getData();
  return (
    <div className="pt-24 min-h-screen">
      <Blog posts={data.blogs.filter((b) => b.published)} />
    </div>
  );
}
