import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/actions";
import { getAdminBadgeCounts } from "@/lib/data";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await checkAuth();
  if (!isAuth) {
    redirect("/admin/login");
  }

  // Fetch badge counts server-side (aggregated server-side in Firestore)
  const { unreadMessages, pendingComments } = await getAdminBadgeCounts();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a]">
      <AdminSidebar unreadMessages={unreadMessages} pendingComments={pendingComments} />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
