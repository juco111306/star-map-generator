'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Mail, Heart } from 'lucide-react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#F4F0E8] border-t border-[#E8E2D7] pt-16 pb-12 text-[#78716C] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E4DED2]">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EFE9DF] border border-[#DDD6C8] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
              </div>
              <span className="font-serif text-base font-bold text-[#1C1917] tracking-wider">
                STELLAIRE ATELIER
              </span>
            </div>
            <p className="text-[11px] text-[#57534E] leading-relaxed font-light">
              An artisan studio devoted to thoughtful personalized keepsakes. From astronomical celestial alignments to carved American walnut and embroidered organic cotton.
            </p>
          </div>

          {/* Collection Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider">
              The Keepsake Collection
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('customizer')}
                  className="hover:text-[#A37055] transition-colors"
                >
                  The Celestial Blueprint™ (Star Map)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  The Heritage Walnut Keepsake Box
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  Embroidered Monogram Cloud Socks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  True North: Coordinates Art Print
                </button>
              </li>
            </ul>
          </div>

          {/* Workshop & Standards */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider">
              Artisan Standards
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>300 DPI Archival Heavy Cotton Paper</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>Solid Natural Hardwoods & Wax Finishes</span>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('producer')}
                  className="text-[#A37055] hover:underline font-semibold"
                >
                  Print Workshop Order Queue &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Concierge */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider">
              Studio Concierge
            </h4>
            <p className="text-[11px] leading-relaxed text-[#57534E] font-light">
              Questions regarding custom coordinates, special inscriptions, or custom sizing?
            </p>
            <div className="p-3 bg-white rounded-xl border border-[#E4DED2] text-[11px] space-y-0.5 shadow-sm">
              <span className="text-[#78716C] block">Artisan Concierge Email:</span>
              <span className="text-[#1C1917] font-mono">concierge@stellaireatelier.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A8A29E] gap-4">
          <p>© {new Date().getFullYear()} Stellaire Atelier. Thoughtfully crafted to order with enduring emotional care.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#57534E] cursor-pointer">Care & Materials</span>
            <span className="hover:text-[#57534E] cursor-pointer">Archival Guarantee</span>
            <span className="hover:text-[#57534E] cursor-pointer">Gift Packaging</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
