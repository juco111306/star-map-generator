import { PosterSize, FrameStyle } from '../types';

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

export const getLocalizedMetricSizes = (locale: string = 'nl') => [
  {
    id: '20x30' as PosterSize,
    label: '20 × 30 cm',
    sub: locale === 'de' ? 'Kompakte Erinnerung (2:3)' : locale === 'en' ? 'Compact Keepsake (2:3)' : 'Compact Aandenken (2:3)',
    aspect: '2:3',
  },
  {
    id: '30x40' as PosterSize,
    label: '30 × 40 cm',
    sub: locale === 'de' ? 'Klassische Galeriegröße (3:4)' : locale === 'en' ? 'Classic Gallery Size (3:4)' : 'Klassieke Galerij (3:4)',
    aspect: '3:4',
    popular: true,
  },
  {
    id: '40x50' as PosterSize,
    label: '40 × 50 cm',
    sub: locale === 'de' ? 'Medium Statement (4:5)' : locale === 'en' ? 'Medium Statement (4:5)' : 'Medium Statement (4:5)',
    aspect: '4:5',
  },
  {
    id: '50x70' as PosterSize,
    label: '50 × 70 cm',
    sub: locale === 'de' ? 'Großes Kunstformat (5:7)' : locale === 'en' ? 'Grand Art Statement (5:7)' : 'Groot Kunstformaat (5:7)',
    aspect: '5:7',
    popular: true,
  },
];

export const getLocalizedFrameOptions = (locale: string = 'nl') => [
  {
    id: 'digital' as FrameStyle,
    label: locale === 'de' ? 'Digitale Datei' : locale === 'en' ? 'Digital File' : 'Digitaal Bestand',
    category: 'digital' as const,
    sub: locale === 'de' ? 'Druckfertiges PDF (300 DPI)' : locale === 'en' ? 'Print-Ready PDF (300 DPI)' : 'Print-klaar PDF (300 DPI)',
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
    label: locale === 'de' ? 'Klassischer Kunstdruck' : locale === 'en' ? 'Classic Matte Print' : 'Classic Matte Print',
    category: 'print' as const,
    sub: locale === 'de' ? '200 g/m² Museums-Qualitätspapier' : locale === 'en' ? '200 gsm Museum-Grade Matte Paper' : '200 gsm Museumkwaliteit Mat Papier',
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
    sub: locale === 'de' ? 'Kunstdruck + Schwarzer Qualitätsrahmen' : locale === 'en' ? 'Classic Matte + Black Premium Frame' : 'Classic Matte + Zwarte Kwaliteitslijst',
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
    previewBorderColor: '#1C1A18',
  },
  {
    id: 'oak' as FrameStyle,
    label: locale === 'de' ? 'Natürliche Eiche (Helles Holz)' : locale === 'en' ? 'Natural Wood (Light Wood)' : 'Natuurlijk Hout (Licht Hout)',
    category: 'frame' as const,
    sub: locale === 'de' ? 'Kunstdruck + Heller Naturholzrahmen' : locale === 'en' ? 'Classic Matte + Natural Timber Frame' : 'Classic Matte + Licht Houten Lijst',
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
    previewBorderColor: '#DFC9A6',
  },
  {
    id: 'white' as FrameStyle,
    label: locale === 'de' ? 'Reinweißes Holz' : locale === 'en' ? 'Pure White Wood' : 'Zuiver Wit Hout',
    category: 'frame' as const,
    sub: locale === 'de' ? 'Kunstdruck + Weißer Qualitätsrahmen' : locale === 'en' ? 'Classic Matte + White Premium Frame' : 'Classic Matte + Witte Kwaliteitslijst',
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
    previewBorderColor: '#FAF8F5',
  },
];

export const METRIC_SIZES = getLocalizedMetricSizes('nl');
export const FRAME_OPTIONS = getLocalizedFrameOptions('nl');

