// src/app/auth/signout/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  
  // Use the origin of the request to ensure it redirects to the current domain
  const requestUrl = new URL(req.url)
  return NextResponse.redirect(new URL('/login', requestUrl.origin), {
    status: 302,
  })
}