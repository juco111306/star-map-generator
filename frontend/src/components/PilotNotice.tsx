'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Truck, HeartHandshake, Info, Mail, CheckCircle2 } from 'lucide-react';

export const PilotNotice: React.FC = () => {
  return (
    <section id="pilot" className="py-14 sm:py-20 bg-[#F5F2EB] border-t border-[#EAE5DC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E2DDD5] shadow-[0_15px_40px_rgba(28,25,23,0.04)] relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#F2ECE1] to-transparent rounded-full blur-3xl pointer-events-none -z-0 opacity-70" />

          <div className="relative z-10 space-y-8">
            {/* Header Badge & Title */}
            <div className="text-center sm:text-left space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E4DDD0] text-[#A37055] text-xs font-medium">
                <Info className="w-3.5 h-3.5" />
                <span>TRANSPARANTIE & VERTROUWEN</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[#1C1917]">
                Over onze Exclusieve Pilot in Nederland & België
              </h2>
              <p className="text-[#57534E] text-sm sm:text-base font-light leading-relaxed max-w-3xl">
                Stellaire bevindt zich momenteel in de exclusieve pilotfase. Wij brengen onze gepersonaliseerde sterrenposters met de hoogste ambachtelijke standaarden naar klanten in Nederland en België, vóór de officiële landelijke lancering.
              </p>
            </div>

            {/* 3 Pillars of the Pilot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Pillar 1: Local Sustainable Gelato Production */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DE] space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#A37055] shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#1C1917]">
                  Lokale Kwaliteitsproductie
                </h3>
                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  Elke bestelling wordt via onze ervaren partner met jarenlange ervaring en prachtige kwaliteitslijsten lokaal en on-demand geproduceerd in Nederland en België. Dit garandeert snelle bezorging, minimale CO2-uitstoot en FSC® gecertificeerde lijsten.
                </p>
              </div>

              {/* Pillar 2: 100% Quality & Craft */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DE] space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#A37055] shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#1C1917]">
                  100% Museumkwaliteit
                </h3>
                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  Elke bestelling wordt individueel vervaardigd op 285 gsm archiefwaardig fine-art papier met lichtechte pigmentinkt. De sterrenstand wordt exact berekend via officiële NASA JPL efemeriden.
                </p>
              </div>

              {/* Pillar 3: Fast & Insured Shipping */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DE] space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#A37055] shadow-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#1C1917]">
                  Verzekerd via PostNL & Bpost
                </h3>
                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  Verzending binnen 2–3 werkdagen in Nederland en België in een stevige beschermende kunstverpakking met Track & Trace. Komt een pakket beschadigd aan? Wij herdrukken direct kosteloos.
                </p>
              </div>
            </div>

            {/* Bottom Contact & Reassurance Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF9F6] border border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3 text-[#57534E]">
                <HeartHandshake className="w-5 h-5 text-[#A37055] shrink-0" />
                <span>
                  <strong className="text-[#1C1917] font-medium">Persoonlijke klantenservice:</strong> Ons team volgt elke pilot-bestelling handmatig op voor een vlekkeloze ervaring.
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[#78716C]">Vragen over de pilot?</span>
                <span className="font-medium text-[#1C1917] underline decoration-[#A37055]">klantenservice@stellaire.nl</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
