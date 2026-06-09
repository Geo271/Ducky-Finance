// src/app/login/page.tsx
import { login, signup } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F6] text-zinc-800 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-rose-200/20 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full max-w-sm bg-white p-8 rounded-3xl border border-pink-100/60 shadow-[0_4px_30px_rgba(244,63,94,0.03)] relative z-10">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-zinc-900">Welcome to <span className="text-pink-500">Ducky Finance</span></h1>
          <p className="text-xs text-zinc-400 mt-1">Sign in or register your independent financial manager account</p>
        </header>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Email Address</label>
            <input id="email" name="email" type="email" required placeholder="your.name@example.com" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200" />
          </div>

          {/* Password Field with inline Forgot Password Link */}
<div className="flex flex-col gap-1.5 mb-6">
  
  {/* The Label and the Link MUST be inside this specific div together */}
  <div className="flex items-center justify-between">
    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
    
    {/* NUCLEAR FIX: Using a standard <a> tag forces the browser to navigate */}
    <a href="/forgot-password" className="text-[10px] font-bold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider">
      Forgot Password?
    </a>
  </div>
  
  <input 
    name="password" 
    type="password" 
    required 
    placeholder="••••••••" 
    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" 
  />
</div>

          <button formAction={login} className="mt-2 w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm">
            Sign In Account
          </button>
          
          <p className="text-center text-xs text-zinc-400 mt-4 font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="text-pink-500 hover:text-pink-600 font-bold underline decoration-pink-200 underline-offset-4">
              Create New Account
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}