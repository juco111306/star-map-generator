'use client';

import React from 'react';
import { DESIGN_STYLES } from '../constants/styles';
import { Check } from 'lucide-react';
import {
  SAMPLE_STARS,
  SAMPLE_CONSTELLATION_LINES,
} from '../constants/sampleCelestialData';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onSelectStyle,
}) => {
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
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

            {/* Summer Triangle Sky over Amsterdam */}
            {renderPosterSky(
              'sel-sky-midnight',
              '#070D1F',
              '#FFFFFF',
              'rgba(255,255,255,0.45)',
              390,
              0,
              <ellipse cx="485" cy="450" rx="290" ry="170" fill="rgba(255,255,255,0.075)" transform="rotate(-25 485 450)" />
            )}

            {/* Celestial Rings & Cardinal Ticks */}
            <circle cx="500" cy="460" r="390" fill="none" stroke="rgba(255, 255, 255, 0.48)" strokeWidth="3" />
            <circle cx="500" cy="460" r="362" fill="none" stroke="rgba(255, 255, 255, 0.24)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="460" r="268" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

            <line x1="500" y1="58" x2="500" y2="78" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="500" y1="842" x2="500" y2="862" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="98" y1="460" x2="118" y2="460" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
            <line x1="882" y1="460" x2="902" y2="460" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />

            <text x="500" y="48" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">N</text>
            <text x="500" y="888" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">S</text>
            <text x="82" y="467" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">W</text>
            <text x="918" y="467" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">E</text>

            {/* Poster Inscriptions */}
            <text x="500" y="945" textAnchor="middle" fill="#FFFFFF" fontSize="40" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              THE NIGHT WE MET
            </text>
            <text x="500" y="1022" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="64" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Emma &amp; Lucas
            </text>
            <g>
              <line x1="375" y1="1080" x2="465" y2="1080" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <text x="500" y="1086" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">✦</text>
              <line x1="535" y1="1080" x2="625" y2="1080" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1138" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              14 JUNI 2024 • 22:30 UUR
            </text>
            <text x="500" y="1188" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              AMSTERDAM • 52.3676° N • 4.9041° E
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
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(12,75,86,0.22)" strokeWidth="1.5" />

            {/* Spring Sky / Ursa Major over Utrecht */}
            {renderPosterSky(
              'sel-sky-teal',
              'url(#sel-teal-nebula)',
              '#FFFFFF',
              'rgba(255,255,255,0.55)',
              390,
              95,
              <ellipse cx="485" cy="450" rx="250" ry="140" fill="rgba(255,255,255,0.12)" transform="rotate(-20 485 450)" />
            )}

            <circle cx="500" cy="460" r="390" fill="none" stroke="#0C4B56" strokeWidth="3.5" />
            <circle cx="500" cy="460" r="362" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="8 6" />

            <text x="500" y="945" textAnchor="middle" fill="#083B44" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              TOEN EEN STER WERD GEBOREN
            </text>
            <text x="500" y="1022" textAnchor="middle" fill="#1A5A66" fontSize="64" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Liam Noah
            </text>
            <g>
              <line x1="375" y1="1080" x2="465" y2="1080" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
              <text x="500" y="1086" textAnchor="middle" fill="#0C4B56" fontSize="22">✧</text>
              <line x1="535" y1="1080" x2="625" y2="1080" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1138" textAnchor="middle" fill="#1A5A66" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              08 MEI 2025 • 03:42 UUR
            </text>
            <text x="500" y="1188" textAnchor="middle" fill="#3B7580" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              UTRECHT • 52.0907° N • 5.1214° E
            </text>
          </svg>
        );

      case 'emerald_night':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="1400" fill="#081C15" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" />

            {/* Autumn Sky / Cassiopeia over Antwerpen */}
            {renderPosterSky(
              'sel-sky-emerald',
              '#04110C',
              '#D4AF37',
              'rgba(212,175,55,0.48)',
              390,
              190
            )}

            <circle cx="500" cy="460" r="390" fill="none" stroke="#D4AF37" strokeWidth="3.5" />
            <circle cx="500" cy="460" r="362" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="460" r="268" fill="none" stroke="rgba(212,175,55,0.22)" strokeWidth="1" />

            <line x1="500" y1="58" x2="500" y2="78" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="500" y1="842" x2="500" y2="862" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="98" y1="460" x2="118" y2="460" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="882" y1="460" x2="902" y2="460" stroke="#D4AF37" strokeWidth="2.5" />

            <text x="500" y="48" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">N</text>
            <text x="500" y="888" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">S</text>
            <text x="82" y="467" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">W</text>
            <text x="918" y="467" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">E</text>

            <text x="500" y="945" textAnchor="middle" fill="#D4AF37" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              DE DAG DAT WE &apos;JA&apos; ZEIDEN
            </text>
            <text x="500" y="1022" textAnchor="middle" fill="#F3E5AB" fontSize="64" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Sophie &amp; Thomas
            </text>
            <g>
              <line x1="375" y1="1080" x2="465" y2="1080" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
              <text x="500" y="1086" textAnchor="middle" fill="#D4AF37" fontSize="20">✦</text>
              <line x1="535" y1="1080" x2="625" y2="1080" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1138" textAnchor="middle" fill="#F3E5AB" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              18 SEPTEMBER 2023 • 16:15 UUR
            </text>
            <text x="500" y="1188" textAnchor="middle" fill="#C9B06B" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              ANTWERPEN • 51.2194° N • 4.4025° E
            </text>
          </svg>
        );

      case 'burgundy_sky':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="1400" fill="#38070E" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,235,238,0.22)" strokeWidth="1.5" />

            {/* Winter Sky / Orion & Sirius over Rotterdam */}
            {renderPosterSky(
              'sel-sky-burgundy',
              '#240308',
              '#FFFFFF',
              'rgba(255,235,238,0.45)',
              390,
              280
            )}

            <circle cx="500" cy="460" r="390" fill="none" stroke="rgba(255,235,238,0.45)" strokeWidth="3" />
            <circle cx="500" cy="460" r="362" fill="none" stroke="rgba(255,235,238,0.25)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="460" r="268" fill="none" stroke="rgba(255,235,238,0.15)" strokeWidth="1" />

            <text x="500" y="945" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              ONDER DEZELFDE STERREN
            </text>
            <text x="500" y="1022" textAnchor="middle" fill="#F7D6DA" fontSize="64" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Mila &amp; Daan
            </text>
            <g>
              <line x1="375" y1="1080" x2="465" y2="1080" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
              <text x="500" y="1086" textAnchor="middle" fill="#F7D6DA" fontSize="20">♥</text>
              <line x1="535" y1="1080" x2="625" y2="1080" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1138" textAnchor="middle" fill="#F7D6DA" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              31 DECEMBER 2022 • 23:59 UUR
            </text>
            <text x="500" y="1188" textAnchor="middle" fill="#D6A6AD" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              ROTTERDAM • 51.9244° N • 4.4777° E
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DESIGN_STYLES.map((style) => {
          const isSelected = style.id === selectedStyleId;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group relative p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#1C1917] bg-[#FAF8F5] ring-2 ring-[#1C1917] shadow-md'
                  : 'border-[#E2DDD5] bg-[#FAF8F5]/60 hover:bg-white hover:border-[#1C1917] shadow-xs'
              }`}
            >
              {/* Natural Light Wood Framed Mini Poster */}
              <div className="relative aspect-[300/420] w-full rounded-none bg-gradient-to-br from-[#E8DAC3] via-[#DFCCA9] to-[#D4BE9B] p-[4px] sm:p-[5px] shadow-[0_4px_14px_rgba(40,25,10,0.12)] ring-1 ring-[#C8B28E]/60 mb-2.5 overflow-hidden transition-transform duration-300 group-hover:scale-[1.015]">
                {/* Active checkmark badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Vector Poster Art - Flush Fit in Wood Frame */}
                <div className="w-full h-full rounded-none overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
                  {renderPosterSVG(style.id)}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-0.5 w-full">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#1C1917]">
                    {style.name}
                  </h4>
                  {style.isWatercolor && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-[#083B44]/10 text-[#083B44]">
                      Watercolor
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-[#A37055] font-medium truncate">
                  {style.subtitle}
                </p>

                <p className="text-[9.5px] text-[#78716C] line-clamp-2 leading-snug pt-0.5 font-light">
                  {style.description}
                </p>

                {/* Color Palette Preview Swatch Dots */}
                <div className="flex items-center gap-1.5 pt-2">
                  <span className="text-[8.5px] text-[#A8A29E] uppercase tracking-wider font-mono">Palette:</span>
                  <div className="flex items-center space-x-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.bgColor }}
                      title={`Achtergrond: ${style.bgColor}`}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.mapBgColor }}
                      title={`Hemel: ${style.mapBgColor}`}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.starColor }}
                      title={`Sterren: ${style.starColor}`}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
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
