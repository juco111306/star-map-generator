'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FAQProps {
  onOpenReturnPolicy?: () => void;
  onCustomizeStarMap?: () => void;
}

export const FAQ: React.FC<FAQProps> = ({
  onOpenReturnPolicy,
  onCustomizeStarMap,
}) => {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  const faqList = t.faq.items;

  return (
    <section id="faq" className="py-20 bg-[#FAF8F5] border-t border-[#EAE5DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#DDD6C8] text-[#A37055] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
            {t.faq.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqList.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#1C1917]/20 shadow-sm ring-1 ring-black/5'
                    : 'bg-[#F5F2EB]/50 border-[#E8E2D7] hover:bg-white hover:border-[#D6D0C5]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-xs sm:text-sm text-[#1C1917]">
                    {item.q}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#1C1917] text-white rotate-180'
                        : 'bg-[#EAE5DC] text-[#78716C]'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs text-[#57534E] leading-relaxed border-t border-[#F0ECE1] animate-in fade-in-50 duration-200">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Policy & Guarantee Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-[#EFE9DF] border border-[#DDD6C8] flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-[#1C1917] flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A37055]" />
              <span>{t.faq.helpHeading}</span>
            </h4>
            <p className="text-xs text-[#57534E]">
              {t.faq.helpText}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenReturnPolicy && (
              <button
                type="button"
                onClick={onOpenReturnPolicy}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#D6D0C5] text-[#1C1917] text-xs font-semibold shadow-xs transition"
              >
                {t.faq.returnPolicyButton}
              </button>
            )}

            {onCustomizeStarMap && (
              <button
                type="button"
                onClick={onCustomizeStarMap}
                className="px-4 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <span>{t.navbar.ctaButton}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E6C285]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
