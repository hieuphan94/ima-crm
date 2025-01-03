import { NextResponse } from 'next/server';

// Các routes không cần auth
const publicRoutes = ['/login', '/register'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');

  // Cho phép truy cập public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Kiểm tra auth cho các routes khác
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Cấu hình các routes cần apply middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 