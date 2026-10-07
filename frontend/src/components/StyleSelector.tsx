'use client';

import React from 'react';
import { DESIGN_STYLES, getLocalizedStyleDetails } from '../constants/styles';
import { Check } from 'lucide-react';
import {
  SAMPLE_STARS,
  SAMPLE_CONSTELLATION_LINES,
} from '../constants/sampleCelestialData';
import { MysticalMilkyWay } from './MysticalMilkyWay';
import { useLanguage } from '../context/LanguageContext';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onSelectStyle,
}) => {
  const { locale, t } = useLanguage();
  const currentStyles = getLocalizedStyleDetails(locale);
  // Helper to render authentic celestial sphere with distinct rotation per style
  const renderPosterSky = (
    maskId: string,
    bgFill: string,
    starColor: string,
    lineColor: string,
    radius: number = 390,
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
            <circle cx="500" cy="460" r={radius - 1} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${maskId})`}>
          <circle cx="500" cy="460" r={radius} fill={bgFill} />
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
                y1={460 - y1r * radius}
                x2={500 + x2r * radius}
                y2={460 - y2r * radius}
                stroke={lineColor}
                strokeWidth="1.2"
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
                cy={460 - yr * radius}
                r={s.r * 1.25}
                fill={starColor}
                opacity={s.bright ? 1.0 : 0.85}
              />
            );
          })}
        </g>
      </>
    );
  };

  // Render a real, complete miniature poster with unique stars, times, locations, and names
  const renderPosterSVG = (styleId: string) => {
    switch (styleId) {
      case 'midnight_classic':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="1400" fill="#0B132B" />

            {/* Summer Triangle Sky over Amsterdam */}
            {renderPosterSky(
              'sel-sky-midnight',
              '#070D1F',
              '#FFFFFF',
              'rgba(255,255,255,0.45)',
              390,
              0,
              <MysticalMilkyWay cx={500} cy={460} radius={390} rotation={-28} idPrefix="sel-mw-midnight" opacity={0.55} />
            )}

            {/* Celestial Rings & Cardinal Ticks */}
            <circle cx="500" cy="460" r="390" fill="none" stroke="rgba(255, 255, 255, 0.48)" strokeWidth="3" />
            <circle cx="500" cy="460" r="362" fill="none" stroke="rgba(255, 255, 255, 0.24)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="460" r="268" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

            <line x1="500" y1="58" x2="500" y2="78" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="500" y1="842" x2="500" y2="862" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="98" y1="460" x2="118" y2="460" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="882" y1="460" x2="902" y2="460" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />

            <text x="500" y="48" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.n}</text>
            <text x="500" y="888" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.s}</text>
            <text x="82" y="467" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.w}</text>
            <text x="918" y="467" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.e}</text>

            {/* Poster Inscriptions */}
            <text x="500" y="945" textAnchor="middle" fill="#FFFFFF" fontSize="40" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {t.catalog.posters.midnight.title}
            </text>
            <text x="500" y="1022" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="64" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {t.catalog.posters.midnight.names}
            </text>
            <g>
              <line x1="375" y1="1080" x2="465" y2="1080" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <text x="500" y="1086" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">✦</text>
              <line x1="535" y1="1080" x2="625" y2="1080" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1138" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {t.catalog.posters.midnight.date}
            </text>
            <text x="500" y="1188" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {t.catalog.posters.midnight.location} • {t.catalog.posters.midnight.coords}
            </text>
          </svg>
        );

      case 'teal_watercolor':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="sel-teal-nebula" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1E889B" />
                <stop offset="45%" stopColor="#0E5866" />
                <stop offset="85%" stopColor="#083B44" />
                <stop offset="100%" stopColor="#05252B" />
              </radialGradient>
            </defs>

            <rect width="1000" height="1400" fill="#F5F7F6" />

            {/* Spring Sky / Ursa Major over Utrecht */}
            {renderPosterSky(
              'sel-sky-teal',
              'url(#sel-teal-nebula)',
              '#FFFFFF',
              'rgba(255,255,255,0.55)',
              390,
              95,
              <MysticalMilkyWay cx={500} cy={460} radius={390} rotation={-20} idPrefix="sel-mw-teal" isWatercolor={true} opacity={0.50} />
            )}

            <circle cx="500" cy="460" r="390" fill="none" stroke="#0C4B56" strokeWidth="3.5" />
            <circle cx="500" cy="460" r="362" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="8 6" />

            <text x="500" y="945" textAnchor="middle" fill="#083B44" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {t.catalog.posters.teal.title}
            </text>
            <text x="500" y="1022" textAnchor="middle" fill="#1A5A66" fontSize="64" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {t.catalog.posters.teal.names}
            </text>
            <g>
              <line x1="375" y1="1080" x2="465" y2="1080" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
              <text x="500" y="1086" textAnchor="middle" fill="#0C4B56" fontSize="22">✧</text>
              <line x1="535" y1="1080" x2="625" y2="1080" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1138" textAnchor="middle" fill="#1A5A66" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {t.catalog.posters.teal.date}
            </text>
            <text x="500" y="1188" textAnchor="middle" fill="#3B7580" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {t.catalog.posters.teal.location} • {t.catalog.posters.teal.coords}
            </text>
          </svg>
        );

      case 'emerald_night':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="1400" fill="#081C15" />

            {/* Autumn Sky / Cassiopeia over Antwerpen */}
            {renderPosterSky(
              'sel-sky-emerald',
              '#04110C',
              '#D4AF37',
              'rgba(212,175,55,0.48)',
              390,
              190,
              <MysticalMilkyWay cx={500} cy={460} radius={390} rotation={-15} idPrefix="sel-mw-emerald" opacity={0.50} />
            )}

            <circle cx="500" cy="460" r="390" fill="none" stroke="#D4AF37" strokeWidth="3.5" />
            <circle cx="500" cy="460" r="362" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="460" r="268" fill="none" stroke="rgba(212,175,55,0.22)" strokeWidth="1" />

            <line x1="500" y1="58" x2="500" y2="78" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="500" y1="842" x2="500" y2="862" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="98" y1="460" x2="118" y2="460" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="882" y1="460" x2="902" y2="460" stroke="#D4AF37" strokeWidth="2.5" />

            <text x="500" y="48" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.n}</text>
            <text x="500" y="888" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.s}</text>
            <text x="82" y="467" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.w}</text>
            <text x="918" y="467" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">{t.studio.cardinalPoints.e}</text>

            <text x="500" y="945" textAnchor="middle" fill="#D4AF37" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {t.catalog.posters.emerald.title}
            </text>
            <text x="500" y="1022" textAnchor="middle" fill="#F3E5AB" fontSize="64" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {t.catalog.posters.emerald.names}
            </text>
            <g>
              <line x1="375" y1="1080" x2="465" y2="1080" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
              <text x="500" y="1086" textAnchor="middle" fill="#D4AF37" fontSize="20">✦</text>
              <line x1="535" y1="1080" x2="625" y2="1080" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1138" textAnchor="middle" fill="#F3E5AB" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {t.catalog.posters.emerald.date}
            </text>
            <text x="500" y="1188" textAnchor="middle" fill="#C9B06B" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {t.catalog.posters.emerald.location} • {t.catalog.posters.emerald.coords}
            </text>
          </svg>
        );

      case 'burgundy_sky':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="1400" fill="#38070E" />

            {/* Winter Sky / Orion & Sirius over Rotterdam */}
            {renderPosterSky(
              'sel-sky-burgundy',
              '#240308',
              '#FFFFFF',
              'rgba(255,235,238,0.45)',
              390,
              280,
              <MysticalMilkyWay cx={500} cy={460} radius={390} rotation={-35} idPrefix="sel-mw-burgundy" opacity={0.55} />
            )}

            <circle cx="500" cy="460" r="390" fill="none" stroke="rgba(255,235,238,0.45)" strokeWidth="3" />
            <circle cx="500" cy="460" r="362" fill="none" stroke="rgba(255,235,238,0.25)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="460" r="268" fill="none" stroke="rgba(255,235,238,0.15)" strokeWidth="1" />

            <text x="500" y="945" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {t.catalog.posters.burgundy.title}
            </text>
            <text x="500" y="1022" textAnchor="middle" fill="#F7D6DA" fontSize="64" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {t.catalog.posters.burgundy.names}
            </text>
            <g>
              <line x1="375" y1="1080" x2="465" y2="1080" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
              <path
                d="M 500 1088 C 493 1080 486 1073 491 1067 C 495 1063 499 1066 500 1069 C 501 1066 505 1063 509 1067 C 514 1073 507 1080 500 1088 Z"
                fill="#F7D6DA"
              />
              <line x1="535" y1="1080" x2="625" y2="1080" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1138" textAnchor="middle" fill="#F7D6DA" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {t.catalog.posters.burgundy.date}
            </text>
            <text x="500" y="1188" textAnchor="middle" fill="#D6A6AD" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {t.catalog.posters.burgundy.location} • {t.catalog.posters.burgundy.coords}
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {DESIGN_STYLES.map((style) => {
          const isSelected = style.id === selectedStyleId;
          const meta = currentStyles[style.id] || {
            title: style.name,
            subtitle: style.subtitle,
            desc: style.description,
          };

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group relative p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#1C1917] bg-[#FAF8F5] ring-2 ring-[#1C1917] shadow-md'
                  : 'border-[#E2DDD5] bg-[#FAF8F5]/60 hover:bg-white hover:border-[#1C1917] shadow-xs'
              }`}
            >
              {/* Clean Flush Mini Poster - No Passepartout */}
              <div className="relative aspect-[300/420] w-full rounded-none shadow-[0_4px_14px_rgba(40,25,10,0.12)] ring-1 ring-black/10 mb-1.5 sm:mb-2.5 overflow-hidden transition-transform duration-300 group-hover:scale-[1.015]">
                {/* Active checkmark badge */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center shadow-md">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                  </div>
                )}

                {/* Vector Poster Art - Edge to Edge */}
                <div className="w-full h-full">
                  {renderPosterSVG(style.id)}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-0.5 w-full min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-[11px] sm:text-xs font-semibold text-[#1C1917] truncate">
                    {meta.title}
                  </h4>
                  {style.isWatercolor && (
                    <span className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-medium bg-[#083B44]/10 text-[#083B44] shrink-0">
                      Watercolor
                    </span>
                  )}
                </div>

                <p className="text-[9px] sm:text-[10px] text-[#A37055] font-medium truncate">
                  {meta.subtitle}
                </p>

                <p className="hidden sm:block text-[9.5px] text-[#78716C] line-clamp-2 leading-snug pt-0.5 font-light">
                  {meta.desc}
                </p>

                {/* Color Palette Preview Swatch Dots */}
                <div className="flex items-center gap-1 sm:gap-1.5 pt-1 sm:pt-2">
                  <span className="hidden sm:inline text-[8.5px] text-[#A8A29E] uppercase tracking-wider font-mono">Palette:</span>
                  <div className="flex items-center space-x-1">
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.bgColor }}
                      title={`Achtergrond: ${style.bgColor}`}
                    />
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.mapBgColor }}
                      title={`Hemel: ${style.mapBgColor}`}
                    />
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.starColor }}
                      title={`Sterren: ${style.starColor}`}
                    />
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.borderColor.startsWith('rgba') ? style.textColor : style.borderColor }}
                      title="Accent"
                    />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
