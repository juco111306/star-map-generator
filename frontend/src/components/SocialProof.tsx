'use client';

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SocialProof: React.FC = () => {
  const { t } = useLanguage();
  const reviews = t.socialProof.reviews;

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-[#F7F4EE] border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="flex items-center justify-center space-x-1 text-[#A37055]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#A37055]" />
            ))}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            {t.socialProof.title}
          </h2>
          <p className="text-[#57534E] text-sm font-light leading-relaxed">
            {t.socialProof.subtitle}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={r.id || idx}
              className="rounded-2xl bg-white border border-[#EAE5DC] p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#A37055]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#A37055]" />
                    ))}
                  </div>
                  <span className="text-[10.5px] text-[#78716C] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-[#A37055]" />
                    <span>{t.socialProof.verifiedBuyer}</span>
                  </span>
                </div>

                <h4 className="font-serif text-sm font-semibold text-[#1C1917]">
                  {r.title}
                </h4>

                <p className="text-xs text-[#44403C] leading-relaxed italic font-light">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2EDE4]">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs font-bold text-[#1C1917]">
                    {r.author}
                  </span>
                  <span className="text-[10px] text-[#A37055] font-medium">
                    {r.occasion}
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
      </div>
    </section>
  );
};
