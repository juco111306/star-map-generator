'use client';

import React from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Truck,
  AlertCircle,
  X,
  Mail,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';

interface ReturnPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReturnPolicyModal: React.FC<ReturnPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E2DDD5] rounded-3xl shadow-2xl overflow-hidden my-8 text-[#1C1917] animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#F5F2EB] border-b border-[#E8E4DC] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917] shadow-sm">
              <RotateCcw className="w-4 h-4 text-[#A37055]" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1C1917] tracking-wide flex items-center gap-2">
                <span>Retourbeleid &amp; Tevredenheidsgarantie</span>
              </h3>
              <p className="text-[11px] text-[#78716C]">
                Transparant beleid voor gepersonaliseerde sterrenposters &amp; drukwerk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white transition"
            aria-label="Sluiten"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Guarantee Summary Banner */}
          <div className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#DDD6C8] flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#1C1917] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#E6C285]" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-semibold text-[#1C1917]">
                Onze Unieke Ontwerp-Tevredenheidsgarantie
              </h4>
              <p className="text-[#57534E] leading-relaxed">
                Omdat elke sterrenkaart een uniek gepersonaliseerd maatwerkproduct is, kunnen fysieke posters niet worden geretourneerd. <strong>Ben je niet tevreden over het resultaat? Dan storten wij de volledige ontwerpprijs (€19,-) aan je terug.</strong>
              </p>
            </div>
          </div>

          {/* Policy Articles */}
          <div className="space-y-5 text-xs text-[#57534E]">
            {/* Article 1: Personalized Custom Goods */}
            <div className="space-y-2 pb-4 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#A37055]" />
                <span>1. Gepersonaliseerd Maatwerk &amp; Herroepingsrecht</span>
              </div>
              <p className="leading-relaxed font-light">
                Al onze sterrenkaarten worden specifiek voor jou op aanvraag gegenereerd, berekend op basis van jouw unieke tijdstip, coördinaten en persoonlijke namen of teksten.
              </p>
              <p className="leading-relaxed font-light">
                Conform <strong>artikel 6:230p sub f van het Burgerlijk Wetboek</strong> en de <strong>Europese Richtlijn Consumentenrechten (2011/83/EU)</strong> is het wettelijke herroepingsrecht (de standaard bedenktermijn van 14 dagen) uitgesloten voor goederen die volgens specificaties van de consument zijn vervaardigd of duidelijk een persoonlijk karakter hebben. Fysieke prints en op maat gemonteerde houten fotolijsten kunnen derhalve niet worden geretourneerd of opnieuw op voorraad worden genomen.
              </p>
            </div>

            {/* Article 2: Design Price Refund */}
            <div className="space-y-2 pb-4 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#A37055]" />
                <span>2. Terugbetaling van de Ontwerpprijs</span>
              </div>
              <p className="leading-relaxed font-light">
                Wij hechten buitengewoon veel waarde aan jouw emotionele ervaring bij het ontvangen van een Stellaire sterrenposter. Mocht het ontwerp onverhoopt niet aan jouw verwachtingen voldoen, dan brengen wij de fysieke materiaal- en verzendkosten (die reeds bij onze drukkerijpartner zijn gemaakt) in mindering, maar betalen we de <strong>volledige ontwerpkosten van €19,-</strong> direct terug.
              </p>
              <p className="leading-relaxed font-light">
                Bij aankoop van de zuiver <em>Digitale Editie (PDF 300 DPI)</em> geldt tevens dat wij bij aantoonbare technische gebreken of legitieme onvrede over de sterrencompositie het volledige bedrag vergoeden.
              </p>
            </div>

            {/* Article 3: Damaged Goods & Quality Guarantee */}
            <div className="space-y-3 pb-4 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-xs uppercase tracking-wider">
                <Truck className="w-4 h-4 text-[#A37055]" />
                <span>3. Transportschade &amp; Kwaliteitsgarantie (100% Gedekt door Ons Atelier)</span>
              </div>
              <p className="leading-relaxed font-light">
                Als een ingelijst product of een ander artikel beschadigd aankomt (zoals <strong>gebroken glas of plexiglas, ingedeukte hoeken, of gebarsten hout van de lijst</strong>) of sprake is van een fabricagefout, neemt ons atelier de volledige verantwoordelijkheid onder onze <strong>100% Kwaliteitsgarantie</strong>.
              </p>

              <div className="space-y-3">
                {/* 1. Atelier covers it */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E8E4DC] space-y-1.5">
                  <h5 className="font-semibold text-[#1C1917] text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Ons Atelier Vergoedt Alle Kosten (Kosteloze Vervanging of Terugbetaling)</span>
                  </h5>
                  <p className="text-[11.5px] text-[#57534E] leading-relaxed">
                    Indien de schade is ontstaan tijdens het transport of door een productiefout, vergoedt ons atelier alle kosten. Wij zorgen voor:
                  </p>
                  <ul className="space-y-1 list-disc list-inside text-[11px] text-[#57534E] pl-1">
                    <li>Een <strong>kosteloze, nieuwe vervangende bestelling</strong> die met voorrang wordt gedrukt, ingelijst en verzonden.</li>
                    <li>Of een <strong>volledige terugbetaling</strong> indien vervanging niet haalbaar is of je als klant niet kunt wachten.</li>
                  </ul>
                </div>

                {/* 2. What you need to do */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E2DDD5] space-y-2">
                  <h5 className="font-semibold text-[#1C1917] text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#A37055]" />
                    <span>2. Wat Moet Je Doen Om Aanspraak Te Maken?</span>
                  </h5>
                  <div className="space-y-2 text-[11px] text-[#57534E]">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#1C1917] min-w-[70px]">Termijn:</span>
                      <span>Meld de schade binnen <strong>30 dagen</strong> nadat je het pakket hebt ontvangen.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#1C1917] min-w-[70px]">Fotobewijs:</span>
                      <div className="space-y-1">
                        <span>Ons atelier heeft strikt fotobewijs nodig om de claim in te dienen bij de transporteur. Stuur duidelijke foto’s van:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[#1C1917] font-medium pt-0.5">
                          <li><strong>Het beschadigde artikel zelf</strong> (bijv. het gebroken glas, de ingedeukte lijsthoek of het gebarsten hout).</li>
                          <li><strong>De verpakking (ZOWEL de binnen- als de buitenverpakking)</strong>. Foto’s van de verzenddoos en het binnenste beschermingsmateriaal zijn <em>verplicht</em> om de transportschadeclaim bij de bezorgdienst te kunnen valideren.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article 4: Cancellation Window */}
            <div className="space-y-2 pb-4 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#A37055]" />
                <span>4. Annuleren of Wijzigen vóór Productie</span>
              </div>
              <p className="leading-relaxed font-light">
                Onze geautomatiseerde systemen zetten de sterrenhemel direct om naar een drukklare vector PDF. Heb je per ongeluk een spelfout gemaakt in de namen of datum? Je kunt jouw bestelling tot <strong>2 uur na betaling</strong> kosteloos laten aanpassen of annuleren voordat het bestand in de drukpers gaat.
              </p>
            </div>

            {/* Article 5: Contact Procedure */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-xs uppercase tracking-wider">
                <Mail className="w-4 h-4 text-[#A37055]" />
                <span>5. Een verzoek indienen</span>
              </div>
              <p className="leading-relaxed font-light">
                Wil je aanspraak maken op teruggave van de ontwerpprijs of een herdruk aanvragen wegens schade? Neem contact op met ons atelier:
              </p>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E8E4DC]">
                <div className="flex items-center gap-2 font-medium text-[#1C1917]">
                  <Mail className="w-4 h-4 text-[#A37055]" />
                  <span>klantenservice@stellaire.nl</span>
                </div>
                <span className="text-[11px] text-[#78716C]">
                  Vermeld altijd jouw bestelnummer (bijv. STL-19565)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F5F2EB] border-t border-[#E8E4DC] flex items-center justify-between">
          <p className="text-[11px] text-[#78716C] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A37055]" />
            <span>Conform EU richtlijn consumentenrechten &amp; 100% ambachtelijke kwaliteitsgarantie</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1C1917] text-white hover:bg-[#332F2B] text-xs font-semibold transition shadow-sm"
          >
            Begrepen &amp; Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
