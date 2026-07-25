import { getData } from "@/lib/data";
import { updatePopupContent } from "@/lib/actions";

export const metadata = {
  title: "Popup Card | Admin",
};

export default async function PopupAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const data = await getData();
  const popup = data.popup;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Popup Card</h1>
        <p className="text-gray-400 mt-2">
          Manage the welcome popup shown to first-time visitors on the landing page.
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-sm text-green-400 text-sm font-medium">
          ✓ Popup settings saved successfully.
        </div>
      )}

      <form action={updatePopupContent} className="space-y-8">
        {/* Existing image for reference */}
        <input type="hidden" name="existingImage" value={popup.image || ""} />

        {/* Enable Toggle */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold">Enable Popup</h2>
              <p className="text-gray-500 text-sm mt-1">
                When enabled, new visitors will see this popup on their first visit.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="enabled"
                value="true"
                defaultChecked={popup.enabled}
                className="sr-only peer"
                id="popup-enabled"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9a84c]"></div>
            </label>
          </div>
        </div>

        {/* Image */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-sm p-6">
          <h2 className="text-white font-bold mb-4">Banner Image <span className="text-gray-500 font-normal">(optional)</span></h2>
          {popup.image && (
            <img src={popup.image} alt="Current popup image" className="w-full h-40 object-cover rounded-sm mb-4 opacity-70" />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#c9a84c]/10 file:text-[#c9a84c] hover:file:bg-[#c9a84c]/20 cursor-pointer"
          />
        </div>

        {/* Content — English */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-sm p-6 space-y-4">
          <h2 className="text-white font-bold mb-2">Content — English</h2>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Title</label>
            <input
              type="text"
              name="title_en"
              defaultValue={popup.title_en}
              placeholder="Welcome to my portfolio!"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Body Text</label>
            <textarea
              name="body_en"
              defaultValue={popup.body_en}
              rows={4}
              placeholder="Feel free to explore my work, read my blog, or get in touch!"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Button Label</label>
              <input
                type="text"
                name="buttonLabel_en"
                defaultValue={popup.buttonLabel_en}
                placeholder="View My Work"
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Button URL</label>
              <input
                type="text"
                name="buttonUrl"
                defaultValue={popup.buttonUrl}
                placeholder="/portfolio"
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
              />
            </div>
          </div>
        </div>

        {/* Content — Japanese */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-sm p-6 space-y-4">
          <h2 className="text-white font-bold mb-2">Content — 日本語</h2>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">タイトル</label>
            <input
              type="text"
              name="title_ja"
              defaultValue={popup.title_ja}
              placeholder="ポートフォリオへようこそ！"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">本文</label>
            <textarea
              name="body_ja"
              defaultValue={popup.body_ja}
              rows={4}
              placeholder="作品をご覧いただいたり、ブログを読んだり、お気軽にご連絡ください。"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 resize-y"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">ボタンラベル</label>
            <input
              type="text"
              name="buttonLabel_ja"
              defaultValue={popup.buttonLabel_ja}
              placeholder="作品を見る"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-[#c9a84c] text-black font-bold text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
          >
            Save Popup Settings
          </button>
        </div>
      </form>
    </div>
  );
}
