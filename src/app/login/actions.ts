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
    redirect('/login?error=Invalid email or password')
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
      // Automatically confirms the email so you don't have to check your inbox during local testing
      emailRedirectTo: 'http://localhost:3000',
    }
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Once registered, redirect them instantly to the home dashboard
  revalidatePath('/', 'layout')
  redirect('/')
}

