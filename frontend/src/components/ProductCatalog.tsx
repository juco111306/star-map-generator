'use client';

import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { DESIGN_STYLES, getLocalizedStyleDetails } from '../constants/styles';
import {
  SAMPLE_STARS,
  SAMPLE_CONSTELLATION_LINES,
} from '../constants/sampleCelestialData';
import { MysticalMilkyWay } from './MysticalMilkyWay';
import { useLanguage } from '../context/LanguageContext';
import { FrameStyle } from '../types';

interface ProductCatalogProps {
  onCustomizeStarMap: () => void;
  onSelectStyle?: (styleId: string) => void;
  onSelectEdition?: (frameStyle: FrameStyle) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onCustomizeStarMap,
  onSelectStyle,
  onSelectEdition,
}) => {
  const { locale, t, currencySymbol, formatPrice } = useLanguage();

  const currentStyles = getLocalizedStyleDetails(locale);

  const handleCardClick = (styleId: string) => {
    if (onSelectStyle) {
      onSelectStyle(styleId);
    } else {
      onCustomizeStarMap();
    }
  };

  // Helper to render authentic starfield inside poster sphere with rotation for distinct astronomical sky per style
  const renderCelestialSky = (
    maskId: string,
    bgFill: string,
    starColor: string,
    lineColor: string,
    radius: number = 400,
    rotationDeg: number = 0,
    nebula?: React.ReactNode
  ) => {
    const rad = (rotationDeg * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    return (
      <>
        <defs>
          <clipPath id={maskId}>
            <circle cx="500" cy="480" r={radius - 1} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${maskId})`}>
          <circle cx="500" cy="480" r={radius} fill={bgFill} />
          {nebula}
          {SAMPLE_CONSTELLATION_LINES.map((line, idx) => {
            const x1r = line.x1 * cosR - line.y1 * sinR;
            const y1r = line.x1 * sinR + line.y1 * cosR;
            const x2r = line.x2 * cosR - line.y2 * sinR;
            const y2r = line.x2 * sinR + line.y2 * cosR;
            return (
              <line
                key={idx}
                x1={500 + x1r * radius}
                y1={480 - y1r * radius}
                x2={500 + x2r * radius}
                y2={480 - y2r * radius}
                stroke={lineColor}
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            );
          })}
          {SAMPLE_STARS.map((s, idx) => {
            const xr = s.x * cosR - s.y * sinR;
            const yr = s.x * sinR + s.y * cosR;
            return (
              <circle
                key={idx}
                cx={500 + xr * radius}
                cy={480 - yr * radius}
                r={s.r}
                fill={starColor}
                opacity={s.bright ? 1.0 : 0.85}
              />
            );
          })}
        </g>
      </>
    );
  };

  // Render the exact, authentic miniature vector poster for each style matching studio proportions
  // Each card showcases a unique milestone, distinctive constellation sky, names, and Dutch/Belgian location
  const renderExactPosterSVG = (styleId: string) => {
    switch (styleId) {
      case 'midnight_classic':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* Background */}
            <rect width="1000" height="1400" fill="#0B132B" />

            {/* Dense Authentic Celestial Starfield (Summer Triangle / Cygnus Sky - 0° orientation) */}
            {renderCelestialSky(
              'cat-sky-midnight',
              '#070D1F',
              '#FFFFFF',
              'rgba(255,255,255,0.42)',
              400,
              0,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-28} idPrefix="cat-mw-midnight" opacity={0.55} />
            )}

            {/* Celestial Circle & Compass */}
            <circle cx="500" cy="480" r="400" fill="none" stroke="rgba(255, 255, 255, 0.48)" strokeWidth="3" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255, 255, 255, 0.24)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="480" r="275" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

            {/* Cardinal Degree Ticks */}
            <line x1="500" y1="72" x2="500" y2="92" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="500" y1="868" x2="500" y2="888" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="92" y1="480" x2="112" y2="480" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="888" y1="480" x2="908" y2="480" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />

            <text x="500" y="60" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.n}</text>
            <text x="500" y="915" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.s}</text>
            <text x="75" y="487" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.w}</text>
            <text x="925" y="487" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.e}</text>

            {/* Example 1: Romantic First Meeting */}
            <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {t.catalog.posters.midnight.title}
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {t.catalog.posters.midnight.names}
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {t.catalog.posters.midnight.date}
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {t.catalog.posters.midnight.location} • {t.catalog.posters.midnight.coords}
            </text>
          </svg>
        );

      case 'teal_watercolor':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="cat-teal-nebula-hq" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1E889B" />
                <stop offset="45%" stopColor="#0E5866" />
                <stop offset="85%" stopColor="#083B44" />
                <stop offset="100%" stopColor="#05252B" />
              </radialGradient>
            </defs>

            {/* Matted Gallery Light Linen Background */}
            <rect width="1000" height="1400" fill="#F5F7F6" />

            {/* Swirling Teal Watercolor Celestial Disk (Spring Sky / Ursa Major - 95° orientation) */}
            {renderCelestialSky(
              'cat-sky-teal',
              'url(#cat-teal-nebula-hq)',
              '#FFFFFF',
              'rgba(255,255,255,0.55)',
              400,
              95,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-20} idPrefix="cat-mw-teal" isWatercolor={true} opacity={0.50} />
            )}

            <circle cx="500" cy="480" r="400" fill="none" stroke="#0C4B56" strokeWidth="3.5" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="8 6" />

            {/* Example 2: Birth of a Child */}
            <text x="500" y="955" textAnchor="middle" fill="#083B44" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {t.catalog.posters.teal.title}
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#1A5A66" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {t.catalog.posters.teal.names}
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#0C4B56" fontSize="22">✧</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#1A5A66" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {t.catalog.posters.teal.date}
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#3B7580" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {t.catalog.posters.teal.location} • {t.catalog.posters.teal.coords}
            </text>
          </svg>
        );

      case 'emerald_night':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* British Racing Green Background */}
            <rect width="1000" height="1400" fill="#081C15" />

            {/* Inner Forest Sphere with Gold Stars (Autumn Sky / Cassiopeia & Pegasus - 190° orientation) */}
            {renderCelestialSky(
              'cat-sky-emerald',
              '#04110C',
              '#D4AF37',
              'rgba(212,175,55,0.48)',
              400,
              190,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-15} idPrefix="cat-mw-emerald" opacity={0.50} />
            )}

            <circle cx="500" cy="480" r="400" fill="none" stroke="#D4AF37" strokeWidth="3.5" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="480" r="275" fill="none" stroke="rgba(212,175,55,0.22)" strokeWidth="1" />

            {/* Cardinal Ticks */}
            <line x1="500" y1="72" x2="500" y2="92" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="500" y1="868" x2="500" y2="888" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="92" y1="480" x2="112" y2="480" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="888" y1="480" x2="908" y2="480" stroke="#D4AF37" strokeWidth="2.5" />

            <text x="500" y="60" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.n}</text>
            <text x="500" y="915" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.s}</text>
            <text x="75" y="487" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.w}</text>
            <text x="925" y="487" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.e}</text>

            {/* Example 3: Wedding Day */}
            <text x="500" y="955" textAnchor="middle" fill="#D4AF37" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {t.catalog.posters.emerald.title}
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#F3E5AB" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {t.catalog.posters.emerald.names}
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#D4AF37" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#F3E5AB" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {t.catalog.posters.emerald.date}
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#C9B06B" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {t.catalog.posters.emerald.location} • {t.catalog.posters.emerald.coords}
            </text>
          </svg>
        );

      case 'burgundy_sky':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* Velvet Wine Red Background */}
            <rect width="1000" height="1400" fill="#38070E" />

            {/* Deep Bordeaux Celestial Disk (Winter Sky / Orion & Sirius - 280° orientation) */}
            {renderCelestialSky(
              'cat-sky-burgundy',
              '#240308',
              '#FFFFFF',
              'rgba(255,235,238,0.45)',
              400,
              280,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-35} idPrefix="cat-mw-burgundy" opacity={0.55} />
            )}

            <circle cx="500" cy="480" r="400" fill="none" stroke="rgba(255,235,238,0.45)" strokeWidth="3" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255,235,238,0.25)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="480" r="275" fill="none" stroke="rgba(255,235,238,0.15)" strokeWidth="1" />

            {/* Example 4: Anniversary / Under The Same Stars */}
            <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {t.catalog.posters.burgundy.title}
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#F7D6DA" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {t.catalog.posters.burgundy.names}
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
              <path
                d="M 500 1096 C 493 1088 486 1081 491 1075 C 495 1071 499 1074 500 1077 C 501 1074 505 1071 509 1075 C 514 1081 507 1088 500 1096 Z"
                fill="#F7D6DA"
              />
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#F7D6DA" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {t.catalog.posters.burgundy.date}
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#D6A6AD" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {t.catalog.posters.burgundy.location} • {t.catalog.posters.burgundy.coords}
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <section id="stijlen" className="py-16 sm:py-24 bg-[#F7F4EE] border-t border-[#EAE5DC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE9DF] border border-[#E0D7C9] text-[#78716C] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
            <span>{t.catalog.artStylesBadge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            {t.catalog.artStylesTitle}
          </h2>
          <p className="text-[#57534E] text-sm sm:text-base font-light leading-relaxed">
            {t.catalog.artStylesDesc}
          </p>
        </div>

        {/* 4 Flagship Art Styles - Compact 2x2 grid on mobile, 4 balanced columns on desktop (lg:grid-cols-4) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {DESIGN_STYLES.map((style) => {
            const meta = currentStyles[style.id] || {
              title: style.name,
              subtitle: style.subtitle,
              desc: style.description,
              tag: 'STIJL',
            };

            return (
              <div
                key={style.id}
                onClick={() => handleCardClick(style.id)}
                className="group bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-[#E2DDD5] shadow-[0_8px_25px_rgba(28,25,23,0.04)] hover:shadow-[0_18px_40px_rgba(28,25,23,0.12)] hover:border-[#C8BFB0] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2 sm:space-y-3.5">
                  {/* Clean Flush Poster Art - No Passepartout */}
                  <div className="relative aspect-[300/420] rounded-none overflow-hidden shadow-[0_12px_28px_-6px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* Badge */}
                    <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 px-1.5 py-0.5 sm:px-2 rounded-none text-[7px] sm:text-[8.5px] font-bold tracking-wider uppercase bg-white/95 text-[#1C1917] shadow-xs border border-black/10">
                      {meta.tag}
                    </span>

                    {/* The Exact Vector Poster Art - Edge to Edge */}
                    <div className="w-full h-full">
                      {renderExactPosterSVG(style.id)}
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-0.5 sm:space-y-1 pt-0.5 px-0.5 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <h3 className="font-serif text-xs sm:text-base font-bold text-[#1C1917] truncate min-w-0">
                        {meta.title}
                      </h3>
                      <div className="text-right shrink-0 whitespace-nowrap ml-1">
                        <span className="hidden sm:inline text-[10px] text-[#A8A29E] line-through mr-1">{currencySymbol}19</span>
                        <span className="text-[11px] sm:text-xs font-bold text-emerald-800">{t.catalog.digital.pricePrefix} {locale === 'de' ? 'Kostenlos' : locale === 'en' ? 'FREE' : 'Gratis'}</span>
                      </div>
                    </div>
                    <p className="text-[9.5px] sm:text-[10.5px] font-semibold text-[#A37055] truncate">
                      {meta.subtitle}
                    </p>
                    <p className="hidden sm:block text-[11px] text-[#78716C] font-light leading-snug line-clamp-2">
                      {meta.desc}
                    </p>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-2 sm:pt-3.5 mt-2 sm:mt-3 border-t border-[#F2ECE1] flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#1C1917] group-hover:text-[#A37055] transition-colors">
                  <span className="truncate mr-1">{t.catalog.digital.cta}</span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FAF8F5] group-hover:bg-[#1C1917] group-hover:text-white flex items-center justify-center transition-all shadow-2xs shrink-0">
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editions & Formats Showcase */}
        <div className="space-y-8 pt-6">
          <div className="text-center max-w-xl mx-auto space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-[#EFE9DF] border border-[#E0D7C9] text-[#78716C] text-[11px] font-medium">
              <Sparkles className="w-3 h-3 text-[#A37055]" />
              <span>{t.catalog.badge}</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917]">
              {t.catalog.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C] font-light">
              {locale === 'de'
                ? 'Wählen Sie zwischen unserer kostenlosen Pilot-Digitaldatei für Reddit-Tester oder hochwertigen physischen Drucken.'
                : locale === 'en'
                ? 'Choose between our 100% free pilot digital edition for Reddit testers or artisan physical prints.'
                : 'Kies tussen onze 100% gratis pilot digitale editie voor Reddit-testers of ambachtelijke fysieke prints.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Edition 1: 300 DPI Digital Vector PDF (Featured 100% Free Pilot Tier) */}
            <div className="relative rounded-3xl p-6 sm:p-7 bg-white border-2 border-emerald-500 shadow-[0_12px_35px_rgba(16,185,129,0.12)] flex flex-col justify-between space-y-5 ring-4 ring-emerald-500/10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {t.catalog.digital.badge}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{locale === 'de' ? 'Sofort' : locale === 'en' ? 'Instant' : 'Direct'}</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                    {t.catalog.digital.title}
                  </h4>
                  <p className="text-xs text-[#78716C] mt-0.5 font-light">
                    {t.catalog.digital.subtitle}
                  </p>
                </div>

                <div className="py-2.5 px-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-baseline gap-2">
                  <span className="text-xs text-[#78716C] line-through">{formatPrice(19)}</span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800">
                    {formatPrice(0)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    ({locale === 'de' ? '100% Kostenlos • Pilot' : locale === 'en' ? '100% Free • Pilot' : '100% Gratis • Pilot'})
                  </span>
                </div>

                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  {t.catalog.digital.description}
                </p>

                <ul className="space-y-2 pt-1">
                  {t.catalog.digital.features.map((feat, i) => (
                    <li key={i} className="text-[11.5px] text-[#44403C] flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSelectEdition) onSelectEdition('digital');
                  else onCustomizeStarMap();
                }}
                className="w-full py-3.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.catalog.digital.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Edition 2: Museum Fine-Art Poster */}
            <div className="relative rounded-3xl p-6 sm:p-7 bg-white border border-[#E2DDD5] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#C8BFB0] transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    {locale === 'de' ? '⏳ Bald Verfügbar' : locale === 'en' ? '⏳ Coming Soon' : '⏳ Binnenkort Beschikbaar'}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                    {t.catalog.poster.title}
                  </h4>
                  <p className="text-xs text-[#78716C] mt-0.5 font-light">
                    {t.catalog.poster.subtitle}
                  </p>
                </div>

                <div className="py-2.5 px-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex items-baseline gap-2">
                  <span className="text-xs text-[#78716C]">{t.catalog.poster.pricePrefix}</span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                    {formatPrice(39)}
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    ({t.common.vatIncluded})
                  </span>
                </div>

                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  {t.catalog.poster.description}
                </p>

                <ul className="space-y-2 pt-1">
                  {t.catalog.poster.features.map((feat, i) => (
                    <li key={i} className="text-[11.5px] text-[#44403C] flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A37055] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSelectEdition) onSelectEdition('digital');
                  else onCustomizeStarMap();
                }}
                className="w-full py-3.5 px-4 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {locale === 'de'
                    ? '⏳ Bald Verfügbar (Gratis PDF wählen)'
                    : locale === 'en'
                    ? '⏳ Coming Soon (Choose Free PDF)'
                    : '⏳ Binnenkort (Kies Gratis PDF)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Edition 3: Framed Heirloom Print */}
            <div className="relative rounded-3xl p-6 sm:p-7 bg-white border border-[#E2DDD5] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#C8BFB0] transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    {locale === 'de' ? '⏳ Bald Verfügbar' : locale === 'en' ? '⏳ Coming Soon' : '⏳ Binnenkort Beschikbaar'}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                    {t.catalog.framed.title}
                  </h4>
                  <p className="text-xs text-[#78716C] mt-0.5 font-light">
                    {t.catalog.framed.subtitle}
                  </p>
                </div>

                <div className="py-2.5 px-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex items-baseline gap-2">
                  <span className="text-xs text-[#78716C]">{t.catalog.framed.pricePrefix}</span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                    {formatPrice(79)}
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    ({t.common.vatIncluded})
                  </span>
                </div>

                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  {t.catalog.framed.description}
                </p>

                <ul className="space-y-2 pt-1">
                  {t.catalog.framed.features.map((feat, i) => (
                    <li key={i} className="text-[11.5px] text-[#44403C] flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A37055] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSelectEdition) onSelectEdition('digital');
                  else onCustomizeStarMap();
                }}
                className="w-full py-3.5 px-4 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {locale === 'de'
                    ? '⏳ Bald Verfügbar (Gratis PDF wählen)'
                    : locale === 'en'
                    ? '⏳ Coming Soon (Choose Free PDF)'
                    : '⏳ Binnenkort (Kies Gratis PDF)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quality & Trust Banner */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2DDD5] shadow-xs flex flex-wrap items-center justify-around gap-4 text-xs text-[#57534E]">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>{t.catalog.trustPoint1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>{t.catalog.trustPoint2}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>{t.catalog.trustPoint3}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>{t.catalog.trustPoint4}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
