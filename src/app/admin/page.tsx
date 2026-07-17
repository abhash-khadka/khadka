import { getData, getMessages } from "@/lib/data";
import Link from "next/link";

const BlogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const PortfolioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const LandingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
  </svg>
);

export default async function AdminDashboard() {
  const [data, messages] = await Promise.all([
    getData(),
    getMessages(),
  ]);

  const unreadMessages = messages ? messages.filter((m) => !m.read).length : 0;

  const stats = [
    { label: "Blog Posts",       value: data.blogs.length,     href: "/admin/blogs",     icon: <BlogIcon />,      color: "text-blue-400",   bg: "bg-blue-400/10" },
    { label: "Portfolio Items",  value: data.portfolio.length, href: "/admin/portfolio", icon: <PortfolioIcon />, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Unread Messages",  value: unreadMessages,        href: "/admin/messages",  icon: <MessageIcon />,   color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here is a quick overview of your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#111111] border border-gray-800 rounded-sm p-6 hover:border-[#c9a84c]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <span className={`${stat.color} ${stat.bg} p-2 rounded-sm`}>{stat.icon}</span>
            </div>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/blogs/new" className="flex items-center gap-3 bg-[#111111] border border-gray-800 p-5 rounded-sm hover:border-[#c9a84c]/30 transition-colors">
            <span className="text-[#c9a84c] bg-[#c9a84c]/10 p-2 rounded-sm shrink-0"><PlusIcon /></span>
            <div>
              <p className="text-white text-sm font-semibold">New Blog Post</p>
              <p className="text-gray-500 text-xs">Write and publish a new article</p>
            </div>
          </Link>
          <Link href="/admin/portfolio/new" className="flex items-center gap-3 bg-[#111111] border border-gray-800 p-5 rounded-sm hover:border-[#c9a84c]/30 transition-colors">
            <span className="text-[#c9a84c] bg-[#c9a84c]/10 p-2 rounded-sm shrink-0"><PlusIcon /></span>
            <div>
              <p className="text-white text-sm font-semibold">New Portfolio Item</p>
              <p className="text-gray-500 text-xs">Add a project to your portfolio</p>
            </div>
          </Link>
          <Link href="/admin/landing" className="flex items-center gap-3 bg-[#111111] border border-gray-800 p-5 rounded-sm hover:border-[#c9a84c]/30 transition-colors">
            <span className="text-[#c9a84c] bg-[#c9a84c]/10 p-2 rounded-sm shrink-0"><LandingIcon /></span>
            <div>
              <p className="text-white text-sm font-semibold">Edit Landing Page</p>
              <p className="text-gray-500 text-xs">Update hero text, about section</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Blog Posts */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Blog Posts</h2>
        <div className="bg-[#111111] border border-gray-800 rounded-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-500 font-medium px-6 py-4">Title</th>
                <th className="text-left text-gray-500 font-medium px-6 py-4 hidden md:table-cell">Date</th>
                <th className="text-left text-gray-500 font-medium px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {data.blogs.slice(0, 5).map((post) => (
                <tr key={post.id} className="border-b border-gray-800/50 last:border-0 hover:bg-white/2">
                  <td className="px-6 py-4 text-white font-medium truncate max-w-[200px]">{post.title_en}</td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{post.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${post.published ? "bg-green-500/10 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/blogs/${post.id}/edit`} className="text-[#c9a84c] hover:text-white text-xs font-medium transition-colors">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
