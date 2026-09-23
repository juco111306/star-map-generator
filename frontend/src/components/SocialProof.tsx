'use client';

import React from 'react';
import { Star, CheckCircle, Heart } from 'lucide-react';

export const SocialProof: React.FC = () => {
  const reviews = [
    {
      name: 'Jessica & David M.',
      occasion: '1st Wedding Anniversary (Paper)',
      stars: 5,
      date: 'Verified Buyer',
      content:
        'My husband literally was moved to tears when he opened this on our paper anniversary. The texture of the cotton rag paper is so substantial, and the script calligraphy of our names is breathtaking. We chose the Scandinavian Oak frame and it hangs in our bedroom.',
      product: 'The Celestial Blueprint™ in Midnight Classic (18x24")',
    },
    {
      name: 'Liam & Sophia K.',
      occasion: 'Engagement Milestone',
      stars: 5,
      date: 'Verified Buyer',
      content:
        'We ordered our star map for the night we got engaged under the stars in Santorini. The compass dial, constellations, and the delicate stardust texture look so elevated in person. It feels like a piece of quiet poetry.',
      product: 'The Celestial Blueprint™ in Minimalist Light (18x24")',
    },
    {
      name: 'Elena & Marcus R.',
      occasion: 'Newborn Baby Arrival',
      stars: 5,
      date: 'Verified Buyer',
      content:
        'I gifted this to my sister when she had her daughter. Having the exact night sky over the hospital with her birth coordinates is the most deeply meaningful gift you could ever give a new mother.',
      product: 'The Celestial Blueprint™ in Teal Watercolor (18x24")',
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
            Cherished Across Generations
          </h2>
          <p className="text-[#57534E] text-sm font-light leading-relaxed">
            Real stories from couples and families who preserved a piece of eternity.
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
                    <span>Verified Heirloom</span>
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
                  <span className="text-[10.5px] text-[#A37055] font-medium">
                    {r.occasion}
                  </span>
                </div>
                <p className="text-[10px] text-[#78716C] mt-0.5">
                  {r.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
