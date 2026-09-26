'use client';

import React from 'react';
import { Sparkles, Compass, Printer, ArrowRight, Info, Package } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  orderCount?: number;
  onOpenTrackingModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  orderCount = 0,
  onOpenTrackingModal,
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
      {/* Top Announcement Bar */}
      <div className="bg-[#F2ECE1] border-b border-[#E5DECF] py-1.5 px-4 text-center">
        <p className="text-[11px] font-medium tracking-wide text-[#57534E] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A37055]" />
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

        {/* Center Navigation Links / Tabs */}
        <nav className="hidden md:flex items-center p-1 bg-[#F2EDE4]/80 backdrop-blur-sm rounded-full border border-[#E4DDD0] space-x-1 text-xs">
          <button
            onClick={() => handleScrollToSection('how-it-works')}
            className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all font-medium"
          >
            Hoe het werkt
          </button>
          <button
            onClick={() => handleScrollToSection('stijlen')}
            className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all font-medium"
          >
            Kunststijlen
          </button>
          <button
            onClick={() => onNavigate('customizer')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-semibold shadow-xs ${
              currentView === 'customizer'
                ? 'bg-[#1C1917] text-[#FAF8F5] ring-2 ring-[#A37055]/30'
                : 'bg-[#FAF8F5] text-[#1C1917] hover:bg-[#1C1917] hover:text-white border border-[#E0D7C9]'
            }`}
          >
            <span>Ontwerpstudio</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#A37055]" />
          </button>
          {onOpenTrackingModal && (
            <button
              onClick={onOpenTrackingModal}
              className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all font-medium flex items-center gap-1.5"
              title="Log in met e-mailadres en bestelnummer om de status van uw order in de drukkerij te bekijken"
            >
              <Printer className="w-3.5 h-3.5 text-[#A37055]" />
              <span>Drukkerij</span>
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Mobile Drukkerij Order Status Login Button */}
          {onOpenTrackingModal && (
            <button
              onClick={onOpenTrackingModal}
              className="md:hidden px-2.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border bg-[#FAF8F5] text-[#57534E] border-[#E2DDD5] hover:border-[#1C1917] hover:text-[#1C1917]"
              title="Drukkerij status & inloggen"
            >
              <Printer className="w-3.5 h-3.5 text-[#A37055]" />
              <span className="text-[11px]">Drukkerij</span>
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={() => onNavigate('customizer')}
            className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-[#FAF8F5] font-semibold text-xs transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#E6C285]" />
            <span className="hidden sm:inline">Ontwerp sterrenkaart</span>
            <span className="sm:hidden">Ontwerp</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </div>
    </header>
  );
};
