import { NextResponse } from 'next/server';

export function middleware(request) {
  // Chỉ kiểm tra token từ cookies, không dùng localStorage
  const token = request.cookies.get('token');
  
  // Log để debug
  console.log('Middleware check:', {
    path: request.nextUrl.pathname,
    hasToken: !!token
  });
  
  // Nếu không có token và cố truy cập dashboard
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Nếu có token và cố truy cập login
  if (token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}; 