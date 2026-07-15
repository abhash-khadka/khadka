import { createBlogPost } from "@/lib/actions";
import Link from "next/link";
import BlogForm from "../BlogForm";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin/blogs" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">New Blog Post</h1>
        </div>
      </div>

      <BlogForm action={createBlogPost} />
    </div>
  );
}
