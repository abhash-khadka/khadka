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

  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: post.image ? [post.image] : undefined,
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

  return <BlogClient post={post} />;
}
