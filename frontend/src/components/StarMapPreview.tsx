'use client';

import React, { useMemo, useState } from 'react';
import { DESIGN_STYLES } from '../constants/styles';
import { CelestialData, FrameStyle, MapConfig } from '../types';
import { MoonPhasesDivider } from './MoonPhasesDivider';
import {
  SAMPLE_STARS,
  SAMPLE_CONSTELLATION_LINES,
} from '../constants/sampleCelestialData';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Sparkles,
  Loader2,
  Frame,
} from 'lucide-react';

interface StarMapPreviewProps {
  config: MapConfig;
  celestialData: CelestialData | null;
  isLoading: boolean;
  onFrameChange?: (frame: FrameStyle) => void;
}

export const StarMapPreview: React.FC<StarMapPreviewProps> = ({
  config,
  celestialData,
  isLoading,
  onFrameChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Match current style
  const currentStyle = useMemo(() => {
    return (
      DESIGN_STYLES.find((s) => s.id === config.styleId) || DESIGN_STYLES[0]
    );
  }, [config.styleId]);

  // Poster dimensions in SVG coordinate space
  const size = config.posterSize || '50x70';
  const vbWidth = 1000;
  let vbHeight = 1400; // default 50x70 (5:7 ratio)
  let aspectRatioClass = 'aspect-[5/7]';
  let scaleFactor = 1.15;
  let baseRadius = 410; // 5% smaller (balanced size)
  let baseCy = 485;

  if (size === '20x30' || size === '24x36') {
    vbHeight = 1500;
    aspectRatioClass = 'aspect-[2/3]';
    scaleFactor = size === '24x36' ? 1.25 : 1.0;
    baseRadius = 435; // 5% smaller
    baseCy = 525;
  } else if (size === '30x40' || size === '18x24') {
    vbHeight = 1333;
    aspectRatioClass = 'aspect-[3/4]';
    scaleFactor = 1.0;
    baseRadius = 391; // 5% smaller
    baseCy = 470;
  } else if (size === '40x50') {
    vbHeight = 1250;
    aspectRatioClass = 'aspect-[4/5]';
    scaleFactor = 1.05;
    baseRadius = 385; // 5% smaller
    baseCy = 445;
  } else if (size === '50x70') {
    vbHeight = 1400;
    aspectRatioClass = 'aspect-[5/7]';
    scaleFactor = 1.15;
    baseRadius = 410; // 5% smaller
    baseCy = 485;
  }

  // Layout variations
  const layout = config.layoutVariation || 'standard_stack';
  const isCurvedLayout = layout === 'curved_border' || currentStyle.curvedText;
  const isTopTitleLayout = layout === 'top_title';
  const isMoonPhasesLayout = layout === 'moon_phases';
  const isFramedLayout = layout === 'framed';

  // Celestial sphere position inside virtual canvas
  const cx = 500;
  let radius = baseRadius;
  let cy = baseCy;

  if (isTopTitleLayout) {
    radius = Math.round(baseRadius * 0.94);
    cy = Math.round(vbHeight * 0.47);
  } else if (isMoonPhasesLayout) {
    radius = Math.round(baseRadius * 0.97);
    cy = baseCy - 20;
  } else if (isCurvedLayout) {
    radius = Math.round(baseRadius * 0.98);
    cy = baseCy + Math.round(75 * scaleFactor);
  } else if (isFramedLayout) {
    radius = Math.round(baseRadius * 0.98);
    cy = baseCy;
  }

  // Mask shape selection (user choice or style default)
  const maskShape = config.maskShape || currentStyle.maskShape || 'circle';
  const isHeart = maskShape === 'heart';

  // Matted border margin in SVG coordinates
  const isLarge = size === '24x36' || size === '50x70';
  const matMargin = isLarge ? 38 : 34;
  const frameMargin = isLarge ? 54 : 44;

  // Heart path generation for romantic heart shape mask
  const heartPathData = useMemo(() => {
    const pts: string[] = [];
    const count = 180;
    for (let i = 0; i <= count; i++) {
      const t = (i / count) * 2 * Math.PI;
      const xRaw = 16 * Math.pow(Math.sin(t), 3);
      const yRaw =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      const xNorm = xRaw / 16.0;
      const yNorm = (yRaw + 1.75) / 15.25;
      const px = (cx + xNorm * radius).toFixed(2);
      const py = (cy - yNorm * radius).toFixed(2);
      pts.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    pts.push('Z');
    return pts.join(' ');
  }, [cx, cy, radius]);

  // Secondary outer heart outline for luxury romantic look
  const outerHeartPathData = useMemo(() => {
    const pts: string[] = [];
    const count = 180;
    const rOuter = radius + 7;
    for (let i = 0; i <= count; i++) {
      const t = (i / count) * 2 * Math.PI;
      const xRaw = 16 * Math.pow(Math.sin(t), 3);
      const yRaw =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      const xNorm = xRaw / 16.0;
      const yNorm = (yRaw + 1.75) / 15.25;
      const px = (cx + xNorm * rOuter).toFixed(2);
      const py = (cy - yNorm * rOuter).toFixed(2);
      pts.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    pts.push('Z');
    return pts.join(' ');
  }, [cx, cy, radius]);

  // Curved text path along the upper boundary for Style 9
  const curvedTextRadius = radius + 22;
  const curvedArcPath = useMemo(() => {
    const xStart = cx - curvedTextRadius;
    const yStart = cy;
    const xEnd = cx + curvedTextRadius;
    const yEnd = cy;
    return `M ${xStart} ${yStart} A ${curvedTextRadius} ${curvedTextRadius} 0 0 1 ${xEnd} ${yEnd}`;
  }, [cx, cy, curvedTextRadius]);

  // Degree ticks around the celestial compass ring (every 10 deg)
  const degreeTicks = useMemo(() => {
    const ticks = [];
    for (let deg = 0; deg < 360; deg += 10) {
      if (deg === 0 || deg === 90 || deg === 180 || deg === 270) continue;
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 30 === 0;
      const tickLen = isMajor ? 6.5 : 3.5;
      // In SVG: North is 0 deg (up, -y), East is 90 deg (left, -x), South is 180 deg (+y), West is 270 deg (+x)
      const sinA = Math.sin(rad);
      const cosA = Math.cos(rad);
      const x1 = cx - radius * sinA;
      const y1 = cy - radius * cosA;
      const x2 = cx - (radius + tickLen) * sinA;
      const y2 = cy - (radius + tickLen) * cosA;
      ticks.push({ x1, y1, x2, y2, isMajor, key: deg });
    }
    return ticks;
  }, [cx, cy, radius]);

  // Active star points: prioritize real astronomy data, fallback immediately to authentic sample stars
  const activeStars = useMemo(() => {
    if (currentStyle.constellationsOnly) {
      if (celestialData?.constellation_stars && celestialData.constellation_stars.length > 0) {
        return celestialData.constellation_stars;
      }
      return SAMPLE_STARS.filter((s) => s.bright).map((s) => ({
        x: s.x,
        y: s.y,
        mag: 1.5,
        size: s.r * 1.8,
        is_constellation: true,
      }));
    }

    if (celestialData?.stars && celestialData.stars.length > 0) {
      return celestialData.stars;
    }

    return SAMPLE_STARS.map((s) => ({
      x: s.x,
      y: s.y,
      mag: s.bright ? 1.5 : 4.0,
      size: s.r * 1.3,
      is_constellation: s.bright,
    }));
  }, [celestialData, currentStyle.constellationsOnly]);

  // Active constellation lines
  const activeLines = useMemo(() => {
    if (celestialData?.lines && celestialData.lines.length > 0) {
      return celestialData.lines.map((l) => ({
        x1: l.p1[0],
        y1: l.p1[1],
        x2: l.p2[0],
        y2: l.p2[1],
      }));
    }

    return SAMPLE_CONSTELLATION_LINES.map((l) => ({
      x1: l.x1,
      y1: l.y1,
      x2: l.x2,
      y2: l.y2,
    }));
  }, [celestialData]);

  // Dynamic vertical positions for typography elements
  const typographyLayout = useMemo(() => {
    // Generous breathing space between circle bottom and main title inscription
    let currentY = cy + radius + 85 * scaleFactor;

    const positions = {
      titleY: 0,
      namesY: 0,
      dividerY: 0,
      moonPhasesY: 0,
      dateY: 0,
      locY: 0,
    };

    if (isTopTitleLayout) {
      // Top Title composition: Title dynamically positioned above circle
      // to eliminate the excessive gap between title and celestial sphere
      positions.titleY = (cy - radius) - 75 * scaleFactor;

      // Secondary details below celestial sphere with enhanced elegant spacing
      currentY = cy + radius + 75 * scaleFactor;
      if (config.namesBlock?.enabled && config.namesBlock.text.trim()) {
        positions.namesY = currentY;
        currentY += (config.namesBlock.size * 0.85 + 28) * scaleFactor;
      }
      if (config.dividerStyle !== 'none') {
        const divBaseSize = config.dividerSize || 34;
        const divScale = (divBaseSize / 18) * scaleFactor;
        const dividerHalfHeight = 4.5 * divScale;

        positions.dividerY = currentY + 14 * scaleFactor + dividerHalfHeight;
        const dateSize = (config.dateBlock?.enabled && config.dateBlock.text.trim()) ? config.dateBlock.size : 27;
        const dateAscender = dateSize * 0.72 * scaleFactor;
        positions.dateY = positions.dividerY + dividerHalfHeight + 18 * scaleFactor + dateAscender;
        currentY = positions.dateY + (dateSize * 0.35 + 22) * scaleFactor;
      } else if (config.dateBlock?.enabled && config.dateBlock.text.trim()) {
        const dateSize = config.dateBlock.size;
        const dateAscender = dateSize * 0.72 * scaleFactor;
        positions.dateY = currentY + 18 * scaleFactor + dateAscender;
        currentY = positions.dateY + (dateSize * 0.35 + 22) * scaleFactor;
      }
      if (
        (config.locationBlock?.enabled && config.locationBlock.text.trim()) ||
        (config.coordsBlock?.enabled && config.coordsBlock.text.trim())
      ) {
        const coordSize = (config.coordsBlock?.enabled && config.coordsBlock.text.trim()) ? config.coordsBlock.size : 21;
        positions.locY = currentY + (coordSize * 0.72 * scaleFactor);
      }
      return positions;
    }

    if (isMoonPhasesLayout) {
      // Moon phases row positioned underneath star map (twice the size) - unchanged
      positions.moonPhasesY = cy + radius + 40 * scaleFactor;

      const divBaseSize = config.dividerSize || 34;
      const divScale = (divBaseSize / 18) * scaleFactor;
      const dividerHalfHeight = config.dividerStyle !== 'none' ? (4.5 * divScale) : 0;

      // Anchored divider position keeping date and location text unchanged
      const dateSize = (config.dateBlock?.enabled && config.dateBlock.text.trim()) ? config.dateBlock.size : 27;
      const dateAscender = dateSize * 0.72 * scaleFactor;

      // Reference divider position for unchanged date/location layout
      const baseDividerY = positions.moonPhasesY + 215 * scaleFactor;
      const span = baseDividerY - positions.moonPhasesY;

      // Position title+names starting at 1/3 distance between moons and the divider
      const oneThirdOffset = span * (1.0 / 3.0);
      positions.titleY = positions.moonPhasesY + oneThirdOffset;

      let afterTitleY = positions.titleY;
      if (config.titleBlock?.enabled && config.titleBlock.text.trim()) {
        afterTitleY += (config.titleBlock.size * 0.85 + 24) * scaleFactor;
      }
      if (config.namesBlock?.enabled && config.namesBlock.text.trim()) {
        positions.namesY = afterTitleY;
        afterTitleY += (config.namesBlock.size * 0.85 + 20) * scaleFactor;
      }

      // Divider position: stays at baseDividerY unless large custom font pushes it down
      positions.dividerY = Math.max(baseDividerY, afterTitleY + 12 * scaleFactor + dividerHalfHeight);

      if (config.dividerStyle !== 'none') {
        positions.dateY = positions.dividerY + dividerHalfHeight + 16 * scaleFactor + dateAscender;
        currentY = positions.dateY + (dateSize * 0.35 + 18) * scaleFactor;
      } else if (config.dateBlock?.enabled && config.dateBlock.text.trim()) {
        positions.dateY = positions.dividerY + 14 * scaleFactor + dateAscender;
        currentY = positions.dateY + (dateSize * 0.35 + 18) * scaleFactor;
      }

      if (
        (config.locationBlock?.enabled && config.locationBlock.text.trim()) ||
        (config.coordsBlock?.enabled && config.coordsBlock.text.trim())
      ) {
        const coordSize = (config.coordsBlock?.enabled && config.coordsBlock.text.trim()) ? config.coordsBlock.size : 21;
        positions.locY = currentY + (coordSize * 0.72 * scaleFactor);
      }
      return positions;
    }

    if (isCurvedLayout) {
      currentY = cy + radius + 85 * scaleFactor;
      if (config.namesBlock?.enabled && config.namesBlock.text.trim()) {
        positions.namesY = currentY;
        currentY += (config.namesBlock.size * 0.85 + 24) * scaleFactor;
      }
      if (config.dividerStyle !== 'none') {
        const divBaseSize = config.dividerSize || 34;
        const divScale = (divBaseSize / 18) * scaleFactor;
        const dividerHalfHeight = 4.5 * divScale;

        positions.dividerY = currentY + 10 * scaleFactor + dividerHalfHeight;
        const dateSize = (config.dateBlock?.enabled && config.dateBlock.text.trim()) ? config.dateBlock.size : 27;
        const dateAscender = dateSize * 0.72 * scaleFactor;
        positions.dateY = positions.dividerY + dividerHalfHeight + 16 * scaleFactor + dateAscender;
        currentY = positions.dateY + (dateSize * 0.35 + 18) * scaleFactor;
      } else if (config.dateBlock?.enabled && config.dateBlock.text.trim()) {
        const dateSize = config.dateBlock.size;
        const dateAscender = dateSize * 0.72 * scaleFactor;
        positions.dateY = currentY + 14 * scaleFactor + dateAscender;
        currentY = positions.dateY + (dateSize * 0.35 + 18) * scaleFactor;
      }
      if (
        (config.locationBlock?.enabled && config.locationBlock.text.trim()) ||
        (config.coordsBlock?.enabled && config.coordsBlock.text.trim())
      ) {
        const coordSize = (config.coordsBlock?.enabled && config.coordsBlock.text.trim()) ? config.coordsBlock.size : 21;
        positions.locY = currentY + (coordSize * 0.72 * scaleFactor);
      }
      return positions;
    }

    // Standard Stack and Framed layout
    if (config.titleBlock?.enabled && config.titleBlock.text.trim()) {
      positions.titleY = currentY;
      currentY += (config.titleBlock.size * 0.85 + 26) * scaleFactor;
    }

    if (config.namesBlock?.enabled && config.namesBlock.text.trim()) {
      positions.namesY = currentY;
      currentY += (config.namesBlock.size * 0.85 + 24) * scaleFactor;
    }

    if (config.dividerStyle !== 'none') {
      const divBaseSize = config.dividerSize || 34;
      const divScale = (divBaseSize / 18) * scaleFactor;
      const dividerHalfHeight = 4.5 * divScale;

      positions.dividerY = currentY + 12 * scaleFactor + dividerHalfHeight;
      const dateSize = (config.dateBlock?.enabled && config.dateBlock.text.trim()) ? config.dateBlock.size : 27;
      const dateAscender = dateSize * 0.72 * scaleFactor;
      positions.dateY = positions.dividerY + dividerHalfHeight + 16 * scaleFactor + dateAscender;
      currentY = positions.dateY + (dateSize * 0.35 + 18) * scaleFactor;
    } else if (config.dateBlock?.enabled && config.dateBlock.text.trim()) {
      const dateSize = config.dateBlock.size;
      const dateAscender = dateSize * 0.72 * scaleFactor;
      positions.dateY = currentY + 14 * scaleFactor + dateAscender;
      currentY = positions.dateY + (dateSize * 0.35 + 18) * scaleFactor;
    }

    if (
      (config.locationBlock?.enabled && config.locationBlock.text.trim()) ||
      (config.coordsBlock?.enabled && config.coordsBlock.text.trim())
    ) {
      const coordSize = (config.coordsBlock?.enabled && config.coordsBlock.text.trim()) ? config.coordsBlock.size : 21;
      positions.locY = currentY + (coordSize * 0.72 * scaleFactor);
    }

    return positions;
  }, [cy, radius, size, isCurvedLayout, isTopTitleLayout, isMoonPhasesLayout, config, scaleFactor]);

  // Combined Location & Coordinates
  const combinedLocationText = useMemo(() => {
    const parts: string[] = [];
    if (config.locationBlock?.enabled && config.locationBlock.text.trim()) {
      parts.push(
        config.locationBlock.uppercase
          ? config.locationBlock.text.toUpperCase()
          : config.locationBlock.text
      );
    }
    if (config.coordsBlock?.enabled && config.coordsBlock.text.trim()) {
      parts.push(
        config.coordsBlock.uppercase
          ? config.coordsBlock.text.toUpperCase()
          : config.coordsBlock.text
      );
    }
    return parts.join(' • ');
  }, [config.locationBlock, config.coordsBlock]);

  // Frame styling wrapper with natural studio light shadows (Gelato Classic Matte Wooden Frames)
  const frameContainerStyle = useMemo(() => {
    switch (config.frameStyle) {
      case 'digital':
        return 'p-0 rounded-none shadow-[0_20px_45px_-12px_rgba(56,189,248,0.22),0_8px_18px_-6px_rgba(28,25,23,0.1)] border border-[#BAE6FD] ring-2 ring-sky-400/25';
      case 'black':
        return 'p-0 bg-[#161514] rounded-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_10px_25px_-5px_rgba(0,0,0,0.25)] border-[6px] sm:border-[8px] border-[#1C1A18] ring-1 ring-black/50';
      case 'oak':
        return 'p-0 bg-gradient-to-br from-[#E8DAC3] via-[#DFCCA9] to-[#D4BE9B] rounded-none shadow-[0_25px_60px_-12px_rgba(40,25,10,0.24),0_10px_22px_-5px_rgba(40,25,10,0.14)] border-[6px] sm:border-[8px] border-[#DFC9A6] ring-1 ring-[#C8B28E]/60';
      case 'white':
        return 'p-0 bg-[#FFFFFF] rounded-none shadow-[0_25px_60px_-15px_rgba(28,25,23,0.25),0_10px_25px_-5px_rgba(28,25,23,0.12)] border-[6px] sm:border-[8px] border-[#FAF8F5] ring-1 ring-[#D8D4CC]';
      case 'none':
      default:
        return 'p-0 rounded-none shadow-[0_20px_45px_-12px_rgba(28,25,23,0.22),0_8px_18px_-6px_rgba(28,25,23,0.1)] border border-[#E7E2D9]';
    }
  }, [config.frameStyle]);

  return (
    <div className="order-1 lg:order-2 flex-1 flex flex-col items-center justify-start lg:sticky lg:top-[65px] h-auto lg:h-[calc(100vh-65px)] p-3 lg:p-4 overflow-y-auto lg:overflow-hidden bg-[#F2EFE9] relative">
      {/* Soft natural studio gallery light behind preview */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-white/80 via-white/40 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Top Toolbar Controls */}
      <div className="w-full max-w-[640px] flex items-center justify-between gap-2 mb-2 sm:mb-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#E2DDD5] text-xs shadow-sm">
        <div className="flex items-center space-x-2 text-[#1C1917]">
          <span className="font-serif font-bold text-[#1C1917] tracking-wide">{currentStyle.name}</span>
          <span className="text-[#A8A29E]">&bull;</span>
          <span className="text-[#78716C] font-mono text-[11px]">
            {config.frameStyle === 'digital'
              ? 'Digitaal PDF (300 DPI)'
              : config.frameStyle === 'oak'
              ? `${config.posterSize.replace('x', ' × ')} cm • Natuurlijk Hout (Licht)`
              : config.frameStyle === 'black'
              ? `${config.posterSize.replace('x', ' × ')} cm • Mat Zwart Hout`
              : config.frameStyle === 'white'
              ? `${config.posterSize.replace('x', ' × ')} cm • Zuiver Wit Hout`
              : `${config.posterSize.replace('x', ' × ')} cm • Classic Matte Poster`}
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] transition"
            title="Uitzoomen"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-[#78716C] w-9 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.1))}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] transition"
            title="Inzoomen"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1.0)}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] transition"
            title="Standaard zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] transition"
            title="Volledig scherm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Poster Preview Box */}
      <div
        className={`w-full flex items-center justify-center transition-transform duration-200 ${
          isFullscreen
            ? 'fixed inset-0 z-50 bg-black/95 p-8 flex items-center justify-center'
            : 'flex-1 min-h-0 w-full flex items-center justify-center py-1 sm:py-2'
        }`}
        style={{ transform: isFullscreen ? undefined : `scale(${zoomLevel})` }}
      >
        <div
          className={`w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none lg:w-auto lg:h-[calc(100vh-165px)] lg:max-h-[750px] ${aspectRatioClass} overflow-hidden relative transition-all duration-300 ${frameContainerStyle}`}
          style={{
            backgroundColor: currentStyle.bgColor,
          }}
        >
          {/* SVG Vector Star Map Rendering */}
          <svg
            viewBox={`0 0 ${vbWidth} ${vbHeight}`}
            className="w-full h-full select-none"
          >
            <defs>
              {/* Circular Clip Mask */}
              <clipPath id="circle-clip-mask">
                <circle cx={cx} cy={cy} r={radius} />
              </clipPath>

              {/* Heart Clip Mask */}
              <clipPath id="heart-clip-mask">
                <path d={heartPathData} />
              </clipPath>

              {/* Curved Text Arc Path for Style 9 */}
              <path id="curved-text-arc" d={curvedArcPath} fill="none" />

              {/* Teal Watercolor / Radial Texture Gradient */}
              <radialGradient
                id="teal-watercolor-gradient"
                cx="50%"
                cy="50%"
                r="50%"
                fx="45%"
                fy="45%"
              >
                <stop offset="0%" stopColor="#1B8296" stopOpacity="1" />
                <stop offset="35%" stopColor="#136F78" stopOpacity="1" />
                <stop offset="70%" stopColor="#0B4F5E" stopOpacity="1" />
                <stop offset="100%" stopColor="#06252C" stopOpacity="1" />
              </radialGradient>

              {/* Stardust nebula glow */}
              <radialGradient id="celestial-nebula-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
                <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              {/* Star glow filter */}
              <filter id="star-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Poster Background */}
            <rect width={vbWidth} height={vbHeight} fill={currentStyle.bgColor} />

            {/* Matted Gallery Passepartout Border (if enabled) */}
            {config.showMattedBorder && (
              <>
                {/* White outer mat frame */}
                <rect x="0" y="0" width={vbWidth} height={matMargin} fill="#FFFFFF" />
                <rect x="0" y={vbHeight - matMargin} width={vbWidth} height={matMargin} fill="#FFFFFF" />
                <rect x="0" y="0" width={matMargin} height={vbHeight} fill="#FFFFFF" />
                <rect x={vbWidth - matMargin} y="0" width={matMargin} height={vbHeight} fill="#FFFFFF" />

                {/* Fine interior keyline */}
                <rect
                  x={matMargin}
                  y={matMargin}
                  width={vbWidth - 2 * matMargin}
                  height={vbHeight - 2 * matMargin}
                  fill="none"
                  stroke="#CCCCCC"
                  strokeWidth="0.75"
                />
              </>
            )}

            {/* The "Framed" Layout: Delicate built-in passe-partout keyline */}
            {isFramedLayout && !config.showMattedBorder && (
              <rect
                x={frameMargin}
                y={frameMargin}
                width={vbWidth - 2 * frameMargin}
                height={vbHeight - 2 * frameMargin}
                fill="none"
                stroke={currentStyle.subtitleColor}
                strokeWidth={0.85 * scaleFactor}
                strokeOpacity={0.4}
              />
            )}

            {/* Mask Group: Renders celestial contents clipped to shape */}
            <g
              clipPath={
                isHeart
                  ? 'url(#heart-clip-mask)'
                  : 'url(#circle-clip-mask)'
              }
            >
              {/* Map background fill inside mask */}
              <rect
                x={cx - radius - 50}
                y={cy - radius - 50}
                width={(radius + 50) * 2}
                height={(radius + 50) * 2}
                fill={
                  currentStyle.isWatercolor
                    ? 'url(#teal-watercolor-gradient)'
                    : currentStyle.mapBgColor
                }
              />

              {/* Watercolor texture image overlay if watercolor style */}
              {currentStyle.isWatercolor && (
                <image
                  href="/textures/teal_watercolor.png"
                  x={cx - radius * 1.15}
                  y={cy - radius * 1.15}
                  width={radius * 2.3}
                  height={radius * 2.3}
                  preserveAspectRatio="xMidYMid slice"
                />
              )}

              {/* Milky Way Soft Luminous Nebula Ellipses */}
              {config.showMilkyWay && !currentStyle.isWatercolor && !currentStyle.constellationsOnly && (
                <g opacity="0.85">
                  <ellipse
                    cx={cx - 15}
                    cy={cy - 10}
                    rx={radius * 0.75}
                    ry={radius * 0.45}
                    fill="rgba(255,255,255,0.08)"
                    transform={`rotate(-25 ${cx - 15} ${cy - 10})`}
                  />
                  <ellipse
                    cx={cx + 10}
                    cy={cy + 15}
                    rx={radius * 0.6}
                    ry={radius * 0.3}
                    fill="rgba(255,255,255,0.05)"
                    transform={`rotate(-32 ${cx + 10} ${cy + 15})`}
                  />
                </g>
              )}

              {/* Milky Way Stardust Nebula Overlay (if enabled) */}
              {config.showMilkyWay && !currentStyle.isWatercolor && !currentStyle.constellationsOnly && (
                <image
                  href="/textures/milky_way.png"
                  x={cx - radius * 1.05}
                  y={cy - radius * 1.05}
                  width={radius * 2.1}
                  height={radius * 2.1}
                  preserveAspectRatio="xMidYMid slice"
                  opacity={0.88}
                />
              )}

              {/* Stardust nebula glow */}
              <circle cx={cx} cy={cy} r={radius} fill="url(#celestial-nebula-glow)" />

              {/* Delicate Celestial Grid: Altitude Circles, Equator, Meridian & Prime Vertical Axes */}
              {config.showCelestialGrid && (
                <g>
                  {/* 30° Altitude Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius * 0.66}
                    fill="none"
                    stroke={currentStyle.ringColor}
                    strokeWidth="0.5"
                    strokeDasharray="2 3"
                    opacity={0.65}
                  />
                  {/* 60° Altitude Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius * 0.33}
                    fill="none"
                    stroke={currentStyle.ringColor}
                    strokeWidth="0.5"
                    strokeDasharray="2 3"
                    opacity={0.5}
                  />
                  {/* Celestial Equator */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius * 0.78}
                    fill="none"
                    stroke={currentStyle.ringColor}
                    strokeWidth="0.65"
                    strokeDasharray="4 3"
                    opacity={0.7}
                  />
                  {/* North-South Meridian Line */}
                  <line
                    x1={cx}
                    y1={cy - radius}
                    x2={cx}
                    y2={cy + radius}
                    stroke={currentStyle.ringColor}
                    strokeWidth="0.5"
                    strokeDasharray="2 3"
                    opacity={0.45}
                  />
                  {/* East-West Prime Vertical Line */}
                  <line
                    x1={cx - radius}
                    y1={cy}
                    x2={cx + radius}
                    y2={cy}
                    stroke={currentStyle.ringColor}
                    strokeWidth="0.5"
                    strokeDasharray="2 3"
                    opacity={0.45}
                  />
                  {/* Zenith Crosshair */}
                  <line
                    x1={cx - 8}
                    y1={cy}
                    x2={cx + 8}
                    y2={cy}
                    stroke={currentStyle.ringColor}
                    strokeWidth="0.85"
                  />
                  <line
                    x1={cx}
                    y1={cy - 8}
                    x2={cx}
                    y2={cy + 8}
                    stroke={currentStyle.ringColor}
                    strokeWidth="0.85"
                  />
                </g>
              )}

              {/* Constellation Lines */}
              {config.showConstellationLines &&
                activeLines.map((line, idx) => {
                  const x1 = cx + line.x1 * radius;
                  const y1 = cy - line.y1 * radius;
                  const x2 = cx + line.x2 * radius;
                  const y2 = cy - line.y2 * radius;

                  return (
                    <line
                      key={idx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={currentStyle.constellationColor}
                      strokeWidth={currentStyle.constellationsOnly ? 1.6 : 0.85}
                      strokeLinecap="round"
                    />
                  );
                })}

              {/* Stars rendering */}
              {currentStyle.constellationsOnly
                ? // Style 10: Only constellation vertex stars
                  activeStars.map((s, idx) => {
                    const sx = cx + s.x * radius;
                    const sy = cy - s.y * radius;
                    const r = Math.max(1.5, (s.size || 1.8) * 0.95);
                    return (
                      <circle
                        key={idx}
                        cx={sx}
                        cy={sy}
                        r={r}
                        fill={currentStyle.starColor}
                        filter="url(#star-glow)"
                      />
                    );
                  })
                : // All visible stars
                  activeStars.map((s, idx) => {
                    const sx = cx + s.x * radius;
                    const sy = cy - s.y * radius;
                    const r = Math.max(0.6, (s.size || 1.0) * 0.85);
                    const isBright = (s.mag ?? 3) < 2.0;
                    return (
                      <circle
                        key={idx}
                        cx={sx}
                        cy={sy}
                        r={r}
                        fill={currentStyle.starColor}
                        opacity={(s.mag ?? 3) < 3.5 ? 1.0 : 0.85}
                        filter={isBright ? 'url(#star-glow)' : undefined}
                      />
                    );
                  })}
            </g>

            {/* Mask Boundary Outline & Celestial Compass Dial */}
            {isHeart ? (
              <>
                <path
                  d={heartPathData}
                  fill="none"
                  stroke={currentStyle.borderColor}
                  strokeWidth="1.6"
                />
                <path
                  d={outerHeartPathData}
                  fill="none"
                  stroke={currentStyle.ringColor}
                  strokeWidth="0.8"
                />
              </>
            ) : (
              <>
                {/* Primary Circle Outline */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={currentStyle.borderColor}
                  strokeWidth="1.6"
                />

                {/* Celestial Compass Dial (Double Ring, Degree Ticks, Cardinals) */}
                {config.showCelestialGrid && !currentStyle.curvedText && (
                  <g>
                    {/* Outer Concentric Ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 7}
                      fill="none"
                      stroke={currentStyle.ringColor}
                      strokeWidth="0.8"
                    />

                    {/* Degree Ticks */}
                    {degreeTicks.map((t) => (
                      <line
                        key={t.key}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        stroke={currentStyle.ringColor}
                        strokeWidth={t.isMajor ? 1.0 : 0.6}
                      />
                    ))}

                    {/* Cardinal Points (N, S, E, W) */}
                    <text
                      x={cx}
                      y={cy - radius - 12}
                      textAnchor="middle"
                      fill={currentStyle.textColor}
                      fontSize="9"
                      fontWeight="600"
                      fontFamily={`'${config.coordsBlock?.font || 'Montserrat'}', sans-serif`}
                    >
                      N
                    </text>
                    <text
                      x={cx}
                      y={cy + radius + 19}
                      textAnchor="middle"
                      fill={currentStyle.textColor}
                      fontSize="9"
                      fontWeight="600"
                      fontFamily={`'${config.coordsBlock?.font || 'Montserrat'}', sans-serif`}
                    >
                      S
                    </text>
                    <text
                      x={cx - radius - 15}
                      y={cy + 3.5}
                      textAnchor="middle"
                      fill={currentStyle.textColor}
                      fontSize="9"
                      fontWeight="600"
                      fontFamily={`'${config.coordsBlock?.font || 'Montserrat'}', sans-serif`}
                    >
                      E
                    </text>
                    <text
                      x={cx + radius + 15}
                      y={cy + 3.5}
                      textAnchor="middle"
                      fill={currentStyle.textColor}
                      fontSize="9"
                      fontWeight="600"
                      fontFamily={`'${config.coordsBlock?.font || 'Montserrat'}', sans-serif`}
                    >
                      W
                    </text>
                  </g>
                )}
              </>
            )}

            {/* The "Moon Phases" Layout: 7 Lunar Phases Divider */}
            {isMoonPhasesLayout && typographyLayout.moonPhasesY > 0 && (
              <MoonPhasesDivider
                cx={cx}
                cy={typographyLayout.moonPhasesY}
                color={currentStyle.subtitleColor}
                scaleFactor={scaleFactor}
              />
            )}

            {/* Typography Section with Independent Block Controls */}
            {isCurvedLayout ? (
              /* Curved Main Title Layout */
              <>
                {config.titleBlock?.enabled && config.titleBlock.text && (
                  <text
                    fill={currentStyle.textColor}
                    fontSize={config.titleBlock.size * 0.74 * scaleFactor}
                    fontWeight="600"
                    letterSpacing={`${config.titleBlock.tracking || 3}px`}
                    fontFamily={`'${config.titleBlock.font}', serif`}
                  >
                    <textPath
                      href="#curved-text-arc"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {config.titleBlock.uppercase
                        ? config.titleBlock.text.toUpperCase()
                        : config.titleBlock.text}
                    </textPath>
                  </text>
                )}

                {/* Names / Subtitle */}
                {config.namesBlock?.enabled && config.namesBlock.text && (
                  <text
                    x={cx}
                    y={typographyLayout.namesY}
                    textAnchor="middle"
                    fill={currentStyle.subtitleColor}
                    fontSize={config.namesBlock.size * 0.85 * scaleFactor}
                    fontWeight={config.namesBlock.font === 'Great Vibes' ? '400' : '500'}
                    fontStyle={config.namesBlock.italic ? 'italic' : 'normal'}
                    letterSpacing={`${config.namesBlock.tracking || 1}px`}
                    fontFamily={`'${config.namesBlock.font}', cursive, serif`}
                  >
                    {config.namesBlock.uppercase
                      ? config.namesBlock.text.toUpperCase()
                      : config.namesBlock.text}
                  </text>
                )}
              </>
            ) : (
              /* Standard Typography Layout */
              <>
                {/* 1. Main Title */}
                {config.titleBlock?.enabled && config.titleBlock.text && (
                  <text
                    x={cx}
                    y={typographyLayout.titleY}
                    textAnchor="middle"
                    fill={currentStyle.textColor}
                    fontSize={config.titleBlock.size * 0.78 * scaleFactor}
                    fontWeight="600"
                    letterSpacing={`${config.titleBlock.tracking || 2.5}px`}
                    fontFamily={`'${config.titleBlock.font}', serif`}
                  >
                    {config.titleBlock.uppercase
                      ? config.titleBlock.text.toUpperCase()
                      : config.titleBlock.text}
                  </text>
                )}

                {/* 2. Names / Couple Calligraphy */}
                {config.namesBlock?.enabled && config.namesBlock.text && (
                  <text
                    x={cx}
                    y={typographyLayout.namesY}
                    textAnchor="middle"
                    fill={currentStyle.subtitleColor}
                    fontSize={config.namesBlock.size * 0.85 * scaleFactor}
                    fontWeight={config.namesBlock.font === 'Great Vibes' ? '400' : '500'}
                    fontStyle={config.namesBlock.italic ? 'italic' : 'normal'}
                    letterSpacing={`${config.namesBlock.tracking || 1}px`}
                    fontFamily={`'${config.namesBlock.font}', cursive, serif`}
                  >
                    {(() => {
                      let t = config.namesBlock.uppercase
                        ? config.namesBlock.text.toUpperCase()
                        : config.namesBlock.text;
                      if (config.namesBlock.font === 'Great Vibes' && t.includes(' & ')) {
                        return t.replace(' & ', '   &   ');
                      }
                      return t;
                    })()}
                  </text>
                )}
              </>
            )}

            {/* 4. Decorative Divider Ornament */}
            {config.dividerStyle !== 'none' && typographyLayout.dividerY > 0 && (() => {
              const divSize = config.dividerSize || 18;
              const divScale = divSize / 18;
              const divHalfW = 55 * divScale;
              const innerGap = (config.dividerStyle === 'dot' ? 8 : 10) * divScale;
              const strokeW = Math.max(0.5, 0.75 * divScale);
              const y = typographyLayout.dividerY;

              return (
                <g>
                  {config.dividerStyle === 'diamond' && (
                    <>
                      <line
                        x1={cx - divHalfW}
                        y1={y}
                        x2={cx - innerGap}
                        y2={y}
                        stroke={currentStyle.subtitleColor}
                        strokeWidth={strokeW}
                        strokeOpacity="0.6"
                      />
                      <line
                        x1={cx + innerGap}
                        y1={y}
                        x2={cx + divHalfW}
                        y2={y}
                        stroke={currentStyle.subtitleColor}
                        strokeWidth={strokeW}
                        strokeOpacity="0.6"
                      />
                      <polygon
                        points={`${cx},${y - 3.5 * divScale} ${cx + 3.5 * divScale},${y} ${cx},${y + 3.5 * divScale} ${cx - 3.5 * divScale},${y}`}
                        fill={currentStyle.subtitleColor}
                      />
                    </>
                  )}

                  {config.dividerStyle === 'star' && (
                    <>
                      <line
                        x1={cx - divHalfW}
                        y1={y}
                        x2={cx - innerGap}
                        y2={y}
                        stroke={currentStyle.subtitleColor}
                        strokeWidth={strokeW}
                        strokeOpacity="0.6"
                      />
                      <line
                        x1={cx + innerGap}
                        y1={y}
                        x2={cx + divHalfW}
                        y2={y}
                        stroke={currentStyle.subtitleColor}
                        strokeWidth={strokeW}
                        strokeOpacity="0.6"
                      />
                      <text
                        x={cx}
                        y={y + 3.5 * divScale}
                        textAnchor="middle"
                        fill={currentStyle.subtitleColor}
                        fontSize={9 * divScale}
                      >
                        ✦
                      </text>
                    </>
                  )}

                  {config.dividerStyle === 'heart' && (
                    <>
                      <line
                        x1={cx - divHalfW}
                        y1={y}
                        x2={cx - innerGap}
                        y2={y}
                        stroke={currentStyle.subtitleColor}
                        strokeWidth={strokeW}
                        strokeOpacity="0.6"
                      />
                      <line
                        x1={cx + innerGap}
                        y1={y}
                        x2={cx + divHalfW}
                        y2={y}
                        stroke={currentStyle.subtitleColor}
                        strokeWidth={strokeW}
                        strokeOpacity="0.6"
                      />
                      <path
                        d={`M ${cx} ${y + 3 * divScale}
                           C ${cx - 4.5 * divScale} ${y - 2.5 * divScale}, ${cx - 4.5 * divScale} ${y - 5.5 * divScale}, ${cx} ${y - 2 * divScale}
                           C ${cx + 4.5 * divScale} ${y - 5.5 * divScale}, ${cx + 4.5 * divScale} ${y - 2.5 * divScale}, ${cx} ${y + 3 * divScale} Z`}
                        fill={currentStyle.subtitleColor}
                      />
                    </>
                  )}

                  {config.dividerStyle === 'dot' && (
                    <>
                      <line
                        x1={cx - divHalfW}
                        y1={y}
                        x2={cx - innerGap}
                        y2={y}
                        stroke={currentStyle.subtitleColor}
                        strokeWidth={strokeW}
                        strokeOpacity="0.6"
                      />
                      <line
                        x1={cx + innerGap}
                        y1={y}
                        x2={cx + divHalfW}
                        y2={y}
                        stroke={currentStyle.subtitleColor}
                        strokeWidth={strokeW}
                        strokeOpacity="0.6"
                      />
                      <circle cx={cx} cy={y} r={2 * divScale} fill={currentStyle.subtitleColor} />
                    </>
                  )}

                  {config.dividerStyle === 'line' && (
                    <line
                      x1={cx - divHalfW}
                      y1={y}
                      x2={cx + divHalfW}
                      y2={y}
                      stroke={currentStyle.subtitleColor}
                      strokeWidth={strokeW}
                      strokeOpacity="0.6"
                    />
                  )}
                </g>
              );
            })()}

            {/* 5. Significant Date */}
            {config.dateBlock?.enabled && config.dateBlock.text && typographyLayout.dateY > 0 && (
              <text
                x={cx}
                y={typographyLayout.dateY}
                textAnchor="middle"
                fill={currentStyle.footerColor}
                fontSize={config.dateBlock.size * 0.85 * scaleFactor}
                fontWeight="400"
                letterSpacing={`${config.dateBlock.tracking || 2}px`}
                fontFamily={`'${config.dateBlock.font}', sans-serif`}
              >
                {config.dateBlock.uppercase
                  ? config.dateBlock.text.toUpperCase()
                  : config.dateBlock.text}
              </text>
            )}

            {/* 6. Location & Coordinates Text */}
            {combinedLocationText && typographyLayout.locY > 0 && (
              <text
                x={cx}
                y={typographyLayout.locY}
                textAnchor="middle"
                fill={currentStyle.footerColor}
                fontSize={config.coordsBlock.size * 0.85 * scaleFactor}
                fontWeight="400"
                letterSpacing={`${config.coordsBlock.tracking || 1.8}px`}
                fontFamily={`'${config.coordsBlock.font}', sans-serif`}
              >
                {combinedLocationText}
              </text>
            )}
          </svg>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[2px] flex items-center justify-center transition-opacity">
              <div className="bg-[#FAF8F5]/95 border border-[#E2DDD5] px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-[#1C1917]">
                <Loader2 className="w-4 h-4 animate-spin text-[#1C1917]" />
                <span className="text-xs font-serif font-medium tracking-wide">Plotting NASA Celestial Positions...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
