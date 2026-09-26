'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, Translations, CardinalPoints, getDictionary, SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale } from '../locales';

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  changeLocale: (newLocale: Locale) => void;
  formatDate: (dateStr: string) => string;
  monthNames: string[];
  cardinalPoints: CardinalPoints;
  paymentBadges: string[];
  shippingPartnerText: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const COOKIE_NAME = 'stellaire_locale';

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLocale?: Locale;
}> = ({ children, initialLocale }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine initial state
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (initialLocale && isValidLocale(initialLocale)) {
      return initialLocale;
    }
    // Check path for /nl, /de, /en
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^\/(nl|de|en)(\/|$)/);
      if (match && isValidLocale(match[1])) {
        return match[1] as Locale;
      }
      const saved = localStorage.getItem(COOKIE_NAME);
      if (saved && isValidLocale(saved)) {
        return saved as Locale;
      }
    }
    return DEFAULT_LOCALE;
  });

  // Sync state if initialLocale changes
  useEffect(() => {
    if (initialLocale && isValidLocale(initialLocale) && initialLocale !== locale) {
      setLocaleState(initialLocale);
    }
  }, [initialLocale, locale]);

  // Read URL on client-side navigation
  useEffect(() => {
    if (pathname) {
      const match = pathname.match(/^\/(nl|de|en)(\/|$)/);
      if (match && isValidLocale(match[1]) && match[1] !== locale) {
        setLocaleState(match[1] as Locale);
      }
    }
  }, [pathname, locale]);

  const changeLocale = useCallback((newLocale: Locale) => {
    if (!isValidLocale(newLocale)) return;

    // 1. Update local state
    setLocaleState(newLocale);

    // 2. Persist in cookie (1 year expiry) and localStorage so user preference is NEVER overridden
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      try {
        localStorage.setItem(COOKIE_NAME, newLocale);
      } catch (err) {}
    }

    // 3. Navigate to updated path
    if (pathname) {
      let targetPath = pathname;
      const match = pathname.match(/^\/(nl|de|en)(\/|$)/);
      if (match) {
        targetPath = pathname.replace(/^\/(nl|de|en)/, `/${newLocale}`);
      } else {
        targetPath = `/${newLocale}${pathname === '/' ? '' : pathname}`;
      }
      router.push(targetPath);
    } else {
      router.push(`/${newLocale}`);
    }
  }, [pathname, router]);

  const t = useMemo(() => getDictionary(locale), [locale]);

  const formatDate = useCallback((dateStr: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const day = d.getUTCDate();
    const month = t.studio.monthNames[d.getUTCMonth()] || '';
    const year = d.getUTCFullYear();

    if (locale === 'de') {
      return `${day}. ${month} ${year}`;
    }
    if (locale === 'en') {
      return `${month} ${day}, ${year}`;
    }
    return `${day} ${month} ${year}`;
  }, [locale, t]);

  const value = useMemo<LanguageContextType>(() => ({
    locale,
    t,
    changeLocale,
    formatDate,
    monthNames: t.studio.monthNames,
    cardinalPoints: t.studio.cardinalPoints,
    paymentBadges: t.footer.paymentBadges,
    shippingPartnerText: t.footer.shippingPartnerText,
  }), [locale, t, changeLocale, formatDate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components outside of provider
    const fallbackT = getDictionary(DEFAULT_LOCALE);
    return {
      locale: DEFAULT_LOCALE,
      t: fallbackT,
      changeLocale: () => {},
      formatDate: (d) => d,
      monthNames: fallbackT.studio.monthNames,
      cardinalPoints: fallbackT.studio.cardinalPoints,
      paymentBadges: fallbackT.footer.paymentBadges,
      shippingPartnerText: fallbackT.footer.shippingPartnerText,
    };
  }
  return context;
};
