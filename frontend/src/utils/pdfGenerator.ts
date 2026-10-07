import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { MapConfig } from '../types';
import { DESIGN_STYLES } from '../constants/styles';
import { SAMPLE_STARS, SAMPLE_CONSTELLATION_LINES } from '../constants/sampleCelestialData';

// Cache font buffers in memory so they are only loaded once per process/session
const fontBufferCache = new Map<string, ArrayBuffer>();

const FONT_FILE_MAP: Record<string, string> = {
  'Cinzel': 'Cinzel.ttf',
  'Great Vibes': 'GreatVibes.ttf',
  'Montserrat': 'Montserrat.ttf',
  'Playfair Display': 'PlayfairDisplay.ttf',
  'Lato': 'Lato.ttf',
};

async function getFontBuffer(fontName: string): Promise<ArrayBuffer | null> {
  if (fontBufferCache.has(fontName)) {
    return fontBufferCache.get(fontName)!;
  }

  // 1. Try Node.js fs (server-side Next.js route / API / script)
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const candidatePaths = [
        path.join(process.cwd(), 'public', 'fonts', fontName),
        path.join(process.cwd(), 'frontend', 'public', 'fonts', fontName),
        path.join(__dirname, '..', '..', 'public', 'fonts', fontName),
        path.join(__dirname, '..', '..', '..', 'public', 'fonts', fontName),
        path.join(__dirname, '..', '..', 'frontend', 'public', 'fonts', fontName),
      ];
      for (const fontPath of candidatePaths) {
        if (fs.existsSync(fontPath)) {
          const buf = fs.readFileSync(fontPath);
          const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
          fontBufferCache.set(fontName, arrayBuf);
          return arrayBuf;
        }
      }
    } catch (e) {
      console.warn(`[PDF] Server font load for ${fontName} note:`, e);
    }
  }

  // 2. Try browser fetch (client-side in browser)
  if (typeof window !== 'undefined' || typeof fetch !== 'undefined') {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const res = await fetch(`${origin}/fonts/${fontName}`);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        fontBufferCache.set(fontName, arrayBuf);
        return arrayBuf;
      }
    } catch (e) {
      console.warn(`[PDF] Client font fetch for ${fontName} note:`, e);
    }
  }

  return null;
}

// Fallback transliteration for standard fonts (WinAnsi Windows-1252) when custom font is unavailable
function safeCharForFont(char: string, font: any): string {
  try {
    font.encodeText(char);
    return char;
  } catch {
    const map: Record<string, string> = {
      // Balkan / South Slavic
      'č': 'c', 'Č': 'C',
      'ć': 'c', 'Ć': 'C',
      'ž': 'z', 'Ž': 'Z',
      'š': 's', 'Š': 'S',
      'đ': 'dj', 'Đ': 'Dj',
      // Nordic
      'å': 'a', 'Å': 'A',
      'æ': 'ae', 'Æ': 'Ae',
      'ø': 'o', 'Ø': 'O',
      // German / Dutch
      'ä': 'a', 'Ä': 'A',
      'ö': 'o', 'Ö': 'O',
      'ü': 'u', 'Ü': 'U',
      'ß': 'ss',
      'ë': 'e', 'Ë': 'E',
      'ï': 'i', 'Ï': 'I',
      'ÿ': 'y', 'Ÿ': 'Y',
      // Polish / Czech / Slovak / Hungarian
      'ł': 'l', 'Ł': 'L',
      'ń': 'n', 'Ń': 'N',
      'ę': 'e', 'Ę': 'E',
      'ą': 'a', 'Ą': 'A',
      'ś': 's', 'Ś': 'S',
      'ź': 'z', 'Ź': 'Z',
      'ż': 'z', 'Ż': 'Z',
      'ř': 'r', 'Ř': 'R',
      'ť': 't', 'Ť': 'T',
      'ď': 'd', 'Ď': 'D',
      'ň': 'n', 'Ň': 'N',
      'ů': 'u', 'Ů': 'U',
      'ő': 'o', 'Ő': 'O',
      'ű': 'u', 'Ű': 'U',
      // Romanian
      'ș': 's', 'Ș': 'S',
      'ț': 't', 'Ț': 'T',
    };
    return map[char] || '?';
  }
}

function sanitizeTextForFont(text: string, font: any): string {
  try {
    font.encodeText(text);
    return text;
  } catch {
    return Array.from(text).map((c) => safeCharForFont(c, font)).join('');
  }
}

