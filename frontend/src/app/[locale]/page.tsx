import React from 'react';
import Home from '../page';
import { Locale, isValidLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/locales';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface LocalePageProps {
  params: {
    locale: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function LocalePage({ params, searchParams }: LocalePageProps) {
  const activeLocale: Locale = isValidLocale(params.locale)
    ? (params.locale as Locale)
    : DEFAULT_LOCALE;

  const isAdmin =
    searchParams?.admin === '1' ||
    searchParams?.admin === 'true' ||
    searchParams?.view === 'producer';

  return (
    <Home
      initialLocale={activeLocale}
      initialView={isAdmin ? 'producer' : undefined}
      initialSearchParams={searchParams}
    />
  );
}
