'use client'

import { useState, useEffect } from 'react'
import { resendRecoveryCode } from '@/app/forgot-password/actions'

export default function ResendCode({ email }: { email: string }) {
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds cooldown
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // This handles the countdown logic
  useEffect(() => {
    if (timeLeft <= 0) return

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [timeLeft])

  const handleResend = async () => {
    setIsSending(true)
    setMessage('')
    
    // Call the server action we just made
    const result = await resendRecoveryCode(email)

    setIsSuccess(result.success)
    
    if (result.success) {
      setTimeLeft(60) // Reset the timer back to 60 seconds
      setMessage('Code resent successfully!')
    } else {
      setMessage(result.error || 'Failed to resend code.')
    }
    
    setIsSending(false)
  }

  return (
    <div className="text-center mt-4 flex flex-col items-center gap-2">
      {timeLeft > 0 ? (
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          Resend code in <span className="text-pink-500">{timeLeft}s</span>
        </p>
      ) : (
        <button
          type="button" // Important: type="button" prevents it from submitting the main form
          onClick={handleResend}
          disabled={isSending}
          className="text-[10px] font-bold text-zinc-500 hover:text-pink-500 transition-colors uppercase tracking-widest disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Resend Code'}
        </button>
      )}
      
      {/* Show temporary success/error message */}
      {message && (
        <p className={`text-xs font-medium ${isSuccess ? 'text-emerald-500' : 'text-rose-500'}`}>
          {message}
        </p>
      )}
    </div>
  )
}