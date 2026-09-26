import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['nl', 'de', 'en'];
const DEFAULT_LOCALE = 'nl';
const COOKIE_NAME = 'stellaire_locale';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip internal Next.js paths, API endpoints, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|css|js|map|json|ttf|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a supported locale
  const pathnameHasLocale = LOCALES.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 1. Check if user already made a manual choice stored in cookie
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) {
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname === '/' ? '' : pathname}${search}`, request.url));
  }

  // 2. Geo-IP detection (Vercel, Cloudflare, or custom reverse-proxy headers)
  const countryHeader =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code');

  if (countryHeader) {
    const c = countryHeader.toUpperCase();
    if (['DE', 'AT', 'CH'].includes(c)) {
      return NextResponse.redirect(new URL(`/de${pathname === '/' ? '' : pathname}${search}`, request.url));
    }
    if (['NL', 'BE'].includes(c)) {
      return NextResponse.redirect(new URL(`/nl${pathname === '/' ? '' : pathname}${search}`, request.url));
    }
    if (['GB', 'US', 'IE', 'CA', 'AU', 'NZ', 'FR', 'ES', 'IT', 'DK', 'SE', 'NO', 'FI'].includes(c)) {
      return NextResponse.redirect(new URL(`/en${pathname === '/' ? '' : pathname}${search}`, request.url));
    }
  }

  // 3. Browser Accept-Language header detection
  const acceptLang = request.headers.get('accept-language')?.toLowerCase() || '';
  if (acceptLang.startsWith('de') || acceptLang.includes(',de')) {
    return NextResponse.redirect(new URL(`/de${pathname === '/' ? '' : pathname}${search}`, request.url));
  }
  if (acceptLang.startsWith('nl') || acceptLang.includes(',nl')) {
    return NextResponse.redirect(new URL(`/nl${pathname === '/' ? '' : pathname}${search}`, request.url));
  }
  if (acceptLang.startsWith('en') || acceptLang.includes(',en')) {
    return NextResponse.redirect(new URL(`/en${pathname === '/' ? '' : pathname}${search}`, request.url));
  }

  // 4. Default fallback: redirect to /nl
  return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}${search}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
