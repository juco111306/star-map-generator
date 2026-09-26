'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Mail, Truck, Info } from 'lucide-react';
import { AppView } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onOpenReturnPolicy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenReturnPolicy }) => {
  const { t } = useLanguage();

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
                {t.common.brandName}
              </span>
            </div>
            <p className="text-[11px] text-[#57534E] leading-relaxed font-light">
              {t.footer.brandDesc}
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[10.5px] text-[#A37055] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A37055]" />
              <span>{t.footer.editionBadge}</span>
            </div>
          </div>

          {/* Product & Studio Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider">
              {t.footer.col1Title}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('customizer')}
                  className="hover:text-[#A37055] transition-colors"
                >
                  {t.footer.linkDesign}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('stijlen')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  {t.footer.linkStyles}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('how-it-works')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  {t.footer.linkHowItWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('faq')}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  {t.footer.linkFAQ}
                </button>
              </li>
            </ul>
          </div>

          {/* Quality & Craft Standards */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider">
              {t.footer.col2Title}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>{t.footer.point1}</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>{t.footer.point2}</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>{t.footer.point3}</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534E]">
                <Truck className="w-3.5 h-3.5 text-[#A37055] shrink-0" />
                <span>{t.footer.shippingPartnerText}</span>
              </li>
              {onOpenReturnPolicy && (
                <li className="pt-1">
                  <button
                    onClick={onOpenReturnPolicy}
                    className="text-[#A37055] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>{t.footer.returnPolicyLinkText}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1C1917] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#A37055]" />
              <span>{t.footer.col3Title}</span>
            </h4>
            <p className="text-[11px] text-[#57534E] leading-relaxed font-light">
              {t.footer.col3Desc}
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${t.footer.email}`}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1C1917] hover:text-[#A37055] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#A37055]" />
                <span>{t.footer.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Regional Payment Icons, and Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex flex-wrap items-center gap-3 text-[#8C827A]">
            <span>&copy; {new Date().getFullYear()} {t.footer.copyright}</span>
            <span>•</span>
            {onOpenReturnPolicy && (
              <button
                onClick={onOpenReturnPolicy}
                className="hover:text-[#1C1917] transition-colors underline"
              >
                {t.footer.returnPolicyShort}
              </button>
            )}
            <span>•</span>
            <button
              onClick={() => handleScrollTo('faq')}
              className="hover:text-[#1C1917] transition-colors underline"
            >
              {t.footer.faqShort}
            </button>
          </div>

          {/* Regional Dynamic Payment Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#8C827A]">
            {t.footer.paymentBadges.map((badge, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-white border border-[#E0D9CD] font-medium text-[#57534E] shadow-2xs"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
