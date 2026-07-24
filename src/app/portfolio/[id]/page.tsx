import { notFound } from "next/navigation";
import { getData } from "@/lib/data";
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

  // Strip HTML from overview for description
  const cleanDescription = overview.replace(/<[^>]+>/g, '').substring(0, 160) + "...";
  const canonicalUrl = `/portfolio/${project.id}`;
  const defaultImage = "https://abhashkhadka.com.np/logo.png";
  const ogImage = project.image || defaultImage;

  return {
    title,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: cleanDescription,
      type: "article",
      images: [{ url: ogImage }],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title_en || "Portfolio Project",
    description: project.overview_en ? project.overview_en.replace(/<[^>]+>/g, '') : "",
    image: project.image ? [project.image] : ["https://abhashkhadka.com.np/logo.png"],
    author: {
      "@type": "Person",
      name: "Abhash Khadka",
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
      <PortfolioClient project={project} />
    </>
  );
}
