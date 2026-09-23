'use client';

import React from 'react';
import { Calendar, Printer, Sparkles, ArrowRight, Feather } from 'lucide-react';

interface HowItWorksProps {
  onStartCustomizing: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartCustomizing }) => {
  const steps = [
    {
      number: '01',
      title: 'Kies Jouw Bijzondere Moment',
      description:
        'Selecteer een datum, tijdstip en locatie op aarde—van een historische gracht in Amsterdam of Brugge tot het strand van jullie huwelijksreis.',
      icon: <Calendar className="w-5 h-5 text-[#A37055]" />,
    },
    {
      number: '02',
      title: 'Personaliseer in Onze Studio',
      description:
        'Voeg jullie namen toe in elegante kalligrafie, kies een romantische titel, stem lettergroottes af tot 100 pt en kies jouw favoriete kunststijl.',
      icon: <Feather className="w-5 h-5 text-[#A37055]" />,
    },
    {
      number: '03',
      title: 'Ambachtelijk Gedrukt & Geleverd',
      description:
        'Individueel gedrukt op 285 gsm archiefwaardig fine-art papier, optioneel ingelijst in een slank 8 mm kader en snel bezorgd via PostNL of Bpost.',
      icon: <Printer className="w-5 h-5 text-[#A37055]" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-[#FAF8F5] relative overflow-hidden border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F3EFE7] border border-[#E4DDD0] text-[#78716C] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
            <span>HET AMBACHTELIJKE PROCES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            Hoe Jouw Sterrenposter Wordt Gemaakt
          </h2>
          <p className="text-[#57534E] text-sm font-light leading-relaxed">
            Van wetenschappelijke NASA-berekeningen tot fysiek meesterwerk in drie eenvoudige stappen.
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
            <span>Ontwerp nu jouw sterrenkaart</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
