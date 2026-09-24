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

export const METRIC_SIZES: { id: PosterSize; label: string; sub: string; aspect: string; popular?: boolean }[] = [
  { id: '20x30', label: '20 × 30 cm', sub: 'Compact Aandenken (2:3)', aspect: '2:3' },
  { id: '30x40', label: '30 × 40 cm', sub: 'Klassieke Galerij (3:4)', aspect: '3:4', popular: true },
  { id: '40x50', label: '40 × 50 cm', sub: 'Medium Statement (4:5)', aspect: '4:5' },
  { id: '50x70', label: '50 × 70 cm', sub: 'Groot Kunstformaat (5:7)', aspect: '5:7', popular: true },
];

export const FRAME_OPTIONS: {
  id: FrameStyle;
  label: string;
  category: 'digital' | 'print' | 'frame';
  sub: string;
  desc: string;
  badge?: string;
  borderStyle: string;
  bgStyle: string;
  innerBg: string;
  previewBorderColor: string;
}[] = [
  {
    id: 'digital',
    label: 'Digitaal Bestand',
    category: 'digital',
    sub: 'Print-klaar PDF (300 DPI)',
    desc: 'Direct per e-mail ontvangen in ultrahoge resolutie om zelf te printen of lokaal te laten drukken.',
    badge: 'Laagste Prijs • Direct',
    borderStyle: 'border-dashed border-sky-400',
    bgStyle: 'bg-sky-50',
    innerBg: 'bg-[#0E1526]',
    previewBorderColor: '#38bdf8',
  },
  {
    id: 'none',
    label: 'Classic Matte Print',
    category: 'print',
    sub: '200 gsm Museumkwaliteit Mat Papier',
    desc: 'Zonder lijst. Gedrukt door Gelato op FSC® archiefpapier, geleverd in stevige koker.',
    badge: 'Populair',
    borderStyle: 'border-dashed border-[#C5BFB5]',
    bgStyle: 'bg-white',
    innerBg: 'bg-[#2E3440]',
    previewBorderColor: '#E7E2D9',
  },
  {
    id: 'black',
    label: 'Gelato Zwart Hout',
    category: 'frame',
    sub: 'Classic Matte + Zwart Houten Lijst',
    desc: 'FSC® massief hout, ontspiegeld kristalhelder acrylglas en direct ophangklaar.',
    badge: 'Klassiek Galerij',
    borderStyle: 'border-[3px] border-[#181716]',
    bgStyle: 'bg-[#181716]',
    innerBg: 'bg-[#0E1526]',
    previewBorderColor: '#1C1A18',
  },
  {
    id: 'oak',
    label: 'Gelato Natuurlijk Hout',
    category: 'frame',
    sub: 'Classic Matte + Natuurlijk Houten Lijst',
    desc: 'Massief natuurlijk hout met verfijnde houtnerf, acrylglas en kant-en-klare ophangkit.',
    badge: 'Warm & Tijdloos',
    borderStyle: 'border-[3px] border-[#9A6B3D]',
    bgStyle: 'bg-[#9A6B3D]',
    innerBg: 'bg-[#0E1526]',
    previewBorderColor: '#936034',
  },
  {
    id: 'white',
    label: 'Gelato Wit Hout',
    category: 'frame',
    sub: 'Classic Matte + Wit Houten Lijst',
    desc: 'Zacht satijnwit massief hout, acrylglas en ophangkit, perfect voor lichte interieurs.',
    badge: 'Licht & Modern',
    borderStyle: 'border-[3px] border-[#E8E4DC] ring-1 ring-[#D0CAC0]',
    bgStyle: 'bg-white',
    innerBg: 'bg-[#0E1526]',
    previewBorderColor: '#FAF8F5',
  },
];

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
    typeLabel: isDigital ? 'Digitaal Bestand (300 DPI)' : hasFrame ? 'Gelato Houten Lijst' : 'Classic Matte Poster',
    frameLabel: frameOption.label,
    sizeLabel: sizeOption.label,
    shippingText: isDigital ? 'Direct per e-mail (Gratis)' : 'Gratis en verzekerd in NL & BE (PostNL / Bpost)',
  };
}

export const BASE_STARTING_PRICE = 'vanaf €19,00';
export const BASE_STARTING_ORIGINAL_PRICE = '€29,00';
