'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Download,
  AlertCircle,
  X,
  Calendar,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileText,
  Printer,
} from 'lucide-react';
import { OrderRecord } from '../types';
import { apiFetch } from '../utils/api';

interface CustomerTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  initialEmail?: string;
}

export const CustomerTrackingModal: React.FC<CustomerTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  initialEmail = '',
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'history'>('track');

  // Track single order form state
  const [orderId, setOrderId] = useState(initialOrderId);
  const [trackEmail, setTrackEmail] = useState(initialEmail);
  const [trackedOrder, setTrackedOrder] = useState<OrderRecord | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // History form state
  const [historyEmail, setHistoryEmail] = useState(initialEmail);
  const [orderHistory, setOrderHistory] = useState<OrderRecord[] | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !trackEmail.trim()) {
      setTrackError('Vul alstublieft zowel uw bestelnummer als uw e-mailadres in.');
      return;
    }

    setIsTrackingLoading(true);
    setTrackError(null);
    setTrackedOrder(null);

    try {
      const res = await apiFetch('/api/customer/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId.trim(),
          email: trackEmail.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.detail || 'Geen bestelling gevonden voor dit bestelnummer en e-mailadres.'
        );
      }

      const data: OrderRecord = await res.json();
      setTrackedOrder(data);
    } catch (err: any) {
      setTrackError(err.message || 'Fout bij het ophalen van de bestelling.');
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!historyEmail.trim()) {
      setHistoryError('Vul alstublieft uw e-mailadres in.');
      return;
    }

    setIsHistoryLoading(true);
    setHistoryError(null);
    setOrderHistory(null);

    try {
      const res = await apiFetch('/api/customer/orders/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: historyEmail.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'Fout bij het ophalen van uw bestelgeschiedenis.');
      }

      const data = await res.json();
      setOrderHistory(data.orders || []);
      if ((data.orders || []).length === 0) {
        setHistoryError('Geen eerdere bestellingen gevonden voor dit e-mailadres.');
      }
    } catch (err: any) {
      setHistoryError(err.message || 'Fout bij het ophalen van bestellingen.');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const selectOrderFromHistory = (order: OrderRecord) => {
    setOrderId(order.order_id);
    setTrackEmail(order.customer.email);
    setTrackedOrder(order);
    setActiveTab('track');
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    confirmed: { label: 'Ontvangen', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    in_production: { label: 'In Atelier Productie', color: 'bg-sky-50 text-sky-800 border-sky-200' },
    printed: { label: 'Gedrukt & Geïnspecteerd', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    shipped: { label: 'Onderweg met bezorgpartner', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    delivered: { label: 'Bezorgd', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'in_production':
      case 'ready_for_print':
        return 1;
      case 'printed':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const steps = [
    { title: 'Ontvangen', desc: 'Compositie vastgelegd' },
    { title: 'In Productie', desc: '300 DPI vector PDF' },
    { title: 'Gedrukt', desc: '285 gsm katoen' },
    { title: 'Verzonden', desc: 'Track & Trace partner' },
    { title: 'Bezorgd', desc: 'Op bestemming' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#E2DDD5] rounded-3xl shadow-2xl overflow-hidden my-8 text-[#1C1917]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#F5F2EB] border-b border-[#E8E4DC] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917] shadow-sm">
              <Printer className="w-4 h-4 text-[#A37055]" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1C1917] tracking-wide flex items-center gap-2">
                <span>Drukkerij &amp; Bestelstatus</span>
                <span className="text-[10px] uppercase font-sans font-semibold px-2 py-0.5 rounded-full bg-[#E8E2D5] text-[#57534E]">
                  Realtime Atelier Status
                </span>
              </h3>
              <p className="text-[11px] text-[#78716C]">
                Log in met uw bestelnummer en e-mailadres om de productiestatus in onze drukkerij te bekijken
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8E4DC] bg-white px-6">
          <button
            onClick={() => setActiveTab('track')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'track'
                ? 'border-[#1C1917] text-[#1C1917]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Drukkerij Status Bekijken</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'history'
                ? 'border-[#1C1917] text-[#1C1917]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mijn Eerdere Bestellingen</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'track' ? (
            <div className="space-y-6">
              {/* Lookup Form */}
              <form
                onSubmit={handleTrackSubmit}
                className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block mb-1">
                      Bestelnummer *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bijv. STL-19565"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] uppercase tracking-wider font-mono shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block mb-1">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="uw@email.nl"
                      value={trackEmail}
                      onChange={(e) => setTrackEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                </div>

                {trackError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{trackError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#A8A29E]">
                    Geen wachtwoord vereist • Veilig op basis van e-mail en bestelnummer
                  </span>
                  <button
                    type="submit"
                    disabled={isTrackingLoading}
                    className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isTrackingLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Inloggen...</span>
                      </>
                    ) : (
                      <>
                        <Printer className="w-3.5 h-3.5" />
                        <span>Drukkerij Status Bekijken</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Sample Hint */}
              {!trackedOrder && (
                <div className="p-3.5 bg-[#F5F2EB]/60 rounded-2xl border border-[#E8E4DC] text-xs text-[#78716C] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
                    <span>
                      Voorbeeld testbestelling: <strong>STL-19565</strong> (
                      <span className="font-mono text-[#1C1917]">clara.sterling@atelier-luxury.com</span>) of{' '}
                      <strong>STL-90547</strong> (<span className="font-mono text-[#1C1917]">jane@example.com</span>)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderId('STL-19565');
                      setTrackEmail('clara.sterling@atelier-luxury.com');
                    }}
                    className="text-[#A37055] font-semibold hover:underline text-[11px]"
                  >
                    Test nu &rarr;
                  </button>
                </div>
              )}

              {/* Tracked Order Details */}
              {trackedOrder && (
                <div className="space-y-5 animate-in fade-in-50 duration-300">
                  {/* Order Overview Header Card */}
                  <div className="p-6 bg-white rounded-3xl border border-[#E8E4DC] shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0ECE1]">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-sm bg-[#F5F2EB] px-2.5 py-0.5 rounded-lg border border-[#E2DDD5] text-[#1C1917]">
                            {trackedOrder.order_id}
                          </span>
                          <span
                            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                              statusLabels[trackedOrder.status]?.color ||
                              'bg-zinc-50 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            {statusLabels[trackedOrder.status]?.label || trackedOrder.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#78716C] mt-1">
                          Geplaatst op:{' '}
                          {trackedOrder.created_at
                            ? new Date(trackedOrder.created_at).toLocaleDateString('nl-NL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : 'Recent'}
                        </p>
                      </div>

                      {/* Download PDF Action */}
                      <a
                        href={`/api/customer/orders/${trackedOrder.order_id}/pdf?email=${encodeURIComponent(
                          trackEmail
                        )}`}
                        download
                        className="px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md flex items-center justify-center gap-2 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download 300 DPI Poster PDF</span>
                      </a>
                    </div>

                    {/* Visual Progress Stepper */}
                    <div className="py-2">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#EBE7DF] z-0" />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
                          style={{
                            width: `${(getStatusStepIndex(trackedOrder.status) / (steps.length - 1)) * 100}%`,
                          }}
                        />

                        {/* Step Nodes */}
                        {steps.map((s, idx) => {
                          const currentStep = getStatusStepIndex(trackedOrder.status);
                          const isComplete = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={idx} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                                  isComplete
                                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                                    : 'bg-white border-2 border-[#D6D0C4] text-[#A8A29E]'
                                }`}
                              >
                                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] mt-2 font-medium text-center hidden sm:block ${
                                  isCurrent ? 'text-[#1C1917] font-bold' : 'text-[#78716C]'
                                }`}
                              >
                                {s.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Carrier & Tracking details */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917]">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1C1917]">
                            Bezorging via {trackedOrder.carrier || 'PostNL'}
                          </p>
                          <p className="text-[#78716C] text-[11px]">
                            {trackedOrder.tracking_number
                              ? `Track & Trace code: ${trackedOrder.tracking_number}`
                              : 'Trackingcode wordt geactiveerd zodra het atelier het pakket overdraagt.'}
                          </p>
                        </div>
                      </div>

                      {trackedOrder.tracking_url && (
                        <a
                          href={trackedOrder.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] border border-[#E2DDD5] font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
                        >
                          <span>Volg bij Bezorger</span>
                          <ExternalLink className="w-3 h-3 text-[#78716C]" />
                        </a>
                      )}
                    </div>

                    {/* Timeline Log */}
                    {trackedOrder.timeline && trackedOrder.timeline.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                          Atelier Voortgang & Logboek
                        </span>
                        <div className="space-y-2 border-l-2 border-[#E8E4DC] pl-4 ml-1">
                          {trackedOrder.timeline.map((evt, i) => (
                            <div key={i} className="relative pb-2">
                              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#1C1917] ring-4 ring-[#FAF8F5]" />
                              <div className="flex items-center justify-between">
                                <h5 className="font-serif font-bold text-xs text-[#1C1917]">{evt.title}</h5>
                                <span className="text-[10px] text-[#A8A29E] font-mono">
                                  {evt.timestamp ? new Date(evt.timestamp).toLocaleString('nl-NL') : ''}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#78716C] mt-0.5">{evt.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Artwork Details & Delivery Destination */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#F0ECE1] text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block mb-1">
                          Kunstwerk Specificaties
                        </span>
                        <p className="font-serif font-bold text-[#1C1917]">
                          {trackedOrder.title_text || 'Sterrenkaart'}
                        </p>
                        <p className="text-[11px] text-[#78716C] italic">{trackedOrder.names_text}</p>
                        <p className="text-[11px] text-[#57534E] mt-1">
                          Formaat: <strong>{trackedOrder.poster_size} cm</strong> • Uitvoering:{' '}
                          <strong className="capitalize">{trackedOrder.frame_style || 'Zonder lijst'}</strong>
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block mb-1">
                          Afleveradres
                        </span>
                        <p className="font-semibold text-[#1C1917]">{trackedOrder.customer.name}</p>
                        <p className="text-[11px] text-[#57534E]">
                          {trackedOrder.customer.address_line1}, {trackedOrder.customer.city}{' '}
                          {trackedOrder.customer.postal_code}, {trackedOrder.customer.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Order History by Email */
            <div className="space-y-6">
              <form
                onSubmit={handleHistorySubmit}
                className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-4"
              >
                <div>
                  <label className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block mb-1">
                    E-mailadres bij Uw Bestellingen *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="bijv. emma@voorbeeld.nl"
                      value={historyEmail}
                      onChange={(e) => setHistoryEmail(e.target.value)}
                      className="flex-1 bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={isHistoryLoading}
                      className="px-5 py-2 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2 shrink-0"
                    >
                      {isHistoryLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Laden...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Zoek Bestellingen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {historyError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{historyError}</span>
                  </div>
                )}
              </form>

              {/* Order History Results */}
              {orderHistory && orderHistory.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                    Gevonden Bestellingen ({orderHistory.length})
                  </h4>

                  <div className="space-y-3">
                    {orderHistory.map((item) => (
                      <div
                        key={item.order_id}
                        className="p-4 bg-white rounded-2xl border border-[#E8E4DC] hover:border-[#1C1917] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-xs bg-[#F5F2EB] px-2 py-0.5 rounded border border-[#E2DDD5] text-[#1C1917]">
                              {item.order_id}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                                statusLabels[item.status]?.color || 'bg-zinc-50 text-zinc-800 border-zinc-200'
                              }`}
                            >
                              {statusLabels[item.status]?.label || item.status}
                            </span>
                            <span className="text-[11px] text-[#78716C] font-mono">
                              {item.created_at
                                ? new Date(item.created_at).toLocaleDateString('nl-NL')
                                : 'Recent'}
                            </span>
                          </div>

                          <h5 className="font-serif font-bold text-sm text-[#1C1917]">
                            {item.title_text || 'Sterrenkaart'}
                          </h5>
                          <p className="text-xs text-[#78716C] italic">Opgedragen: {item.names_text}</p>
                          <p className="text-[11px] text-[#57534E]">
                            Formaat: <strong>{item.poster_size} cm</strong> • Lijst:{' '}
                            <strong className="capitalize">{item.frame_style || 'Zonder lijst'}</strong>
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => selectOrderFromHistory(item)}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-sm flex items-center justify-center gap-1.5 transition"
                          >
                            <span>Bekijk & Volg</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`/api/customer/orders/${item.order_id}/pdf?email=${encodeURIComponent(
                              historyEmail
                            )}`}
                            download
                            className="p-2 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] border border-[#E2DDD5] shadow-sm transition"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4 text-[#78716C]" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
