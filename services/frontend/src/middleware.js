import { NextResponse } from 'next/server';
import { ROUTES, getDefaultRoute, hasPermission, isPublicRoute } from './configs/routesPermission';

// Helper function để parse JWT token an toàn
const parseJwt = (token) => {
  try {
    // 1. Check token tồn tại
    if (!token) {
      console.error('Token is empty');
      return null;
    }

    // 2. Check token format
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return null;
    }

    // 3. Parse payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());

    // 4. Validate payload
    if (!payload || typeof payload !== 'object') {
      console.error('Invalid payload format');
      return null;
    }

    return payload;
  } catch (e) {
    console.error('Token parse error:', e);
    return null;
  }
};

// Helper function để check token validity
const isValidToken = (userData) => {
  try {
    if (!userData) return false;

    // Check expiration time
    const currentTime = Date.now() / 1000;
    const isValid = userData.exp > currentTime;

    console.log('Token validity check:', {
      exp: userData.exp,
      current: currentTime,
      isValid,
    });

    return isValid;
  } catch (e) {
    console.error('Token validation error:', e);
    return false;
  }
};

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // 1. Skip static files và public assets
  if (
    path === '/favicon.ico' ||
    path.startsWith('/_next/') ||
    path.startsWith('/public/') ||
    path.startsWith('/images/')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const isApiRoute = path.startsWith('/api/');

  // 2. Parse và validate token
  let userData = null;
  if (token) {
    userData = parseJwt(token);
    if (!userData || !isValidToken(userData)) {
      console.warn('Invalid or expired token:', { path, userData });

      if (isApiRoute) {
        return new NextResponse(JSON.stringify({ message: 'Token invalid or expired' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        });
      }
      const response = NextResponse.redirect(new URL(ROUTES.login, request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // 3. API routes luôn cần authentication
  if (isApiRoute && !userData) {
    console.warn('Unauthorized API access:', { path });
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  // 4. Xử lý public routes
  if (isPublicRoute(path)) {
    if (userData) {
      // Đã login -> chuyển đến trang mặc định theo role/department
      const defaultRoute = getDefaultRoute(userData.role, userData.department);
      console.log('Redirecting logged user from public route:', {
        from: path,
        to: defaultRoute,
        role: userData.role,
        department: userData.department,
      });
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
    return NextResponse.next();
  }

  // 5. Xử lý khi chưa đăng nhập
  if (!userData) {
    console.warn('Unauthorized access:', { path });
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Check role và department
  if (!userData.role || !userData.department) {
    console.warn('Invalid user data:', { userData, path });
    const response = NextResponse.redirect(new URL(ROUTES.login, request.url));
    response.cookies.delete('token');
    return response;
  }

  // 7. Check permission
  if (!hasPermission(userData.role, userData.department, path)) {
    console.warn('Permission denied:', {
      path,
      role: userData.role,
      department: userData.department,
    });
    const defaultRoute = getDefaultRoute(userData.role, userData.department);
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // 8. Có quyền truy cập -> cho phép
  return NextResponse.next();
}

// Cập nhật matcher config
export const config = {
  matcher: [
    // Exclude files
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
    // Include API routes
    '/api/:path*',
  ],
};
