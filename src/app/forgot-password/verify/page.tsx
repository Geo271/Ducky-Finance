// src/app/forgot-password/verify/page.tsx
import { verifyRecoveryOtp } from '../actions'
import ResendCode from '@/components/ResendCode'
import VerifyCodeForm from '@/components/VerifyCodeForm'


export default async function VerifyRecoveryPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ email?: string }> 
}) {
  const resolvedParams = await searchParams
  const email = resolvedParams.email || ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF8F8] p-6 font-sans">
      <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-xl w-full max-w-sm flex flex-col gap-4 text-center">
        
        <VerifyCodeForm email={email} />

        <ResendCode email={email} />

      </div>
    </div>
  )
}

