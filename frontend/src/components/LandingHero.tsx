'use client';

import React from 'react';
import { ArrowRight, Star, Sparkles, ShieldCheck, Heart, Award, MapPin, Gift, Feather } from 'lucide-react';
import { AppView } from '../types';

interface LandingHeroProps {
  onNavigate: (view: AppView) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-[#FAF8F5]">
      {/* Soft natural ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#F2EDE2] rounded-full blur-[120px] -z-10 pointer-events-none opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Storytelling & Emotional Tone */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3EFE7] border border-[#E4DDD0] text-[#78716C] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
              <span>Thoughtful Keepsakes Crafted with Archival Care</span>
            </div>

            {/* Main Emotive Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C1917] leading-[1.18]">
              Gifts made to hold <br />
              <span className="italic text-[#A37055]">what words cannot.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#57534E] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              From the exact alignment of the stars on the night you first met, to hand-embroidered organic textiles and carved solid walnut heirlooms. Every gift is made to order with quiet simplicity and enduring emotional value.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={() => onNavigate('customizer')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>Personalize &ldquo;The Celestial Blueprint™&rdquo;</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F2EB] text-[#292524] border border-[#D6D0C7] font-medium text-xs tracking-wide transition-all shadow-sm"
              >
                Explore All Keepsakes
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
                <strong className="text-[#1C1917] font-medium">4.98 / 5.0</strong> from over 3,200+ heartfelt milestone moments
              </span>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase in Serene Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-[400px]">
              {/* Soft warm shadow */}
              <div className="absolute -inset-2 rounded-[32px] bg-[#E8E1D3]/50 blur-xl opacity-80" />

              {/* Framed Artwork Presentation */}
              <div className="relative rounded-[28px] bg-white border border-[#EBE7DF] p-4 shadow-[0_20px_50px_rgba(40,30,20,0.08)]">
                {/* Artwork Thumbnail with soft cream mat */}
                <div
                  onClick={() => onNavigate('customizer')}
                  className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#060D1E] cursor-pointer border border-[#E5E0D6] group-hover:border-[#C4BAA9] transition-colors shadow-inner"
                >
                  <img
                    src="/textures/star_map_sample.png"
                    alt="The Celestial Blueprint Custom Star Map Print"
                    className="w-full h-full object-cover transform group-hover:scale-[1.015] transition-transform duration-500"
                  />

                  {/* Understated Minimalist Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-[#E7E3DC] px-3 py-1 rounded-full text-[10px] font-medium text-[#1C1917] tracking-wider shadow-sm">
                    FLAGSHIP KEEPSAKE
                  </div>

                  {/* Hover Prompt */}
                  <div className="absolute inset-0 bg-[#1C1917]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white text-[#1C1917] font-semibold text-xs shadow-xl flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <span>Personalize in Atelier Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="pt-3.5 px-1 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#1C1917] tracking-wide">
                      The Celestial Blueprint™
                    </h3>
                    <p className="text-[11px] text-[#78716C] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#A37055]" />
                      <span>New York, NY • September 22, 2026</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs line-through text-[#A8A29E] block">$68.00</span>
                    <span className="text-sm font-semibold text-[#1C1917]">$49.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Craftsmanship Highlights */}
        <div className="mt-16 pt-8 border-t border-[#EAE5DC] grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#A37055]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1C1917]">Astronomical Precision</h4>
              <p className="text-[11px] text-[#78716C]">8,870 stars via NASA ephemeris</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-[#A37055]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1C1917]">Archival Fine Art Paper</h4>
              <p className="text-[11px] text-[#78716C]">300 DPI heavy cotton rag</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-center shrink-0">
              <Feather className="w-4 h-4 text-[#A37055]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1C1917]">Natural Solid Wood</h4>
              <p className="text-[11px] text-[#78716C]">Sustainably harvested walnut & oak</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-[#A37055]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1C1917]">Keepsake Packaging</h4>
              <p className="text-[11px] text-[#78716C]">Wax seals & complimentary gift notes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
