"use client";

import { deleteMessage, markMessageRead, markMessageReplied } from "@/lib/actions";
import { useTransition, useState } from "react";
import { Message } from "@/lib/data";

export function MessageCard({ msg }: { msg: Message }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
    if (!msg.read) {
      startTransition(() => markMessageRead(msg.id));
    }
  };

  return (
    <div className={`bg-[#111111] border rounded-sm overflow-hidden transition-colors ${msg.read ? "border-gray-800" : "border-[#c9a84c]/40"}`}>
      {/* Header row */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02]"
        onClick={expanded ? () => setExpanded(false) : handleExpand}
      >
        {/* Unread dot */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.read ? "bg-transparent" : "bg-[#c9a84c]"}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-sm font-semibold truncate ${msg.read ? "text-gray-300" : "text-white"}`}>
              {msg.name}
            </span>
            <span className="text-gray-600 text-xs hidden sm:block truncate">{msg.email}</span>
          </div>
          <p className="text-gray-500 text-sm truncate">{msg.subject}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {msg.replied && (
            <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded-full hidden sm:block">
              Replied
            </span>
          )}
          <span className="text-gray-600 text-xs">{msg.date}</span>
          <span className="text-gray-500">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-gray-800 p-5">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
            {msg.message}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=Hi ${encodeURIComponent(msg.name)},%0A%0A`}
              onClick={() => startTransition(() => markMessageReplied(msg.id))}
              className="flex items-center gap-2 bg-[#c9a84c] text-black font-bold px-4 py-2 text-xs tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
            >
              ✉ Reply via Email
            </a>
            <button
              onClick={() => {
                if (confirm("Delete this message?")) {
                  startTransition(() => deleteMessage(msg.id));
                }
              }}
              disabled={isPending}
              className="flex items-center gap-2 border border-red-800/50 text-red-500 hover:text-red-400 hover:border-red-600 px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors rounded-sm disabled:opacity-50"
            >
              ✕ Delete
            </button>
            <span className="text-gray-600 text-xs">From: {msg.email}</span>
          </div>
        </div>
      )}
    </div>
  );
}
