"use client";

import { deletePortfolioItem } from "@/lib/actions";
import { useTransition } from "react";

export function DeletePortfolioButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure you want to delete this project?")) {
          startTransition(() => deletePortfolioItem(id));
        }
      }}
      disabled={isPending}
      className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
