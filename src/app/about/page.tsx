import About from "@/components/About";
import Quote from "@/components/Quote";
import { getData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn more about my journey, skills, and experience as an IT student and developer.",
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const data = await getData();
  return (
    <main className="pt-24 min-h-screen">
      <About data={data.landing} />
      <Quote data={data.landing} />
    </main>
  );
}
