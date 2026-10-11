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

  const pathname = request.nextUrl.pathname

  // Public gateway pages that logged-in users should NEVER see
  const isAuthGatewayRoute = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password')

  const isUpdatePasswordRoute = pathname.startsWith('/update-password')

  // 1. If NOT logged in:
  // Allow them on login/register/forgot-password, but block protected app pages AND update-password
  if (!user && !isAuthGatewayRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If LOGGED IN:
  // Redirect away from login / register / forgot-password to dashboard
  // Notice: /update-password is NOT blocked here, so authenticated users can set their new password!
  if (user && isAuthGatewayRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}