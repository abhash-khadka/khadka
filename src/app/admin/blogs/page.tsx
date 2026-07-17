import { getData } from "@/lib/data";
import Link from "next/link";
import { DeleteBlogButton } from "./DeleteBlogButton";

export default async function AdminBlogsPage() {
  const data = await getData();

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-gray-500 text-sm">{data.blogs.length} posts total</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="bg-[#c9a84c] text-black font-bold px-5 py-2.5 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm w-full sm:w-auto text-center"
        >
          + New Post
        </Link>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-500 font-medium px-6 py-4">Title</th>
              <th className="text-left text-gray-500 font-medium px-6 py-4 hidden md:table-cell">Date</th>
              <th className="text-left text-gray-500 font-medium px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.blogs.map((post) => (
              <tr key={post.id} className="border-b border-gray-800/50 last:border-0 hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <p className="text-white font-medium truncate max-w-[250px]">{post.title_en}</p>
                  <p className="text-gray-600 text-xs mt-0.5 truncate max-w-[250px]">{post.excerpt_en}</p>
                </td>
                <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{post.date}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${post.published ? "bg-green-500/10 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/blogs/${post.slug || post.id}`} target="_blank" className="text-gray-500 hover:text-white text-xs transition-colors">
                      View
                    </Link>
                    <Link href={`/admin/blogs/${post.slug || post.id}/edit`} className="text-[#c9a84c] hover:text-white text-xs font-medium transition-colors">
                      Edit
                    </Link>
                    <DeleteBlogButton id={post.id} slug={post.slug} />
                  </div>
                </td>
              </tr>
            ))}
            {data.blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-600">
                  No blog posts yet. <Link href="/admin/blogs/new" className="text-[#c9a84c]">Create one →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
