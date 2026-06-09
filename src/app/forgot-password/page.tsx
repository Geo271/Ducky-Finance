// src/app/forgot-password/page.tsx
import { sendRecoveryEmail } from './actions'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF8F8] p-6">
      <form action={sendRecoveryEmail} className="bg-white p-8 rounded-3xl border border-pink-100 shadow-xl w-full max-w-sm flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Reset Password</h1>
        <p className="text-xs text-black-500 mb-2">Enter your account email to receive a 6-digit recovery code.</p>
        
        <input 
          name="email" 
          type="email" 
          required 
          placeholder="name@example.com" 
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm text-left" 
        />
        
        <button type="submit" className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-all text-sm shadow-sm">
          Send Code
        </button>
        
        <a href="/login" className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-wider mt-2">
          ← Back to Login
        </a>
      </form>
    </div>
  )
}