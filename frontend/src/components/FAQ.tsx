'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface FAQProps {
  onOpenReturnPolicy?: () => void;
  onCustomizeStarMap?: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  category: 'retour' | 'kwaliteit' | 'bestelling';
}

export const FAQ: React.FC<FAQProps> = ({
  onOpenReturnPolicy,
  onCustomizeStarMap,
}) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqItems: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'retour',
      question: 'Kan ik mijn gepersonaliseerde sterrenposter retourneren?',
      answer: (
        <div className="space-y-2 text-[#57534E] leading-relaxed">
          <p>
            Omdat elke sterrenkaart een <strong>uniek maatwerkproduct</strong> is dat specifiek op jouw coördinaten, datum en persoonlijke namen wordt berekend en gedrukt, geldt volgens de wet (artikel 6:230p sub f BW) geen standaard herroepingsrecht voor fysieke exemplaren.
          </p>
          <p>
            <strong>Onze unieke ontwerpgarantie:</strong> Wij willen dat je 100% tevreden bent. Mocht het ontwerp niet naar wens zijn, dan betalen wij zonder discussie de <strong>volledige ontwerpprijs (€19,-)</strong> aan je terug!
          </p>
        </div>
      ),
    },
    {
      id: 'faq-2',
      category: 'kwaliteit',
      question: 'Wat als mijn poster of lijst beschadigd aankomt?',
      answer: (
        <div className="space-y-2.5 text-[#57534E] leading-relaxed">
          <p>
            Mocht een ingelijst product of print beschadigd aankomen (zoals <strong>gebroken glas of plexiglas, ingedeukte hoeken, of gebarsten hout van de lijst</strong>) of sprake zijn van een productiefout, dan neemt ons atelier de volledige verantwoordelijkheid onder onze <strong>100% Kwaliteitsgarantie</strong>.
          </p>
          <p>
            Ons atelier dekt alle kosten: wij sturen kosteloos een <strong>nieuwe vervangende bestelling</strong> met voorrang naar je toe, of vergoeden het volledige aankoopbedrag.
          </p>
          <div className="p-3 bg-white rounded-xl border border-[#E8E4DC] text-xs space-y-1">
            <p className="font-semibold text-[#1C1917]">Wat moet je doen om aanspraak te maken?</p>
            <ul className="list-disc list-inside space-y-1 text-[11.5px] text-[#57534E]">
              <li>Meld het binnen <strong>30 dagen na ontvangst</strong> via <span className="font-medium text-[#1C1917]">klantenservice@stellaire.nl</span>.</li>
              <li>Stuur duidelijke foto’s van <strong>het beschadigde product zelf</strong> (gebroken glas/hout/poster).</li>
              <li>Stuur foto’s van <strong>de verpakking (ZOWEL de binnen- als de buitenkant/doos)</strong>. Dit is strikt verplicht om de transportschadeclaim bij de bezorgdienst in te dienen.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'faq-3',
      category: 'retour',
      question: 'Hoe vraag ik de terugbetaling van de ontwerpprijs aan?',
      answer: (
        <p className="text-[#57534E] leading-relaxed">
          Stuur eenvoudig een e-mail naar <span className="font-semibold text-[#1C1917]">klantenservice@stellaire.nl</span> onder vermelding van jouw bestelnummer (bijv. STL-19565) en geef kort aan waarom het ontwerp niet naar verwachting was. Ons atelier verwerkt jouw verzoek binnen 24 uur en stort het ontwerpbedrag van €19,- direct terug via de oorspronkelijke betaalmethode (iDEAL, Bancontact, Visa of Mastercard).
        </p>
      ),
    },
    {
      id: 'faq-4',
      category: 'bestelling',
      question: 'Kan ik mijn bestelling na betaling nog aanpassen of annuleren?',
      answer: (
        <p className="text-[#57534E] leading-relaxed">
          Ja, dat kan tot <strong>2 uur na het plaatsen van jouw bestelling</strong>. Omdat ons atelier geautomatiseerd en snel start met het instellen van de 300 DPI vector PDF en kleurkalibratie, verzoeken we je om eventuele typfouten in namen of data direct aan ons door te geven via e-mail. Na 2 uur is het printproces onomkeerbaar gestart.
        </p>
      ),
    },
    {
      id: 'faq-5',
      category: 'kwaliteit',
      question: 'Hoe nauwkeurig is de stand van de sterren?',
      answer: (
        <p className="text-[#57534E] leading-relaxed">
          Onze astronomische engine berekent de exacte positie van sterren, sterrenbeelden en de Melkweg op basis van de <strong>Yale Bright Star Catalog</strong> en <strong>NASA JPL astronomische efemeriden</strong>. De hemelkoepel toont exact wat er boven jouw gekozen locatie (tot op de minuut nauwkeurig) aan de hemel stond of zal staan.
        </p>
      ),
    },
    {
      id: 'faq-6',
      category: 'bestelling',
      question: 'Wat zijn de verzendkosten en levertijden?',
      answer: (
        <p className="text-[#57534E] leading-relaxed">
          Verzending is <strong>volledig gratis</strong> binnen Nederland en België via vertrouwde partners (zoals PostNL, Bpost). Fysieke posters en houten lijsten worden binnen 24-48 uur zorgvuldig geproduceerd en binnen 2-4 werkdagen stevig verpakt bij je thuisbezorgd met Track &amp; Trace. Kies je voor de Digitale Editie? Dan is de 300 DPI print-ready PDF direct na afronding te downloaden.
        </p>
      ),
    },
  ];

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-[#FAF8F5] border-t border-[#EAE5DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#DDD6C8] text-[#A37055] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Veelgestelde Vragen</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
            Transparantie, Kwaliteit &amp; Retourbeleid
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto leading-relaxed">
            Alles wat je moet weten over onze ambachtelijke materialen, de astronomische berekeningen en ons eerlijke retour- en garantiebeleid.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#1C1917]/20 shadow-sm ring-1 ring-black/5'
                    : 'bg-[#F5F2EB]/50 border-[#E8E2D7] hover:bg-white hover:border-[#D6D0C5]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-xs sm:text-sm text-[#1C1917]">
                    {item.question}
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
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs border-t border-[#F0ECE1] animate-in fade-in-50 duration-200">
                    {item.answer}
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
              <span>Vragen over maatwerk of jouw bestelling?</span>
            </h4>
            <p className="text-xs text-[#57534E]">
              Lees ons officiële retourdocument of neem direct contact op met ons atelier.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenReturnPolicy && (
              <button
                type="button"
                onClick={onOpenReturnPolicy}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#D6D0C5] text-[#1C1917] text-xs font-semibold shadow-xs transition"
              >
                Volledig Retourbeleid
              </button>
            )}

            {onCustomizeStarMap && (
              <button
                type="button"
                onClick={onCustomizeStarMap}
                className="px-4 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <span>Ontwerp Nu</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E6C285]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