// Base pricing matrix taking into account Gelato production costs, EU shipping, and healthy webshop margins
const PRICING_TABLE: Record<FrameStyle, Record<string, { price: number; originalPrice: number }>> = {
  digital: {
    '20x30': { price: 19, originalPrice: 29 },
    '30x40': { price: 19, originalPrice: 29 },
    '40x50': { price: 19, originalPrice: 29 },
    '50x70': { price: 19, originalPrice: 29 },
    '18x24': { price: 19, originalPrice: 29 },
    '24x36': { price: 19, originalPrice: 29 },
  },
  none: {
    '20x30': { price: 29, originalPrice: 39 },
    '30x40': { price: 39, originalPrice: 49 },
    '40x50': { price: 49, originalPrice: 59 },
    '50x70': { price: 59, originalPrice: 74 },
    '18x24': { price: 49, originalPrice: 59 },
    '24x36': { price: 69, originalPrice: 89 },
  },
  black: {
    '20x30': { price: 59, originalPrice: 79 },
    '30x40': { price: 74, originalPrice: 95 },
    '40x50': { price: 89, originalPrice: 115 },
    '50x70': { price: 119, originalPrice: 149 },
    '18x24': { price: 89, originalPrice: 115 },
    '24x36': { price: 139, originalPrice: 179 },
  },
  oak: {
    '20x30': { price: 59, originalPrice: 79 },
    '30x40': { price: 74, originalPrice: 95 },
    '40x50': { price: 89, originalPrice: 115 },
    '50x70': { price: 119, originalPrice: 149 },
    '18x24': { price: 89, originalPrice: 115 },
    '24x36': { price: 139, originalPrice: 179 },
  },
  white: {
    '20x30': { price: 59, originalPrice: 79 },
    '30x40': { price: 74, originalPrice: 95 },
    '40x50': { price: 89, originalPrice: 115 },
    '50x70': { price: 119, originalPrice: 149 },
    '18x24': { price: 89, originalPrice: 115 },
    '24x36': { price: 139, originalPrice: 179 },
  },
};

export function calculatePrice(size: PosterSize | string, frameStyle: FrameStyle | string): PriceDetails {
  const safeSize = (size in PRICING_TABLE.digital ? size : '50x70') as PosterSize;
  const safeFrame = (frameStyle in PRICING_TABLE ? frameStyle : 'none') as FrameStyle;

  const entry = PRICING_TABLE[safeFrame][safeSize] || { price: 19, originalPrice: 29 };
  const price = entry.price;
  const originalPrice = entry.originalPrice;
  const isDigital = safeFrame === 'digital';
  const hasFrame = ['black', 'oak', 'white'].includes(safeFrame);

  const frameOption = FRAME_OPTIONS.find((f) => f.id === safeFrame) || FRAME_OPTIONS[1];
  const sizeOption = METRIC_SIZES.find((s) => s.id === safeSize) || {
    id: safeSize as PosterSize,
    label: `${safeSize.replace('x', ' × ')} cm`,
    sub: 'Metrisch Formaat',
    aspect: '3:4',
  };

  return {
    price,
    originalPrice,
    formattedPrice: `€${price},00`,
    formattedOriginalPrice: `€${originalPrice},00`,
    savings: originalPrice - price,
    isDigital,
    hasFrame,
    typeLabel: isDigital ? 'Digitaal Bestand (300 DPI)' : hasFrame ? 'Houten Kwaliteitslijst' : 'Classic Matte Poster',
    frameLabel: frameOption.label,
    sizeLabel: sizeOption.label,
    shippingText: isDigital ? 'Direct per e-mail (Gratis)' : 'Gratis en verzekerd in NL & BE via vertrouwde partners (zoals PostNL, Bpost)',
  };
}

export const BASE_STARTING_PRICE = 'vanaf €19,00';
export const BASE_STARTING_ORIGINAL_PRICE = '€29,00';
