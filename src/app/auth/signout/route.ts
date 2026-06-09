// src/app/auth/signout/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), {
    status: 302,
  })
}