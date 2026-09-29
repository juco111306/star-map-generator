import { PosterSize, FrameStyle, UnitSystem } from '../types';

export interface PriceDetails {
  price: number;
  originalPrice: number;
  formattedPrice: string;
  formattedOriginalPrice: string;
  savings: number;
  isDigital: boolean;
  hasFrame: boolean;
  typeLabel: string;
  frameLabel: string;
  sizeLabel: string;
  shippingText: string;
}

export interface PosterSizeOption {
  id: PosterSize;
  label: string;
  sub: string;
  aspect: string;
  popular?: boolean;
  unit: 'cm' | 'in';
}

/**
 * Standard European Metric Trio (30x40, 40x50, 50x70 cm).
 * If isUK is true, labels include the dual inch equivalent in brackets.
 */
export const getLocalizedMetricSizes = (locale: string = 'nl', isUK: boolean = false): PosterSizeOption[] => [
  {
    id: '30x40' as PosterSize,
    label: isUK ? '30 × 40 cm (12 × 16″)' : '30 × 40 cm',
    sub:
      locale === 'de'
        ? 'Klassische Galerie (3:4)'
        : locale === 'en'
        ? 'Compact Gallery (3:4)'
        : 'Klassieke Galerij (3:4)',
    aspect: '3:4',
    unit: 'cm',
  },
  {
    id: '40x50' as PosterSize,
    label: isUK ? '40 × 50 cm (16 × 20″)' : '40 × 50 cm',
    sub:
      locale === 'de'
        ? 'Medium Statement (4:5)'
        : locale === 'en'
        ? 'Medium Statement (4:5)'
        : 'Medium Statement (4:5)',
    aspect: '4:5',
    unit: 'cm',
  },
  {
    id: '50x70' as PosterSize,
    label: isUK ? '50 × 70 cm (20 × 28″)' : '50 × 70 cm',
    sub:
      locale === 'de'
        ? 'Großes Format (5:7) • Bestseller'
        : locale === 'en'
        ? 'Grand Classic (5:7) • Bestseller'
        : 'Groot Formaat (5:7) • Bestseller',
    aspect: '5:7',
    popular: true,
    unit: 'cm',
  },
];

/**
 * Standard North American Imperial Trio (12x18", 18x24", 24x36").
 * Produced in US Gelato facilities with standard local US frame sizing.
 */
export const getLocalizedImperialSizes = (locale: string = 'en'): PosterSizeOption[] => [
  {
    id: '12x18' as PosterSize,
    label: '12 × 18″ (30 × 45 cm)',
    sub:
      locale === 'de'
        ? 'Kompaktes Format (2:3)'
        : locale === 'nl'
        ? 'Compact Formaat (2:3)'
        : 'Compact Gallery (2:3)',
    aspect: '2:3',
    unit: 'in',
  },
  {
    id: '18x24' as PosterSize,
    label: '18 × 24″ (45 × 60 cm)',
    sub:
      locale === 'de'
        ? 'Galerie-Klassiker (3:4) • Bestseller'
        : locale === 'nl'
        ? 'Galerij Klassieker (3:4) • Bestseller'
        : 'Classic Gallery (3:4) • Bestseller',
    aspect: '3:4',
    popular: true,
    unit: 'in',
  },
  {
    id: '24x36' as PosterSize,
    label: '24 × 36″ (60 × 90 cm)',
    sub:
      locale === 'de'
        ? 'Großes Statement (2:3)'
        : locale === 'nl'
        ? 'Groot Statement (2:3)'
        : 'Grand Statement (2:3)',
    aspect: '2:3',
    unit: 'in',
  },
];

