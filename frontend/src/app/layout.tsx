import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata: Metadata = {
  title: 'Stellaire Atelier — Thoughtful Personalized Keepsakes & Artisan Gifts',
  description: 'Handcrafted personalized keepsakes celebrating life’s defining moments. Custom star maps, carved wooden heirlooms, embroidered textiles, and bespoke art.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className="overflow-x-hidden max-w-full w-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#FAF8F5] text-[#1C1917] antialiased min-h-screen overflow-x-hidden max-w-full w-full">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
