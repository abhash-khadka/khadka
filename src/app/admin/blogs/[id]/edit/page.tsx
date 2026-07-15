import { getData } from "@/lib/data";
import { updateBlogPost } from "@/lib/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogForm from "../../BlogForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData();
  // Support both slug and legacy numeric id
  const post = data.blogs.find((b) => b.slug === id || b.id === parseInt(id));
  if (!post) notFound();

  const action = updateBlogPost.bind(null, post.id);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin/blogs" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
        </div>
      </div>

      <BlogForm post={post} action={action} isEdit={true} />
    </div>
  );
}