export const getLocalizedFrameOptions = (locale: string = 'nl') => [
  {
    id: 'digital' as FrameStyle,
    label: locale === 'de' ? 'Digitale Datei' : locale === 'en' ? 'Digital File' : 'Digitaal Bestand',
    category: 'digital' as const,
    sub: locale === 'de' ? '300 DPI Vektor-PDF' : locale === 'en' ? '300 DPI Vector PDF' : '300 DPI Vector PDF',
    desc:
      locale === 'de'
        ? 'Sofort per E-Mail in Ultra-High-Definition zum Selbstdrucken oder für lokale Druckereien.'
        : locale === 'en'
        ? 'Instant email delivery in ultra-high resolution to print yourself or at a local print shop.'
        : 'Direct per e-mail ontvangen in ultrahoge resolutie om zelf te printen of lokaal te laten drukken.',
    badge: locale === 'de' ? 'Bester Preis • Sofort' : locale === 'en' ? 'Best Value • Instant' : 'Laagste Prijs • Direct',
    borderStyle: 'border-dashed border-sky-400',
    bgStyle: 'bg-sky-50',
    innerBg: 'bg-[#0E1526]',
    previewBorderColor: '#38bdf8',
  },
  {
    id: 'none' as FrameStyle,
    label: locale === 'de' ? 'Klassischer Kunstdruck' : locale === 'en' ? 'Classic Matte Print' : 'Classic Matte Poster',
    category: 'print' as const,
    sub: locale === 'de' ? '200 g/m² Archiv-Kunstdruck' : locale === 'en' ? '200 gsm Archival Print' : '200 gsm Archiefprint',
    desc:
      locale === 'de'
        ? 'Ohne Rahmen. Gedruckt auf FSC®-zertifiziertem Archivpapier, geliefert in stabiler Schutzrolle.'
        : locale === 'en'
        ? 'Unframed print. Crafted on FSC® archival cotton paper, delivered in a reinforced poster tube.'
        : 'Zonder lijst. Gedrukt door onze ervaren drukpartner op FSC® archiefpapier, geleverd in stevige koker.',
    badge: locale === 'de' ? 'Beliebt' : locale === 'en' ? 'Popular' : 'Populair',
    borderStyle: 'border-dashed border-[#C5BFB5]',
    bgStyle: 'bg-white',
    innerBg: 'bg-[#2E3440]',
    previewBorderColor: '#E7E2D9',
  },
  {
    id: 'black' as FrameStyle,
    label: locale === 'de' ? 'Mattschwarzes Holz' : locale === 'en' ? 'Matte Black Wood' : 'Mat Zwart Hout',
    category: 'frame' as const,
    sub: locale === 'de' ? 'Klassisch Schwarz Gerahmt' : locale === 'en' ? 'Classic Black Framed' : 'Klassiek Zwart Ingelijst',
    desc:
      locale === 'de'
        ? 'Massives FSC®-Holz, reflexionsarmes Museums-Acrylglas und montagefertig aufgehängt.'
        : locale === 'en'
        ? 'Solid FSC® hardwood frame, gallery anti-reflective acrylic glass, pre-strung and ready to hang.'
        : 'FSC® massief hout van onze ervaren inlijstpartner, ontspiegeld kristalhelder acrylglas en ophangklaar.',
    badge: locale === 'de' ? 'Galerie-Klassiker' : locale === 'en' ? 'Gallery Classic' : 'Klassiek Galerij',
    borderStyle: 'border-[3px] border-[#181716]',
    bgStyle: 'bg-[#181716]',
    innerBg: 'bg-[#0E1526]',
    previewBorderColor: '#18181B',
  },
  {
    id: 'oak' as FrameStyle,
    label: locale === 'de' ? 'Natürliche Eiche (Helles Holz)' : locale === 'en' ? 'Natural Wood (Light Wood)' : 'Natuurlijk Hout (Licht Hout)',
    category: 'frame' as const,
    sub: locale === 'de' ? 'Heller Naturholzrahmen' : locale === 'en' ? 'Natural Timber Framed' : 'Licht Houten Lijst',
    desc:
      locale === 'de'
        ? 'Massives skandinavisches Naturholz mit feiner Maserung, reflexionsarmem Acrylglas und Aufhängeset.'
        : locale === 'en'
        ? 'Solid Scandinavian light pine with clean profile, gallery acrylic glass, and mounting hardware.'
        : 'Massief natuurlijk licht hout (Scandinavisch grenen) met strakke scherpe randen van onze ervaren inlijstpartner, acrylglas en ophangkit.',
    badge: locale === 'de' ? 'Warm & Zeitlos' : locale === 'en' ? 'Warm & Timeless' : 'Warm & Tijdloos',
    borderStyle: 'border-[3px] border-[#DFC9A6]',
    bgStyle: 'bg-gradient-to-br from-[#E8DAC3] via-[#DFCCA9] to-[#D4BE9B]',
    innerBg: 'bg-[#0E1526]',
    previewBorderColor: '#C8A882',
  },
  {
    id: 'white' as FrameStyle,
    label: locale === 'de' ? 'Reinweißes Holz' : locale === 'en' ? 'Pure White Wood' : 'Zuiver Wit Hout',
    category: 'frame' as const,
    sub: locale === 'de' ? 'Weißer Qualitätsrahmen' : locale === 'en' ? 'White Timber Framed' : 'Witte Kwaliteitslijst',
    desc:
      locale === 'de'
        ? 'Seidenmattes massives Weißholz, bruchsicheres Acrylglas und Aufhängeset, ideal für helle Räume.'
        : locale === 'en'
        ? 'Satin-white solid timber frame, shatterproof acrylic glass, and hanging kit for bright interiors.'
        : 'Zacht satijnwit massief hout van onze ervaren inlijstpartner, acrylglas en ophangkit, perfect voor lichte interieurs.',
    badge: locale === 'de' ? 'Hell & Modern' : locale === 'en' ? 'Clean & Modern' : 'Licht & Modern',
    borderStyle: 'border-[3px] border-[#E8E4DC] ring-1 ring-[#D0CAC0]',
    bgStyle: 'bg-white',
    innerBg: 'bg-[#0E1526]',
    previewBorderColor: '#FFFFFF',
  },
];

