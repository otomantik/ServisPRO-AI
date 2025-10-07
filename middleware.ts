import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/api/auth/login', '/healthz']

// API routes that require authentication
const protectedApiRoutes = [
  '/api/dashboard',
  '/api/services',
  '/api/customers',
  '/api/stock',
  '/api/cash',
  '/api/kasa',
  '/api/users',
  '/api/categories',
  '/api/payment-types',
  '/api/cash-transactions',
  '/api/alacaklar',
  '/api/ar',
  '/api/invoices',
  '/api/staff'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const session = request.cookies.get('session')?.value
  
  // If no session and trying to access protected route
  if (!session) {
    // For dashboard routes, redirect to login
    if (pathname.startsWith('/dashboard')) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    
    // For API routes, return 401
    if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    }
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

