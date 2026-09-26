import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    '';

  const acceptLang = request.headers.get('accept-language')?.toLowerCase() || '';

  let suggestedLocale: 'nl' | 'de' | 'en' = 'en';

  const c = country.toUpperCase();
  if (['DE', 'AT', 'CH'].includes(c) || acceptLang.startsWith('de')) {
    suggestedLocale = 'de';
  } else if (['NL', 'BE'].includes(c) || acceptLang.startsWith('nl')) {
    suggestedLocale = 'nl';
  } else {
    suggestedLocale = 'en';
  }

  return NextResponse.json({
    country: country || 'Unknown',
    suggestedLocale,
    acceptLanguage: acceptLang,
  });
}
