'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Compass, Printer, ArrowRight, Globe, ChevronDown, Check } from 'lucide-react';
import { AppView } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Locale } from '../locales';
import { Currency } from '../utils/pricing';

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
  const { locale, t, changeLocale, currency, currencySymbol, setCurrency } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const languages: { code: Locale; label: string; full: string; flag: string }[] = [
    { code: 'nl', label: 'NL', full: 'Nederlands', flag: '🇳🇱' },
    { code: 'de', label: 'DE', full: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', label: 'ENG', full: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5] border-b border-[#EBE7DF] transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-[#F2ECE1] border-b border-[#E5DECF] py-1.5 px-4 text-center">
        <p className="text-[11px] font-medium tracking-wide text-[#57534E] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A37055]" />
          <span>{t.navbar.bannerText}</span>
          <span className="text-[#D6D0C7] hidden sm:inline">•</span>
          <span className="text-[#78716C] hidden sm:inline">{t.navbar.bannerSub}</span>
        </p>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 text-left group shrink-0"
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
              {t.common.brandTagline}
            </p>
          </div>
        </button>

        {/* Center Navigation Links / Tabs */}
        <nav className="hidden lg:flex items-center p-1 bg-[#F2EDE4]/80 backdrop-blur-sm rounded-full border border-[#E4DDD0] space-x-1 text-xs">
          <button
            onClick={() => handleScrollToSection('how-it-works')}
            className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all font-medium"
          >
            {t.navbar.howItWorks}
          </button>
          <button
            onClick={() => handleScrollToSection('stijlen')}
            className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all font-medium"
          >
            {t.navbar.styles}
          </button>
          <button
            onClick={() => onNavigate('customizer')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-semibold shadow-xs ${
              currentView === 'customizer'
                ? 'bg-[#1C1917] text-[#FAF8F5] ring-2 ring-[#A37055]/30'
                : 'bg-[#FAF8F5] text-[#1C1917] hover:bg-[#1C1917] hover:text-white border border-[#E0D7C9]'
            }`}
          >
            <span>{t.navbar.studio}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#A37055]" />
          </button>
          {onOpenTrackingModal && (
            <button
              onClick={onOpenTrackingModal}
              className="px-3.5 py-1.5 rounded-full text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all font-medium flex items-center gap-1.5"
              title="Status in drukkerij"
            >
              <Printer className="w-3.5 h-3.5 text-[#A37055]" />
              <span>{t.navbar.printer}</span>
            </button>
          )}
        </nav>

        {/* Right Action Buttons & Language Switcher */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Elegant Luxury Atelier Language Switcher Dropdown */}
          <div className="relative shrink-0" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#EDE7DE]/80 hover:bg-[#E4DDCF] border border-[#DDD5C7] text-[#1C1917] text-xs font-semibold tracking-wide transition-all shadow-xs focus:outline-none focus:ring-1 focus:ring-[#A37055]"
              aria-label="Select language"
              aria-expanded={isLangOpen}
            >
              <span className="text-xs leading-none">{currentLang.flag}</span>
              <span className="text-[11px] font-bold text-[#1C1917]">{currentLang.label}</span>
              <ChevronDown className={`w-3 h-3 text-[#78716C] transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 py-1.5 bg-white rounded-2xl shadow-2xl border border-[#DDD5C7] z-[100] ring-1 ring-black/10 overflow-hidden">
                <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-[#8C827A] tracking-wider border-b border-[#F0EBE1] bg-[#FAF8F5]">
                  {locale === 'de' ? 'Sprache wählen' : locale === 'en' ? 'Select language' : 'Kies taal'}
                </div>
                <div className="py-1">
                  {languages.map((lang) => {
                    const isActive = locale === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          changeLocale(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors ${
                          isActive
                            ? 'bg-[#F5EFE6] text-[#1C1917] font-semibold'
                            : 'text-[#44403C] hover:bg-[#FAF8F5] hover:text-[#1C1917]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <span className="font-medium text-xs text-[#1C1917]">{lang.full}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isActive ? 'bg-[#1C1917] text-white' : 'bg-[#EAE4D8] text-[#57534E]'
                            }`}
                          >
                            {lang.label}
                          </span>
                        </div>
                        {isActive && <Check className="w-4 h-4 text-[#A37055] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Luxury Atelier Currency Switcher Dropdown */}
          <div className="relative shrink-0" ref={currencyDropdownRef}>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#EDE7DE]/80 hover:bg-[#E4DDCF] border border-[#DDD5C7] text-[#1C1917] text-xs font-semibold tracking-wide transition-all shadow-xs focus:outline-none focus:ring-1 focus:ring-[#A37055]"
              aria-label="Select currency"
              aria-expanded={isCurrencyOpen}
            >
              <span className="text-[11px] font-bold text-[#1C1917]">{currency}</span>
              <span className="text-[11px] text-[#A37055] font-bold">({currencySymbol})</span>
              <ChevronDown className={`w-3 h-3 text-[#78716C] transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-2 w-44 py-1.5 bg-white rounded-2xl shadow-2xl border border-[#DDD5C7] z-[100] ring-1 ring-black/10 overflow-hidden">
                <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-[#8C827A] tracking-wider border-b border-[#F0EBE1] bg-[#FAF8F5]">
                  {locale === 'de' ? 'Währung wählen' : locale === 'en' ? 'Select currency' : 'Kies valuta'}
                </div>
                <div className="py-1">
                  {[
                    { code: 'USD' as Currency, symbol: '$', label: 'USD ($)', full: 'US Dollar', flag: '🇺🇸' },
                    { code: 'EUR' as Currency, symbol: '€', label: 'EUR (€)', full: 'Euro', flag: '🇪🇺' },
                    { code: 'GBP' as Currency, symbol: '£', label: 'GBP (£)', full: 'British Pound', flag: '🇬🇧' },
                  ].map((cur) => {
                    const isActive = currency === cur.code;
                    return (
                      <button
                        key={cur.code}
                        type="button"
                        onClick={() => {
                          setCurrency(cur.code);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors ${
                          isActive
                            ? 'bg-[#F5EFE6] text-[#1C1917] font-semibold'
                            : 'text-[#44403C] hover:bg-[#FAF8F5] hover:text-[#1C1917]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{cur.flag}</span>
                          <span className="font-medium text-xs text-[#1C1917]">{cur.full}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isActive ? 'bg-[#1C1917] text-white' : 'bg-[#EAE4D8] text-[#57534E]'
                            }`}
                          >
                            {cur.symbol}
                          </span>
                        </div>
                        {isActive && <Check className="w-4 h-4 text-[#A37055] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Drukkerij Order Status Login Button */}
          {onOpenTrackingModal && (
            <button
              onClick={onOpenTrackingModal}
              className="lg:hidden px-2.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border bg-[#FAF8F5] text-[#57534E] border-[#E2DDD5] hover:border-[#1C1917] hover:text-[#1C1917]"
              title={t.navbar.printer}
            >
              <Printer className="w-3.5 h-3.5 text-[#A37055]" />
              <span className="text-[11px] hidden sm:inline">{t.navbar.printer}</span>
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={() => onNavigate('customizer')}
            className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-[#FAF8F5] font-semibold text-xs transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#E6C285]" />
            <span className="hidden sm:inline">{t.navbar.ctaButton}</span>
            <span className="sm:hidden">{t.navbar.ctaMobile}</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </div>
    </header>
  );
};
