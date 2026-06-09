// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set({ name, value, ...options }))
        },
      },
    }
  )

  // Verify session securely on the Edge runtime
  const { data: { user } } = await supabase.auth.getUser()

  // Define all routes that unauthenticated users ARE allowed to visit
  const isPublicAuthRoute = 
    request.nextUrl.pathname.startsWith('/login') || 
  request.nextUrl.pathname.startsWith('/register') ||
  request.nextUrl.pathname.startsWith('/forgot-password') ||
  request.nextUrl.pathname.startsWith('/update-password');

  // Protect internal financial routes: if NOT logged in and NOT on a public route -> redirect to login
  if (!user && !isPublicAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Prevent logged-in users from hitting the authorization screens -> redirect to dashboard
  if (user && isPublicAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - All common media images (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}