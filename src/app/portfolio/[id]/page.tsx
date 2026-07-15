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

  return {
    title,
    description: cleanDescription,
    openGraph: {
      title,
      description: cleanDescription,
      type: "article",
      images: project.image ? [{ url: project.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: project.image ? [project.image] : undefined,
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

  return <PortfolioClient project={project} />;
}
