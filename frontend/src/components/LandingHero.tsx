'use client';

import React, { useState } from 'react';
import { ArrowRight, Star, Sparkles, ShieldCheck, Heart, Award, MapPin, Truck, Check } from 'lucide-react';
import { AppView, MapConfig } from '../types';
import { SAMPLE_STARS, SAMPLE_CONSTELLATION_LINES } from '../constants/sampleCelestialData';
import { MysticalMilkyWay } from './MysticalMilkyWay';
import { useLanguage } from '../context/LanguageContext';

export type HeroOccasionId = 'first_date' | 'wedding' | 'birth' | 'anniversary';

interface LandingHeroProps {
  onNavigate: (view: AppView) => void;
  onStartWithPreset?: (preset: Partial<MapConfig>) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate, onStartWithPreset }) => {
  const { locale, t, formatPrice } = useLanguage();
  const [selectedOccasion, setSelectedOccasion] = useState<HeroOccasionId>('first_date');
  const [overrideStyleId, setOverrideStyleId] = useState<string | null>(null);

  const isDe = locale === 'de';
  const isEn = locale === 'en';

  // Localized milestone occasions tailored for deep emotional connection
  const occasionsData: Record<
    HeroOccasionId,
    {
      id: HeroOccasionId;
      icon: string;
      label: string;
      defaultStyleId: string;
      title: string;
      names: string;
      date: string;
      dateIso: string;
      location: string;
      coords: string;
      lat: number;
      lng: number;
      tagline: string;
    }
  > = {
    first_date: {
      id: 'first_date',
      icon: '💑',
      label: isDe ? 'Erstes Treffen' : isEn ? 'First Date' : 'Eerste Ontmoeting',
      defaultStyleId: 'midnight_classic',
      title: isDe
        ? 'DIE NACHT, IN DER WIR UNS TRAFEN'
        : isEn
        ? 'THE NIGHT WE MET'
        : 'DE NACHT WAARIN WE ELKAAR VONDEN',
      names: isDe ? 'Hannah & Maximilian' : isEn ? 'Olivia & James' : 'Sophie & Daan',
      date: isDe ? '22. SEPTEMBER 2024' : isEn ? 'SEPTEMBER 22, 2024' : '22 SEPTEMBER 2024',
      dateIso: '2024-09-22',
      location: isDe ? 'BERLIN, DEUTSCHLAND' : isEn ? 'LONDON, UNITED KINGDOM' : 'AMSTERDAM, NEDERLAND',
      coords: isDe ? '52.5200° N • 13.4050° O' : isEn ? '51.5074° N • 0.1278° W' : '52.3676° N • 4.9041° E',
      lat: isDe ? 52.52 : isEn ? 51.5074 : 52.3676,
      lng: isDe ? 13.405 : isEn ? -0.1278 : 4.9041,
      tagline: isDe ? 'Der Moment, in dem alles begann' : isEn ? 'The moment our journey began' : 'Het moment waarop alles begon',
    },
    wedding: {
      id: 'wedding',
      icon: '💍',
      label: isDe ? 'Hochzeitstag' : isEn ? 'Wedding Day' : 'Trouwdag',
      defaultStyleId: 'emerald_night',
      title: isDe ? 'UNSER HOCHZEITSTAG' : isEn ? 'OUR WEDDING DAY' : 'ONZE HUWELIJKSDAG',
      names: isDe ? 'Laura & Felix' : isEn ? 'Charlotte & William' : 'Emma & Lucas',
      date: isDe ? '18. AUGUST 2023' : isEn ? 'AUGUST 18, 2023' : '18 AUGUSTUS 2023',
      dateIso: '2023-08-18',
      location: isDe ? 'MÜNCHEN, DEUTSCHLAND' : isEn ? 'EDINBURGH, UNITED KINGDOM' : 'UTRECHT, NEDERLAND',
      coords: isDe ? '48.1351° N • 11.5820° O' : isEn ? '55.9533° N • 3.1883° W' : '52.0907° N • 5.1214° E',
      lat: isDe ? 48.1351 : isEn ? 55.9533 : 52.0907,
      lng: isDe ? 11.582 : isEn ? -3.1883 : 5.1214,
      tagline: isDe ? 'Zwei Leben vereint unter diesen Sternen' : isEn ? 'Two souls united beneath these stars' : 'Twee zielen verenigd onder deze sterren',
    },
    birth: {
      id: 'birth',
      icon: '👶',
      label: isDe ? 'Geburt des Kindes' : isEn ? "Baby's Birth" : 'Geboorte Kind',
      defaultStyleId: 'teal_watercolor',
      title: isDe ? 'WILLKOMMEN AUF DER WELT' : isEn ? 'WELCOME TO THE WORLD' : 'WELKOM OP DE WERELD',
      names: isDe ? 'Noah Alexander' : isEn ? 'Oliver James' : 'Liam Alexander',
      date: isDe ? '14. MAI 2025' : isEn ? 'MAY 14, 2025' : '14 MEI 2025',
      dateIso: '2025-05-14',
      location: isDe ? 'HAMBURG, DEUTSCHLAND' : isEn ? 'DUBLIN, IRELAND' : 'ROTTERDAM, NEDERLAND',
      coords: isDe ? '53.5511° N • 9.9937° O' : isEn ? '53.3498° N • 6.2603° W' : '51.9244° N • 4.4777° E',
      lat: isDe ? 53.5511 : isEn ? 53.3498 : 51.9244,
      lng: isDe ? 9.9937 : isEn ? -6.2603 : 4.4777,
      tagline: isDe ? 'Der Himmel in deiner allerersten Stunde' : isEn ? 'The sky in your very first hour' : 'De hemel in jouw allereerste uur',
    },
    anniversary: {
      id: 'anniversary',
      icon: '✦',
      label: isDe ? 'Jubiläum' : isEn ? 'Anniversary' : 'Jubileum',
      defaultStyleId: 'burgundy_sky',
      title: isDe ? 'UNTER DEN GLEICHEN STERNEN' : isEn ? 'UNDER THE SAME STARS' : 'ONDER DEZELFDE STERREN',
      names: isDe ? 'Mia & Jonas' : isEn ? 'Amelia & George' : 'Mila & Thomas',
      date: isDe ? '04. OKTOBER 2020' : isEn ? 'OCTOBER 04, 2020' : '04 OKTOBER 2020',
      dateIso: '2020-10-04',
      location: isDe ? 'WIEN, ÖSTERREICH' : isEn ? 'NEW YORK, UNITED STATES' : 'ANTWERPEN, BELGIË',
      coords: isDe ? '48.2082° N • 16.3738° O' : isEn ? '40.7128° N • 74.0060° W' : '51.2194° N • 4.4025° E',
      lat: isDe ? 48.2082 : isEn ? 40.7128 : 51.2194,
      lng: isDe ? 16.3738 : isEn ? -74.006 : 4.4025,
      tagline: isDe ? 'Jedes Jahr strahlender denn je' : isEn ? 'Every year shining brighter' : 'Elk jaar stralender dan voorheen',
    },
  };

  const activeOccasion = occasionsData[selectedOccasion];
  const activeStyleId = overrideStyleId || activeOccasion.defaultStyleId;

  const handleOccasionClick = (occId: HeroOccasionId) => {
    setSelectedOccasion(occId);
    setOverrideStyleId(null);
  };

  const handleStyleSwatchClick = (styleId: string) => {
    setOverrideStyleId(styleId);
  };

  const handleScrollToStyles = () => {
    const el = document.getElementById('stijlen');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('customizer');
    }
  };

  const handleStartPersonalizing = () => {
    if (onStartWithPreset) {
      onStartWithPreset({
        styleId: activeStyleId,
        locationName: activeOccasion.location,
        latitude: activeOccasion.lat,
        longitude: activeOccasion.lng,
        date: activeOccasion.dateIso,
        titleBlock: {
          text: activeOccasion.title,
          font: 'Cinzel',
          size: 38,
          tracking: 3,
          uppercase: true,
          italic: false,
          enabled: true,
        },
        namesBlock: {
          text: activeOccasion.names,
          font: 'Great Vibes',
          size: 51,
          tracking: 1,
          uppercase: false,
          italic: false,
          enabled: true,
        },
        dateBlock: {
          text: activeOccasion.date,
          font: 'Montserrat',
          size: 27,
          tracking: 2.5,
          uppercase: true,
          italic: false,
          enabled: true,
        },
        locationBlock: {
          text: activeOccasion.location.toUpperCase(),
          font: 'Montserrat',
          size: 21,
          tracking: 2,
          uppercase: true,
          italic: false,
          enabled: true,
        },
        coordsBlock: {
          text: activeOccasion.coords,
          font: 'Montserrat',
          size: 21,
          tracking: 1.8,
          uppercase: true,
          italic: false,
          enabled: true,
        },
      });
    } else {
      onNavigate('customizer');
    }
  };

  // Helper to render celestial sky in poster with authentic rotation
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
                strokeWidth="1.1"
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
                r={s.r * 1.2}
                fill={starColor}
                opacity={s.bright ? 1.0 : 0.85}
              />
            );
          })}
        </g>
      </>
    );
  };

  // Render authentic interactive vector poster for current occasion & style
  const renderHeroPosterSVG = () => {
    switch (activeStyleId) {
      case 'teal_watercolor':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="hero-teal-nebula" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1E889B" />
                <stop offset="45%" stopColor="#0E5866" />
                <stop offset="85%" stopColor="#083B44" />
                <stop offset="100%" stopColor="#05252B" />
              </radialGradient>
            </defs>
            <rect width="1000" height="1400" fill="#F5F7F6" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(12,75,86,0.22)" strokeWidth="1.5" />
            {renderCelestialSky(
              'hero-sky-teal',
              'url(#hero-teal-nebula)',
              '#FFFFFF',
              'rgba(255,255,255,0.55)',
              400,
              95,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-20} idPrefix="hero-mw-teal" isWatercolor={true} opacity={0.50} />
            )}
            <circle cx="500" cy="480" r="400" fill="none" stroke="#0C4B56" strokeWidth="3.5" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="8 6" />

            <text x="500" y="955" textAnchor="middle" fill="#083B44" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {activeOccasion.title}
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#1A5A66" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {activeOccasion.names}
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#0C4B56" fontSize="22">✧</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#1A5A66" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {activeOccasion.date}
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#3B7580" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {activeOccasion.location} • {activeOccasion.coords}
            </text>
          </svg>
        );

      case 'emerald_night':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="1400" fill="#081C15" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" />
            {renderCelestialSky(
              'hero-sky-emerald',
              '#04110C',
              '#D4AF37',
              'rgba(212,175,55,0.48)',
              400,
              190,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-15} idPrefix="hero-mw-emerald" opacity={0.50} />
            )}
            <circle cx="500" cy="480" r="400" fill="none" stroke="#D4AF37" strokeWidth="3.5" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1.5" strokeDasharray="8 6" />

            <text x="500" y="955" textAnchor="middle" fill="#D4AF37" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {activeOccasion.title}
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#F3E5AB" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {activeOccasion.names}
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#D4AF37" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#F3E5AB" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {activeOccasion.date}
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#C9B06B" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {activeOccasion.location} • {activeOccasion.coords}
            </text>
          </svg>
        );

      case 'burgundy_sky':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="1400" fill="#38070E" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,235,238,0.22)" strokeWidth="1.5" />
            {renderCelestialSky(
              'hero-sky-burgundy',
              '#240308',
              '#FFFFFF',
              'rgba(255,235,238,0.45)',
              400,
              280,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-35} idPrefix="hero-mw-burgundy" opacity={0.55} />
            )}
            <circle cx="500" cy="480" r="400" fill="none" stroke="rgba(255,235,238,0.45)" strokeWidth="3" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255,235,238,0.25)" strokeWidth="1.5" strokeDasharray="8 6" />

            <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {activeOccasion.title}
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#F7D6DA" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {activeOccasion.names}
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#F7D6DA" fontSize="20">♥</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#F7D6DA" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {activeOccasion.date}
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#D6A6AD" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {activeOccasion.location} • {activeOccasion.coords}
            </text>
          </svg>
        );

      case 'midnight_classic':
      default:
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="1400" fill="#0B132B" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
            {renderCelestialSky(
              'hero-sky-midnight',
              '#070D1F',
              '#FFFFFF',
              'rgba(255,255,255,0.42)',
              400,
              0,
              <MysticalMilkyWay cx={500} cy={480} radius={400} rotation={-28} idPrefix="hero-mw-midnight" opacity={0.55} />
            )}
            <circle cx="500" cy="480" r="400" fill="none" stroke="rgba(255, 255, 255, 0.48)" strokeWidth="3" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255, 255, 255, 0.24)" strokeWidth="1.5" strokeDasharray="8 6" />

            <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              {activeOccasion.title}
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              {activeOccasion.names}
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              {activeOccasion.date}
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              {activeOccasion.location} • {activeOccasion.coords}
            </text>
          </svg>
        );
    }
  };

  const styleSwatches = [
    { id: 'midnight_classic', name: 'Midnight Navy', color: '#0B132B' },
    { id: 'teal_watercolor', name: 'White & Teal', color: '#0C4B56' },
    { id: 'emerald_night', name: 'Emerald Gold', color: '#081C15' },
    { id: 'burgundy_sky', name: 'Velvet Wine', color: '#38070E' },
  ];

  return (
    <section className="relative overflow-hidden w-full max-w-[100vw] pt-6 pb-14 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24 bg-[#FAF8F5]">
      {/* Soft natural ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-[90vw] h-[450px] bg-[#F2EDE2] rounded-full blur-[120px] -z-10 pointer-events-none opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-center">
          
          {/* Section 1: Narrative & Interactive Occasion Selector */}
          <div className="w-full lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#F3EFE7] border border-[#E4DDD0] text-[#78716C] text-[11px] sm:text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Emotive Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-normal tracking-tight text-[#1C1917] leading-[1.18]">
              {t.hero.headlinePart1} <br />
              <span className="italic text-[#A37055]">{t.hero.headlinePart2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#57534E] text-xs sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              {t.hero.subtitle}
            </p>

            {/* Interactive Occasion Chips Bar (Immediately hooks attention on mobile & desktop) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[10.5px] sm:text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#A37055]" />
                <span>{isDe ? 'Wählen Sie Ihren Moment zum Ausprobieren:' : isEn ? 'Tap to Preview Your Moment:' : 'Tik om Jouw Moment te Bekijken:'}</span>
              </div>

              {/* Horizontal Scrollable Occasion Pills */}
              <div className="flex items-center justify-center lg:justify-start gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {(Object.keys(occasionsData) as HeroOccasionId[]).map((key) => {
                  const occ = occasionsData[key];
                  const isSelected = selectedOccasion === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleOccasionClick(key)}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isSelected
                          ? 'bg-[#1C1917] text-[#FAF8F5] ring-2 ring-[#1C1917]/20 shadow-sm scale-[1.02]'
                          : 'bg-white text-[#57534E] border border-[#E2DDD5] hover:border-[#1C1917] hover:text-[#1C1917]'
                      }`}
                    >
                      <span className="text-sm leading-none">{occ.icon}</span>
                      <span>{occ.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop CTA & Social Proof (Hidden on mobile to prioritize visual framed art) */}
            <div className="hidden lg:block pt-3 space-y-4">
              <div className="flex items-center space-x-3.5">
                <button
                  type="button"
                  onClick={handleStartPersonalizing}
                  className="px-7 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{isDe ? 'Diesen Moment Personalisieren' : isEn ? 'Personalize This Moment' : 'Pas Dit Moment Aan'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleScrollToStyles}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F2EB] text-[#292524] border border-[#D6D0C7] font-medium text-xs tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  {t.hero.ctaStyles}
                </button>
              </div>

              {/* Gentle Social Proof */}
              <div className="flex items-center space-x-3 text-xs text-[#78716C]">
                <div className="flex items-center text-[#A37055]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#A37055]" />
                  ))}
                </div>
                <span>
                  <strong className="text-[#1C1917] font-medium">4.98 / 5.0</strong> • {t.socialProof.totalReviews}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Visual Framed Art Showcase (Prominent & immediately visible on Mobile) */}
          <div className="w-full lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-[290px] sm:max-w-[360px] lg:max-w-[440px]">
              {/* Soft warm shadow */}
              <div className="absolute -inset-2 rounded-[28px] bg-[#E8E1D3]/50 blur-xl opacity-80 pointer-events-none" />

              {/* Natural Wood Frame Mockup */}
              <div className="relative rounded-none bg-gradient-to-br from-[#E8DAC3] via-[#DFCCA9] to-[#D4BE9B] p-[6px] sm:p-[9px] shadow-[0_20px_45px_-10px_rgba(40,25,10,0.22),0_6px_16px_-4px_rgba(40,25,10,0.12)] ring-1 ring-[#C8B28E]/60 transition-transform duration-500 group-hover:scale-[1.015]">
                
                {/* Active Occasion Tag on Corner */}
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-none text-[8px] sm:text-[9px] font-bold tracking-wider uppercase bg-white/95 text-[#1C1917] shadow-xs border border-black/10 flex items-center gap-1">
                  <span>{activeOccasion.icon}</span>
                  <span>{activeOccasion.label}</span>
                </div>

                <div
                  onClick={handleStartPersonalizing}
                  className="relative rounded-none overflow-hidden aspect-[5/7] bg-[#0B132B] cursor-pointer shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)]"
                  title={isDe ? 'Klicken Sie hier, um im Studio anzupassen' : isEn ? 'Click to customize in studio' : 'Klik om aan te passen in studio'}
                >
                  {/* Dynamic SVG Poster that morphs instantly */}
                  {renderHeroPosterSVG()}

                  {/* Hover Prompt */}
                  <div className="absolute inset-0 bg-[#1C1917]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white text-[#1C1917] font-semibold text-xs shadow-xl flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <span>{t.navbar.ctaButton}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Poster Subtitle & Price Badge */}
              <div className="pt-2.5 px-0.5 flex items-center justify-between text-xs">
                <div className="min-w-0 flex-1 truncate pr-2">
                  <span className="font-serif font-bold text-[#1C1917] text-xs block truncate">
                    {activeOccasion.names}
                  </span>
                  <p className="text-[10px] text-[#78716C] flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#A37055] shrink-0" />
                    <span className="truncate">{activeOccasion.location}</span>
                  </p>
                </div>
                <div className="text-right shrink-0 whitespace-nowrap">
                  <span className="text-[10px] text-[#A8A29E] line-through block">{formatPrice(29)}</span>
                  <span className="font-serif text-xs font-bold text-[#1C1917]">{t.catalog.digital.pricePrefix} {formatPrice(19)}</span>
                </div>
              </div>
            </div>

            {/* Quick Touch Style Swatches under poster */}
            <div className="flex items-center justify-center gap-2 pt-3">
              <span className="text-[9.5px] text-[#78716C] uppercase tracking-wider font-mono">
                {isDe ? 'Stil:' : isEn ? 'Style:' : 'Stijl:'}
              </span>
              <div className="flex items-center space-x-1.5">
                {styleSwatches.map((sw) => {
                  const isCurrent = activeStyleId === sw.id;
                  return (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => handleStyleSwatchClick(sw.id)}
                      className={`w-4 h-4 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'border-[#1C1917] ring-2 ring-[#1C1917]/30 scale-110 shadow-xs'
                          : 'border-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: sw.color }}
                      title={sw.name}
                    >
                      {isCurrent && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile-Only Action & Reviews (Positioned directly under the visual art on phones) */}
            <div className="w-full max-w-[290px] sm:max-w-[360px] block lg:hidden pt-4 space-y-3">
              <button
                type="button"
                onClick={handleStartPersonalizing}
                className="w-full py-3.5 px-4 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isDe ? 'Diesen Moment Personalisieren' : isEn ? 'Personalize This Moment' : 'Pas Dit Moment Aan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleScrollToStyles}
                className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#F5F2EB] text-[#292524] border border-[#D6D0C7] font-medium text-xs tracking-wide transition-all shadow-xs cursor-pointer text-center"
              >
                {t.hero.ctaStyles}
              </button>

              <div className="flex items-center justify-center space-x-2 text-xs text-[#78716C] pt-1">
                <div className="flex items-center text-[#A37055]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#A37055]" />
                  ))}
                </div>
                <span className="text-[11px]">
                  <strong className="text-[#1C1917] font-medium">4.98 / 5.0</strong> • {t.socialProof.totalReviews}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-[#EAE5DC] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] flex items-center justify-center text-[#A37055] shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1C1917]">NASA &amp; Skyfield Data</h4>
              <p className="text-[10px] sm:text-[11px] text-[#78716C]">{t.hero.trustPoint1}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] flex items-center justify-center text-[#A37055] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1C1917]">{t.navbar.bannerText}</h4>
              <p className="text-[10px] sm:text-[11px] text-[#78716C]">{t.footer.shippingPartnerText}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] flex items-center justify-center text-[#A37055] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1C1917]">285 gsm Fine-Art</h4>
              <p className="text-[10px] sm:text-[11px] text-[#78716C]">{t.hero.trustPoint2}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] flex items-center justify-center text-[#A37055] shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1C1917]">{t.catalog.framed.title}</h4>
              <p className="text-[10px] sm:text-[11px] text-[#78716C]">{t.catalog.framed.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
