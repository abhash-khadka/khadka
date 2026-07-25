import { getAllComments } from "@/lib/data";
import AdminCommentList from "./AdminCommentList";

export const metadata = {
  title: "Manage Comments | Admin",
};

export default async function CommentsAdminPage() {
  const comments = await getAllComments();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight mb-8">Comments</h1>
      <p className="text-gray-400 mb-8">
        Manage comments on your blog posts. Approve new comments to display them publicly.
      </p>

      <div className="bg-[#0d0d0d] border border-gray-800 rounded-sm">
        <AdminCommentList comments={comments} />
      </div>
    </div>
  );
}
