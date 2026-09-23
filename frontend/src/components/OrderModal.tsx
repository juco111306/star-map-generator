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
    country: 'United States',
    gift_note: '',
    producer_notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.email.trim() || !customer.address_line1.trim()) {
      setError('Please fill out name, email, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        customer,
        map_config: {
          latitude: config.latitude,
          longitude: config.longitude,
          date: config.date,
          time: config.time,
          date_time: `${config.date}T${config.time || '21:00'}:00Z`,
          poster_size: config.posterSize,
          style_id: config.styleId,
          frame_style: config.frameStyle,
          titleBlock: config.titleBlock,
          namesBlock: config.namesBlock,
          taglineBlock: config.taglineBlock,
          dateBlock: config.dateBlock,
          locationBlock: config.locationBlock,
          coordsBlock: config.coordsBlock,
          show_matted_border: config.showMattedBorder,
          show_celestial_grid: config.showCelestialGrid,
          show_constellation_lines: config.showConstellationLines,
          show_milky_way: config.showMilkyWay,
          divider_style: config.dividerStyle,
        },
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to submit order');
      }

      const orderData: OrderRecord = await res.json();
      setCompletedOrder(orderData);
      onOrderSuccess(orderData);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(err.message || 'Error sending order to workshop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const frameLabels: Record<string, string> = {
    none: 'Unframed Fine Art Print',
    black: 'Slim Matte Black Gallery Frame (8 mm)',
    oak: 'Slim Nordic Oak Wood Frame (8 mm)',
    white: 'Slim Gallery White Frame (8 mm)',
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
                Send to Print Workshop
              </h3>
              <p className="text-[11px] text-[#78716C]">
                Compile 300 DPI archival PDF & dispatch to production queue
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
                ORDER REFERENCE: {completedOrder.order_id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                Dispatched to Print Workshop
              </h2>
              <p className="text-xs text-[#57534E] max-w-md mx-auto leading-relaxed">
                Your archival 300 DPI print-ready PDF has been compiled using exact celestial positions and filed into your producer printing queue.
              </p>
            </div>

            {/* Order Specification Summary Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#E8E4DC] text-left text-xs space-y-2.5 max-w-lg mx-auto shadow-sm">
              <div className="flex justify-between pb-2 border-b border-[#F0ECE1]">
                <span className="text-[#78716C]">Keepsake:</span>
                <span className="font-bold text-[#1C1917]">The Celestial Blueprint™</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Inscribed For:</span>
                <span className="text-[#1C1917] font-serif font-bold">{completedOrder.names_text}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Milestone Date:</span>
                <span className="text-[#1C1917]">{completedOrder.date_text}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Print Size & Frame:</span>
                <span className="text-[#1C1917]">{completedOrder.poster_size}&quot; • {frameLabels[completedOrder.frame_style] || 'Print'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#F0ECE1]">
                <span className="text-[#78716C]">Shipping To:</span>
                <span className="text-[#1C1917]">{completedOrder.customer.name}, {completedOrder.customer.city}</span>
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
                <span>Download Print PDF Proof</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition"
              >
                Return to Studio
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
                    The Celestial Blueprint™
                  </h4>
                  <p className="text-[11px] text-[#78716C] font-serif italic">
                    {config.namesBlock.text || 'Custom Keepsake'}
                  </p>
                  <p className="text-[10px] text-[#A8A29E]">
                    {config.posterSize}&quot; • {frameLabels[config.frameStyle]}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium block mb-0.5">
                  Print Ready (300 DPI)
                </span>
                <span className="text-xs font-bold text-[#1C1917]">$49.00</span>
              </div>
            </div>

            {/* Customer & Recipient Shipping Fields */}
            <div className="space-y-3">
              <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                1. Recipient & Delivery Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">Full Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Emma Harrison"
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">Notification Email *</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="emma@example.com"
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#57534E] font-medium block mb-1">Shipping Street Address *</label>
                <input
                  type="text"
                  required
                  value={customer.address_line1}
                  onChange={(e) => setCustomer({ ...customer, address_line1: e.target.value })}
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="New York"
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">State / Province</label>
                  <input
                    type="text"
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    placeholder="NY"
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={customer.postal_code}
                    onChange={(e) => setCustomer({ ...customer, postal_code: e.target.value })}
                    placeholder="10001"
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Optional Gift Message & Print Workshop Instructions */}
            <div className="space-y-3 pt-2 border-t border-[#E8E4DC]">
              <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                2. Gift Note & Printing Instructions
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">
                    Complimentary Gift Note (Wax-Sealed)
                  </label>
                  <textarea
                    rows={2}
                    value={customer.gift_note}
                    onChange={(e) => setCustomer({ ...customer, gift_note: e.target.value })}
                    placeholder="e.g. Happy 1st Anniversary my love! Here is the sky when our forever began."
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-1.5 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] resize-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">
                    Special Notes for Print Producer
                  </label>
                  <textarea
                    rows={2}
                    value={customer.producer_notes}
                    onChange={(e) => setCustomer({ ...customer, producer_notes: e.target.value })}
                    placeholder="e.g. Heavy matte archival stock, double-check corner alignment."
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-1.5 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] resize-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between">
              <span className="text-[11px] text-[#78716C]">
                Payment deferred • Files into producer print queue
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-medium text-[#78716C] hover:text-[#1C1917]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating 300 DPI PDF...</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-3.5 h-3.5" />
                      <span>Submit Order to Workshop</span>
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
