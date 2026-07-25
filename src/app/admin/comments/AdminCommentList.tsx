"use client";

import { useTransition } from "react";
import { BlogComment } from "@/lib/data";
import { approveComment, deleteComment } from "@/lib/actions";

export default function AdminCommentList({ comments }: { comments: BlogComment[] }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: number) => {
    startTransition(async () => {
      await approveComment(id);
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      startTransition(async () => {
        await deleteComment(id);
      });
    }
  };

  if (comments.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No comments found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 text-xs uppercase tracking-widest text-gray-500">
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Post Slug</th>
            <th className="p-4 font-medium">Name</th>
            <th className="p-4 font-medium">Comment</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {comments.map((comment) => (
            <tr key={comment.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
              <td className="p-4">
                {comment.approved ? (
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-sm font-medium">Approved</span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-sm font-medium">Pending</span>
                )}
              </td>
              <td className="p-4 text-gray-400 font-mono text-xs">{comment.blogSlug}</td>
              <td className="p-4 font-medium text-white">
                {comment.name}
                {comment.parentId && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded-sm tracking-widest uppercase">
                    Reply
                  </span>
                )}
              </td>
              <td className="p-4 text-gray-400 max-w-xs truncate" title={comment.content}>
                {comment.content}
              </td>
              <td className="p-4 text-gray-500 text-xs">{comment.date}</td>
              <td className="p-4 text-right space-x-3">
                {!comment.approved && (
                  <button
                    onClick={() => handleApprove(comment.id)}
                    disabled={isPending}
                    className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={isPending}
                  className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
