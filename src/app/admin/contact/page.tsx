import { getData } from "@/lib/data";
import ContactForm from "./ContactForm";
import { Suspense } from "react";

export default async function AdminContactPage() {
  const data = await getData();

  return (
    <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
      <ContactForm data={data.contact} />
    </Suspense>
  );
}
