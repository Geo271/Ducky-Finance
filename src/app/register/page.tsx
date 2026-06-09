// src/app/register/page.tsx
import { handleSignUp } from './actions'
import Link from 'next/link'

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await searchParams
  const errorMessage = resolvedParams.error

  return (
    <div className="min-h-screen bg-[#FAF6F6] text-zinc-800 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-rose-200/20 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full max-w-sm bg-white p-8 rounded-3xl border border-pink-100/60 shadow-[0_4px_30px_rgba(244,63,94,0.03)] relative z-10">
        <header className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-xl mx-auto mb-3 border border-pink-100">✨</div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Create Account</h1>
          <p className="text-xs text-zinc-400 mt-1">Get started by setting up your secure financial workspace</p>
        </header>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-[11px] font-medium leading-relaxed">
            ❌ {errorMessage}
          </div>
        )}

        <form action={handleSignUp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Email Address</label>
            <input id="email" name="email" type="email" required placeholder="name@example.com" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-zinc-800" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Secure Password</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-zinc-800" />
          </div>

          {/* NEW: Confirm Password Field */}
<div className="flex flex-col gap-1.5 mb-6">
  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confirm Password</label>
  <input 
    name="confirmPassword" 
    type="password" 
    required 
    placeholder="••••••••" 
    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" 
  />
</div>

          <button type="submit" className="mt-2 w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm">
            Register Account
          </button>
          
          <p className="text-center text-xs text-zinc-400 mt-2 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-zinc-700 hover:text-zinc-900 font-bold underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}