// src/app/register/verify/page.tsx
import { handleVerifyOTP } from '../actions'

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ email?: string; error?: string }> }) {
  const resolvedParams = await searchParams
  const email = resolvedParams.email || ''
  const errorMessage = resolvedParams.error

  return (
    <div className="min-h-screen bg-[#FAF6F6] text-zinc-800 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-rose-200/20 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full max-w-sm bg-white p-8 rounded-3xl border border-pink-100/60 shadow-[0_4px_30px_rgba(244,63,94,0.03)] relative z-10">
        <header className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-xl mx-auto mb-3 border border-amber-100">✉️</div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Verify Your Email</h1>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            We sent a secure 6-digit confirmation code to <span className="font-bold text-zinc-700 block mt-0.5">{email}</span>
          </p>
        </header>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-[11px] font-medium leading-relaxed">
            ❌ Invalid verification code. Please check your inbox and try again.
          </div>
        )}

        <form action={handleVerifyOTP} className="flex flex-col gap-4">
          {/* Keep track of the destination email silently */}
          <input type="hidden" name="email" value={email} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="token" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide text-center mb-1">
              Enter 6-Digit Code
            </label>
            <input 
              id="token" 
              name="token" 
              type="text" 
              maxLength={6}
              required 
              autoFocus
              placeholder="000000" 
              className="w-full px-4 py-3 tracking-[0.5em] text-center rounded-xl border border-zinc-200 bg-zinc-50/50 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-pink-200 text-zinc-800 placeholder:tracking-normal placeholder:text-zinc-300" 
            />
          </div>

          <button type="submit" className="mt-2 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm">
            Confirm Verification Code
          </button>
        </form>
      </main>
    </div>
  )
}