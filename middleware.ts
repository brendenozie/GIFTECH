import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected, /api/auth)
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = [
    '/charts',
    '/dashboard',
    '/signals',
    '/news',
    '/insights',
    '/subscription',
    '/profile',
  ];

  // Define auth routes (login, register, etc.)
  const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ];

  // Check if the current path is a protected route
  // const isProtectedRoute = protectedRoutes.some(route => 
  //   path.startsWith(route)
  // );

  // Check if the current path is an auth route
  // const isAuthRoute = authRoutes.some(route => 
  //   path.startsWith(route)
  // );

  // For protected routes, let the client-side auth context handle authentication
  // The middleware will just pass through and let the page components check auth
  // if (isProtectedRoute) {
  //   return NextResponse.next();
  // }

  // For auth routes, let them handle their own logic
  // if (isAuthRoute) {
  //   return NextResponse.next();
  // }

  // For all other routes, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
