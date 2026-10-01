import { Locale } from '../locales/types';

export interface LocaleDefaults {
  title: string;
  names: string;
  locationName: string;
  lat: number;
  lng: number;
  dateStr: string;
  coords: string;
}

export const LOCALE_DEFAULTS: Record<Locale, LocaleDefaults> = {
  nl: {
    title: 'DE NACHT WAARIN WE ELKAAR VONDEN',
    names: 'Sophie & Daan',
    locationName: 'Amsterdam, Nederland',
    lat: 52.3676,
    lng: 4.9041,
    dateStr: '22 SEPTEMBER 2026',
    coords: '52.3676° N • 4.9041° E',
  },
  de: {
    title: 'DIE NACHT, IN DER WIR UNS TRAFEN',
    names: 'Hannah & Maximilian',
    locationName: 'Berlin, Deutschland',
    lat: 52.5200,
    lng: 13.4050,
    dateStr: '22. SEPTEMBER 2026',
    coords: '52.5200° N • 13.4050° O',
  },
  en: {
    title: 'THE NIGHT WE MET',
    names: 'Olivia & James',
    locationName: 'London, United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    dateStr: 'SEPTEMBER 22, 2026',
    coords: '51.5074° N • 0.1278° W',
  },
};
