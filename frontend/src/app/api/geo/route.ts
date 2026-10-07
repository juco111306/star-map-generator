import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Read Vercel IP Country header (or cloudflare/standard fallback)
  const country = (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    ''
  ).toUpperCase();

  const isUS = country === 'US';
  const isUK = country === 'GB';

  const unit: 'in' | 'cm' = isUS ? 'in' : 'cm';
  const currency: 'USD' | 'GBP' | 'EUR' = isUS ? 'USD' : isUK ? 'GBP' : 'EUR';
  const suggestedLocale =
    country === 'DE' || country === 'AT' || country === 'CH' || country === 'LI'
      ? 'de'
      : country === 'NL' || country === 'BE' || country === 'SR'
      ? 'nl'
      : 'en';

  const allowedDeliveryCountries = new Set([
    'NL', 'BE', 'DE', 'AT', 'CH', 'GB', 'FR', 'IE', 'ES', 'IT', 'PT', 'DK', 'SE', 'NO', 'FI', 'LU', 'US'
  ]);
  const isDeliverable = allowedDeliveryCountries.has(country);

  return NextResponse.json(
    {
      country,
      unit,
      isUK,
      currency,
      suggestedLocale,
      isDeliverable,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
