// src/app/update-password/page.tsx
import { updateNewPassword } from '@/app/forgot-password/actions'

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF8F8] p-6">
      <form action={updateNewPassword} className="bg-white p-8 rounded-3xl border border-pink-100 shadow-xl w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 text-center">New Password</h1>
        <p className="text-xs text-zinc-500 text-center mb-2">Secure your account with a new password.</p>
        
        {resolvedParams.error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg text-center">{resolvedParams.error}</p>}

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Password</label>
          <input name="password" type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confirm Password</label>
          <input name="confirmPassword" type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" />
        </div>
        
        <button type="submit" className="w-full py-3 mt-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-all text-sm shadow-sm">
          Save Password
        </button>
      </form>
    </div>
  )
}