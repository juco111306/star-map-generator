'use client';

import React from 'react';
import { Sparkles, ArrowRight, Check, Star, ShieldCheck } from 'lucide-react';
import { DESIGN_STYLES } from '../constants/styles';

interface ProductCatalogProps {
  onCustomizeStarMap: () => void;
  onSelectStyle?: (styleId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onCustomizeStarMap,
  onSelectStyle,
}) => {
  const dutchStyleDetails: Record<
    string,
    { title: string; subtitle: string; desc: string; tag: string }
  > = {
    midnight_classic: {
      title: 'Midnight Classic',
      subtitle: 'Onze Meest Geliefde Bestseller',
      desc: 'Diep koningsblauw met dubbele kompasring, fijne graadverdelingen en fonkelende witte sterren.',
      tag: 'BESTSELLER',
    },
    teal_watercolor: {
      title: 'Teal Watercolor',
      subtitle: 'Zachte Aquarel & Neveltextuur',
      desc: 'Sfeervolle marineblauwe en cyaankleurige aquarelstructuur op een warm linnenachtergrond.',
      tag: 'ARTISTIEK',
    },
    emerald_night: {
      title: 'Emerald Night',
      subtitle: 'Brits Bosgroen & Koninklijk Goud',
      desc: 'Diepgroene nachthemel gecombineerd met metallic gouden sterren en hemelcoördinaten.',
      tag: 'LUXE EDITIE',
    },
    burgundy_sky: {
      title: 'Burgundy Sky',
      subtitle: 'Warme Romantiek & Fluweelrood',
      desc: 'Rijke bordeauxrode tinten die liefde en warmte uitstralen, afgewerkt met zachte parelwitte typografie.',
      tag: 'ROMANTISCH',
    },
    border_text: {
      title: 'Border Text Minimalist',
      subtitle: 'Galerijwit met Gebogen Randschrift',
      desc: 'Strakke moderne kunststijl waarbij jouw persoonlijke titel sierlijk rond de sterrencirkel buigt.',
      tag: 'MINIMALISTISCH',
    },
  };

  const handleCardClick = (styleId: string) => {
    if (onSelectStyle) {
      onSelectStyle(styleId);
    } else {
      onCustomizeStarMap();
    }
  };

  return (
    <section id="stijlen" className="py-16 sm:py-24 bg-[#F7F4EE] border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE9DF] border border-[#E0D7C9] text-[#78716C] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
            <span>5 AMBACHTELIJKE KUNSTSTIJLEN</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            Eén Tijdloos Product, Vijf Verfijnde Stijlen
          </h2>
          <p className="text-[#57534E] text-sm sm:text-base font-light leading-relaxed">
            In onze exclusieve pilot focussen wij ons 100% op het perfectioneren van de gepersonaliseerde sterrenposter. Kies jouw favoriete esthetiek en open direct onze ontwerpstudio.
          </p>
        </div>

        {/* 5 Styles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {DESIGN_STYLES.map((style) => {
            const meta = dutchStyleDetails[style.id] || {
              title: style.name,
              subtitle: style.subtitle,
              desc: style.description,
              tag: 'STIJL',
            };

            return (
              <div
                key={style.id}
                onClick={() => handleCardClick(style.id)}
                className="group bg-white rounded-3xl p-5 sm:p-6 border border-[#E2DDD5] shadow-[0_10px_30px_rgba(28,25,23,0.03)] hover:shadow-[0_20px_45px_rgba(28,25,23,0.08)] hover:border-[#C8BFB0] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Miniature Poster Art Mockup */}
                  <div
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden p-4 flex flex-col items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-[1.01]"
                    style={{ backgroundColor: style.bgColor }}
                  >
                    {/* Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/90 text-[#1C1917] shadow-xs">
                      {meta.tag}
                    </span>

                    {/* Celestial Circle Mockup */}
                    <div
                      className="w-32 h-32 rounded-full border flex items-center justify-center relative shadow-md"
                      style={{
                        backgroundColor: style.mapBgColor,
                        borderColor: style.borderColor,
                      }}
                    >
                      {/* Compass ring tick dots */}
                      <div
                        className="absolute inset-1 rounded-full border border-dashed opacity-40"
                        style={{ borderColor: style.ringColor }}
                      />
                      {/* Center stars representation */}
                      <div className="relative text-center space-y-1">
                        <span
                          className="text-xs font-mono font-bold block"
                          style={{ color: style.starColor }}
                        >
                          ✦ ✧ ✦
                        </span>
                        <div
                          className="w-12 h-0.5 mx-auto rounded-full opacity-40"
                          style={{ backgroundColor: style.starColor }}
                        />
                      </div>
                    </div>

                    {/* Mockup Typography Lines */}
                    <div className="mt-4 text-center space-y-1">
                      <div
                        className="text-[11px] font-serif font-bold tracking-wider uppercase"
                        style={{ color: style.textColor }}
                      >
                        {meta.title}
                      </div>
                      <div
                        className="text-[9px] font-sans opacity-70"
                        style={{ color: style.subtitleColor }}
                      >
                        AMSTERDAM • 21:00
                      </div>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        {meta.title}
                      </h3>
                      <div className="text-right">
                        <span className="text-xs text-[#999] line-through mr-1.5">€68,00</span>
                        <span className="text-sm font-bold text-[#1C1917]">€49,00</span>
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-[#A37055]">
                      {meta.subtitle}
                    </p>
                    <p className="text-xs text-[#57534E] font-light leading-relaxed">
                      {meta.desc}
                    </p>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-5 mt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-semibold text-[#1C1917] group-hover:text-[#A37055] transition-colors">
                  <span>Personaliseer deze stijl</span>
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5] group-hover:bg-[#1C1917] group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality & Trust Banner */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2DDD5] shadow-xs flex flex-wrap items-center justify-around gap-4 text-xs text-[#57534E]">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>Officiële NASA JPL & Skyfield sterrendata</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>285 gsm archiefwaardig katoenpapier</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>Slanke 8 mm fotolijsten met museumglas</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#A37055]" />
            <span>Gratis levering in Nederland & België</span>
          </div>
        </div>
      </div>
    </section>
  );
};
