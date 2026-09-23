'use client';

import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { DESIGN_STYLES } from '../constants/styles';

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
    border_text: {
      title: 'Border Text',
      subtitle: 'Gebogen Randschrift',
      desc: 'Strakke moderne kunststijl waarbij jouw persoonlijke titel sierlijk rond de sterrencirkel buigt.',
      tag: 'KLASSIEK',
    },
  };

  const handleCardClick = (styleId: string) => {
    if (onSelectStyle) {
      onSelectStyle(styleId);
    } else {
      onCustomizeStarMap();
    }
  };

  // Render the exact, authentic miniature vector poster for each style matching studio proportions
  const renderExactPosterSVG = (styleId: string) => {
    switch (styleId) {
      case 'midnight_classic':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* Background */}
            <rect width="1000" height="1400" fill="#0B132B" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

            {/* Celestial Circle & Compass */}
            <circle cx="500" cy="480" r="400" fill="#070D1F" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="3" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" strokeDasharray="8 6" />
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

            {/* Nebula */}
            <ellipse cx="485" cy="470" rx="260" ry="160" fill="rgba(255,255,255,0.065)" transform="rotate(-25 485 470)" />

            {/* Constellations */}
            <line x1="330" y1="360" x2="440" y2="295" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
            <line x1="440" y1="295" x2="610" y2="345" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
            <line x1="610" y1="345" x2="710" y2="465" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
            <line x1="380" y1="590" x2="515" y2="640" stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
            <line x1="515" y1="640" x2="645" y2="560" stroke="rgba(255,255,255,0.38)" strokeWidth="2" />

            {/* Stars */}
            <circle cx="330" cy="360" r="7" fill="#FFFFFF" />
            <circle cx="440" cy="295" r="10" fill="#FFFFFF" />
            <circle cx="610" cy="345" r="8" fill="#FFFFFF" />
            <circle cx="710" cy="465" r="7" fill="#FFFFFF" />
            <circle cx="380" cy="590" r="7" fill="#FFFFFF" />
            <circle cx="515" cy="640" r="9" fill="#FFFFFF" />
            <circle cx="645" cy="560" r="8" fill="#FFFFFF" />
            <circle cx="280" cy="480" r="4.5" fill="#FFFFFF" opacity="0.75" />
            <circle cx="560" cy="420" r="3.5" fill="#FFFFFF" opacity="0.65" />
            <circle cx="460" cy="530" r="5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="670" cy="670" r="3.5" fill="#FFFFFF" opacity="0.55" />
            <text x="440" y="270" textAnchor="middle" fill="#FFFFFF" fontSize="30" opacity="0.95">✦</text>

            {/* Exact Proportioned Typography Stack */}
            <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              THE NIGHT WE MET
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              22 SEPTEMBER 2026
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

            {/* Matted Gallery Light Background */}
            <rect width="1000" height="1400" fill="#F5F7F6" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(12,75,86,0.22)" strokeWidth="1.5" />

            {/* Swirling Teal Watercolor Celestial Disk */}
            <circle cx="500" cy="480" r="400" fill="url(#cat-teal-nebula-hq)" stroke="#0C4B56" strokeWidth="3.5" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="8 6" />
            <ellipse cx="485" cy="470" rx="240" ry="140" fill="rgba(255,255,255,0.1)" transform="rotate(-20 485 470)" />

            {/* Constellations */}
            <line x1="330" y1="380" x2="470" y2="320" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
            <line x1="470" y1="320" x2="650" y2="360" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
            <line x1="390" y1="600" x2="580" y2="570" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />

            <circle cx="330" cy="380" r="8" fill="#FFFFFF" />
            <circle cx="470" cy="320" r="10" fill="#FFFFFF" />
            <circle cx="650" cy="360" r="8" fill="#FFFFFF" />
            <circle cx="390" cy="600" r="7" fill="#FFFFFF" />
            <circle cx="580" cy="570" r="8.5" fill="#FFFFFF" />
            <circle cx="530" cy="480" r="4.5" fill="#FFFFFF" opacity="0.85" />
            <circle cx="410" cy="500" r="4" fill="#FFFFFF" opacity="0.75" />
            <text x="470" y="295" textAnchor="middle" fill="#FFFFFF" fontSize="30" opacity="0.95">✦</text>

            {/* Exact Inscription in Deep Teal */}
            <text x="500" y="955" textAnchor="middle" fill="#083B44" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              THE NIGHT WE MET
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#1A5A66" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#0C4B56" fontSize="22">✧</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(12,75,86,0.4)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#1A5A66" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              22 SEPTEMBER 2026
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#3B7580" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              AMSTERDAM, NEDERLAND • 52.3676° N • 4.9041° E
            </text>
          </svg>
        );

      case 'emerald_night':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* British Racing Green Background */}
            <rect width="1000" height="1400" fill="#081C15" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" />

            {/* Inner Forest Sphere */}
            <circle cx="500" cy="480" r="400" fill="#04110C" stroke="#D4AF37" strokeWidth="3.5" />
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

            {/* Cassiopeia W in Gold */}
            <line x1="310" y1="360" x2="400" y2="425" stroke="#D4AF37" strokeWidth="2.2" opacity="0.85" />
            <line x1="400" y1="425" x2="500" y2="350" stroke="#D4AF37" strokeWidth="2.2" opacity="0.85" />
            <line x1="500" y1="350" x2="600" y2="435" stroke="#D4AF37" strokeWidth="2.2" opacity="0.85" />
            <line x1="600" y1="435" x2="690" y2="375" stroke="#D4AF37" strokeWidth="2.2" opacity="0.85" />

            <circle cx="310" cy="360" r="8" fill="#D4AF37" />
            <circle cx="400" cy="425" r="9" fill="#D4AF37" />
            <circle cx="500" cy="350" r="10" fill="#D4AF37" />
            <circle cx="600" cy="435" r="9" fill="#D4AF37" />
            <circle cx="690" cy="375" r="8" fill="#D4AF37" />
            <circle cx="450" cy="600" r="7" fill="#D4AF37" />
            <circle cx="570" cy="630" r="8.5" fill="#D4AF37" />
            <circle cx="370" cy="540" r="4.5" fill="#D4AF37" opacity="0.75" />
            <text x="500" y="325" textAnchor="middle" fill="#D4AF37" fontSize="30" opacity="0.95">✦</text>

            {/* Exact Inscription in Gold */}
            <text x="500" y="955" textAnchor="middle" fill="#D4AF37" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              THE NIGHT WE MET
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#F3E5AB" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="#D4AF37" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#F3E5AB" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              22 SEPTEMBER 2026
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#C9B06B" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              AMSTERDAM, NEDERLAND • 52.3676° N • 4.9041° E
            </text>
          </svg>
        );

      case 'burgundy_sky':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* Velvet Wine Red Background */}
            <rect width="1000" height="1400" fill="#38070E" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,235,238,0.22)" strokeWidth="1.5" />

            {/* Deep Bordeaux Celestial Disk */}
            <circle cx="500" cy="480" r="400" fill="#240308" stroke="rgba(255,235,238,0.45)" strokeWidth="3" />
            <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255,235,238,0.25)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="500" cy="480" r="275" fill="none" stroke="rgba(255,235,238,0.15)" strokeWidth="1" />

            {/* Constellation Lines */}
            <line x1="340" y1="360" x2="480" y2="330" stroke="rgba(255,235,238,0.48)" strokeWidth="2" />
            <line x1="480" y1="330" x2="640" y2="410" stroke="rgba(255,235,238,0.48)" strokeWidth="2" />
            <line x1="480" y1="330" x2="520" y2="510" stroke="rgba(255,235,238,0.42)" strokeWidth="2" />
            <line x1="520" y1="510" x2="660" y2="600" stroke="rgba(255,235,238,0.42)" strokeWidth="2" />

            <circle cx="340" cy="360" r="8" fill="#FFFFFF" />
            <circle cx="480" cy="330" r="10" fill="#FFFFFF" />
            <circle cx="640" cy="410" r="8" fill="#FFFFFF" />
            <circle cx="520" cy="510" r="8" fill="#F7D6DA" />
            <circle cx="660" cy="600" r="9" fill="#FFFFFF" />
            <circle cx="380" cy="560" r="4.5" fill="#F7D6DA" opacity="0.85" />
            <circle cx="580" cy="380" r="4" fill="#FFFFFF" opacity="0.75" />
            <text x="480" y="305" textAnchor="middle" fill="#FFFFFF" fontSize="30" opacity="0.95">✦</text>

            {/* Exact Inscription in Rose / Champagne */}
            <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
              THE NIGHT WE MET
            </text>
            <text x="500" y="1028" textAnchor="middle" fill="#F7D6DA" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <g>
              <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
              <text x="500" y="1094" textAnchor="middle" fill="rgba(255,235,238,0.7)" fontSize="20">✦</text>
              <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,235,238,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1144" textAnchor="middle" fill="#F7D6DA" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              22 SEPTEMBER 2026
            </text>
            <text x="500" y="1195" textAnchor="middle" fill="#D6A6AD" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              AMSTERDAM, NEDERLAND • 52.3676° N • 4.9041° E
            </text>
          </svg>
        );

      case 'border_text':
        return (
          <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <path id="cat-border-arc-hq" d="M 78 480 A 422 422 0 0 1 922 480" fill="none" />
            </defs>

            {/* Deep Navy Canvas */}
            <rect width="1000" height="1400" fill="#0B132B" />
            <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

            {/* Celestial Sphere Background */}
            <circle cx="500" cy="480" r="390" fill="#070D1F" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="3" />
            <circle cx="500" cy="480" r="362" fill="none" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" strokeDasharray="8 6" />

            {/* Signature Curved Inscription Along Outer Arc */}
            <text fill="#FFFFFF" fontSize="34" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="8">
              <textPath href="#cat-border-arc-hq" startOffset="50%" textAnchor="middle">
                THE NIGHT WE MET
              </textPath>
            </text>

            {/* Constellation Lines & Stars */}
            <line x1="360" y1="520" x2="490" y2="490" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
            <line x1="490" y1="490" x2="620" y2="550" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
            <circle cx="360" cy="520" r="8" fill="#FFFFFF" />
            <circle cx="490" cy="490" r="10" fill="#FFFFFF" />
            <circle cx="620" cy="550" r="8" fill="#FFFFFF" />
            <circle cx="430" cy="410" r="6" fill="#FFFFFF" />
            <circle cx="570" cy="395" r="7" fill="#FFFFFF" />
            <text x="490" y="465" textAnchor="middle" fill="#FFFFFF" fontSize="28" opacity="0.95">✦</text>

            {/* Inscription Below */}
            <text x="500" y="990" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="62" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <g>
              <line x1="375" y1="1048" x2="465" y2="1048" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <text x="500" y="1054" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">✦</text>
              <line x1="535" y1="1048" x2="625" y2="1048" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
            <text x="500" y="1108" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
              22 SEPTEMBER 2026
            </text>
            <text x="500" y="1158" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
              AMSTERDAM, NEDERLAND • 52.3676° N • 4.9041° E
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
            <span>5 AMBACHTELIJKE KUNSTSTIJLEN</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            Eén Tijdloos Product, Vijf Verfijnde Stijlen
          </h2>
          <p className="text-[#57534E] text-sm sm:text-base font-light leading-relaxed">
            In onze exclusieve pilot focussen wij ons 100% op het perfectioneren van de gepersonaliseerde sterrenposter. Kies jouw favoriete esthetiek en open direct onze ontwerpstudio.
          </p>
        </div>

        {/* 5 Styles - Placed in 1 line on desktop (lg:grid-cols-5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-4 xl:gap-5">
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
                  {/* Exact Archival Poster Art Presentation (Gallery Frame Mockup) */}
                  <div className="relative aspect-[300/420] rounded-2xl overflow-hidden bg-[#FAF8F5] p-2 border border-[#E8E4DC] shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* Badge */}
                    <span className="absolute top-3.5 left-3.5 z-10 px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase bg-white/95 text-[#1C1917] shadow-sm border border-black/5">
                      {meta.tag}
                    </span>

                    {/* The Exact Vector Poster Art */}
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-md">
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
                        <span className="text-[10px] text-[#A8A29E] line-through mr-1">€68</span>
                        <span className="text-xs font-bold text-[#1C1917]">€49</span>
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
            <span>285 gsm archiefwaardig katoenpapier</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>Slanke 8 mm wissellijsten met mineraalglas</span>
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
