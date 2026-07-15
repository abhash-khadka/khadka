import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for freelance projects, collaborations, or just to say hi.",
};

export default function ContactPage() {
  return (
    <main className="pt-24 min-h-screen flex items-center bg-[#0a0a0a]">
      <div className="w-full">
        <Contact />
      </div>
    </main>
  );
}
