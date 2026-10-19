import { getData } from "@/lib/data";
import ContactForm from "./ContactForm";
import { Suspense } from "react";
import { AdminFormSkeleton } from "@/components/Skeleton";

export default async function AdminContactPage() {
  const data = await getData();

  return (
    <Suspense fallback={<AdminFormSkeleton />}>
      <ContactForm data={data.contact} />
    </Suspense>
  );
}
