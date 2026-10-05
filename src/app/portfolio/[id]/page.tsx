import { notFound } from "next/navigation";
import { getData, getApprovedComments } from "@/lib/data";
import { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getData();
  const project = data.portfolio.find((p) => p.id === parseInt(resolvedParams.id));

  if (!project) {
    return { title: "Project Not Found" };
  }

  const title = project.title_en || "Portfolio Project";
  const overview = project.overview_en || "";

  // Strip HTML from overview for description, guard against empty strings
  const stripped = overview.replace(/<[^>]+>/g, '').trim().substring(0, 157);
  const cleanDescription = stripped ? stripped + "..." : title;
  const canonicalUrl = `/portfolio/${project.id}`;
  const fullUrl = `https://abhashkhadka.com.np/portfolio/${project.id}`;
  const defaultImage = "https://abhashkhadka.com.np/logo.png";
  const ogImage = project.image || defaultImage;

  return {
    title,
    description: cleanDescription,
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
      description: cleanDescription,
      type: "article",
      url: fullUrl,
      siteName: "Abhash Khadka Portfolio",
      locale: "en_US",
      alternateLocale: ["ja_JP"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [ogImage],
    },
  };
}

export default async function PortfolioProject({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getData();
  const project = data.portfolio.find((p) => p.id === parseInt(resolvedParams.id));

  if (!project) {
    notFound();
  }

  const comments = await getApprovedComments(project.id.toString());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title_en || "Portfolio Project",
    // Bilingual: provide Japanese project name
    ...(project.title_ja ? { alternateName: project.title_ja } : {}),
    description: project.overview_en ? project.overview_en.replace(/<[^>]+>/g, '') : "",
    inLanguage: ["en", "ja"],
    image: project.image ? [project.image] : ["https://abhashkhadka.com.np/logo.png"],
    author: {
      "@type": "Person",
      name: "Abhash Khadka",
      alternateName: "アバシュ・カドカ",
      url: "https://abhashkhadka.com.np/"
    },
    url: `https://abhashkhadka.com.np/portfolio/${project.id}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioClient project={project} comments={comments} />
    </>
  );
}
