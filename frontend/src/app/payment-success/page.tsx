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
  Loader2,
  FileCheck,
} from 'lucide-react';
import { OrderRecord, MapConfig } from '@/types';
import { apiFetch } from '@/utils/api';
import { generateStarMapPdfBlob } from '@/utils/pdfGenerator';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId') || '';
  const sessionId = searchParams.get('session_id') || '';
  const amountParam = searchParams.get('amount') || '';

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [orderConfig, setOrderConfig] = useState<MapConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on page load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // 1. Immediately attempt to load order details from localStorage for 0-latency display
    let localSavedOrder: any = null;
    try {
      const stored =
        (orderId && localStorage.getItem(`stellaire_order_${orderId}`)) ||
        localStorage.getItem('stellaire_last_order');
      if (stored) {
        localSavedOrder = JSON.parse(stored);
        setOrder(localSavedOrder);
        if (localSavedOrder.map_config) {
          setOrderConfig(localSavedOrder.map_config);
        }
      }
    } catch (e) {
      console.warn('LocalStorage order read warning:', e);
    }

    // 2. Fetch official order from backend if available
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
        console.warn('Backend order sync note:', err);
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

  // Robust, 100% reliable 300 DPI PDF download handler
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      let pdfBlob: Blob | null = null;

      // 1. Try fetching from Next.js / backend order route
      try {
        const res = await fetch(`/api/orders/${displayOrderId}/pdf`);
        if (res.ok) {
          const candidate = await res.blob();
          if (
            candidate.size > 2000 &&
            (candidate.type.includes('pdf') || candidate.type.includes('octet-stream'))
          ) {
            pdfBlob = candidate;
          }
        }
      } catch (fetchErr) {
        console.warn('API PDF fetch attempt:', fetchErr);
      }

      // 2. If backend endpoint returned non-PDF or failed, generate high-res 300 DPI vector PDF directly!
      if (!pdfBlob) {
        const activeConfig: Partial<MapConfig> = orderConfig || {
          posterSize: (order?.poster_size as any) || '50x70',
          styleId: order?.style_id || 'midnight_classic',
          frameStyle: (order?.frame_style as any) || 'digital',
          titleBlock: {
            text: order?.title_text || 'The Night We Met',
            font: 'Playfair Display',
            size: 34,
            tracking: 3,
            uppercase: true,
            italic: false,
            enabled: true,
          },
          namesBlock: {
            text: order?.names_text || '',
            font: 'Great Vibes',
            size: 22,
            tracking: 1.5,
            uppercase: false,
            italic: true,
            enabled: !!order?.names_text,
          },
          dateBlock: {
            text: order?.date_text || '22 September 2026',
            font: 'Montserrat',
            size: 16,
            tracking: 2.2,
            uppercase: true,
            italic: false,
            enabled: true,
          },
          locationBlock: {
            text: order?.location_text || 'Amsterdam, Nederland',
            font: 'Montserrat',
            size: 14,
            tracking: 1.8,
            uppercase: true,
            italic: false,
            enabled: true,
          },
          showCelestialGrid: true,
          showConstellationLines: true,
          showMilkyWay: true,
          showMattedBorder: false,
          dividerStyle: 'diamond',
        };

        const pdfBytes = await generateStarMapPdfBlob(activeConfig, displayOrderId);
        pdfBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      }

      // 3. Trigger immediate browser download
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${displayOrderId}_print_ready_300dpi.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err: any) {
      console.error('Download PDF error:', err);
      // Fallback: direct window navigation to route
      window.open(`/api/orders/${displayOrderId}/pdf`, '_blank');
    } finally {
      setIsDownloading(false);
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
              {isDigital
                ? 'Jouw gepersonaliseerde sterrenkaart is met astronomische precisie berekend en jouw 300 DPI vector PDF staat direct klaar voor download.'
                : 'Jouw unieke sterrenhemel is met astronomische precisie berekend en doorgestuurd naar ons atelier voor productie.'}
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

        {/* Digital Edition Instant Download Callout Banner */}
        {isDigital && (
          <div className="p-6 bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Download className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-700">
                  Instant Digitale Levering
                </span>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  Jouw 300 DPI Drukklare Vector PDF Staat Klaar
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Geen wachttijd. Klik op de onderstaande knop om direct jouw officiële museum-kwaliteit printbestand (300 DPI vector) te downloaden naar jouw computer of telefoon.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-sky-300" />
                    <span>300 DPI PDF Genereren & Downloaden...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Download Succesvol Gestart!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>Download Print-Ready PDF (300 DPI Vector)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

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
                      ? `In Productie bij Inlijstpartner (#${order.gelato_order_id})`
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
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-white font-medium text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Voorbereiden...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Gestart!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Download Print-Ready PDF (300 DPI)</span>
                </>
              )}
            </button>

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
                  : 'Onze inlijstpartner drukt de poster op 200 gsm fine-art papier en monteert deze zorgvuldig in de lijst.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono font-bold text-[#A37055]">3. Gratis Bezorging</span>
              <p className="text-[11px] font-light leading-relaxed">
                {isDigital
                  ? 'Geen fysieke verzending nodig; levenslang bewaard en direct printklaar op elk gewenst formaat.'
                  : 'Zodra het pakket verzonden is ontvang je direct een e-mail met Track & Trace code van onze vertrouwde bezorgpartner.'}
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
