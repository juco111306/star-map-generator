'use client';

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const SocialProof: React.FC = () => {
  const reviews = [
    {
      name: 'Anouk & Daan M.',
      occasion: '1e Huwelijksverjaardag (Katoen)',
      stars: 5,
      location: 'Amsterdam, Nederland',
      content:
        'Mijn man was letterlijk sprakeloos toen hij dit uitpakte voor onze eerste trouwdag. De tastbare kwaliteit van het katoenpapier en de sierlijke kalligrafie van onze namen zijn adembenemend. We kozen de Scandinavisch eiken lijst en hij hangt nu trots in onze woonkamer.',
      product: 'Gepersonaliseerde Sterrenposter in Midnight Classic (50×70 cm)',
    },
    {
      name: 'Charlotte & Thomas V.',
      occasion: 'Verlovingsmoment',
      stars: 5,
      location: 'Antwerpen, België',
      content:
        'We bestelden onze sterrenkaart voor de nacht van ons aanzoek onder de sterrenhemel in de Ardennen. De kompasring, de herkenbare sterrenbeelden en de diepe kleuren zien er in het echt nóg luxueuzer uit dan op het scherm. Een prachtig tastbaar aandenken.',
      product: 'Gepersonaliseerde Sterrenposter in Emerald Night (40×50 cm)',
    },
    {
      name: 'Sanne & Ruben K.',
      occasion: 'Geboorte van onze Dochter',
      stars: 5,
      location: 'Utrecht, Nederland',
      content:
        'Dit cadeau gekregen bij de geboorte van onze dochter Fien. De exacte nachthemel boven het ziekenhuis met haar geboortecoördinaten en tijdstip is het meest betekenisvolle geschenk dat we konden wensen voor de kinderkamer.',
      product: 'Gepersonaliseerde Sterrenposter in Teal Watercolor (30×40 cm)',
    },
  ];

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
            Dierbare Herinneringen in Nederland & België
          </h2>
          <p className="text-[#57534E] text-sm font-light leading-relaxed">
            Echte ervaringen van koppels en gezinnen die hun meest bijzondere moment hebben vereeuwigd.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-[#EAE5DC] p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#A37055]">
                    {[...Array(r.stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#A37055]" />
                    ))}
                  </div>
                  <span className="text-[10.5px] text-[#78716C] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-[#A37055]" />
                    <span>Geverifieerde Koper</span>
                  </span>
                </div>

                <p className="text-xs text-[#44403C] leading-relaxed italic font-light">
                  &ldquo;{r.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2EDE4]">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xs font-bold text-[#1C1917]">
                    {r.name}
                  </h4>
                  <span className="text-[10px] text-[#A37055] font-medium">
                    {r.occasion}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#78716C] mt-1">
                  <span>{r.product}</span>
                  <span className="font-mono text-[9.5px] text-[#8C827A]">{r.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
