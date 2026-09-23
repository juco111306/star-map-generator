'use client';

import React from 'react';
import { DESIGN_STYLES } from '../constants/styles';
import { Check, Sparkles, Compass } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onSelectStyle,
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {DESIGN_STYLES.map((style) => {
          const isSelected = style.id === selectedStyleId;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#1C1917] bg-[#FAF8F5] ring-2 ring-[#1C1917] shadow-md'
                  : 'border-[#E2DDD5] bg-[#FAF8F5]/60 hover:bg-white hover:border-[#1C1917] shadow-sm'
              }`}
            >
              {/* Top Miniature Artisan Vector Artwork Swatch */}
              <div
                className="w-full h-24 rounded-xl mb-2.5 relative overflow-hidden flex items-center justify-center border border-black/10 shadow-inner"
                style={{ backgroundColor: style.bgColor }}
              >
                {/* 1. Midnight Classic Miniature Artwork */}
                {style.id === 'midnight_classic' && (
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="#070D1F" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    {/* Cardinal ticks */}
                    <line x1="50" y1="8" x2="50" y2="12" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                    <line x1="50" y1="88" x2="50" y2="92" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                    <line x1="8" y1="50" x2="12" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                    <line x1="88" y1="50" x2="92" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                    {/* Constellation Lines */}
                    <line x1="32" y1="36" x2="44" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                    <line x1="44" y1="28" x2="62" y2="34" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                    <line x1="62" y1="34" x2="72" y2="48" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                    <line x1="38" y1="62" x2="52" y2="68" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                    <line x1="52" y1="68" x2="66" y2="58" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                    {/* Stars */}
                    <circle cx="32" cy="36" r="1.6" fill="#FFFFFF" />
                    <circle cx="44" cy="28" r="2.2" fill="#FFFFFF" />
                    <circle cx="62" cy="34" r="1.8" fill="#FFFFFF" />
                    <circle cx="72" cy="48" r="1.5" fill="#FFFFFF" />
                    <circle cx="38" cy="62" r="1.5" fill="#FFFFFF" />
                    <circle cx="52" cy="68" r="2.0" fill="#FFFFFF" />
                    <circle cx="66" cy="58" r="1.7" fill="#FFFFFF" />
                    {/* Background stellar dust */}
                    <circle cx="28" cy="52" r="0.9" fill="#FFFFFF" opacity="0.7" />
                    <circle cx="58" cy="44" r="0.8" fill="#FFFFFF" opacity="0.6" />
                    <circle cx="46" cy="54" r="1.1" fill="#FFFFFF" opacity="0.8" />
                    <circle cx="68" cy="68" r="0.8" fill="#FFFFFF" opacity="0.5" />
                    {/* North Star ✦ */}
                    <text x="44" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="7" opacity="0.95">✦</text>
                  </svg>
                )}

                {/* 2. Teal Watercolor Miniature Artwork */}
                {style.id === 'teal_watercolor' && (
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <defs>
                      <radialGradient id="thumb-teal-grad" cx="45%" cy="45%" r="55%">
                        <stop offset="0%" stopColor="#1E889B" />
                        <stop offset="50%" stopColor="#0E5866" />
                        <stop offset="100%" stopColor="#083B44" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="42" fill="url(#thumb-teal-grad)" stroke="#0C4B56" strokeWidth="1.2" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                    {/* Nebula stardust swirls */}
                    <ellipse cx="48" cy="48" rx="26" ry="18" fill="rgba(255,255,255,0.08)" transform="rotate(-20 48 48)" />
                    {/* Constellations in bright cyan-white */}
                    <line x1="30" y1="42" x2="48" y2="32" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                    <line x1="48" y1="32" x2="68" y2="38" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                    <line x1="38" y1="64" x2="60" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                    <circle cx="30" cy="42" r="1.8" fill="#FFFFFF" />
                    <circle cx="48" cy="32" r="2.2" fill="#FFFFFF" />
                    <circle cx="68" cy="38" r="1.8" fill="#FFFFFF" />
                    <circle cx="38" cy="64" r="1.5" fill="#FFFFFF" />
                    <circle cx="60" cy="60" r="1.8" fill="#FFFFFF" />
                    <circle cx="54" cy="48" r="1.0" fill="#FFFFFF" opacity="0.8" />
                    <circle cx="36" cy="54" r="0.9" fill="#FFFFFF" opacity="0.7" />
                  </svg>
                )}

                {/* 3. Emerald Night Miniature Artwork */}
                {style.id === 'emerald_night' && (
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="#04110C" stroke="#D4AF37" strokeWidth="1.2" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
                    {/* Metallic Gold Constellation: Cassiopeia "W" */}
                    <line x1="26" y1="36" x2="38" y2="44" stroke="#D4AF37" strokeWidth="0.9" opacity="0.75" />
                    <line x1="38" y1="44" x2="50" y2="35" stroke="#D4AF37" strokeWidth="0.9" opacity="0.75" />
                    <line x1="50" y1="35" x2="62" y2="45" stroke="#D4AF37" strokeWidth="0.9" opacity="0.75" />
                    <line x1="62" y1="45" x2="74" y2="38" stroke="#D4AF37" strokeWidth="0.9" opacity="0.75" />
                    <circle cx="26" cy="36" r="1.8" fill="#D4AF37" />
                    <circle cx="38" cy="44" r="2.0" fill="#D4AF37" />
                    <circle cx="50" cy="35" r="2.2" fill="#D4AF37" />
                    <circle cx="62" cy="45" r="2.0" fill="#D4AF37" />
                    <circle cx="74" cy="38" r="1.8" fill="#D4AF37" />
                    <circle cx="44" cy="62" r="1.6" fill="#D4AF37" />
                    <circle cx="58" cy="66" r="1.9" fill="#D4AF37" />
                    <circle cx="34" cy="56" r="0.9" fill="#D4AF37" opacity="0.7" />
                    <text x="50" y="24" textAnchor="middle" fill="#D4AF37" fontSize="7" opacity="0.95">✦</text>
                  </svg>
                )}

                {/* 4. Burgundy Sky Miniature Artwork */}
                {style.id === 'burgundy_sky' && (
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="#240308" stroke="rgba(255,235,238,0.4)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,235,238,0.22)" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,235,238,0.15)" strokeWidth="0.5" />
                    {/* Romantic Star Constellation */}
                    <line x1="34" y1="36" x2="48" y2="32" stroke="rgba(255,235,238,0.5)" strokeWidth="0.8" />
                    <line x1="48" y1="32" x2="66" y2="42" stroke="rgba(255,235,238,0.5)" strokeWidth="0.8" />
                    <line x1="48" y1="32" x2="52" y2="52" stroke="rgba(255,235,238,0.4)" strokeWidth="0.8" />
                    <line x1="52" y1="52" x2="68" y2="62" stroke="rgba(255,235,238,0.4)" strokeWidth="0.8" />
                    <circle cx="34" cy="36" r="1.8" fill="#FFFFFF" />
                    <circle cx="48" cy="32" r="2.2" fill="#FFFFFF" />
                    <circle cx="66" cy="42" r="1.8" fill="#FFFFFF" />
                    <circle cx="52" cy="52" r="1.7" fill="#F7D6DA" />
                    <circle cx="68" cy="62" r="2.0" fill="#FFFFFF" />
                    <circle cx="36" cy="58" r="1.0" fill="#F7D6DA" opacity="0.8" />
                    <circle cx="58" cy="38" r="0.9" fill="#FFFFFF" opacity="0.7" />
                  </svg>
                )}

                {/* 5. Border Text Miniature Artwork */}
                {style.id === 'border_text' && (
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <defs>
                      <path id="preview-arc" d="M 16 50 A 34 34 0 0 1 84 50" fill="none" />
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="#070D1F" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                    {/* Arched typography perimeter */}
                    <text fill="#FFFFFF" fontSize="5.2" fontWeight="600" letterSpacing="1.2">
                      <textPath href="#preview-arc" startOffset="50%" textAnchor="middle">
                        THE NIGHT WE MET
                      </textPath>
                    </text>
                    {/* Stars inside */}
                    <line x1="38" y1="56" x2="52" y2="52" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                    <line x1="52" y1="52" x2="64" y2="60" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                    <circle cx="38" cy="56" r="1.6" fill="#FFFFFF" />
                    <circle cx="52" cy="52" r="2.0" fill="#FFFFFF" />
                    <circle cx="64" cy="60" r="1.7" fill="#FFFFFF" />
                    <circle cx="50" cy="66" r="1.0" fill="#FFFFFF" opacity="0.7" />
                  </svg>
                )}

                {/* Active checkmark badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-[#1C1917] flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#1C1917]">
                    {style.name}
                  </h4>
                  {style.isWatercolor && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-[#083B44]/10 text-[#083B44]">
                      Watercolor
                    </span>
                  )}
                  {style.curvedText && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-[#A37055]/15 text-[#A37055]">
                      Curved
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
                      className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.bgColor }}
                      title={`Poster Background: ${style.bgColor}`}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.mapBgColor }}
                      title={`Sky Map Color: ${style.mapBgColor}`}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.starColor }}
                      title={`Star Color: ${style.starColor}`}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: style.borderColor.startsWith('rgba') ? style.textColor : style.borderColor }}
                      title="Accent Trim"
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
