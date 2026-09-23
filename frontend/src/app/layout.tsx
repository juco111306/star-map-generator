import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stellaire Atelier — Thoughtful Personalized Keepsakes & Artisan Gifts',
  description: 'Handcrafted personalized keepsakes celebrating life’s defining moments. Custom star maps, carved wooden heirlooms, embroidered textiles, and bespoke art.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#FAF8F5] text-[#1C1917] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
