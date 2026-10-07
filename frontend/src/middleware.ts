import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['nl', 'de', 'en'];
const DEFAULT_LOCALE = 'en';
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

  // 1. Explicit user choice stored in cookie has highest priority (never overridden)
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) {
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname === '/' ? '' : pathname}${search}`, request.url));
  }

  // 2. Geo-IP detection: ONLY German-speaking or Dutch-speaking places auto-open in their native language
  const countryHeader =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code');

  if (countryHeader) {
    const c = countryHeader.toUpperCase();
    // German-speaking: Germany, Austria, Switzerland, Liechtenstein
    if (['DE', 'AT', 'CH', 'LI'].includes(c)) {
      return NextResponse.redirect(new URL(`/de${pathname === '/' ? '' : pathname}${search}`, request.url));
    }
    // Dutch-speaking: Netherlands, Belgium, Suriname
    if (['NL', 'BE', 'SR'].includes(c)) {
      return NextResponse.redirect(new URL(`/nl${pathname === '/' ? '' : pathname}${search}`, request.url));
    }
  }

  // 3. Default for all other locations worldwide (including Nairobi/Kenya, US, UK, international): English
  return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}${search}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
