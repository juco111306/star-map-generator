'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Download,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Printer,
  ExternalLink,
  ShieldCheck,
  Truck,
  Heart,
  Home as HomeIcon,
} from 'lucide-react';
import { OrderRecord } from '@/types';
import { apiFetch } from '@/utils/api';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId') || '';
  const sessionId = searchParams.get('session_id') || '';
  const amountParam = searchParams.get('amount') || '';

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on page load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const loadOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiFetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data: OrderRecord = await res.json();
          setOrder(data);

          // If physical order and Gelato submission was not triggered yet, trigger client fallback
          if (data.frame_style !== 'digital' && !data.gelato_order_id) {
            try {
              const gRes = await apiFetch(`/api/orders/${orderId}/gelato-submit`, {
                method: 'POST',
              });
              if (gRes.ok) {
                const gData = await gRes.json();
                if (gData.order) {
                  setOrder(gData.order);
                }
              }
            } catch (gErr) {
              console.warn('Gelato auto-trigger note:', gErr);
            }
          }
        }
      } catch (err) {
        console.warn('Could not load order record:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const displayOrderId = order?.order_id || orderId || 'STL-BEVESTIGD';
  const isDigital = order?.frame_style === 'digital';

  const copyOrderRef = () => {
    if (displayOrderId) {
      navigator.clipboard.writeText(displayOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE5DC] px-6 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#A37055] transition-colors">
              Stellaire
            </span>
            <span className="text-[10px] font-sans tracking-widest text-[#78716C] uppercase font-semibold">
              Atelier
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#57534E] hover:text-[#1C1917] flex items-center gap-1.5 transition"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Terug naar Winkel</span>
          </Link>
        </div>
      </header>

      {/* Main Success Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 flex-1 w-full">
        {/* Success Header Hero */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl scale-150 animate-pulse pointer-events-none" />
            <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Betaling Geslaagd • Bestelling Bevestigd</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
              Hartelijk Dank voor Jouw Bestelling
            </h1>

            <p className="text-[#57534E] text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
              Jouw unieke sterrenhemel is met astronomische precisie berekend en doorgestuurd naar ons atelier voor productie.
            </p>
          </div>

          {/* Luxury Order ID Badge */}
          <div className="pt-2 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#E2DDD5] shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-mono font-medium">
              Bestelnummer:
            </span>
            <span className="font-mono font-bold text-sm text-[#1C1917]">
              {displayOrderId}
            </span>
            <button
              onClick={copyOrderRef}
              className="text-[11px] text-[#A37055] hover:underline font-medium ml-1"
            >
              {copied ? 'Gekopieerd!' : 'Kopiëren'}
            </button>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-[#E2DDD5] shadow-sm overflow-hidden divide-y divide-[#F2ECE1]">
          {/* Status Row */}
          <div className="p-5 sm:p-6 bg-[#FAF8F5]/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917] shadow-xs">
                <Printer className="w-4 h-4 text-[#A37055]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                  Productiestatus
                </span>
                <p className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {isDigital
                      ? 'Gereed voor Download'
                      : order?.gelato_order_id
                      ? `In Productie bij Gelato (#${order.gelato_order_id})`
                      : 'In Atelier Productie'}
                  </span>
                </p>
              </div>
            </div>

            {order?.customer?.email && (
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                  Bevestiging Verzonden Naar
                </span>
                <p className="text-xs font-mono text-[#1C1917] font-medium">
                  {order.customer.email}
                </p>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="p-5 sm:p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1C1917]">
              {order?.title_text || 'De Gepersonaliseerde Sterrenposter™'}
            </h3>

            {order?.names_text && (
              <p className="text-xs text-[#78716C] font-serif italic -mt-2">
                Opgedragen aan: <strong className="text-[#1C1917] not-italic">{order.names_text}</strong>
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#57534E]">
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-0.5">
                <span className="text-[10px] text-[#78716C] uppercase font-semibold">Formaat</span>
                <p className="font-bold text-[#1C1917]">{order?.poster_size || '50x70'} cm</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-0.5">
                <span className="text-[10px] text-[#78716C] uppercase font-semibold">Uitvoering</span>
                <p className="font-bold text-[#1C1917] capitalize">
                  {isDigital
                    ? 'Digitaal Bestand (300 DPI)'
                    : order?.frame_style === 'oak'
                    ? 'Natuurlijk Hout (Licht)'
                    : order?.frame_style === 'black'
                    ? 'Mat Zwart Hout'
                    : order?.frame_style === 'white'
                    ? 'Zuiver Wit Hout'
                    : 'Classic Matte Poster'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-0.5">
                <span className="text-[10px] text-[#78716C] uppercase font-semibold">Bestandskwaliteit</span>
                <p className="font-bold text-[#1C1917]">300 DPI Archival Vector</p>
              </div>
            </div>

            {/* Delivery Address if physical */}
            {order?.customer && !isDigital && (
              <div className="pt-2 text-xs text-[#57534E] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A37055] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#1C1917]">Bezorgadres: </span>
                  <span>
                    {order.customer.name}, {order.customer.address_line1}, {order.customer.postal_code} {order.customer.city}, {order.customer.country}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-5 sm:p-6 bg-[#FAF8F5]/40 flex flex-col sm:flex-row items-center gap-3">
            {/* Download PDF button */}
            {displayOrderId && (
              <a
                href={`/api/orders/${displayOrderId}/pdf`}
                download={`${displayOrderId}_print_ready_300dpi.pdf`}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-md flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Print-Ready PDF (300 DPI)</span>
              </a>
            )}

            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] font-medium text-xs border border-[#E2DDD5] flex items-center justify-center gap-1.5 transition shadow-xs text-center"
            >
              <span>Nieuwe Sterrenkaart Ontwerpen</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#78716C]" />
            </Link>
          </div>
        </div>

        {/* 3 Step Roadmap of What Happens Next */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2DDD5] shadow-xs space-y-4">
          <h4 className="font-serif text-sm font-bold text-[#1C1917] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A37055]" />
            <span>Wat Gebeurt Er Nu?</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#57534E]">
            <div className="space-y-1">
              <span className="font-mono font-bold text-[#A37055]">1. Astronomische Berekening</span>
              <p className="text-[11px] font-light leading-relaxed">
                De sterrenstand van jouw datum en coördinaten is met NASA JPL data omgezet naar een scherpe 300 DPI vector PDF.
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono font-bold text-[#A37055]">2. Productie & Inlijsting</span>
              <p className="text-[11px] font-light leading-relaxed">
                {isDigital
                  ? 'Jouw digitale vectorbestand staat direct klaar voor download en is ook naar jouw e-mail verzonden.'
                  : 'Onze inlijstpartner Gelato drukt de poster op 200 gsm fine-art papier en monteert deze zorgvuldig in de lijst.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono font-bold text-[#A37055]">3. Gratis Bezorging</span>
              <p className="text-[11px] font-light leading-relaxed">
                {isDigital
                  ? 'Geen fysieke verzending nodig; levenslang bewaard en direct printklaar op elk gewenst formaat.'
                  : 'Zodra het pakket verzonden is ontvang je direct een e-mail met PostNL / Bpost Track & Trace code.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE5DC] py-6 text-center text-xs text-[#78716C] bg-[#F5F2EB]/50">
        <p>© {new Date().getFullYear()} Stellaire Atelier • Ambachtelijke Gepersonaliseerde Sterrenposters</p>
      </footer>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#78716C]">
          <div className="w-6 h-6 border-2 border-[#1C1917]/20 border-t-[#1C1917] rounded-full animate-spin mr-2" />
          <span>Bestelling verifiëren...</span>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
