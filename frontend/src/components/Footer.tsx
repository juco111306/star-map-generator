'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Mail, Heart, Info, Truck } from 'lucide-react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleScrollTo = (id: string) => {
    onNavigate('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

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
              Een ambachtelijke ontwerpstudio gewijd aan het vastleggen van jouw meest dierbare levensmomenten onder de exacte stand van de sterrenhemel.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[10.5px] text-[#A37055] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A37055]" />
              <span>Pilot Editie voor Nederland & België</span>
            </div>
          </div>

          {/* Product & Studio Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider">
              Onze Sterrenkaarten
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('customizer')}
                  className="hover:text-[#A37055] transition-colors"
                >
                  Ontwerp Jouw Sterrenposter
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('stijlen')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  Bekijk de Kunststijlen
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('how-it-works')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  Hoe het werkt
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('producer')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  Drukkerij Bestellingenoverzicht
                </button>
              </li>
            </ul>
          </div>

          {/* Quality & Craft Standards */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider">
              Kwaliteit & Ambacht
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>300 DPI 285 gsm Katoenpapier</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>Officiële NASA JPL & Skyfield data</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>Slanke 8 mm fotolijsten met museumglas</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <Truck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>Verzekerde verzending via PostNL & Bpost</span>
              </li>
            </ul>
          </div>

          {/* Pilot Transparency Note */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#A37055]" />
              <span>Over deze Pilot</span>
            </h4>
            <p className="text-[11px] text-[#57534E] leading-relaxed font-light">
              Stellaire test momenteel kleinschalig in Nederland en België. Onze officiële handelsregisterinschrijving is in de afrondende notariële fase. Iedere bestelling wordt persoonlijk en met de hoogste zorg geproduceerd.
            </p>
            <div className="pt-2">
              <a
                href="mailto:klantenservice@stellaire.nl"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1C1917] hover:text-[#A37055] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#A37055]" />
                <span>klantenservice@stellaire.nl</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Payment, and Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-[#8C827A]">
            &copy; {new Date().getFullYear()} Stellaire Atelier. Alle rechten voorbehouden. Exclusieve pilotfase in Nederland & België.
          </p>
          <div className="flex items-center space-x-3 text-[10px] text-[#8C827A]">
            <span className="px-2 py-0.5 rounded bg-white border border-[#E0D9CD] font-medium text-[#57534E]">iDEAL</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E0D9CD] font-medium text-[#57534E]">Bancontact</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E0D9CD] font-medium text-[#57534E]">Klarna</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E0D9CD] font-medium text-[#57534E]">Visa / Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
