'use client'

import { useRouter } from 'next/navigation'
import { updateNewPassword } from './action'
import SubmitButton from '@/components/SubmitButton'
import toast from 'react-hot-toast'

export default function UpdatePasswordPage() {
  const router = useRouter()

  const handleUpdate = async (formData: FormData) => {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    const result = await updateNewPassword(formData)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    if (result?.success) {
      toast.success('Password updated successfully! Please log in.')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF8F8] p-6 font-sans">
      <form action={handleUpdate} className="bg-white p-8 rounded-3xl border border-pink-100 shadow-xl w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 text-center">New Password</h1>
        <p className="text-xs text-zinc-500 text-center mb-2">Secure your account with a new password.</p>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Password</label>
          <input 
            name="password" 
            type="password" 
            required 
            placeholder="••••••••" 
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confirm Password</label>
          <input 
            name="confirmPassword" 
            type="password" 
            required 
            placeholder="••••••••" 
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" 
          />
        </div>
        
        <SubmitButton 
          defaultText="Save Password"
          loadingText="Saving..."
          className="w-full py-3 mt-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-all text-sm shadow-sm"
        />
      </form>
    </div>
  )
}