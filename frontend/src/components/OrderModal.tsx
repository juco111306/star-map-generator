'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Printer,
  Sparkles,
  CheckCircle2,
  Package,
  Heart,
  MapPin,
  Calendar,
  Download,
  ArrowRight,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { CustomerDetails, MapConfig, OrderRecord } from '../types';
import { apiFetch } from '../utils/api';
import { calculatePrice } from '../utils/pricing';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MapConfig;
  onOrderSuccess: (order: OrderRecord) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  config,
  onOrderSuccess,
}) => {
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nederland',
    gift_note: '',
    producer_notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const isDigital = config.frameStyle === 'digital';
  const priceDetails = calculatePrice(config.posterSize, config.frameStyle);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer.name.trim() || !customer.email.trim()) {
      setError('Vul alstublieft uw naam en e-mailadres in.');
      return;
    }
    if (!isDigital && (!customer.address_line1.trim() || !customer.city.trim() || !customer.postal_code.trim())) {
      setError('Vul alstublieft uw volledige bezorgadres in voor PostNL / Bpost.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payloadCustomer = {
        ...customer,
        address_line1: customer.address_line1.trim() || 'Digitale Levering per E-mail',
        city: customer.city.trim() || 'Digitaal',
        postal_code: customer.postal_code.trim() || '0000',
        country: customer.country || 'Nederland',
      };

      // 1. Calculate price (29 for physical, 19 for digital)
      const amount = config.frameStyle === 'digital' ? 19 : 29;

      // 2. Ping the new Paystack route directly!
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payloadCustomer.email,
          amount: amount,
          shippingDetails: payloadCustomer,
          designUrl: `https://star-map-generator-iota.vercel.app/placeholder.pdf`
        })
      });

      if (!checkoutRes.ok) {
        throw new Error('Kon geen verbinding maken met de kassa.');
      }

      const checkoutData = await checkoutRes.json();
      
      // 3. Redirect the user to the secure payment page
      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      } else {
        throw new Error('Fout bij het aanmaken van de betaling');
      }

    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(err.message || 'Fout bij het verzenden van de bestelling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const frameLabels: Record<string, string> = {
    digital: 'Digitaal Bestand (300 DPI Vector PDF)',
    none: 'Classic Matte Poster (Alleen print)',
    black: 'Gelato Zwart Houten Lijst (Classic Matte)',
    oak: 'Gelato Natuurlijk Houten Lijst (Classic Matte)',
    white: 'Gelato Wit Houten Lijst (Classic Matte)',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E2DDD5] rounded-3xl shadow-2xl overflow-hidden my-8 text-[#1C1917]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#F5F2EB] border-b border-[#E8E4DC] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917] shadow-sm">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1C1917] tracking-wide">
                Verzend naar Drukkerij Atelier
              </h3>
              <p className="text-[11px] text-[#78716C]">
                300 DPI museum-PDF compileren & toevoegen aan de productiewachtrij
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {completedOrder ? (
          /* Order Confirmation View */
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono tracking-widest text-[#78716C] font-bold uppercase">
                BESTELREFERENTIE: {completedOrder.order_id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                Succesvol Verzonden naar het Atelier
              </h2>
              <p className="text-xs text-[#57534E] max-w-md mx-auto leading-relaxed">
                Uw 300 DPI archiefwaardige print-PDF is met uiterste precisie berekend op basis van de exacte hemelcoördinaten en toegevoegd aan de productiewachtrij.
              </p>
            </div>

            {/* Order Specification Summary Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#E8E4DC] text-left text-xs space-y-2.5 max-w-lg mx-auto shadow-sm">
              <div className="flex justify-between pb-2 border-b border-[#F0ECE1]">
                <span className="text-[#78716C]">Kunstwerk:</span>
                <span className="font-bold text-[#1C1917]">De Gepersonaliseerde Sterrenposter™</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Opgedragen aan:</span>
                <span className="text-[#1C1917] font-serif font-bold">{completedOrder.names_text}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Bijzondere Datum:</span>
                <span className="text-[#1C1917]">{completedOrder.date_text}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Formaat & Uitvoering:</span>
                <span className="text-[#1C1917]">{completedOrder.frame_style === 'digital' ? 'Digitaal Bestand' : `${completedOrder.poster_size} cm`} • {frameLabels[completedOrder.frame_style] || 'Kunstdruk'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Totaalbedrag:</span>
                <span className="text-[#1C1917] font-bold">{priceDetails.formattedPrice}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#F0ECE1]">
                <span className="text-[#78716C]">{completedOrder.frame_style === 'digital' ? 'Verzonden naar:' : 'Bezorging aan:'}</span>
                <span className="text-[#1C1917]">{completedOrder.customer.name} ({completedOrder.customer.email})</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/api/orders/${completedOrder.order_id}/pdf`}
                download
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] font-medium text-xs border border-[#E2DDD5] flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Proefdruk PDF</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition"
              >
                Terug naar Atelier
              </button>
            </div>
          </div>
        ) : (
          /* Order Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Keepsake Summary Banner */}
            <div className="p-3.5 bg-[#F5F2EB]/70 rounded-2xl border border-[#E8E4DC] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-14 rounded-lg overflow-hidden bg-white border border-[#E2DDD5] shrink-0 shadow-sm">
                  <img
                    src="/textures/star_map_sample.png"
                    alt="Star Map"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#1C1917] text-xs">
                    De Gepersonaliseerde Sterrenposter™
                  </h4>
                  <p className="text-[11px] text-[#78716C] font-serif italic">
                    {config.namesBlock.text || 'Ambachtelijk Kunstwerk'}
                  </p>
                  <p className="text-[10px] text-[#A8A29E]">
                    {config.frameStyle === 'digital' ? 'Digitaal PDF (300 DPI)' : `${config.posterSize.replace('x', ' × ')} cm`} • {frameLabels[config.frameStyle]}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium block mb-0.5">
                  {config.frameStyle === 'digital' ? 'Direct digitaal (PDF)' : 'Gelato Productie'}
                </span>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-[#A8A29E] line-through">{priceDetails.formattedOriginalPrice}</span>
                  <span className="text-xs font-bold text-[#1C1917]">{priceDetails.formattedPrice}</span>
                </div>
              </div>
            </div>

            {/* Customer & Shipping / Delivery Fields */}
            {isDigital ? (
              <div className="space-y-3">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    <strong>Digitale Editie:</strong> Uw 300 DPI drukklare vector PDF wordt direct gegenereerd en verzonden naar het onderstaande e-mailadres. Geen verzendkosten.
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                  1. Contactgegevens voor Digitale Toezending
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">Volledige Naam *</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="bijv. Emma van der Meer"
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">E-mailadres voor PDF *</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="emma@voorbeeld.nl"
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                  1. Gegevens van de Ontvanger & Bezorgadres (Gelato Partner)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">Volledige Naam *</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="bijv. Emma van der Meer"
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">E-mailadres voor updates *</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="emma@voorbeeld.nl"
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">Straatnaam & Huisnummer *</label>
                  <input
                    type="text"
                    required
                    value={customer.address_line1}
                    onChange={(e) => setCustomer({ ...customer, address_line1: e.target.value })}
                    placeholder="bijv. Keizersgracht 142"
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">Plaats *</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="Amsterdam"
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">Provincie</label>
                    <input
                      type="text"
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      placeholder="Noord-Holland"
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">Postcode *</label>
                    <input
                      type="text"
                      required
                      value={customer.postal_code}
                      onChange={(e) => setCustomer({ ...customer, postal_code: e.target.value })}
                      placeholder="1015 CJ"
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">Land *</label>
                  <select
                    value={customer.country}
                    onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  >
                    <option value="Nederland">Nederland (PostNL Tracked)</option>
                    <option value="België">België (Bpost Tracked)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Optional Gift Message & Print Workshop Instructions */}
            <div className="space-y-3 pt-2 border-t border-[#E8E4DC]">
              <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                2. Cadeaukaartje & Aanwijzingen voor de Drukker
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">
                    Kosteloos Cadeaukaartje (Met Waszegel)
                  </label>
                  <textarea
                    rows={2}
                    value={customer.gift_note}
                    onChange={(e) => setCustomer({ ...customer, gift_note: e.target.value })}
                    placeholder="bijv. Gefeliciteerd met jullie 1-jarig huwelijk! Dit was de hemel toen ons avontuur begon."
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-1.5 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] resize-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">
                    Aanwijzingen voor de Drukker
                  </label>
                  <textarea
                    rows={2}
                    value={customer.producer_notes}
                    onChange={(e) => setCustomer({ ...customer, producer_notes: e.target.value })}
                    placeholder="bijv. Classic Matte papier, extra zorgvuldig centreren."
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-1.5 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] resize-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between">
              <span className="text-[11px] text-[#78716C]">
                {isDigital ? 'Digitale instant levering' : 'Productie via partner Gelato • PostNL / Bpost'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-medium text-[#78716C] hover:text-[#1C1917]"
                >
                  Annuleren
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>300 DPI PDF Genereren...</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-3.5 h-3.5" />
                      <span>Bestelling Plaatsen ({priceDetails.formattedPrice})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
