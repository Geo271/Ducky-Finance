'use server'
import { createClient } from '@/utils/supabase/server'

export async function forgotPassword(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `http://localhost:3000/auth/update-password`, // Change to production URL later
  })
  if (error) throw new Error(error.message)
}