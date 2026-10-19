import { notFound } from "next/navigation";
import { getData, getApprovedComments } from "@/lib/data";
import { Metadata } from "next";
import BlogClient from "./BlogClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getData();
  const post = data.blogs.find(
    (p) => p.slug === resolvedParams.id || p.id === parseInt(resolvedParams.id)
  );

  // Drafts must never be indexed or reachable
  if (!post || !post.published) {
    return { title: "Post Not Found" };
  }

  const title = post.title_en || "Blog Post";
  const excerpt = post.excerpt_en || title;
  const slug = post.slug || post.id;
  const canonicalUrl = `/blogs/${slug}`;
  const fullUrl = `https://abhashkhadka.com.np/blogs/${slug}`;
  const defaultImage = "https://abhashkhadka.com.np/logo.png";
  const ogImage = post.image || defaultImage;

  // Safely parse the date — if it's not a valid ISO string, use current date
  const parsedDate = new Date(post.date);
  const publishedTime = isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString();

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": fullUrl,
        "ja": fullUrl,
        "x-default": fullUrl,
      },
    },
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      url: fullUrl,
      siteName: "Abhash Khadka Portfolio",
      locale: "en_US",
      alternateLocale: ["ja_JP"],
      publishedTime,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getData();
  // Match by slug first, fall back to numeric id for old posts
  const post = data.blogs.find(
    (p) => p.slug === resolvedParams.id || p.id === parseInt(resolvedParams.id)
  );

  // Drafts are only visible in the admin panel — 404 them for everyone else
  if (!post || !post.published) {
    notFound();
  }

  // Safely parse the date for structured data
  const blogDate = new Date(post.date);
  const isoDate = isNaN(blogDate.getTime()) ? undefined : blogDate.toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title_en || "Blog Post",
    // Bilingual: provide Japanese headline as alternativeHeadline
    ...(post.title_ja ? { alternativeHeadline: post.title_ja } : {}),
    description: post.excerpt_en || "",
    inLanguage: ["en", "ja"],
    image: post.image ? [post.image] : ["https://abhashkhadka.com.np/logo.png"],
    ...(isoDate ? { datePublished: isoDate } : {}),
    url: `https://abhashkhadka.com.np/blogs/${post.slug || post.id}`,
    author: {
      "@type": "Person",
      name: "Abhash Khadka",
      alternateName: "アバシュ・カドカ",
      url: "https://abhashkhadka.com.np/"
    }
  };

  const comments = await getApprovedComments(post.slug || post.id.toString());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogClient post={post} comments={comments} />
    </>
  );
}
