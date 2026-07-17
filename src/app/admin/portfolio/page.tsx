import { getData } from "@/lib/data";
import Link from "next/link";
import { DeletePortfolioButton } from "./DeletePortfolioButton";

export default async function AdminPortfolioPage() {
  const data = await getData();

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-gray-500 text-sm">{data.portfolio.length} projects total</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="bg-[#c9a84c] text-black font-bold px-5 py-2.5 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm w-full sm:w-auto text-center"
        >
          + New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.portfolio.map((item) => (
          <div key={item.id} className="bg-[#111111] border border-gray-800 rounded-sm overflow-hidden hover:border-gray-700 transition-colors">
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="p-5">
              <span className="text-[#c9a84c] text-[10px] font-semibold tracking-widest uppercase">{item.category}</span>
              <h3 className="text-white font-bold text-base mt-1 mb-2 truncate">{item.title_en}</h3>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{item.overview_en}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {item.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="bg-gray-900 text-gray-400 text-[10px] px-2 py-0.5 rounded-sm">{tech}</span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <div className="flex gap-4">
                  <Link href={`/portfolio/${item.id}`} target="_blank" className="text-gray-500 hover:text-white text-xs transition-colors">
                    View
                  </Link>
                  <Link href={`/admin/portfolio/${item.id}/edit`} className="text-[#c9a84c] hover:text-white text-xs font-medium transition-colors">
                    Edit
                  </Link>
                </div>
                <DeletePortfolioButton id={item.id} />
              </div>
            </div>
          </div>
        ))}
        {data.portfolio.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-600">
            No portfolio items yet. <Link href="/admin/portfolio/new" className="text-[#c9a84c]">Add one →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
