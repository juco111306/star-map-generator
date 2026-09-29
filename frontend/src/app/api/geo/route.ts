import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Read Vercel IP Country header (or cloudflare/standard fallback)
  const country = (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    'NL'
  ).toUpperCase();

  const isNorthAmerica = country === 'US' || country === 'CA';
  const isUK = country === 'GB';

  const unit: 'in' | 'cm' = isNorthAmerica ? 'in' : 'cm';
  const currency: 'USD' | 'GBP' | 'EUR' = isNorthAmerica ? 'USD' : isUK ? 'GBP' : 'EUR';
  const suggestedLocale =
    country === 'DE' || country === 'AT' || country === 'CH'
      ? 'de'
      : country === 'NL' || country === 'BE'
      ? 'nl'
      : 'en';

  return NextResponse.json(
    {
      country,
      unit,
      isUK,
      currency,
      suggestedLocale,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
