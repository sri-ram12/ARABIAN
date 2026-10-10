import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Arabian Mandi Subdomain & Multi-Portal Router Middleware
 *
 * Allows hosting all 4 portals with distinct URLs online:
 * - Customer Portal: https://yourdomain.com or https://mandi.yourdomain.com
 * - Admin Console:   https://admin.yourdomain.com
 * - Kitchen Station: https://kitchen.yourdomain.com
 * - Rider Logistics: https://rider.yourdomain.com or https://delivery.yourdomain.com
 *
 * Also preserves direct path-based access (/admin, /admin/kitchen, /delivery, /portals).
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Bypass Next.js internal assets, API routes, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract hostname without port (e.g. "admin.arabianmandi.in" or "admin.localhost")
  const host = hostname.split(':')[0].toLowerCase();

  // 1. ADMIN SUBDOMAIN: admin.*
  if (host.startsWith('admin.')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/admin', request.url));
    }
    if (pathname === '/login') {
      return NextResponse.rewrite(new URL('/admin/login', request.url));
    }
  }

  // 2. KITCHEN SUBDOMAIN: kitchen.*
  if (host.startsWith('kitchen.')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/admin/kitchen', request.url));
    }
    if (pathname === '/login') {
      return NextResponse.rewrite(new URL('/kitchen/login', request.url));
    }
  }

  // 3. RIDER / DELIVERY SUBDOMAIN: rider.* or delivery.*
  if (host.startsWith('rider.') || host.startsWith('delivery.')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/delivery', request.url));
    }
    if (pathname === '/login') {
      return NextResponse.rewrite(new URL('/rider/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
