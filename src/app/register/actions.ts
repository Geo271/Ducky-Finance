// src/app/register/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function handleSignUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string // Added this

  // 1. Validate Password Match
  if (password !== confirmPassword) {
    redirect(`/register?error=${encodeURIComponent("Passwords do not match")}`)
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/register/verify?email=${encodeURIComponent(email)}`)
}

export async function handleVerifyOTP(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  })

  if (error) {
    redirect(`/register/verify?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// 2. New Forgot Password Function
export async function handleForgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // NOTE: Ensure this URL matches your actual password reset page route
  const redirectTo = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com/auth/update-password' 
    : 'http://localhost:3000/auth/update-password'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/login?message=Check your email for the reset link`)
}