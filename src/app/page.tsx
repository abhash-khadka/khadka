import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Quote from "@/components/Quote";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import { getData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const data = await getData();
  return (
    <>
      <Hero data={data.landing} />
      <Portfolio projects={data.portfolio} />
      <About data={data.landing} />
      <Quote data={data.landing} />
      <Blog posts={data.blogs.filter((b) => b.published)} />
      <Contact />
    </>
  );
}