export const METRIC_SIZES = getLocalizedMetricSizes('nl', false);
export const FRAME_OPTIONS = getLocalizedFrameOptions('nl');

// Base pricing matrix taking into account Gelato production costs, EU/US shipping, and healthy webshop margins
const PRICING_TABLE: Record<FrameStyle, Record<string, { price: number; originalPrice: number }>> = {
  digital: {
    '30x40': { price: 19, originalPrice: 29 },
    '40x50': { price: 19, originalPrice: 29 },
    '50x70': { price: 19, originalPrice: 29 },
    '12x18': { price: 19, originalPrice: 29 },
    '18x24': { price: 19, originalPrice: 29 },
    '24x36': { price: 19, originalPrice: 29 },
  },
  none: {
    '30x40': { price: 39, originalPrice: 49 },
    '40x50': { price: 49, originalPrice: 59 },
    '50x70': { price: 59, originalPrice: 74 },
    '12x18': { price: 39, originalPrice: 49 },
    '18x24': { price: 49, originalPrice: 59 },
    '24x36': { price: 69, originalPrice: 89 },
  },
  black: {
    '30x40': { price: 74, originalPrice: 95 },
    '40x50': { price: 89, originalPrice: 115 },
    '50x70': { price: 119, originalPrice: 149 },
    '12x18': { price: 69, originalPrice: 89 },
    '18x24': { price: 89, originalPrice: 115 },
    '24x36': { price: 139, originalPrice: 179 },
  },
  oak: {
    '30x40': { price: 74, originalPrice: 95 },
    '40x50': { price: 89, originalPrice: 115 },
    '50x70': { price: 119, originalPrice: 149 },
    '12x18': { price: 69, originalPrice: 89 },
    '18x24': { price: 89, originalPrice: 115 },
    '24x36': { price: 139, originalPrice: 179 },
  },
  white: {
    '30x40': { price: 74, originalPrice: 95 },
    '40x50': { price: 89, originalPrice: 115 },
    '50x70': { price: 119, originalPrice: 149 },
    '12x18': { price: 69, originalPrice: 89 },
    '18x24': { price: 89, originalPrice: 115 },
    '24x36': { price: 139, originalPrice: 179 },
  },
};

