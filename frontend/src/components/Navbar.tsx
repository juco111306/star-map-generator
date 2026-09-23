'use client';

import React from 'react';
import { Sparkles, Compass, Printer, ArrowRight, Info } from 'lucide-react';
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
  const handleScrollToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#EBE7DF] transition-colors">
      {/* Top Pilot Announcement Bar */}
      <div className="bg-[#F2ECE1] border-b border-[#E5DECF] py-1.5 px-4 text-center">
        <p className="text-[11px] font-medium tracking-wide text-[#57534E] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A37055]" />
          <span className="font-semibold text-[#1C1917]">EXCLUSIEVE PILOT EDITIE</span>
          <span className="text-[#D6D0C7]">•</span>
          <span>Gratis verzending in Nederland & België (PostNL / Bpost)</span>
          <span className="text-[#D6D0C7] hidden sm:inline">•</span>
          <span className="text-[#78716C] hidden sm:inline">100% Ambachtelijke Kwaliteitsgarantie</span>
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
              Gepersonaliseerde Sterrenposters
            </p>
          </div>
        </button>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-medium">
          <button
            onClick={() => handleScrollToSection('how-it-works')}
            className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EFE9] transition-all"
          >
            Hoe het werkt
          </button>
          <button
            onClick={() => handleScrollToSection('stijlen')}
            className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EFE9] transition-all"
          >
            5 Kunststijlen
          </button>
          <button
            onClick={() => handleScrollToSection('pilot')}
            className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EFE9] transition-all flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5 text-[#A37055]" />
            <span>Over de Pilot</span>
          </button>
          <button
            onClick={() => onNavigate('customizer')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              currentView === 'customizer'
                ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EFE9]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#A37055]" />
            <span>Ontwerpstudio</span>
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
            title="Drukkerij bestellingenoverzicht"
          >
            <Printer className="w-3.5 h-3.5 text-[#A37055]" />
            <span className="hidden sm:inline">Drukkerij Portaal</span>
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
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-[#FAF8F5] font-semibold text-xs transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#E6C285]" />
            <span>Ontwerp sterrenkaart</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </div>
    </header>
  );
};
