'use client';

import React from 'react';
import { Calendar, Sliders, Printer, Sparkles, ArrowRight, Feather, Heart } from 'lucide-react';

interface HowItWorksProps {
  onStartCustomizing: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartCustomizing }) => {
  const steps = [
    {
      number: '01',
      title: 'Specify Your Defining Moment',
      description:
        'Select any date in time and any place on Earth—from a bustling city square to the quiet shore where you made your promise.',
      icon: <Calendar className="w-5 h-5 text-[#A37055]" />,
    },
    {
      number: '02',
      title: 'Personalize with Quiet Care',
      description:
        'Choose timeless typography, bespoke cursive calligraphy names, coordinate footers, and delicate vector ornaments.',
      icon: <Feather className="w-5 h-5 text-[#A37055]" />,
    },
    {
      number: '03',
      title: 'Archival Crafting & Delivery',
      description:
        'Our atelier renders the vector 300 DPI artwork, hand-frames your print in solid wood, and packages it in archival gift wrap.',
      icon: <Printer className="w-5 h-5 text-[#A37055]" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-[#FAF8F5] relative overflow-hidden border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F3EFE7] border border-[#E4DDD0] text-[#78716C] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
            <span>THE ATELIER PROCESS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            How Your Keepsake is Made
          </h2>
          <p className="text-[#57534E] text-sm font-light leading-relaxed">
            From mathematical astronomy calculations to physical museum craftsmanship in three simple steps.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-[#EAE5DC] bg-white p-8 space-y-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#F6F2EA] border border-[#E4DDD0] flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="font-serif text-2xl font-light text-[#D4CBBF]">
                  {s.number}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#1C1917] pt-1">
                {s.title}
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed font-light">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onStartCustomizing}
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-[#FAF8F5] font-semibold text-xs tracking-wide shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <span>Personalize The Star Map Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
