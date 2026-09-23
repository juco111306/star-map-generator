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

  // Render the exact, authentic miniature vector poster for each style
  const renderExactPosterSVG = (styleId: string) => {
    switch (styleId) {
      case 'midnight_classic':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* Background */}
            <rect width="300" height="420" fill="#0B132B" />
            <rect x="12" y="12" width="276" height="396" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />

            {/* Celestial Circle & Compass */}
            <circle cx="150" cy="155" r="95" fill="#070D1F" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" />
            <circle cx="150" cy="155" r="88" fill="none" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="0.6" strokeDasharray="3 2" />
            <circle cx="150" cy="155" r="64" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.5" />

            {/* Cardinal Degree Ticks */}
            <line x1="150" y1="56" x2="150" y2="64" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="150" y1="246" x2="150" y2="254" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="51" y1="155" x2="59" y2="155" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="241" y1="155" x2="249" y2="155" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />

            <text x="150" y="52" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="sans-serif" fontWeight="bold">N</text>
            <text x="150" y="262" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="sans-serif" fontWeight="bold">S</text>
            <text x="46" y="157" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="sans-serif" fontWeight="bold">W</text>
            <text x="254" y="157" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="sans-serif" fontWeight="bold">E</text>

            {/* Nebula */}
            <ellipse cx="145" cy="150" rx="60" ry="38" fill="rgba(255,255,255,0.06)" transform="rotate(-25 145 150)" />

            {/* Constellations */}
            <line x1="108" y1="125" x2="135" y2="108" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <line x1="135" y1="108" x2="175" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <line x1="175" y1="120" x2="198" y2="150" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <line x1="122" y1="182" x2="154" y2="195" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
            <line x1="154" y1="195" x2="185" y2="174" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />

            {/* Stars */}
            <circle cx="108" cy="125" r="2.2" fill="#FFFFFF" />
            <circle cx="135" cy="108" r="3.0" fill="#FFFFFF" />
            <circle cx="175" cy="120" r="2.5" fill="#FFFFFF" />
            <circle cx="198" cy="150" r="2.0" fill="#FFFFFF" />
            <circle cx="122" cy="182" r="2.0" fill="#FFFFFF" />
            <circle cx="154" cy="195" r="2.6" fill="#FFFFFF" />
            <circle cx="185" cy="174" r="2.2" fill="#FFFFFF" />
            <circle cx="100" cy="160" r="1.2" fill="#FFFFFF" opacity="0.75" />
            <circle cx="168" cy="144" r="1.0" fill="#FFFFFF" opacity="0.65" />
            <circle cx="140" cy="168" r="1.4" fill="#FFFFFF" opacity="0.8" />
            <circle cx="190" cy="190" r="1.0" fill="#FFFFFF" opacity="0.55" />
            <text x="135" y="101" textAnchor="middle" fill="#FFFFFF" fontSize="9" opacity="0.95">✦</text>

            {/* Exact Typography Stack */}
            <text x="150" y="286" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="serif" fontWeight="700" letterSpacing="2.5">
              THE NIGHT WE MET
            </text>
            <text x="150" y="310" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="14" fontFamily="cursive" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <text x="150" y="330" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">✦</text>
            <text x="150" y="348" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.8">
              22 SEPTEMBER 2026
            </text>
            <text x="150" y="364" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6.5" fontFamily="monospace" letterSpacing="1.2">
              52.3676° N • 4.9041° E
            </text>
          </svg>
        );

      case 'teal_watercolor':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="cat-teal-nebula" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1E889B" />
                <stop offset="45%" stopColor="#0E5866" />
                <stop offset="85%" stopColor="#083B44" />
                <stop offset="100%" stopColor="#05252B" />
              </radialGradient>
            </defs>

            {/* Matted Gallery Light Background */}
            <rect width="300" height="420" fill="#F5F7F6" />
            <rect x="12" y="12" width="276" height="396" fill="none" stroke="rgba(12,75,86,0.18)" strokeWidth="0.8" />

            {/* Swirling Teal Watercolor Celestial Disk */}
            <circle cx="150" cy="155" r="95" fill="url(#cat-teal-nebula)" stroke="#0C4B56" strokeWidth="1.4" />
            <circle cx="150" cy="155" r="88" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.6" strokeDasharray="3 2" />
            <ellipse cx="145" cy="150" rx="55" ry="32" fill="rgba(255,255,255,0.1)" transform="rotate(-20 145 150)" />

            {/* Constellations */}
            <line x1="110" y1="135" x2="145" y2="118" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" />
            <line x1="145" y1="118" x2="188" y2="130" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" />
            <line x1="126" y1="184" x2="172" y2="176" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />

            <circle cx="110" cy="135" r="2.4" fill="#FFFFFF" />
            <circle cx="145" cy="118" r="3.0" fill="#FFFFFF" />
            <circle cx="188" cy="130" r="2.4" fill="#FFFFFF" />
            <circle cx="126" cy="184" r="2.0" fill="#FFFFFF" />
            <circle cx="172" cy="176" r="2.5" fill="#FFFFFF" />
            <circle cx="160" cy="150" r="1.3" fill="#FFFFFF" opacity="0.85" />
            <circle cx="125" cy="160" r="1.2" fill="#FFFFFF" opacity="0.75" />
            <text x="145" y="111" textAnchor="middle" fill="#FFFFFF" fontSize="9" opacity="0.95">✦</text>

            {/* Exact Inscription in Deep Teal */}
            <text x="150" y="286" textAnchor="middle" fill="#083B44" fontSize="9.5" fontFamily="serif" fontWeight="700" letterSpacing="2.2">
              THE NIGHT WE MET
            </text>
            <text x="150" y="310" textAnchor="middle" fill="#1A5A66" fontSize="14" fontFamily="cursive" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <text x="150" y="330" textAnchor="middle" fill="#0C4B56" fontSize="9">✧</text>
            <text x="150" y="348" textAnchor="middle" fill="#1A5A66" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.8">
              22 SEPTEMBER 2026
            </text>
            <text x="150" y="364" textAnchor="middle" fill="#3B7580" fontSize="6.5" fontFamily="monospace" letterSpacing="1.2">
              AMSTERDAM, NEDERLAND
            </text>
          </svg>
        );

      case 'emerald_night':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* British Racing Green Background */}
            <rect width="300" height="420" fill="#081C15" />
            <rect x="12" y="12" width="276" height="396" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8" />

            {/* Inner Forest Sphere */}
            <circle cx="150" cy="155" r="95" fill="#04110C" stroke="#D4AF37" strokeWidth="1.4" />
            <circle cx="150" cy="155" r="88" fill="none" stroke="rgba(212,175,55,0.35)" strokeWidth="0.6" strokeDasharray="3 2" />
            <circle cx="150" cy="155" r="64" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />

            {/* Cardinal Ticks */}
            <line x1="150" y1="56" x2="150" y2="64" stroke="#D4AF37" strokeWidth="1" />
            <line x1="150" y1="246" x2="150" y2="254" stroke="#D4AF37" strokeWidth="1" />
            <line x1="51" y1="155" x2="59" y2="155" stroke="#D4AF37" strokeWidth="1" />
            <line x1="241" y1="155" x2="249" y2="155" stroke="#D4AF37" strokeWidth="1" />

            <text x="150" y="52" textAnchor="middle" fill="#D4AF37" fontSize="6" fontFamily="sans-serif" fontWeight="bold">N</text>
            <text x="150" y="262" textAnchor="middle" fill="#D4AF37" fontSize="6" fontFamily="sans-serif" fontWeight="bold">S</text>
            <text x="46" y="157" textAnchor="middle" fill="#D4AF37" fontSize="6" fontFamily="sans-serif" fontWeight="bold">W</text>
            <text x="254" y="157" textAnchor="middle" fill="#D4AF37" fontSize="6" fontFamily="sans-serif" fontWeight="bold">E</text>

            {/* Cassiopeia W in Gold */}
            <line x1="102" y1="125" x2="126" y2="142" stroke="#D4AF37" strokeWidth="0.9" opacity="0.8" />
            <line x1="126" y1="142" x2="150" y2="123" stroke="#D4AF37" strokeWidth="0.9" opacity="0.8" />
            <line x1="150" y1="123" x2="174" y2="144" stroke="#D4AF37" strokeWidth="0.9" opacity="0.8" />
            <line x1="174" y1="144" x2="198" y2="130" stroke="#D4AF37" strokeWidth="0.9" opacity="0.8" />

            <circle cx="102" cy="125" r="2.4" fill="#D4AF37" />
            <circle cx="126" cy="142" r="2.6" fill="#D4AF37" />
            <circle cx="150" cy="123" r="3.0" fill="#D4AF37" />
            <circle cx="174" cy="144" r="2.6" fill="#D4AF37" />
            <circle cx="198" cy="130" r="2.4" fill="#D4AF37" />
            <circle cx="138" cy="180" r="2.0" fill="#D4AF37" />
            <circle cx="166" cy="188" r="2.4" fill="#D4AF37" />
            <circle cx="118" cy="168" r="1.2" fill="#D4AF37" opacity="0.75" />
            <text x="150" y="116" textAnchor="middle" fill="#D4AF37" fontSize="9" opacity="0.95">✦</text>

            {/* Exact Inscription in Gold */}
            <text x="150" y="286" textAnchor="middle" fill="#D4AF37" fontSize="10" fontFamily="serif" fontWeight="700" letterSpacing="2.5">
              THE NIGHT WE MET
            </text>
            <text x="150" y="310" textAnchor="middle" fill="#F3E5AB" fontSize="14" fontFamily="cursive" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <text x="150" y="330" textAnchor="middle" fill="#D4AF37" fontSize="9">✦</text>
            <text x="150" y="348" textAnchor="middle" fill="#F3E5AB" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.8">
              22 SEPTEMBER 2026
            </text>
            <text x="150" y="364" textAnchor="middle" fill="#C9B06B" fontSize="6.5" fontFamily="monospace" letterSpacing="1.2">
              52.3676° N • 4.9041° E
            </text>
          </svg>
        );

      case 'burgundy_sky':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            {/* Velvet Wine Red Background */}
            <rect width="300" height="420" fill="#38070E" />
            <rect x="12" y="12" width="276" height="396" fill="none" stroke="rgba(255,235,238,0.18)" strokeWidth="0.8" />

            {/* Deep Bordeaux Celestial Disk */}
            <circle cx="150" cy="155" r="95" fill="#240308" stroke="rgba(255,235,238,0.45)" strokeWidth="1.2" />
            <circle cx="150" cy="155" r="88" fill="none" stroke="rgba(255,235,238,0.25)" strokeWidth="0.6" strokeDasharray="3 2" />
            <circle cx="150" cy="155" r="64" fill="none" stroke="rgba(255,235,238,0.15)" strokeWidth="0.5" />

            {/* Constellation Lines */}
            <line x1="115" y1="125" x2="146" y2="116" stroke="rgba(255,235,238,0.45)" strokeWidth="0.8" />
            <line x1="146" y1="116" x2="186" y2="138" stroke="rgba(255,235,238,0.45)" strokeWidth="0.8" />
            <line x1="146" y1="116" x2="155" y2="160" stroke="rgba(255,235,238,0.4)" strokeWidth="0.8" />
            <line x1="155" y1="160" x2="190" y2="182" stroke="rgba(255,235,238,0.4)" strokeWidth="0.8" />

            <circle cx="115" cy="125" r="2.4" fill="#FFFFFF" />
            <circle cx="146" cy="116" r="3.0" fill="#FFFFFF" />
            <circle cx="186" cy="138" r="2.4" fill="#FFFFFF" />
            <circle cx="155" cy="160" r="2.3" fill="#F7D6DA" />
            <circle cx="190" cy="182" r="2.6" fill="#FFFFFF" />
            <circle cx="120" cy="172" r="1.3" fill="#F7D6DA" opacity="0.85" />
            <circle cx="170" cy="128" r="1.1" fill="#FFFFFF" opacity="0.75" />
            <text x="146" y="109" textAnchor="middle" fill="#FFFFFF" fontSize="9" opacity="0.95">✦</text>

            {/* Exact Inscription in Rose / Champagne */}
            <text x="150" y="286" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="serif" fontWeight="700" letterSpacing="2.5">
              THE NIGHT WE MET
            </text>
            <text x="150" y="310" textAnchor="middle" fill="#F7D6DA" fontSize="14" fontFamily="cursive" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <text x="150" y="330" textAnchor="middle" fill="rgba(255,235,238,0.6)" fontSize="9">✦</text>
            <text x="150" y="348" textAnchor="middle" fill="#F7D6DA" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.8">
              22 SEPTEMBER 2026
            </text>
            <text x="150" y="364" textAnchor="middle" fill="#D6A6AD" fontSize="6.5" fontFamily="monospace" letterSpacing="1.2">
              52.3676° N • 4.9041° E
            </text>
          </svg>
        );

      case 'border_text':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <path id="cat-border-arc" d="M 50 155 A 100 100 0 0 1 250 155" fill="none" />
            </defs>

            {/* Deep Navy Canvas */}
            <rect width="300" height="420" fill="#0B132B" />
            <rect x="12" y="12" width="276" height="396" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />

            {/* Celestial Sphere Background */}
            <circle cx="150" cy="155" r="90" fill="#070D1F" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" />
            <circle cx="150" cy="155" r="82" fill="none" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="0.6" strokeDasharray="3 2" />

            {/* Signature Curved Inscription Along Outer Arc */}
            <text fill="#FFFFFF" fontSize="9.5" fontWeight="700" letterSpacing="2.8">
              <textPath href="#cat-border-arc" startOffset="50%" textAnchor="middle">
                THE NIGHT WE MET
              </textPath>
            </text>

            {/* Constellation Lines & Stars */}
            <line x1="120" y1="168" x2="152" y2="160" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <line x1="152" y1="160" x2="182" y2="175" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <circle cx="120" cy="168" r="2.4" fill="#FFFFFF" />
            <circle cx="152" cy="160" r="3.0" fill="#FFFFFF" />
            <circle cx="182" cy="175" r="2.4" fill="#FFFFFF" />
            <circle cx="138" cy="135" r="1.8" fill="#FFFFFF" />
            <circle cx="168" cy="130" r="2.2" fill="#FFFFFF" />
            <text x="152" y="152" textAnchor="middle" fill="#FFFFFF" fontSize="9" opacity="0.95">✦</text>

            {/* Inscription Below */}
            <text x="150" y="300" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15" fontFamily="cursive" fontStyle="italic">
              Emma &amp; Daan
            </text>
            <text x="150" y="324" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">✦</text>
            <text x="150" y="344" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.8">
              22 SEPTEMBER 2026
            </text>
            <text x="150" y="360" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6.5" fontFamily="monospace" letterSpacing="1.2">
              52.3676° N • 4.9041° E
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
