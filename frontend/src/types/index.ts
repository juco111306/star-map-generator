export type PosterSize = '20x30' | '30x40' | '40x50' | '50x70' | '18x24' | '24x36';

export type LayoutVariation =
  | 'standard_stack'
  | 'top_title'
  | 'curved_border'
  | 'moon_phases'
  | 'framed';

export type DividerStyle = 'diamond' | 'star' | 'heart' | 'dot' | 'line' | 'none';

export type FrameStyle = 'digital' | 'none' | 'black' | 'oak' | 'white';

export interface StyleOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  bgColor: string;
  mapBgColor: string;
  starColor: string;
  constellationColor: string;
  maskShape: 'circle' | 'heart';
  borderColor: string;
  ringColor: string;
  textColor: string;
  subtitleColor: string;
  footerColor: string;
  curvedText: boolean;
  constellationsOnly: boolean;
  isWatercolor?: boolean;
}

export interface StarPoint {
  x: number;
  y: number;
  mag: number;
  size: number;
  is_constellation: boolean;
}

export interface ConstellationLine {
  constellation: string;
  p1: [number, number];
  p2: [number, number];
}

export interface CelestialData {
  stars: StarPoint[];
  lines: ConstellationLine[];
  constellation_stars: StarPoint[];
  total_visible_stars: number;
  total_visible_lines: number;
}

export interface GeocodeResult {
  display_name: string;
  name: string;
  lat: number;
  lon: number;
}

export interface TextBlockConfig {
  text: string;
  font: string;
  size: number;
  tracking: number;
  uppercase: boolean;
  italic: boolean;
  enabled: boolean;
}

export interface MapConfig {
  posterSize: PosterSize;
  styleId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;

  // Fully customizable text blocks
  titleBlock: TextBlockConfig;
  namesBlock: TextBlockConfig;
  taglineBlock: TextBlockConfig;
  dateBlock: TextBlockConfig;
  locationBlock: TextBlockConfig;
  coordsBlock: TextBlockConfig;

  // Visual & Celestial Toggles
  maskShape: 'circle' | 'heart';
  layoutVariation: LayoutVariation;
  showMattedBorder: boolean;
  showCelestialGrid: boolean; // compass ring, degree ticks, N/S/E/W
  showConstellationLines: boolean;
  showMilkyWay: boolean;
  dividerStyle: DividerStyle;
  dividerSize?: number;
  frameStyle: FrameStyle;
}

export type AppView = 'landing' | 'products' | 'customizer' | 'producer' | 'about';

export interface CustomerDetails {
  name: string;
  email: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  gift_note?: string;
  producer_notes?: string;
}

export interface TimelineEvent {
  status: string;
  timestamp: string;
  title: string;
  description: string;
}

export interface OrderRecord {
  order_id: string;
  created_at: string;
  status: string;
  customer: CustomerDetails;
  poster_size: string;
  style_id: string;
  frame_style: string;
  title_text: string;
  names_text: string;
  date_text: string;
  location_text: string;
  pdf_filename: string;
  pdf_size_bytes: number;
  carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  timeline?: TimelineEvent[];
}

export interface ProductItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
  category: 'celestial' | 'wood' | 'socks' | 'cartography' | 'leather' | 'lunar' | 'soundwave' | 'music';
  available: boolean;
  material?: string;
  details?: string[];
}

