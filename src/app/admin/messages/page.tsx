import { getMessages } from "@/lib/data";
import { MessageCard } from "./MessageCard";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Inbox</h1>
        <p className="text-gray-500 text-sm">
          {messages.length} messages total · {messages.filter((m) => !m.read).length} unread
        </p>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageCard key={msg.id} msg={msg} />
          ))
        ) : (
          <div className="bg-[#111111] border border-gray-800 rounded-sm p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4 text-gray-600 text-2xl">
              ✉
            </div>
            <h3 className="text-white font-medium mb-1">Your inbox is empty</h3>
            <p className="text-gray-500 text-sm">When someone fills out your contact form, their message will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
