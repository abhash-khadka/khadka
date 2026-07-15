import Portfolio from "@/components/Portfolio";
import { getData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A showcase of my recent web development, design, and software projects.",
};

export default async function PortfolioPage() {
  const data = await getData();
  return (
    <main className="pt-24 min-h-screen">
      <Portfolio projects={data.portfolio} />
    </main>
  );
}
