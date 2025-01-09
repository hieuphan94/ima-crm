import { NextResponse } from 'next/server';

// Định nghĩa các routes configuration
const PUBLIC_ROUTES = ['/login', '/forgot-password'];
const PROTECTED_ROUTES = ['/dashboard', '/users', '/settings'];

// Helper function để check route
const isProtectedRoute = (path) => {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
};

const isPublicRoute = (path) => {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

export function middleware(request) {
  const token = request.cookies.get('token');
  const path = request.nextUrl.pathname;

  // Log để debug
  console.log('Middleware check:', {
    path,
    hasToken: !!token,
    isProtected: isProtectedRoute(path),
    isPublic: isPublicRoute(path),
  });

  // Nếu không có token và truy cập protected route
  if (!token && isProtectedRoute(path)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu có token và truy cập public route (như login)
  if (token && isPublicRoute(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Match tất cả các routes
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
