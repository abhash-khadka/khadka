import { getData } from "@/lib/data";
import LandingForm from "./LandingForm";

export default async function AdminLandingPage() {
  const data = await getData();

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Landing Page Editor</h1>
        <p className="text-gray-500 text-sm">Switch between English and Japanese tabs to edit the content for each language. Changes here will reflect instantly on your live site.</p>
      </div>
      
      <LandingForm data={data.landing} />
    </div>
  );
}
