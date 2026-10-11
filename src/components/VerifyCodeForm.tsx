// src/components/VerifyCodeForm.tsx
'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import SubmitButton from '@/components/SubmitButton'
import { verifyRecoveryOtp } from '@/app/forgot-password/actions'

export default function VerifyCodeForm({ email }: { email: string }) {
  const router = useRouter()

  const handleVerify = async (formData: FormData) => {
    const result = await verifyRecoveryOtp(formData)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    if (result?.success) {
      toast.success('Code verified! Set your new password.')
      router.push('/update-password')
    }
  }

  return (
    <form action={handleVerify} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-zinc-900">Enter Code</h1>
      <p className="text-xs text-zinc-500 mb-2">
        We sent a 6-digit code to <br />
        <span className="font-bold text-zinc-800">{email}</span>
      </p>

      <input type="hidden" name="email" value={email} />
      
      <input 
        name="token" 
        type="text" 
        inputMode="numeric" 
        pattern="[0-9]{6}" 
        maxLength={6} 
        placeholder="000000" 
        required
        className="text-center text-2xl tracking-[1em] px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200 font-mono" 
      />
      
      <SubmitButton 
        defaultText="Verify Code"
        loadingText="Verifying..."
        className="w-full py-3 mt-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-all text-sm shadow-sm"
      />
    </form>
  )
}