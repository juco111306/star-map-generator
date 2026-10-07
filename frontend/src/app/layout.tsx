import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Stellaire Atelier — Custom Personalized Star Map Posters & 300 DPI Vector PDF',
  description:
    'Design an authentic personalized star map poster based on exact astronomical calculations from NASA JPL. Order museum-quality cotton prints framed in wood (Europe, UK, US) or download an instant 300 DPI vector PDF available worldwide.',
  keywords: [
    'personalized star map',
    'custom star map poster',
    'sterrenkaart poster',
    'sternenkarte personalisiert',
    'night sky map gift',
    'constellation map by date',
    'custom star map digital download',
    'anniversary star map',
    'wedding celestial gift',
    '300 dpi star map vector pdf',
  ],
  metadataBase: new URL('https://stellaire-atelier.nl'),
  alternates: {
    canonical: 'https://stellaire-atelier.nl',
    languages: {
      'nl-NL': 'https://stellaire-atelier.nl?lang=nl',
      'en-US': 'https://stellaire-atelier.nl?lang=en',
      'de-DE': 'https://stellaire-atelier.nl?lang=de',
    },
  },
  openGraph: {
    title: 'Stellaire Atelier — Custom Personalized Star Map Posters',
    description:
      'Commemorate life’s most precious moments under the stars. Free insured shipping in Europe, the UK & the US • Instant 300 DPI vector PDF delivery worldwide.',
    url: 'https://stellaire-atelier.nl',
    siteName: 'Stellaire Atelier',
    images: [
      {
        url: '/textures/star_map_sample.png',
        width: 1200,
        height: 630,
        alt: 'Stellaire Atelier Custom Personalized Star Map Keepsake',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stellaire Atelier — Custom Personalized Star Map Posters',
    description:
      'Authentic celestial coordinates printed on 285 gsm cotton paper or delivered worldwide as 300 DPI vector PDF.',
    images: ['/textures/star_map_sample.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://stellaire-atelier.nl/#website',
      url: 'https://stellaire-atelier.nl',
      name: 'Stellaire Atelier',
      description: 'Artisan personalized star map generator and bespoke cosmic keepsakes.',
      inLanguage: ['nl', 'en', 'de'],
    },
    {
      '@type': 'Organization',
      '@id': 'https://stellaire-atelier.nl/#organization',
      name: 'Stellaire Atelier',
      url: 'https://stellaire-atelier.nl',
      logo: 'https://stellaire-atelier.nl/icon-512.png',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@stellaireshop.com',
        contactType: 'Customer Support',
        availableLanguage: ['Dutch', 'English', 'German'],
      },
    },
    {
      '@type': 'Product',
      '@id': 'https://stellaire-atelier.nl/#product',
      name: 'Personalized Star Map Poster & 300 DPI Vector PDF',
      image: 'https://stellaire-atelier.nl/textures/star_map_sample.png',
      description:
        'Individually calculated celestial constellation map from exact time and location data using NASA JPL ephemerides. Available as a museum-grade framed print (Europe, UK, US) or worldwide instant 300 DPI vector PDF.',
      brand: {
        '@type': 'Brand',
        name: 'Stellaire Atelier',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: '19.00',
        highPrice: '99.00',
        offerCount: '8',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Stellaire Atelier',
        },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden max-w-full w-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="bg-[#FAF8F5] text-[#1C1917] antialiased min-h-screen overflow-x-hidden max-w-full w-full">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
