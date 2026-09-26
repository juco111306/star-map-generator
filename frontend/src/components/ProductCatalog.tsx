'use client';

import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { DESIGN_STYLES } from '../constants/styles';
import {
  SAMPLE_STARS,
  SAMPLE_CONSTELLATION_LINES,
} from '../constants/sampleCelestialData';
import { MysticalMilkyWay } from './MysticalMilkyWay';

interface ProductCatalogProps {
  onCustomizeStarMap: () => void;
  onSelectStyle?: (styleId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onCustomizeStarMap,
  onSelectStyle,
}) => {
  const dutchStyleDetails: Record<
    string,
    { title: string; subtitle: string; desc: string; tag: string }
  > = {
    midnight_classic: {
      title: 'Midnight Classic',
      subtitle: 'Onze Meest Geliefde Bestseller',
      desc: 'Diep koningsblauw met dubbele kompasring, fijne graadverdeling en fonkelende witte sterren.',
      tag: 'BESTSELLER',
    },
    teal_watercolor: {
      title: 'Teal Watercolor',
      subtitle: 'Zachte Aquarel & Neveltextuur',
      desc: 'Sfeervolle marineblauwe en cyaankleurige aquarelstructuur op een warm linnenachtergrond.',
      tag: 'ARTISTIEK',
    },
    emerald_night: {
      title: 'Emerald Night',
      subtitle: 'Brits Bosgroen & Koninklijk Goud',
      desc: 'Diepgroene nachthemel gecombineerd met metallic gouden sterren en hemelcoördinaten.',
      tag: 'LUXE EDITIE',
    },
    burgundy_sky: {
      title: 'Burgundy Sky',
      subtitle: 'Warme Romantiek & Fluweelrood',
      desc: 'Rijke bordeauxrode tinten die liefde en warmte uitstralen, afgewerkt met zachte parelwitte typografie.',
      tag: 'ROMANTISCH',
    },
  };

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
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

            {/* Dense Authentic Celestial Starfield (Summer Triangle / Cygnus Sky - 0° orientation) */}
            {renderCelestialSky(
              'cat-sky-midnight',
              '#070D1F',
              '#FFFFFF',
              'rgba(255,255,255,0.42)',
              400,
              0,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-28} idPrefix="cat-mw-midnight" />
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

            <text x="500" y="60" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">N</text>
            <text x="500" y="915" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">S</text>
            <text x="75" y="487" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">W</text>
            <text x="925" y="487" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">E</text>

            {/* Example 1: Romantic First Meeting in Amsterdam */}
            <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              THE NIGHT WE MET
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Emma &amp; Lucas
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              14 JUNI 2024
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              AMSTERDAM, NEDERLAND • 52.3676° N • 4.9041° E
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
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(12,75,86,0.22)" strokeWidth="1.5" />

            {/* Swirling Teal Watercolor Celestial Disk (Spring Sky / Ursa Major - 95° orientation) */}
            {renderCelestialSky(
              'cat-sky-teal',
              'url(#cat-teal-nebula-hq)',
              '#FFFFFF',
              'rgba(255,255,255,0.55)',
              400,
              95,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-20} idPrefix="cat-mw-teal" isWatercolor={true} opacity={0.7} />
            )}

            <circle cx="500" cy="480" r="400" fill="none" stroke="#0C4B56" strokeWidth="3.5" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="8 6" />

            {/* Example 2: Birth of a Child in Utrecht */}
            <text x="500" y="955" textAnchor="middle" fill="#083B44" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              TOEN EEN STER WERD GEBOREN
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#1A5A66" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Liam Noah
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#0C4B56" fontSize="22">✧</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#1A5A66" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              08 MEI 2025
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#3B7580" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              UTRECHT, NEDERLAND • 52.0907° N • 5.1214° E
            </text>
          </svg>
        );

      case 'emerald_night':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* British Racing Green Background */}
            <rect width="1000" height="1400" fill="#081C15" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" />

            {/* Inner Forest Sphere with Gold Stars (Autumn Sky / Cassiopeia & Pegasus - 190° orientation) */}
            {renderCelestialSky(
              'cat-sky-emerald',
              '#04110C',
              '#D4AF37',
              'rgba(212,175,55,0.48)',
              400,
              190,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-15} idPrefix="cat-mw-emerald" opacity={0.65} />
            )}

            <circle cx="500" cy="480" r="400" fill="none" stroke="#D4AF37" strokeWidth="3.5" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="480" r="275" fill="none" stroke="rgba(212,175,55,0.22)" strokeWidth="1" />

            {/* Cardinal Ticks */}
            <line x1="500" y1="72" x2="500" y2="92" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="500" y1="868" x2="500" y2="888" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="92" y1="480" x2="112" y2="480" stroke="#D4AF37" strokeWidth="2.5" />
            <line x1="888" y1="480" x2="908" y2="480" stroke="#D4AF37" strokeWidth="2.5" />

            <text x="500" y="60" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">N</text>
            <text x="500" y="915" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">S</text>
            <text x="75" y="487" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">W</text>
            <text x="925" y="487" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="sans-serif" fontWeight="bold">E</text>

            {/* Example 3: Wedding Day in Antwerpen */}
            <text x="500" y="955" textAnchor="middle" fill="#D4AF37" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              DE DAG DAT WE &apos;JA&apos; ZEIDEN
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#F3E5AB" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Sophie &amp; Thomas
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#D4AF37" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#F3E5AB" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              18 SEPTEMBER 2023
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#C9B06B" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              ANTWERPEN, BELGIË • 51.2194° N • 4.4025° E
            </text>
          </svg>
        );

      case 'burgundy_sky':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* Velvet Wine Red Background */}
            <rect width="1000" height="1400" fill="#38070E" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,235,238,0.22)" strokeWidth="1.5" />

            {/* Deep Bordeaux Celestial Disk (Winter Sky / Orion & Sirius - 280° orientation) */}
            {renderCelestialSky(
              'cat-sky-burgundy',
              '#240308',
              '#FFFFFF',
              'rgba(255,235,238,0.45)',
              400,
              280,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-35} idPrefix="cat-mw-burgundy" opacity={0.75} />
            )}

            <circle cx="500" cy="480" r="400" fill="none" stroke="rgba(255,235,238,0.45)" strokeWidth="3" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255,235,238,0.25)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="480" r="275" fill="none" stroke="rgba(255,235,238,0.15)" strokeWidth="1" />

            {/* Example 4: Anniversary / Under The Same Stars in Rotterdam */}
            <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              ONDER DEZELFDE STERREN
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#F7D6DA" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Mila &amp; Daan
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#F7D6DA" fontSize="20">♥</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#F7D6DA" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              31 DECEMBER 2022
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#D6A6AD" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              ROTTERDAM, NEDERLAND • 51.9244° N • 4.4777° E
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
            <span>AMBACHTELIJKE KUNSTSTIJLEN</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            Eén Tijdloos Product, Verfijnde Kunststijlen
          </h2>
          <p className="text-[#57534E] text-sm sm:text-base font-light leading-relaxed">
            Wij focussen ons 100% op het perfectioneren van de gepersonaliseerde sterrenposter. Kies jouw favoriete esthetiek en open direct onze ontwerpstudio.
          </p>
        </div>

        {/* 4 Flagship Art Styles - 4 balanced columns on desktop (lg:grid-cols-4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESIGN_STYLES.map((style) => {
            const meta = dutchStyleDetails[style.id] || {
              title: style.name,
              subtitle: style.subtitle,
              desc: style.description,
              tag: 'STIJL',
            };

            return (
              <div
                key={style.id}
                onClick={() => handleCardClick(style.id)}
                className="group bg-white rounded-3xl p-3.5 sm:p-4 border border-[#E2DDD5] shadow-[0_8px_25px_rgba(28,25,23,0.04)] hover:shadow-[0_18px_40px_rgba(28,25,23,0.12)] hover:border-[#C8BFB0] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Gelato Light Wood Frame Mockup - Thin & Sharp 90° Edges, No White Borders */}
                  <div className="relative aspect-[300/420] rounded-none bg-gradient-to-br from-[#E8DAC3] via-[#DFCCA9] to-[#D4BE9B] p-[6px] sm:p-[7px] shadow-[0_10px_25px_-5px_rgba(40,25,10,0.18)] ring-1 ring-[#C8B28E]/60 transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* Badge */}
                    <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-none text-[8.5px] font-bold tracking-wider uppercase bg-white/95 text-[#1C1917] shadow-xs border border-black/10">
                      {meta.tag}
                    </span>

                    {/* The Exact Vector Poster Art - Flush Fit with Wooden Frame */}
                    <div className="w-full h-full rounded-none overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                      {renderExactPosterSVG(style.id)}
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1 pt-0.5 px-0.5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-base font-bold text-[#1C1917] truncate">
                        {meta.title}
                      </h3>
                      <div className="text-right shrink-0 ml-1">
                        <span className="text-[10px] text-[#A8A29E] line-through mr-1">€29</span>
                        <span className="text-xs font-bold text-[#1C1917]">vanaf €19</span>
                      </div>
                    </div>
                    <p className="text-[10.5px] font-semibold text-[#A37055] truncate">
                      {meta.subtitle}
                    </p>
                    <p className="text-[11px] text-[#78716C] font-light leading-snug line-clamp-2">
                      {meta.desc}
                    </p>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-3.5 mt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-semibold text-[#1C1917] group-hover:text-[#A37055] transition-colors">
                  <span>Personaliseer</span>
                  <div className="w-6 h-6 rounded-full bg-[#FAF8F5] group-hover:bg-[#1C1917] group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality & Trust Banner */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2DDD5] shadow-xs flex flex-wrap items-center justify-around gap-4 text-xs text-[#57534E]">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>Officiële NASA JPL & Skyfield sterrendata</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>Classic Matte 200 gsm archiefpapier</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>Massief houten wissellijsten van onze ervaren inlijstpartner</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>Gratis levering in Nederland & België (PostNL & Bpost)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
