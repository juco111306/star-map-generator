'use client';

import React from 'react';
import { ArrowRight, Star, Sparkles, ShieldCheck, Heart, Award, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { AppView } from '../types';
import { SAMPLE_STARS, SAMPLE_CONSTELLATION_LINES, SAMPLE_CONSTELLATION_STARS } from '../constants/sampleCelestialData';

interface LandingHeroProps {
  onNavigate: (view: AppView) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate }) => {
  const handleScrollToStyles = () => {
    const el = document.getElementById('stijlen');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('customizer');
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24 bg-[#FAF8F5]">
      {/* Soft natural ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#F2EDE2] rounded-full blur-[120px] -z-10 pointer-events-none opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Storytelling & Emotional Tone */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3EFE7] border border-[#E4DDD0] text-[#78716C] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
              <span>Exclusieve Pilot Editie • Nederland & België</span>
            </div>

            {/* Main Emotive Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C1917] leading-[1.18]">
              Cadeaus die vasthouden <br />
              <span className="italic text-[#A37055]">wat woorden niet kunnen.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#57534E] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              De exacte stand van de sterren op het moment dat jullie elkaar ontmoetten, elkaar het jawoord gaven of een nieuw leven verwelkomden. Wetenschappelijk berekend via NASA-astronomie en met de hand ingelijst in museumkwaliteit.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={() => onNavigate('customizer')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>Ontwerp jouw sterrenkaart</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleScrollToStyles}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F2EB] text-[#292524] border border-[#D6D0C7] font-medium text-xs tracking-wide transition-all shadow-sm"
              >
                Bekijk de 5 Kunststijlen
              </button>
            </div>

            {/* Gentle Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start space-x-3 text-xs text-[#78716C]">
              <div className="flex items-center text-[#A37055]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#A37055]" />
                ))}
              </div>
              <span>
                <strong className="text-[#1C1917] font-medium">4.98 / 5.0</strong> uit meer dan 3.200+ dierbare herinneringen
              </span>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase in Serene Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-[460px]">
              {/* Soft warm shadow */}
              <div className="absolute -inset-2 rounded-[32px] bg-[#E8E1D3]/50 blur-xl opacity-80" />

              {/* Framed Artwork Presentation */}
              <div className="relative rounded-[28px] bg-white border border-[#EBE7DF] p-4 shadow-[0_20px_50px_rgba(40,30,20,0.08)]">
                {/* Artwork Thumbnail with exact studio proportions */}
                <div
                  onClick={() => onNavigate('customizer')}
                  className="relative rounded-2xl overflow-hidden aspect-[5/7] bg-[#0B132B] cursor-pointer border border-[#E5E0D6] group-hover:border-[#C4BAA9] transition-all shadow-inner"
                >
                  <svg viewBox="0 0 1000 1400" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <clipPath id="hero-celestial-mask">
                        <circle cx="500" cy="480" r="399" />
                      </clipPath>
                      <filter id="hero-star-glow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Archival Canvas Background */}
                    <rect width="1000" height="1400" fill="#0B132B" />
                    
                    {/* Inner Fine Matting Keyline */}
                    <rect x="36" y="36" width="928" height="1328" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

                    {/* Celestial Sphere Masked Contents */}
                    <g clipPath="url(#hero-celestial-mask)">
                      {/* Deep Midnight Blue Disk Base */}
                      <circle cx="500" cy="480" r="400" fill="#070D1F" />

                      {/* Milky Way Soft Luminous Nebula */}
                      <ellipse cx="485" cy="470" rx="300" ry="180" fill="rgba(255,255,255,0.075)" transform="rotate(-25 485 470)" />
                      <ellipse cx="510" cy="495" rx="240" ry="120" fill="rgba(255,255,255,0.045)" transform="rotate(-32 510 495)" />

                      {/* Authentic Constellation Lines */}
                      {SAMPLE_CONSTELLATION_LINES.map((line, idx) => (
                        <line
                          key={idx}
                          x1={500 + line.x1 * 400}
                          y1={480 - line.y1 * 400}
                          x2={500 + line.x2 * 400}
                          y2={480 - line.y2 * 400}
                          stroke="rgba(255, 255, 255, 0.42)"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      ))}

                      {/* Full Visible Astronomical Stars */}
                      {SAMPLE_STARS.map((s, idx) => (
                        <circle
                          key={idx}
                          cx={500 + s.x * 400}
                          cy={480 - s.y * 400}
                          r={s.r}
                          fill="#FFFFFF"
                          opacity={s.bright ? 1.0 : 0.88}
                          filter={s.bright ? 'url(#hero-star-glow)' : undefined}
                        />
                      ))}

                      {/* Major Constellation Vertex Stars */}
                      {SAMPLE_CONSTELLATION_STARS.map((s, idx) => (
                        <circle
                          key={`cs-${idx}`}
                          cx={500 + s.x * 400}
                          cy={480 - s.y * 400}
                          r={s.r}
                          fill="#FFFFFF"
                          opacity={0.98}
                          filter="url(#hero-star-glow)"
                        />
                      ))}

                      {/* North Star ✦ at celestial pole */}
                      <text x="496" y="265" textAnchor="middle" fill="#FFFFFF" fontSize="32" opacity="0.95">✦</text>
                    </g>

                    {/* Celestial Boundary Rings & Compass */}
                    <circle cx="500" cy="480" r="400" fill="none" stroke="rgba(255, 255, 255, 0.48)" strokeWidth="3" />
                    <circle cx="500" cy="480" r="372" fill="none" stroke="rgba(255, 255, 255, 0.24)" strokeWidth="1.5" strokeDasharray="8 6" />
                    <circle cx="500" cy="480" r="275" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

                    {/* Compass Cardinal Degree Ticks */}
                    <line x1="500" y1="72" x2="500" y2="92" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
                    <line x1="500" y1="868" x2="500" y2="888" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
                    <line x1="92" y1="480" x2="112" y2="480" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
                    <line x1="888" y1="480" x2="908" y2="480" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />

                    <text x="500" y="60" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">N</text>
                    <text x="500" y="915" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">S</text>
                    <text x="75" y="487" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">W</text>
                    <text x="925" y="487" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="bold">E</text>

                    {/* Prominent, Harmonious Studio Typography Proportions */}
                    {/* 1. Main Title Inscription */}
                    <text x="500" y="955" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontFamily="Cinzel, serif" fontWeight="700" letterSpacing="4.5">
                      THE NIGHT WE MET
                    </text>

                    {/* 2. Couple Calligraphy Names */}
                    <text x="500" y="1028" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="60" fontFamily="'Great Vibes', cursive, serif" fontStyle="italic">
                      Emma &amp; Daan
                    </text>

                    {/* 3. Decorative Divider */}
                    <g>
                      <line x1="375" y1="1088" x2="465" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                      <text x="500" y="1094" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">✦</text>
                      <line x1="535" y1="1088" x2="625" y2="1088" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                    </g>

                    {/* 4. Significant Date */}
                    <text x="500" y="1144" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="3.5">
                      22 SEPTEMBER 2026
                    </text>

                    {/* 5. Location & GPS Coordinates */}
                    <text x="500" y="1195" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="500" letterSpacing="2.2">
                      AMSTERDAM, NEDERLAND • 52.3676° N • 4.9041° E
                    </text>
                  </svg>

                  {/* Understated Minimalist Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-[#E7E3DC] px-3 py-1 rounded-full text-[10px] font-medium text-[#1C1917] tracking-wider shadow-sm">
                    EXCLUSIEVE PILOT EDITIE
                  </div>

                  {/* Hover Prompt */}
                  <div className="absolute inset-0 bg-[#1C1917]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white text-[#1C1917] font-semibold text-xs shadow-xl flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <span>Personaliseer in Atelier Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="pt-3.5 px-1 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#1C1917] tracking-wide">
                      De Gepersonaliseerde Sterrenposter
                    </h3>
                    <p className="text-[11px] text-[#78716C] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#A37055]" />
                      <span>Amsterdam • 21:00 • 285 gsm Fine-Art</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#A8A29E] line-through block">€68,00</span>
                    <span className="font-serif text-sm font-bold text-[#1C1917]">vanaf €49,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 pt-10 border-t border-[#EAE5DC] grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] flex items-center justify-center text-[#A37055] shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1C1917]">Echte NASA Sterrendata</h4>
              <p className="text-[11px] text-[#78716C]">Wetenschappelijk nauwkeurig</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] flex items-center justify-center text-[#A37055] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1C1917]">Gratis Verzending NL & BE</h4>
              <p className="text-[11px] text-[#78716C]">Via PostNL & Bpost Track & Trace</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] flex items-center justify-center text-[#A37055] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1C1917]">285 gsm Katoenpapier</h4>
              <p className="text-[11px] text-[#78716C]">Museum archiefkwaliteit</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] flex items-center justify-center text-[#A37055] shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1C1917]">Ambachtelijk Ingelijst</h4>
              <p className="text-[11px] text-[#78716C]">Slanke 8 mm fotolijsten</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
