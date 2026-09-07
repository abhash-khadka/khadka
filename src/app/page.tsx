import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Quote from "@/components/Quote";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import WelcomePopup from "@/components/WelcomePopup";
import { getData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const data = await getData();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://abhashkhadka.com.np/#website",
        url: "https://abhashkhadka.com.np/",
        name: data.seo.siteName_en || "Abhash Khadka Portfolio",
        description: data.seo.description_en || "B.S. Information Technology Student - Building web apps, databases, and AI tools.",
        publisher: {
          "@id": "https://abhashkhadka.com.np/#person"
        }
      },
      {
        "@type": "Person",
        "@id": "https://abhashkhadka.com.np/#person",
        name: "Abhash Khadka",
        url: "https://abhashkhadka.com.np/",
        jobTitle: "Web Developer",
        alumniOf: "Information Technology Student"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {data.popup.enabled && <WelcomePopup popup={data.popup} />}
      <Hero data={data.landing} />
      <Portfolio projects={data.portfolio} />
      <About data={data.landing} />
      <Quote data={data.landing} />
      <Blog posts={data.blogs.filter((b) => b.published)} />
      <Contact data={data.contact} />
    </>
  );
}
