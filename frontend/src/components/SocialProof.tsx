'use client';

import React from 'react';
import { Sparkles, CheckCircle, Mail, MessageSquareHeart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SocialProof: React.FC = () => {
  const { locale, t } = useLanguage();
  const reviews = t.socialProof.reviews;

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-[#F7F4EE] border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#E0D7C9] text-[#A37055] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.socialProof.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            {t.socialProof.title}
          </h2>
          <p className="text-[#57534E] text-sm sm:text-base font-light leading-relaxed">
            {t.socialProof.subtitle}
          </p>
        </div>

        {/* 4 Transparent Pilot Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={r.id || idx}
              className="rounded-2xl bg-white border border-[#EAE5DC] p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A37055] font-semibold">
                    {r.occasion}
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>{t.socialProof.verifiedBuyer}</span>
                  </span>
                </div>

                <h4 className="font-serif text-sm font-semibold text-[#1C1917]">
                  {r.title}
                </h4>

                <p className="text-xs text-[#57534E] leading-relaxed font-light">
                  {r.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2EDE4]">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs font-bold text-[#1C1917]">
                    {r.author}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#78716C] mt-1">
                  <span>{r.location}</span>
                  <span className="text-[9.5px] text-[#8C827A]">{r.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated Community Feedback & Reddit Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DDD5] shadow-[0_10px_30px_rgba(28,25,23,0.03)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[#A37055] font-semibold text-xs uppercase tracking-wider">
              <MessageSquareHeart className="w-4 h-4" />
              <span>
                {locale === 'de'
                  ? 'Gemeinsam mit der Community wachsen'
                  : locale === 'en'
                  ? 'Building Alongside Our Community'
                  : 'Samen Groeien met de Community'}
              </span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C1917]">
              {locale === 'de'
                ? 'Testen Sie unsere Webseite über Reddit oder Social Media?'
                : locale === 'en'
                ? 'Trying our generator from Reddit or social media?'
                : 'Probeer je onze website via Reddit of sociale media?'}
            </h3>
            <p className="text-xs text-[#57534E] max-w-2xl font-light leading-relaxed">
              {locale === 'de'
                ? 'Als unabhängiges Indie-Studio schätzen wir jede Rückmeldung sehr. Teilen Sie Ihre Gedanken, Fehlerberichte oder ein Foto Ihres ausgedruckten Posters. Echte Rezensionen unserer ersten Nutzer werden wir hier künftig mit Stolz präsentieren!'
                : locale === 'en'
                ? 'As an independent indie studio, we deeply appreciate every piece of feedback. Share your thoughts, bug reports, or a photo of your printed star map. Real testimonials from our early community will be proudly featured here as we grow!'
                : 'Als onafhankelijke indie studio waarderen we alle feedback enorm. Deel jouw ervaringen, suggesties of een foto van jouw afgedrukte poster. Echte reviews van onze eerste gebruikers worden hier straks met trots getoond!'}
            </p>
          </div>

          <a
            href="mailto:info@stellaireshop.com?subject=Indie%20Pilot%20Feedback"
            className="px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-semibold text-xs shadow-md hover:shadow-lg transition whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-[#A37055]" />
            <span>
              {locale === 'de'
                ? 'Feedback Teilen'
                : locale === 'en'
                ? 'Share Your Feedback'
                : 'Deel Jouw Feedback'}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
