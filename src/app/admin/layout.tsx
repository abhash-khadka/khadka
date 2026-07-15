import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/actions";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await checkAuth();
  if (!isAuth) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
