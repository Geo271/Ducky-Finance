// src/app/forgot-password/verify/page.tsx
import { verifyRecoveryOtp } from '../actions'
import ResendCode from '@/components/ResendCode'

export default async function VerifyRecoveryPage({ searchParams }: { searchParams: Promise<{ email: string, error?: string }> }) {
  const resolvedParams = await searchParams
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF8F8] p-6">
      <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-xl w-full max-w-sm flex flex-col gap-4 text-center">
        
        {/* We wrap the main inputs in a form */}
        <form action={verifyRecoveryOtp} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-zinc-900">Enter Code</h1>
          <p className="text-xs text-zinc-500 mb-2">We sent a 6-digit code to <br/><span className="font-bold text-zinc-800">{resolvedParams.email}</span></p>
          
          {resolvedParams.error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg">{resolvedParams.error}</p>}

          <input type="hidden" name="email" value={resolvedParams.email} />
          
          <input 
            name="token" 
            type="text" 
            inputMode="numeric" 
            pattern="[0-9]{6}" 
            maxLength={6} 
            placeholder="000000" 
            required
            className="text-center text-2xl tracking-[1em] px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200" 
          />
          
          <button type="submit" className="w-full py-3 mt-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-all text-sm shadow-sm">
            Verify Code
          </button>
        </form>

        {/* 2. ADD THE RESEND COMPONENT HERE OUTSIDE THE FORM */}
        <ResendCode email={resolvedParams.email} />

      </div>
    </div>
  )
}