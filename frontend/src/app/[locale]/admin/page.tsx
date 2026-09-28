import React from 'react';
import Home from '../../page';
import { Locale, isValidLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/locales';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface AdminPageProps {
  params: {
    locale: string;
  };
}

export default function AdminPage({ params }: AdminPageProps) {
  const activeLocale: Locale = isValidLocale(params.locale)
    ? (params.locale as Locale)
    : DEFAULT_LOCALE;

  return <Home initialLocale={activeLocale} initialView="producer" />;
}
