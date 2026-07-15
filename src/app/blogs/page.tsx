import Blog from "@/components/Blog";
import { getData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights on software development and technology.",
};

export default async function BlogsPage() {
  const data = await getData();
  return (
    <main className="pt-24 min-h-screen">
      <Blog posts={data.blogs.filter((b) => b.published)} />
    </main>
  );
}
