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
import { useLanguage } from '@/context/LanguageContext';

function PaymentSuccessContent() {
  const { locale, t } = useLanguage();
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

        const pdfBytes = await generateStarMapPdfBlob(activeConfig, displayOrderId, locale);
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
      window.open(`/api/orders/${displayOrderId}/pdf?locale=${locale}`, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE5DC] px-6 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href={locale === 'nl' ? '/' : `/${locale}`} className="flex items-center space-x-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#A37055] transition-colors">
              Stellaire
            </span>
            <span className="text-[10px] font-sans tracking-widest text-[#78716C] uppercase font-semibold">
              Atelier
            </span>
          </Link>

          <Link
            href={locale === 'nl' ? '/' : `/${locale}`}
            className="text-xs font-semibold text-[#57534E] hover:text-[#1C1917] flex items-center gap-1.5 transition"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>{t.paymentSuccess.continueExploringButton || (locale === 'de' ? 'Zurück zum Atelier' : locale === 'en' ? 'Back to Atelier' : 'Terug naar Winkel')}</span>
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
              <span>
                {locale === 'de'
                  ? 'Zahlung Erfolgreich • Bestellung Bestätigt'
                  : locale === 'en'
                  ? 'Payment Succeeded • Order Confirmed'
                  : 'Betaling Geslaagd • Bestelling Bevestigd'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
              {t.paymentSuccess.orderConfirmedTitle}
            </h1>

            <p className="text-[#57534E] text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
              {isDigital ? t.paymentSuccess.digitalSubtitle : t.paymentSuccess.thankYouMessage}
            </p>
          </div>

          {/* Luxury Order ID Badge */}
          <div className="pt-2 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#E2DDD5] shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-mono font-medium">
              {t.paymentSuccess.orderNumberPrefix}:
            </span>
            <span className="font-mono font-bold text-sm text-[#1C1917]">
              {displayOrderId}
            </span>
            <button
              onClick={copyOrderRef}
              className="text-[11px] text-[#A37055] hover:underline font-medium ml-1"
            >
              {copied
                ? locale === 'de'
                  ? 'Kopiert!'
                  : locale === 'en'
                  ? 'Copied!'
                  : 'Gekopieerd!'
                : locale === 'de'
                ? 'Kopieren'
                : locale === 'en'
                ? 'Copy'
                : 'Kopiëren'}
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
                  {locale === 'de'
                    ? 'Sofortige Digitale Lieferung'
                    : locale === 'en'
                    ? 'Instant Digital Delivery'
                    : 'Instant Digitale Levering'}
                </span>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  {t.paymentSuccess.digitalTitle}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {t.paymentSuccess.digitalSubtitle}
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
                    <span>{t.paymentSuccess.generatingPdf}</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>
                      {locale === 'de'
                        ? 'Download erfolgreich gestartet!'
                        : locale === 'en'
                        ? 'Download started successfully!'
                        : 'Download Succesvol Gestart!'}
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>{t.paymentSuccess.downloadPdfButton}</span>
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
                  {locale === 'de' ? 'Produktionsstatus' : locale === 'en' ? 'Production Status' : 'Productiestatus'}
                </span>
                <p className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {isDigital
                      ? locale === 'de'
                        ? 'Bereit zum Download'
                        : locale === 'en'
                        ? 'Ready for Download'
                        : 'Gereed voor Download'
                      : order?.gelato_order_id
                      ? locale === 'de'
                        ? `In Produktion beim Druckpartner (#${order.gelato_order_id})`
                        : locale === 'en'
                        ? `In Production with Atelier Partner (#${order.gelato_order_id})`
                        : `In Productie bij Inlijstpartner (#${order.gelato_order_id})`
                      : locale === 'de'
                      ? 'In Atelier-Produktion'
                      : locale === 'en'
                      ? 'In Atelier Production'
                      : 'In Atelier Productie'}
                  </span>
                </p>
              </div>
            </div>

            {order?.customer?.email && (
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                  {locale === 'de' ? 'Bestätigung gesendet an' : locale === 'en' ? 'Confirmation sent to' : 'Bevestiging Verzonden Naar'}
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
                {locale === 'de' ? 'Gewidmet für: ' : locale === 'en' ? 'Dedicated to: ' : 'Opgedragen aan: '}
                <strong className="text-[#1C1917] not-italic">{order.names_text}</strong>
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#57534E]">
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-0.5">
                <span className="text-[10px] text-[#78716C] uppercase font-semibold">
                  {locale === 'de' ? 'Format' : locale === 'en' ? 'Size' : 'Formaat'}
                </span>
                <p className="font-bold text-[#1C1917]">{order?.poster_size || '50x70'} cm</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-0.5">
                <span className="text-[10px] text-[#78716C] uppercase font-semibold">
                  {locale === 'de' ? 'Ausführung' : locale === 'en' ? 'Edition' : 'Uitvoering'}
                </span>
                <p className="font-bold text-[#1C1917] capitalize">
                  {isDigital
                    ? locale === 'de'
                      ? 'Digitale Datei (300 DPI)'
                      : locale === 'en'
                      ? 'Digital File (300 DPI)'
                      : 'Digitaal Bestand (300 DPI)'
                    : order?.frame_style === 'oak'
                    ? t.studio.frameColorOak
                    : order?.frame_style === 'black'
                    ? t.studio.frameColorBlack
                    : order?.frame_style === 'white'
                    ? t.studio.frameColorWhite
                    : locale === 'de'
                    ? 'Klassisches Kunstdruck-Poster'
                    : locale === 'en'
                    ? 'Classic Fine-Art Poster'
                    : 'Classic Matte Poster'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-0.5">
                <span className="text-[10px] text-[#78716C] uppercase font-semibold">
                  {locale === 'de' ? 'Dateiqualität' : locale === 'en' ? 'File Quality' : 'Bestandskwaliteit'}
                </span>
                <p className="font-bold text-[#1C1917]">300 DPI Archival Vector</p>
              </div>
            </div>

            {/* Delivery Address if physical */}
            {order?.customer && !isDigital && (
              <div className="pt-2 text-xs text-[#57534E] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A37055] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#1C1917]">
                    {locale === 'de' ? 'Lieferadresse: ' : locale === 'en' ? 'Delivery Address: ' : 'Bezorgadres: '}
                  </span>
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
                  <span>{t.paymentSuccess.generatingPdf}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {locale === 'de'
                      ? 'Download gestartet!'
                      : locale === 'en'
                      ? 'Download started!'
                      : 'Download Gestart!'}
                  </span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>{t.paymentSuccess.downloadPdfButton}</span>
                </>
              )}
            </button>

            <Link
              href={locale === 'nl' ? '/' : `/${locale}`}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] font-medium text-xs border border-[#E2DDD5] flex items-center justify-center gap-1.5 transition shadow-xs text-center"
            >
              <span>{t.paymentSuccess.continueExploringButton}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#78716C]" />
            </Link>
          </div>
        </div>

        {/* 3 Step Roadmap of What Happens Next */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2DDD5] shadow-xs space-y-4">
          <h4 className="font-serif text-sm font-bold text-[#1C1917] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A37055]" />
            <span>
              {locale === 'de'
                ? 'Was geschieht als Nächstes?'
                : locale === 'en'
                ? 'What Happens Next?'
                : 'Wat Gebeurt Er Nu?'}
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#57534E]">
            <div className="space-y-1">
              <span className="font-mono font-bold text-[#A37055]">
                {`1. ${
                  locale === 'de'
                    ? 'Astronomische Berechnung'
                    : locale === 'en'
                    ? 'Astronomical Calculation'
                    : 'Astronomische Berekening'
                }`}
              </span>
              <p className="text-[11px] font-light leading-relaxed">
                {locale === 'de'
                  ? 'Die Sternenkonstellation zu Ihrem Datum und Koordinaten wurde mit NASA JPL Daten in ein gestochen scharfes 300 DPI Vektor-PDF umgewandelt.'
                  : locale === 'en'
                  ? 'The exact celestial alignment for your date and coordinates was rendered with NASA JPL precision into a crisp 300 DPI vector PDF.'
                  : 'De sterrenstand van jouw datum en coördinaten is met NASA JPL data omgezet naar een scherpe 300 DPI vector PDF.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono font-bold text-[#A37055]">
                {`2. ${
                  locale === 'de'
                    ? 'Produktion & Einrahmung'
                    : locale === 'en'
                    ? 'Production & Framing'
                    : 'Productie & Inlijsting'
                }`}
              </span>
              <p className="text-[11px] font-light leading-relaxed">
                {isDigital
                  ? locale === 'de'
                    ? 'Ihre digitale Vektordatei steht sofort zum Download bereit und wurde auch an Ihre E-Mail gesendet.'
                    : locale === 'en'
                    ? 'Your digital vector file is immediately available for download and was sent to your email.'
                    : 'Jouw digitale vectorbestand staat direct klaar voor download en is ook naar jouw e-mail verzonden.'
                  : locale === 'de'
                  ? 'Unser Druckpartner druckt das Poster auf 200 g/m² Kunstdruckpapier und rahmt es sorgfältig ein.'
                  : locale === 'en'
                  ? 'Our artisan partner crafts the print on 200 gsm fine-art paper and custom frames it with care.'
                  : 'Onze inlijstpartner drukt de poster op 200 gsm fine-art papier en monteert deze zorgvuldig in de lijst.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono font-bold text-[#A37055]">
                {`3. ${
                  locale === 'de'
                    ? 'Kostenlose Lieferung'
                    : locale === 'en'
                    ? 'Free Tracked Delivery'
                    : 'Gratis Bezorging'
                }`}
              </span>
              <p className="text-[11px] font-light leading-relaxed">
                {isDigital
                  ? locale === 'de'
                    ? 'Kein physischer Versand erforderlich; lebenslang gesichert und sofort druckbereit.'
                    : locale === 'en'
                    ? 'No physical shipping needed; yours for a lifetime and ready to print at any size.'
                    : 'Geen fysieke verzending nodig; levenslang bewaard en direct printklaar op elk gewenst formaat.'
                  : locale === 'de'
                  ? 'Sobald das Paket versendet wurde, erhalten Sie eine E-Mail mit Tracking-Code unseres vertrauenswürdigen Zustellpartners.'
                  : locale === 'en'
                  ? 'Once dispatched, you will receive an email with live Track & Trace from our trusted courier partner.'
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
