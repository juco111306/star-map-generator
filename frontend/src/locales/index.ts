import { Locale, Translations } from './types';
import { nl } from './nl';
import { de } from './de';
import { en } from './en';

export * from './types';

export const SUPPORTED_LOCALES: Locale[] = ['nl', 'de', 'en'];
export const DEFAULT_LOCALE: Locale = 'nl';

export const DICTIONARIES: Record<Locale, Translations> = {
  nl,
  de,
  en,
};

export function getDictionary(locale?: string | null): Translations {
  if (locale && (locale === 'nl' || locale === 'de' || locale === 'en')) {
    return DICTIONARIES[locale];
  }
  return DICTIONARIES[DEFAULT_LOCALE];
}

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}
