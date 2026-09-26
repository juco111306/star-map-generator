import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { MapConfig } from '../types';
import { DESIGN_STYLES } from '../constants/styles';
import { SAMPLE_STARS, SAMPLE_CONSTELLATION_LINES } from '../constants/sampleCelestialData';

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

// Draw centered text with character tracking support
function drawCenteredText(
  page: any,
  text: string,
  y: number,
  size: number,
  font: any,
  color: { r: number; g: number; b: number; a: number },
  tracking: number = 0
) {
  if (!text) return;
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

  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    totalWidth += font.widthOfTextAtSize(text[i], size) + (i < text.length - 1 ? tracking : 0);
  }

  let currentX = (page.getWidth() - totalWidth) / 2;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
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
  orderId?: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // 1. Resolve poster dimensions in PDF points (72 pt per inch, 28.346 pt per cm)
  const posterSize = config.posterSize || '50x70';
  let pageWidth = 1417.32;
  let pageHeight = 1984.25;

  if (posterSize === '20x30') {
    pageWidth = 566.93;
    pageHeight = 850.39;
  } else if (posterSize === '30x40') {
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
  }

  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  const scale = pageWidth / 1296.0; // Normalized to 18x24

  // 2. Load and embed classic standard typography fonts
  const fontSerifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontSerifItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const fontSans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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
  if (config.showMattedBorder) {
    const matMargin = 55.0 * scale;
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
      borderWidth: 0.8 * scale,
    });
  }

  // 5. Celestial Disc Coordinates & Sizing
  const cx = pageWidth / 2.0;
  const radius = Math.min(pageWidth * 0.41, pageHeight * 0.31);
  const cy = pageHeight - radius - (config.showMattedBorder ? 120.0 : 95.0) * scale;

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

  // Cardinal orientation points (N, S, E, W)
  const cardinalSize = 8.5 * scale;
  const cardinalDist = radius + 9.0 * scale;
  const cardColor = rgb(borderColor.r, borderColor.g, borderColor.b);

  page.drawText('N', {
    x: cx - 3.5 * scale,
    y: cy + cardinalDist,
    size: cardinalSize,
    font: fontSansBold,
    color: cardColor,
    opacity: borderColor.a,
  });
  page.drawText('S', {
    x: cx - 3.0 * scale,
    y: cy - cardinalDist - 8.0 * scale,
    size: cardinalSize,
    font: fontSansBold,
    color: cardColor,
    opacity: borderColor.a,
  });
  page.drawText('E', {
    x: cx + cardinalDist + 2.0 * scale,
    y: cy - 3.5 * scale,
    size: cardinalSize,
    font: fontSansBold,
    color: cardColor,
    opacity: borderColor.a,
  });
  page.drawText('W', {
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

  // 6. Typography Layout Section
  // Space calculations flowing from bottom of the star map to page baseline
  let currentY = cy - radius - 55.0 * scale;

  // Title Block
  const titleBlock = config.titleBlock;
  const titleText = (titleBlock?.text || 'The Night We Met').trim();
  if (titleText) {
    const titleSize = Math.max(18, (titleBlock?.size || 34) * 0.85 * scale);
    const titleTracking = ((titleBlock?.tracking || 3.0) * scale);
    const formattedTitle = titleBlock?.uppercase ? titleText.toUpperCase() : titleText;

    drawCenteredText(
      page,
      formattedTitle,
      currentY,
      titleSize,
      fontSerifBold,
      textColor,
      titleTracking
    );
    currentY -= titleSize * 1.35 + 10.0 * scale;
  }

  // Names / Dedication Block
  const namesBlock = config.namesBlock;
  const namesText = (namesBlock?.text || '').trim();
  if (namesText) {
    const namesSize = Math.max(14, (namesBlock?.size || 22) * 0.9 * scale);
    const namesTracking = ((namesBlock?.tracking || 1.5) * scale);
    const formattedNames = namesBlock?.uppercase ? namesText.toUpperCase() : namesText;

    drawCenteredText(
      page,
      formattedNames,
      currentY,
      namesSize,
      fontSerifItalic,
      subtitleColor,
      namesTracking
    );
    currentY -= namesSize * 1.25 + 12.0 * scale;
  }

  // Divider Ornament
  const dividerStyle = config.dividerStyle || 'diamond';
  if (dividerStyle !== 'none') {
    const divWidth = 140.0 * scale;
    const divColor = rgb(subtitleColor.r, subtitleColor.g, subtitleColor.b);

    if (dividerStyle === 'diamond') {
      page.drawLine({
        start: { x: cx - divWidth / 2, y: currentY },
        end: { x: cx - 14 * scale, y: currentY },
        thickness: 0.65 * scale,
        color: divColor,
        opacity: 0.6,
      });
      page.drawLine({
        start: { x: cx + 14 * scale, y: currentY },
        end: { x: cx + divWidth / 2, y: currentY },
        thickness: 0.65 * scale,
        color: divColor,
        opacity: 0.6,
      });
      // Rotated square diamond
      const dSize = 5.0 * scale;
      page.drawRectangle({
        x: cx - dSize / 2,
        y: currentY - dSize / 2,
        width: dSize,
        height: dSize,
        rotate: degrees(45),
        color: divColor,
        opacity: subtitleColor.a,
      });
    } else if (dividerStyle === 'dot') {
      page.drawLine({
        start: { x: cx - divWidth / 2, y: currentY },
        end: { x: cx - 10 * scale, y: currentY },
        thickness: 0.65 * scale,
        color: divColor,
        opacity: 0.6,
      });
      page.drawLine({
        start: { x: cx + 10 * scale, y: currentY },
        end: { x: cx + divWidth / 2, y: currentY },
        thickness: 0.65 * scale,
        color: divColor,
        opacity: 0.6,
      });
      page.drawCircle({
        x: cx,
        y: currentY,
        size: 2.5 * scale,
        color: divColor,
        opacity: subtitleColor.a,
      });
    } else {
      // Clean continuous hairline
      page.drawLine({
        start: { x: cx - divWidth / 2, y: currentY },
        end: { x: cx + divWidth / 2, y: currentY },
        thickness: 0.65 * scale,
        color: divColor,
        opacity: 0.6,
      });
    }

    currentY -= 20.0 * scale;
  }

  // Date Block
  const dateBlock = config.dateBlock;
  const dateText = (dateBlock?.text || '').trim();
  if (dateText) {
    const dateSize = Math.max(10, (dateBlock?.size || 16) * 0.85 * scale);
    const dateTracking = ((dateBlock?.tracking || 2.2) * scale);
    const formattedDate = dateBlock?.uppercase ? dateText.toUpperCase() : dateText;

    drawCenteredText(
      page,
      formattedDate,
      currentY,
      dateSize,
      fontSans,
      footerColor,
      dateTracking
    );
    currentY -= dateSize * 1.35 + 8.0 * scale;
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
    const locSize = Math.max(9, (config.coordsBlock?.size || 14) * 0.85 * scale);
    const locTracking = ((config.coordsBlock?.tracking || 1.8) * scale);

    drawCenteredText(
      page,
      combinedLoc,
      currentY,
      locSize,
      fontSans,
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
