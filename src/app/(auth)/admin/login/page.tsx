import { loginAction } from "@/lib/actions";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center justify-center gap-3 mb-6">
            <img src="/logo.png" alt="Abhash Logo" className="h-16 w-auto object-contain" />
            <span className="text-2xl font-black tracking-tighter text-white">ABHASH</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your password to manage the site</p>
        </div>

        {/* Form */}
        <form action={loginAction} className="bg-[#111111] border border-gray-800 rounded-sm p-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm"
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">Invalid password. Please try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#c9a84c] text-black font-bold py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
          >
            Sign In →
          </button>
        </form>
      </div>
    </main>
  );
}
