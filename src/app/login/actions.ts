// src/app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// THE SIGN-IN / LOGIN METHOD
export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // FIXED: Return the error so our frontend toast can display it
    return { error: 'Invalid email or password' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// THE CREATE ACCOUNT / SIGNUP METHOD
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      // FIXED: Made this dynamic so it works locally AND on Vercel
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    }
  })

  if (error) {
    // FIXED: Return the exact Supabase error message to the frontend toast
    return { error: error.message }
  }

  // Once registered, redirect them instantly to the home dashboard
  revalidatePath('/', 'layout')
  redirect('/')
}