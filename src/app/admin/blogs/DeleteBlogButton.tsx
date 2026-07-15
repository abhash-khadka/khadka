"use client";

import { deleteBlogPost } from "@/lib/actions";
import { useTransition } from "react";

export function DeleteBlogButton({ id, slug }: { id: number; slug?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure you want to delete this post?")) {
          startTransition(() => deleteBlogPost(id, slug));
        }
      }}
      disabled={isPending}
      className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
