import Contact from "@/components/Contact";
import { Metadata } from "next";
import { getData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for freelance projects, collaborations, or just to say hi.",
};

export default async function ContactPage() {
  const data = await getData();
  
  return (
    <main className="pt-24 min-h-screen flex items-center bg-background">
      <div className="w-full">
        <Contact data={data.contact} />
      </div>
    </main>
  );
}