// Color parser utility supporting hex (#ffffff, #fff) and rgba(r, g, b, a)
function parseColor(str: string): { r: number; g: number; b: number; a: number } {
  if (!str) return { r: 1, g: 1, b: 1, a: 1 };
  str = str.trim();

  if (str.startsWith('rgba') || str.startsWith('rgb')) {
    const match = str.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      return {
        r: Math.min(1, Math.max(0, parseFloat(match[0]) / 255)),
        g: Math.min(1, Math.max(0, parseFloat(match[1]) / 255)),
        b: Math.min(1, Math.max(0, parseFloat(match[2]) / 255)),
        a: match[3] !== undefined ? Math.min(1, Math.max(0, parseFloat(match[3]))) : 1.0,
      };
    }
  }

  const clean = str.replace('#', '').trim();
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16) / 255,
      g: parseInt(clean.substring(2, 4), 16) / 255,
      b: parseInt(clean.substring(4, 6), 16) / 255,
      a: 1.0,
    };
  }
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16) / 255,
      g: parseInt(clean[1] + clean[1], 16) / 255,
      b: parseInt(clean[2] + clean[2], 16) / 255,
      a: 1.0,
    };
  }

  return { r: 0.1, g: 0.1, b: 0.1, a: 1.0 };
}

// Draw centered text with character tracking and complete European/Balkan Unicode support
function drawCenteredText(
  page: any,
  rawText: string,
  y: number,
  size: number,
  font: any,
  color: { r: number; g: number; b: number; a: number },
  tracking: number = 0
) {
  if (!rawText) return;
  const text = sanitizeTextForFont(rawText, font);
  const pdfColor = rgb(color.r, color.g, color.b);

  if (tracking <= 0) {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: (page.getWidth() - textWidth) / 2,
      y,
      size,
      font,
      color: pdfColor,
      opacity: color.a,
    });
    return;
  }

  const chars = Array.from(text);
  let totalWidth = 0;
  for (let i = 0; i < chars.length; i++) {
    totalWidth += font.widthOfTextAtSize(chars[i], size) + (i < chars.length - 1 ? tracking : 0);
  }

  let currentX = (page.getWidth() - totalWidth) / 2;
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    page.drawText(char, {
      x: currentX,
      y,
      size,
      font,
      color: pdfColor,
      opacity: color.a,
    });
    currentX += font.widthOfTextAtSize(char, size) + tracking;
  }
}

/**
 * Generate a 300 DPI high-resolution vector PDF directly.
 * Zero external backend dependency — executes reliably in client browser or Vercel serverless.
 */
