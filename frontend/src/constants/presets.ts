import { MapConfig, TextBlockConfig } from '../types';

export interface TypographyPreset {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  title: Partial<TextBlockConfig>;
  names: Partial<TextBlockConfig>;
  tagline: Partial<TextBlockConfig>;
  date: Partial<TextBlockConfig>;
  location: Partial<TextBlockConfig>;
  coords: Partial<TextBlockConfig>;
  divider: MapConfig['dividerStyle'];
}

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: 'anniversary_classic',
    name: 'Atelier Signature',
    subtitle: 'Cinzel Capitals + Great Vibes Calligraphy',
    badge: 'Top Seller',
    title: {
      font: 'Cinzel',
      size: 38,
      tracking: 3,
      uppercase: true,
      italic: false,
    },
    names: {
      font: 'Great Vibes',
      size: 51,
      tracking: 1,
      uppercase: false,
      italic: false,
    },
    tagline: {
      font: 'Playfair Display',
      size: 13,
      tracking: 1,
      uppercase: false,
      italic: true,
      enabled: false,
    },
    date: {
      font: 'Montserrat',
      size: 27,
      tracking: 2.5,
      uppercase: true,
      italic: false,
    },
    location: {
      font: 'Montserrat',
      size: 21,
      tracking: 2,
      uppercase: true,
      italic: false,
    },
    coords: {
      font: 'Montserrat',
      size: 21,
      tracking: 1.8,
      uppercase: true,
      italic: false,
    },
    divider: 'diamond',
  },
  {
    id: 'modern_minimalist',
    name: 'Modern Minimalist',
    subtitle: 'Montserrat Spaced Sans + Clean Coordinates',
    badge: 'Contemporary',
    title: {
      font: 'Montserrat',
      size: 36,
      tracking: 5,
      uppercase: true,
      italic: false,
    },
    names: {
      font: 'Lato',
      size: 42,
      tracking: 2,
      uppercase: false,
      italic: false,
    },
    tagline: {
      font: 'Lato',
      size: 13,
      tracking: 1,
      uppercase: false,
      italic: false,
      enabled: false,
    },
    date: {
      font: 'Montserrat',
      size: 27,
      tracking: 3,
      uppercase: true,
      italic: false,
    },
    location: {
      font: 'Montserrat',
      size: 21,
      tracking: 2,
      uppercase: true,
      italic: false,
    },
    coords: {
      font: 'Lato',
      size: 21,
      tracking: 1.8,
      uppercase: true,
      italic: false,
    },
    divider: 'line',
  },
  {
    id: 'romantic_script',
    name: 'Romantic Script Romance',
    subtitle: 'Great Vibes Title + Playfair Names + Heart Divider',
    badge: 'Romantic',
    title: {
      font: 'Great Vibes',
      size: 52,
      tracking: 1,
      uppercase: false,
      italic: false,
    },
    names: {
      font: 'Playfair Display',
      size: 38,
      tracking: 2,
      uppercase: false,
      italic: true,
    },
    tagline: {
      font: 'Playfair Display',
      size: 13,
      tracking: 1,
      uppercase: false,
      italic: true,
      enabled: true,
    },
    date: {
      font: 'Playfair Display',
      size: 27,
      tracking: 1.5,
      uppercase: false,
      italic: false,
    },
    location: {
      font: 'Montserrat',
      size: 21,
      tracking: 2,
      uppercase: true,
      italic: false,
    },
    coords: {
      font: 'Montserrat',
      size: 21,
      tracking: 1.8,
      uppercase: true,
      italic: false,
    },
    divider: 'heart',
  },
  {
    id: 'celestial_roman',
    name: 'Celestial Roman Monumental',
    subtitle: 'Pure Cinzel Roman Capitals + Star Divider',
    badge: 'Luxury Roman',
    title: {
      font: 'Cinzel',
      size: 38,
      tracking: 4,
      uppercase: true,
      italic: false,
    },
    names: {
      font: 'Cinzel',
      size: 36,
      tracking: 3,
      uppercase: true,
      italic: false,
    },
    tagline: {
      font: 'Playfair Display',
      size: 13,
      tracking: 1,
      uppercase: false,
      italic: true,
      enabled: false,
    },
    date: {
      font: 'Cinzel',
      size: 27,
      tracking: 2.5,
      uppercase: true,
      italic: false,
    },
    location: {
      font: 'Montserrat',
      size: 21,
      tracking: 3,
      uppercase: true,
      italic: false,
    },
    coords: {
      font: 'Montserrat',
      size: 21,
      tracking: 1.8,
      uppercase: true,
      italic: false,
    },
    divider: 'star',
  },
  {
    id: 'editorial_serif',
    name: 'Editorial Vogue Serif',
    subtitle: 'Playfair Display Italic + Clean Sans Dot',
    badge: 'Vogue Editorial',
    title: {
      font: 'Playfair Display',
      size: 42,
      tracking: 2,
      uppercase: false,
      italic: true,
    },
    names: {
      font: 'Montserrat',
      size: 34,
      tracking: 3,
      uppercase: true,
      italic: false,
    },
    tagline: {
      font: 'Playfair Display',
      size: 13,
      tracking: 1,
      uppercase: false,
      italic: true,
      enabled: false,
    },
    date: {
      font: 'Playfair Display',
      size: 27,
      tracking: 1,
      uppercase: false,
      italic: false,
    },
    location: {
      font: 'Lato',
      size: 21,
      tracking: 2,
      uppercase: true,
      italic: false,
    },
    coords: {
      font: 'Lato',
      size: 21,
      tracking: 1.8,
      uppercase: true,
      italic: false,
    },
    divider: 'dot',
  },
];