const SIZE_LABELS_MAP: Record<string, string> = {
  '30x40': '30 × 40 cm',
  '40x50': '40 × 50 cm',
  '50x70': '50 × 70 cm',
  '12x18': '12 × 18″ (30 × 45 cm)',
  '18x24': '18 × 24″ (45 × 60 cm)',
  '24x36': '24 × 36″ (60 × 90 cm)',
};

export function calculatePrice(
  size: PosterSize | string,
  frameStyle: FrameStyle | string,
  locale: string = 'nl',
  isUK: boolean = false
): PriceDetails {
  const safeSize = (size in PRICING_TABLE.digital ? size : '50x70') as PosterSize;
  const safeFrame = (frameStyle in PRICING_TABLE ? frameStyle : 'none') as FrameStyle;

  const entry = PRICING_TABLE[safeFrame][safeSize] || { price: 19, originalPrice: 29 };
  const price = entry.price;
  const originalPrice = entry.originalPrice;
  const isDigital = safeFrame === 'digital';
  const hasFrame = ['black', 'oak', 'white'].includes(safeFrame);

  const frameOptions = getLocalizedFrameOptions(locale);
  const frameOption = frameOptions.find((f) => f.id === safeFrame) || frameOptions[1];

  let sizeLabel = SIZE_LABELS_MAP[safeSize] || `${safeSize.replace('x', ' × ')} cm`;
  if (isUK) {
    if (safeSize === '30x40') sizeLabel = '30 × 40 cm (12 × 16″)';
    if (safeSize === '40x50') sizeLabel = '40 × 50 cm (16 × 20″)';
    if (safeSize === '50x70') sizeLabel = '50 × 70 cm (20 × 28″)';
  }

  const typeLabel = isDigital
    ? locale === 'de'
      ? 'Digitale Vektor-PDF (300 DPI)'
      : locale === 'en'
      ? 'Digital Vector PDF (300 DPI)'
      : 'Digitaal Bestand (300 DPI)'
    : hasFrame
    ? locale === 'de'
      ? 'Massiver Holzrahmen'
      : locale === 'en'
      ? 'Solid Wood Frame'
      : 'Houten Kwaliteitslijst'
    : locale === 'de'
    ? 'Classic Matte Kunstdruck'
    : locale === 'en'
    ? 'Classic Matte Poster'
    : 'Classic Matte Poster';

  const shippingText = isDigital
    ? locale === 'de'
      ? 'Sofort per E-Mail (Kostenlos)'
      : locale === 'en'
      ? 'Instant email delivery (Free)'
      : 'Direct per e-mail (Gratis)'
    : locale === 'de'
    ? 'Kostenlose & versicherte Lieferung via DHL / DPD'
    : locale === 'en'
    ? 'Free & insured tracked delivery via trusted partners'
    : 'Gratis en verzekerd in NL & BE via vertrouwde partners (zoals PostNL, Bpost)';

  return {
    price,
    originalPrice,
    formattedPrice: `€${price},00`,
    formattedOriginalPrice: `€${originalPrice},00`,
    savings: originalPrice - price,
    isDigital,
    hasFrame,
    typeLabel,
    frameLabel: frameOption.label,
    sizeLabel,
    shippingText,
  };
}

export const BASE_STARTING_PRICE = 'vanaf €19,00';
export const BASE_STARTING_ORIGINAL_PRICE = '€29,00';
