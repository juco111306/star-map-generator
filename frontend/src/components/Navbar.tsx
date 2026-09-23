'use client';

import React from 'react';
import { Sparkles, Compass, ShoppingBag, Printer, ArrowRight, Heart } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  orderCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  orderCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EBE7DF] transition-colors">
      {/* Top Quiet Announcement Bar */}
      <div className="bg-[#F4F0E8] border-b border-[#EBE7DF]/80 py-1.5 px-4 text-center">
        <p className="text-[11px] font-medium tracking-wide text-[#78716C] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A37055]" />
          <span>HANDCRAFTED PERSONALIZED KEEPSAKES</span>
          <span className="text-[#D6D0C7]">•</span>
          <span className="text-[#44403C]">Made with Natural Materials & Archival Care</span>
          <span className="text-[#D6D0C7]">•</span>
          <span className="text-[#78716C]">Thoughtfully Packaged for Gifting</span>
        </p>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F0EBE1] border border-[#E2DDD5] flex items-center justify-center group-hover:border-[#A37055] transition-colors">
            <Sparkles className="w-4 h-4 text-[#A37055]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif text-lg font-bold tracking-wider text-[#1C1917] group-hover:text-[#A37055] transition-colors">
                STELLAIRE
              </span>
              <span className="text-[10px] text-[#A37055] font-sans font-semibold tracking-widest uppercase">
                ATELIER
              </span>
            </div>
            <p className="text-[9.5px] uppercase tracking-widest text-[#78716C] font-medium">
              Thoughtful Keepsakes & Personalized Gifts
            </p>
          </div>
        </button>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-medium">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              currentView === 'landing'
                ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-sm'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EFE9]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('products')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              currentView === 'products'
                ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-sm'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EFE9]'
            }`}
          >
            Our Collection
          </button>
          <button
            onClick={() => onNavigate('customizer')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              currentView === 'customizer'
                ? 'bg-[#EFE9DF] text-[#1C1917] font-semibold border border-[#DCD5C9]'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EFE9]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#A37055]" />
            <span>The Star Map</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2.5">
          {/* Print Workshop Queue button */}
          <button
            onClick={() => onNavigate('producer')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
              currentView === 'producer'
                ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917]'
                : 'bg-[#FBF9F6] text-[#57534E] border-[#E2DDD5] hover:border-[#1C1917] hover:text-[#1C1917]'
            }`}
            title="View Print Producer Queue & Download PDFs for printing"
          >
            <Printer className="w-3.5 h-3.5 text-[#A37055]" />
            <span className="hidden sm:inline">Print Workshop</span>
            <span className="sm:hidden">Orders</span>
            {orderCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#A37055] text-white font-bold text-[10px]">
                {orderCount}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onNavigate('customizer')}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-[#FAF8F5] font-semibold text-xs transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            <span>Personalize Star Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
