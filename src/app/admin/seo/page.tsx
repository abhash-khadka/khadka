import { getData } from "@/lib/data";
import SeoForm from "./SeoForm";
import { Suspense } from "react";

export const metadata = {
  title: "Admin | SEO Settings",
};

export default async function AdminSeoPage() {
  const data = await getData();

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Global SEO Settings</h1>
        <p className="text-gray-500 text-sm">Update your site's global meta tags to improve Search Engine Optimization (SEO) for both English and Japanese.</p>
      </div>
      
      <Suspense fallback={null}>
        <SeoForm data={data.seo} />
      </Suspense>
    </div>
  );
}