export async function generateStarMapPdfBlob(
  config: Partial<MapConfig>,
  orderId?: string,
  locale: string = 'nl'
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // 1. Resolve poster dimensions in PDF points (72 pt per inch, 28.346 pt per cm)
  const posterSize = config.posterSize || '50x70';
  let pageWidth = 1417.32;
  let pageHeight = 1984.25;

  if (posterSize === '30x40') {
    pageWidth = 850.39;
    pageHeight = 1133.86;
  } else if (posterSize === '40x50') {
    pageWidth = 1133.86;
    pageHeight = 1417.32;
  } else if (posterSize === '50x70') {
    pageWidth = 1417.32;
    pageHeight = 1984.25;
  } else if (posterSize === '24x36') {
    pageWidth = 1728.0;
    pageHeight = 2592.0;
  } else if (posterSize === '18x24') {
    pageWidth = 1296.0;
    pageHeight = 1728.0;
  } else if (posterSize === '12x18') {
    pageWidth = 864.0;
    pageHeight = 1296.0;
  }

  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  const scale = pageWidth / 1000.0; // Normalized canonical width 1000

  // Canonical geometry matching Studio Preview
  let vbHeight = 1400.0;
  let scaleFactor = 1.15;
  let baseRadius = 410.0;
  let baseCy = 485.0;

  if (posterSize === '24x36' || posterSize === '12x18') {
    vbHeight = 1500.0;
    scaleFactor = posterSize === '24x36' ? 1.25 : 1.0;
    baseRadius = 435.0;
    baseCy = 525.0;
  } else if (posterSize === '30x40' || posterSize === '18x24') {
    vbHeight = 1333.33;
    scaleFactor = 1.0;
    baseRadius = 391.0;
    baseCy = 470.0;
  } else if (posterSize === '40x50') {
    vbHeight = 1250.0;
    scaleFactor = 1.05;
    baseRadius = 385.0;
    baseCy = 445.0;
  } else if (posterSize === '50x70') {
    vbHeight = 1400.0;
    scaleFactor = 1.15;
    baseRadius = 410.0;
    baseCy = 485.0;
  }

  // 2. Register fontkit and embed TrueType fonts with full Latin-Ext (Nordic, Balkan, German, etc.) support
  pdfDoc.registerFontkit(fontkit);

  // Fallback standard fonts in case TTF buffer retrieval fails
  const stdSerifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const stdSerifItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const stdSans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const stdSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  async function loadTtfFont(fontFamilyName: string, fallbackFont: any) {
    const filename = FONT_FILE_MAP[fontFamilyName] || `${fontFamilyName.replace(/\s+/g, '')}.ttf`;
    try {
      const buf = await getFontBuffer(filename);
      if (buf) {
        return await pdfDoc.embedFont(buf);
      }
    } catch (err) {
      console.warn(`[PDF] Embedding ${fontFamilyName} (${filename}) failed, using fallback:`, err);
    }
    return fallbackFont;
  }

  // Load configured fonts or their studio defaults with native Latin-Ext vector glyphs
  const fontTitle = await loadTtfFont(config.titleBlock?.font || 'Cinzel', stdSerifBold);
  const fontNames = await loadTtfFont(config.namesBlock?.font || 'Great Vibes', stdSerifItalic);
  const fontDate = await loadTtfFont(config.dateBlock?.font || 'Montserrat', stdSans);
  const fontLoc = await loadTtfFont(config.coordsBlock?.font || config.locationBlock?.font || 'Montserrat', stdSans);
  const fontSans = await loadTtfFont('Montserrat', stdSans);
  const fontSansBold = await loadTtfFont('Montserrat', stdSansBold);

  // 3. Resolve style configuration
  const styleId = config.styleId || 'midnight_classic';
  const currentStyle = DESIGN_STYLES.find((s) => s.id === styleId) || DESIGN_STYLES[0];

  const bgColor = parseColor(currentStyle.bgColor);
  const mapBgColor = parseColor(currentStyle.mapBgColor);
  const starColor = parseColor(currentStyle.starColor);
  const constColor = parseColor(currentStyle.constellationColor);
  const ringColor = parseColor(currentStyle.ringColor);
  const borderColor = parseColor(currentStyle.borderColor);
  const textColor = parseColor(currentStyle.textColor);
  const subtitleColor = parseColor(currentStyle.subtitleColor);
  const footerColor = parseColor(currentStyle.footerColor);

  // 4. Fill base background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(bgColor.r, bgColor.g, bgColor.b),
    opacity: bgColor.a,
  });

  // Matted Gallery Passepartout Border (if enabled)
  const isLarge = posterSize === '24x36' || posterSize === '50x70';
  const matMargin = (isLarge ? 38.0 : 34.0) * scale;
  if (config.showMattedBorder) {
    // White outer passepartout
    page.drawRectangle({
      x: 0,
      y: pageHeight - matMargin,
      width: pageWidth,
      height: matMargin,
      color: rgb(1, 1, 1),
    });
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: matMargin,
      color: rgb(1, 1, 1),
    });
    page.drawRectangle({
      x: 0,
      y: 0,
      width: matMargin,
      height: pageHeight,
      color: rgb(1, 1, 1),
    });
    page.drawRectangle({
      x: pageWidth - matMargin,
      y: 0,
      width: matMargin,
      height: pageHeight,
      color: rgb(1, 1, 1),
    });

    // Inner fine keyline
    page.drawRectangle({
      x: matMargin,
      y: matMargin,
      width: pageWidth - 2 * matMargin,
      height: pageHeight - 2 * matMargin,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 0.65 * scale,
    });
  }

  // 5. Celestial Disc Coordinates & Sizing
  const cx = 500.0 * scale;
  const radius = baseRadius * scale;
  const cy = pageHeight - (baseCy * scale);

  // Celestial sphere background fill
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius,
    color: rgb(mapBgColor.r, mapBgColor.g, mapBgColor.b),
    opacity: mapBgColor.a,
  });

  // Delicate celestial grid lines (equator & declination rings)
  if (config.showCelestialGrid !== false) {
    page.drawCircle({
      x: cx,
      y: cy,
      size: radius * 0.33,
      borderColor: rgb(ringColor.r, ringColor.g, ringColor.b),
      borderWidth: 0.5 * scale,
      opacity: ringColor.a * 0.6,
    });
    page.drawCircle({
      x: cx,
      y: cy,
      size: radius * 0.66,
      borderColor: rgb(ringColor.r, ringColor.g, ringColor.b),
      borderWidth: 0.5 * scale,
      opacity: ringColor.a * 0.6,
    });

    // Equatorial and meridian crosshairs
    page.drawLine({
      start: { x: cx - radius * 0.95, y: cy },
      end: { x: cx + radius * 0.95, y: cy },
      thickness: 0.5 * scale,
      color: rgb(ringColor.r, ringColor.g, ringColor.b),
      opacity: ringColor.a * 0.5,
    });
    page.drawLine({
      start: { x: cx, y: cy - radius * 0.95 },
      end: { x: cx, y: cy + radius * 0.95 },
      thickness: 0.5 * scale,
      color: rgb(ringColor.r, ringColor.g, ringColor.b),
      opacity: ringColor.a * 0.5,
    });
  }

  // Constellation lines
  if (config.showConstellationLines !== false) {
    for (const line of SAMPLE_CONSTELLATION_LINES) {
      const x1 = cx + line.x1 * radius * 0.92;
      const y1 = cy + line.y1 * radius * 0.92;
      const x2 = cx + line.x2 * radius * 0.92;
      const y2 = cy + line.y2 * radius * 0.92;

      // Only draw if within bounds of the disc
      if (
        Math.hypot(x1 - cx, y1 - cy) <= radius &&
        Math.hypot(x2 - cx, y2 - cy) <= radius
      ) {
        page.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          thickness: 0.65 * scale,
          color: rgb(constColor.r, constColor.g, constColor.b),
          opacity: constColor.a,
        });
      }
    }
  }

  // Luminous stars
  for (const star of SAMPLE_STARS) {
    const sx = cx + star.x * radius * 0.92;
    const sy = cy + star.y * radius * 0.92;

    if (Math.hypot(sx - cx, sy - cy) <= radius - 2) {
      const starRadius = Math.max(0.6 * scale, star.r * scale * 0.95);
      page.drawCircle({
        x: sx,
        y: sy,
        size: starRadius,
        color: rgb(starColor.r, starColor.g, starColor.b),
        opacity: star.bright ? 1.0 : starColor.a * 0.85,
      });

      // Extra sparkle ring for major bright navigational stars
      if (star.bright) {
        page.drawCircle({
          x: sx,
          y: sy,
          size: starRadius * 1.8,
          borderColor: rgb(starColor.r, starColor.g, starColor.b),
          borderWidth: 0.4 * scale,
          opacity: 0.45,
        });
      }
    }
  }

  // Double Celestial Compass Outer Rings & Degree Ticks
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius,
    borderColor: rgb(borderColor.r, borderColor.g, borderColor.b),
    borderWidth: 1.2 * scale,
    opacity: borderColor.a,
  });

  page.drawCircle({
    x: cx,
    y: cy,
    size: radius * 0.985,
    borderColor: rgb(ringColor.r, ringColor.g, ringColor.b),
    borderWidth: 0.6 * scale,
    opacity: ringColor.a,
  });

  // Degree ticks every 10 degrees around the outer perimeter
  for (let deg = 0; deg < 360; deg += 10) {
    const rad = (deg * Math.PI) / 180.0;
    const isMajor = deg % 30 === 0;
    const tickLen = (isMajor ? 6.5 : 3.5) * scale;
    const rOuter = radius;
    const rInner = radius - tickLen;

    page.drawLine({
      start: {
        x: cx + rOuter * Math.cos(rad),
        y: cy + rOuter * Math.sin(rad),
      },
      end: {
        x: cx + rInner * Math.cos(rad),
        y: cy + rInner * Math.sin(rad),
      },
      thickness: (isMajor ? 0.8 : 0.5) * scale,
      color: rgb(ringColor.r, ringColor.g, ringColor.b),
      opacity: ringColor.a * 0.85,
    });
  }

  // Cardinal orientation points
  // NL: N (Noord), Z (Zuid), O (Oost), W (West)
  // DE: N (Nord), S (Süd), O (Ost), W (West)
  // EN: N (North), S (South), E (East), W (West)
  const cardN = 'N';
  const cardS = locale === 'nl' ? 'Z' : 'S';
  const cardE = locale === 'en' ? 'E' : 'O';
  const cardW = 'W';

  const cardinalSize = 8.5 * scale;
  const cardinalDist = radius + 9.0 * scale;
  const cardColor = rgb(borderColor.r, borderColor.g, borderColor.b);

  page.drawText(cardN, {
    x: cx - 3.5 * scale,
    y: cy + cardinalDist,
    size: cardinalSize,
    font: fontSansBold,
    color: cardColor,
    opacity: borderColor.a,
  });
  page.drawText(cardS, {
    x: cx - 3.0 * scale,
    y: cy - cardinalDist - 8.0 * scale,
    size: cardinalSize,
    font: fontSansBold,
    color: cardColor,
    opacity: borderColor.a,
  });
  page.drawText(cardE, {
    x: cx + cardinalDist + 2.0 * scale,
    y: cy - 3.5 * scale,
    size: cardinalSize,
    font: fontSansBold,
    color: cardColor,
    opacity: borderColor.a,
  });
  page.drawText(cardW, {
    x: cx - cardinalDist - 12.0 * scale,
    y: cy - 3.5 * scale,
    size: cardinalSize,
    font: fontSansBold,
    color: cardColor,
    opacity: borderColor.a,
  });

  // Zenith subtle central crosshair
  page.drawLine({
    start: { x: cx - 6.0 * scale, y: cy },
    end: { x: cx + 6.0 * scale, y: cy },
    thickness: 0.7 * scale,
    color: rgb(ringColor.r, ringColor.g, ringColor.b),
    opacity: 0.6,
  });
  page.drawLine({
    start: { x: cx, y: cy - 6.0 * scale },
    end: { x: cx, y: cy + 6.0 * scale },
    thickness: 0.7 * scale,
    color: rgb(ringColor.r, ringColor.g, ringColor.b),
    opacity: 0.6,
  });

  // 6. Typography Layout Section with strictly locked title clearance
  const effTitleSize = (config.titleBlock?.size || 38) * 0.78 * scaleFactor;
  const titleAscender = effTitleSize * 0.72;
  const titleTop = baseCy + baseRadius + 50.0 * scaleFactor;
  let currentCanonicalY = titleTop;

  // Title Block
  const titleBlock = config.titleBlock;
  const titleText = (titleBlock?.text || 'The Night We Met').trim();
  if (titleBlock?.enabled !== false && titleText) {
    const titleBaseline = titleTop + titleAscender;
    const titleY = pageHeight - (titleBaseline * scale);
    const titleSize = effTitleSize * scale;
    const titleTracking = ((titleBlock?.tracking || 2.5) * scale);
    const formattedTitle = titleBlock?.uppercase ? titleText.toUpperCase() : titleText;

    drawCenteredText(
      page,
      formattedTitle,
      titleY,
      titleSize,
      fontTitle,
      textColor,
      titleTracking
    );
    currentCanonicalY = titleBaseline + (effTitleSize * 0.28 + 26.0) * scaleFactor;
  }

  // Names / Dedication Block
  const namesBlock = config.namesBlock;
  const namesText = (namesBlock?.text || '').trim();
  if (namesBlock?.enabled !== false && namesText) {
    const effNamesSize = (namesBlock?.size || 51) * 0.85 * scaleFactor;
    const namesBaseline = currentCanonicalY + effNamesSize * 0.72;
    const namesY = pageHeight - (namesBaseline * scale);
    const namesSize = effNamesSize * scale;
    const namesTracking = ((namesBlock?.tracking || 1.0) * scale);
    const formattedNames = namesBlock?.uppercase ? namesText.toUpperCase() : namesText;

    drawCenteredText(
      page,
      formattedNames,
      namesY,
      namesSize,
      fontNames,
      subtitleColor,
      namesTracking
    );
    currentCanonicalY = namesBaseline + (effNamesSize * 0.28 + 24.0) * scaleFactor;
  }

  // Divider Ornament
  const dividerStyle = config.dividerStyle || 'diamond';
  const divBaseSize = config.dividerSize || 34;
  const divScale = (divBaseSize / 18.0) * scaleFactor;
  const dividerHalfHeight = 4.5 * divScale;

  if (dividerStyle !== 'none') {
    const divCanonicalY = currentCanonicalY + 12.0 * scaleFactor + dividerHalfHeight;
    const divY = pageHeight - (divCanonicalY * scale);
    const divWidth = 110.0 * divScale * scale;
    const divColor = rgb(subtitleColor.r, subtitleColor.g, subtitleColor.b);

    if (dividerStyle === 'diamond') {
      page.drawLine({
        start: { x: cx - divWidth / 2, y: divY },
        end: { x: cx - 10.0 * divScale * scale, y: divY },
        thickness: Math.max(0.5, 0.75 * divScale) * scale,
        color: divColor,
        opacity: 0.6,
      });
      page.drawLine({
        start: { x: cx + 10.0 * divScale * scale, y: divY },
        end: { x: cx + divWidth / 2, y: divY },
        thickness: Math.max(0.5, 0.75 * divScale) * scale,
        color: divColor,
        opacity: 0.6,
      });
      const dSize = 3.5 * divScale * scale;
      page.drawRectangle({
        x: cx - dSize / 2,
        y: divY - dSize / 2,
        width: dSize,
        height: dSize,
        rotate: degrees(45),
        color: divColor,
        opacity: subtitleColor.a,
      });
    } else if (dividerStyle === 'dot') {
      page.drawLine({
        start: { x: cx - divWidth / 2, y: divY },
        end: { x: cx - 8.0 * divScale * scale, y: divY },
        thickness: Math.max(0.5, 0.75 * divScale) * scale,
        color: divColor,
        opacity: 0.6,
      });
      page.drawLine({
        start: { x: cx + 8.0 * divScale * scale, y: divY },
        end: { x: cx + divWidth / 2, y: divY },
        thickness: Math.max(0.5, 0.75 * divScale) * scale,
        color: divColor,
        opacity: 0.6,
      });
      page.drawCircle({
        x: cx,
        y: divY,
        size: 2.0 * divScale * scale,
        color: divColor,
        opacity: subtitleColor.a,
      });
    } else {
      page.drawLine({
        start: { x: cx - divWidth / 2, y: divY },
        end: { x: cx + divWidth / 2, y: divY },
        thickness: Math.max(0.5, 0.75 * divScale) * scale,
        color: divColor,
        opacity: 0.6,
      });
    }

    currentCanonicalY = divCanonicalY + dividerHalfHeight + 16.0 * scaleFactor;
  } else {
    currentCanonicalY = currentCanonicalY + 14.0 * scaleFactor;
  }

  // Date Block
  const dateBlock = config.dateBlock;
  const dateText = (dateBlock?.text || '').trim();
  if (dateBlock?.enabled !== false && dateText) {
    const effDateSize = (dateBlock?.size || 27) * 0.85 * scaleFactor;
    const dateBaseline = currentCanonicalY + effDateSize * 0.72;
    const dateY = pageHeight - (dateBaseline * scale);
    const dateSize = effDateSize * scale;
    const dateTracking = ((dateBlock?.tracking || 2.0) * scale);
    const formattedDate = dateBlock?.uppercase ? dateText.toUpperCase() : dateText;

    drawCenteredText(
      page,
      formattedDate,
      dateY,
      dateSize,
      fontDate,
      footerColor,
      dateTracking
    );
    currentCanonicalY = dateBaseline + (effDateSize * 0.28 + 18.0) * scaleFactor;
  }

  // Location & Coordinates Block
  const locationText = config.locationBlock?.text?.trim() || '';
  const coordsText = config.coordsBlock?.text?.trim() || '';
  const combinedLoc = [
    config.locationBlock?.uppercase ? locationText.toUpperCase() : locationText,
    config.coordsBlock?.uppercase ? coordsText.toUpperCase() : coordsText,
  ]
    .filter(Boolean)
    .join('  •  ');

  if (combinedLoc) {
    const effCoordsSize = (config.coordsBlock?.size || 21) * 0.85 * scaleFactor;
    const coordsBaseline = currentCanonicalY + effCoordsSize * 0.72;
    const locY = pageHeight - (coordsBaseline * scale);
    const locSize = effCoordsSize * scale;
    const locTracking = ((config.coordsBlock?.tracking || 1.8) * scale);

    drawCenteredText(
      page,
      combinedLoc,
      locY,
      locSize,
      fontLoc,
      footerColor,
      locTracking
    );
  }

  // Tiny discrete archival serial mark in bottom right
  const serial = orderId ? `${orderId} • STELLAIRE ATELIER • 300 DPI` : 'STELLAIRE ATELIER • 300 DPI ARCHIVAL';
  page.drawText(serial, {
    x: pageWidth - 200.0 * scale,
    y: 18.0 * scale,
    size: 6.0 * scale,
    font: fontSans,
    color: rgb(footerColor.r, footerColor.g, footerColor.b),
    opacity: 0.35,
  });

  return pdfDoc.save();
}
