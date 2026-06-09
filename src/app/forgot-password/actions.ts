// src/app/forgot-password/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function sendRecoveryEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)

  redirect(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
}

export async function verifyRecoveryOtp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const { error } = await supabase.auth.verifyOtp({ 
    email, 
    token, 
    type: 'recovery' 
  })
  
  if (error) {
    redirect(`/forgot-password/verify?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`)
  }

  // Redirect specifically to the update-password page
  // The middleware will now let this pass because of the update we made above
  redirect('/update-password') 
}

export async function updateNewPassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect(`/update-password?error=${encodeURIComponent("Passwords do not match")}`)
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) redirect(`/update-password?error=${encodeURIComponent(error.message)}`)

  await supabase.auth.signOut()
  redirect(`/login?message=${encodeURIComponent("Password updated successfully. Please log in.")}`)
}

export async function resendRecoveryCode(email: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}