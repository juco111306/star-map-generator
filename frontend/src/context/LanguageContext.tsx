'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, Translations, CardinalPoints, getDictionary, SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale } from '../locales';
import { Currency, CURRENCY_SYMBOLS, formatPrice as formatPriceUtil } from '../utils/pricing';

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  changeLocale: (newLocale: Locale) => void;
  formatDate: (dateStr: string) => string;
  monthNames: string[];
  cardinalPoints: CardinalPoints;
  paymentBadges: string[];
  shippingPartnerText: string;
  currency: Currency;
  currencySymbol: string;
  setCurrency: (newCurrency: Currency) => void;
  formatPrice: (amount: number) => string;
  isUK: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const COOKIE_NAME = 'stellaire_locale';
export const CURRENCY_COOKIE_NAME = 'stellaire_currency';

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
    if (pathname) {
      const match = pathname.match(/^\/(nl|de|en)(\/|$)/);
      if (match && isValidLocale(match[1])) {
        return match[1] as Locale;
      }
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

  const [isUK, setIsUK] = useState(false);

  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CURRENCY_COOKIE_NAME);
      if (saved && ['EUR', 'USD', 'GBP'].includes(saved)) {
        return saved as Currency;
      }
    }
    // Initial guess based on locale
    if (initialLocale === 'de' || initialLocale === 'nl') return 'EUR';
    if (initialLocale === 'en') {
      if (typeof Intl !== 'undefined') {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (tz.includes('London') || tz.includes('Europe/Belfast')) return 'GBP';
      }
      return 'USD';
    }
    return 'EUR';
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

  // Geo IP detection on initial mount
  useEffect(() => {
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        if (data.isUK) {
          setIsUK(true);
        }
        const hasSavedCurrency =
          typeof window !== 'undefined' && localStorage.getItem(CURRENCY_COOKIE_NAME);
        if (!hasSavedCurrency && data.currency && ['EUR', 'USD', 'GBP'].includes(data.currency)) {
          setCurrencyState(data.currency as Currency);
        }
      })
      .catch(() => {
        if (typeof Intl !== 'undefined') {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          if (tz.includes('London') || tz.includes('Europe/Belfast')) {
            setIsUK(true);
            if (!localStorage.getItem(CURRENCY_COOKIE_NAME)) {
              setCurrencyState('GBP');
            }
          } else if (tz.includes('America') || tz.includes('US') || tz.includes('Canada')) {
            if (!localStorage.getItem(CURRENCY_COOKIE_NAME)) {
              setCurrencyState('USD');
            }
          }
        }
      });
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    if (!['EUR', 'USD', 'GBP'].includes(newCurrency)) return;
    setCurrencyState(newCurrency);
    if (typeof document !== 'undefined') {
      document.cookie = `${CURRENCY_COOKIE_NAME}=${newCurrency}; path=/; max-age=31536000; SameSite=Lax`;
      try {
        localStorage.setItem(CURRENCY_COOKIE_NAME, newCurrency);
      } catch (err) {}
    }
  }, []);

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

    // Automatically adapt currency if the user hasn't explicitly set one in localStorage
    if (typeof window !== 'undefined' && !localStorage.getItem(CURRENCY_COOKIE_NAME)) {
      if (newLocale === 'de' || newLocale === 'nl') {
        setCurrencyState('EUR');
      } else if (newLocale === 'en') {
        setCurrencyState(isUK ? 'GBP' : 'USD');
      }
    }

    // 3. Immediate and reliable navigation to target locale path
    if (typeof window !== 'undefined') {
      const curPath = window.location.pathname;
      const match = curPath.match(/^\/(nl|de|en)(\/|$)/);
      let targetPath = `/${newLocale}`;
      if (match) {
        targetPath = curPath.replace(/^\/(nl|de|en)/, `/${newLocale}`);
      } else {
        targetPath = `/${newLocale}${curPath === '/' ? '' : curPath}`;
      }
      window.location.href = targetPath;
    }
  }, [isUK]);

  const t = useMemo(() => getDictionary(locale), [locale]);

  const currencySymbol = useMemo(() => CURRENCY_SYMBOLS[currency] || '€', [currency]);

  const formatPrice = useCallback((amount: number): string => {
    return formatPriceUtil(amount, currency);
  }, [currency]);

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
    currency,
    currencySymbol,
    setCurrency,
    formatPrice,
    isUK,
  }), [locale, t, changeLocale, formatDate, currency, currencySymbol, setCurrency, formatPrice, isUK]);

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
      currency: 'EUR',
      currencySymbol: '€',
      setCurrency: () => {},
      formatPrice: (amt) => `€${amt},00`,
      isUK: false,
    };
  }
  return context;
};
