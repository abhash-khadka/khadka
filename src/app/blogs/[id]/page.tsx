import { notFound } from "next/navigation";
import { getData } from "@/lib/data";
import { Metadata } from "next";
import BlogClient from "./BlogClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getData();
  const post = data.blogs.find(
    (p) => p.slug === resolvedParams.id || p.id === parseInt(resolvedParams.id)
  ) as any;

  if (!post) {
    return { title: "Post Not Found" };
  }

  const title = post.title_en || "Blog Post";
  const excerpt = post.excerpt_en || "";
  const canonicalUrl = `/blogs/${post.slug || post.id}`;
  const defaultImage = "https://abhashkhadka.com.np/logo.png";
  const ogImage = post.image || defaultImage;

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      publishedTime: post.date,
      images: [{ url: ogImage }],
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
  ) as any;

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title_en || "Blog Post",
    description: post.excerpt_en || "",
    image: post.image ? [post.image] : ["https://abhashkhadka.com.np/logo.png"],
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Abhash Khadka",
      url: "https://abhashkhadka.com.np/"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogClient post={post} />
    </>
  );
}
