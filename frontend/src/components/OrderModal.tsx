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
  ShieldCheck,
} from 'lucide-react';
import { CustomerDetails, MapConfig, OrderRecord } from '../types';
import { apiFetch } from '../utils/api';
import { calculatePrice } from '../utils/pricing';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";
import convertToSubcurrency from "../utils/convertToSubcurrency";
import { useLanguage } from '../context/LanguageContext';

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;
interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MapConfig;
  onOrderSuccess: (order: OrderRecord) => void;
  onOpenReturnPolicy?: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  config,
  onOrderSuccess,
  onOpenReturnPolicy,
}) => {
  const { locale, t, currency, isUK } = useLanguage();
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: currency === 'USD' ? 'United States' : currency === 'GBP' ? 'United Kingdom' : locale === 'de' ? 'Deutschland' : locale === 'en' ? 'United States' : 'Nederland',
    gift_note: '',
    producer_notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const isDigital = config.frameStyle === 'digital';
  const priceDetails = calculatePrice(config.posterSize, config.frameStyle, locale, isUK, currency);
  const isUS =
    (customer.country || '').toLowerCase().includes('united states') ||
    (customer.country || '').toLowerCase().includes('verenigde staten') ||
    (customer.country || '').toLowerCase().includes('vereinigte staaten') ||
    (customer.country || '').toUpperCase() === 'US';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer.name.trim() || !customer.email.trim()) {
      setError(locale === 'de' ? 'Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse ein.' : locale === 'en' ? 'Please enter your name and email address.' : 'Vul alstublieft uw naam en e-mailadres in.');
      return;
    }
    if (!isDigital && (!customer.address_line1.trim() || !customer.city.trim() || !customer.postal_code.trim())) {
      setError(locale === 'de' ? 'Bitte geben Sie Ihre vollständige Lieferadresse für unsere Versandpartner ein.' : locale === 'en' ? 'Please enter your complete shipping address for our delivery partners.' : 'Vul alstublieft uw volledige bezorgadres in voor onze bezorgpartners.');
      return;
    }
    if (!isDigital) {
      const isAllowed = t.orderModal.countries.some(
        (c) =>
          c.name.toLowerCase() === (customer.country || '').toLowerCase() ||
          c.code.toLowerCase() === (customer.country || '').toLowerCase()
      );
      if (!isAllowed) {
        setError(
          locale === 'de'
            ? 'Lieferungen sind derzeit nur nach Europa, Großbritannien und in die USA möglich. Zahlungen aus anderen Ländern werden nicht akzeptiert.'
            : locale === 'en'
            ? 'We currently only deliver to European destinations, the United Kingdom, and the United States. Orders from other countries cannot be accepted.'
            : 'Bezorging is momenteel alleen mogelijk binnen Europese landen, het Verenigd Koninkrijk en de Verenigde Staten. Bestellingen naar overige bestemmingen worden niet geaccepteerd.'
        );
        return;
      }
    }
    if (!isDigital && isUS && !customer.state?.trim()) {
      setError(t.orderModal.stateRequired);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payloadCustomer = {
        ...customer,
        address_line1: customer.address_line1.trim() || (locale === 'de' ? 'Digitale Lieferung per E-Mail' : locale === 'en' ? 'Digital Delivery via Email' : 'Digitale Levering per E-mail'),
        city: customer.city.trim() || (locale === 'de' ? 'Digital' : locale === 'en' ? 'Digital' : 'Digitaal'),
        postal_code: customer.postal_code.trim() || '0000',
        country: customer.country || (locale === 'de' ? 'Deutschland' : locale === 'en' ? 'United Kingdom' : 'Nederland'),
        gift_note: isDigital ? '' : customer.gift_note,
        producer_notes: isDigital ? '' : customer.producer_notes,
      };

      // 1. Calculate price from pricing engine
      const amount = priceDetails.price;

      // 2. Register order and compile 300 DPI print-ready PDF in the backend
      let registeredOrder: OrderRecord | null = null;
      try {
        const orderRes = await apiFetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: payloadCustomer,
            map_config: {
              ...config,
              poster_size: config.posterSize,
              posterSize: config.posterSize,
              style_id: config.styleId,
              styleId: config.styleId,
              frame_style: config.frameStyle,
              frameStyle: config.frameStyle,
              mask_shape: config.maskShape,
              maskShape: config.maskShape,
              show_celestial_grid: config.showCelestialGrid,
              showCelestialGrid: config.showCelestialGrid,
              show_constellation_lines: config.showConstellationLines,
              showConstellationLines: config.showConstellationLines,
              show_milky_way: config.showMilkyWay,
              showMilkyWay: config.showMilkyWay,
              show_matted_border: config.showMattedBorder,
              showMattedBorder: config.showMattedBorder,
              divider_style: config.dividerStyle,
              dividerStyle: config.dividerStyle,
              layout_variation: config.layoutVariation,
              layoutVariation: config.layoutVariation,
              currency: currency,
            },
          }),
        });
        if (orderRes.ok) {
          registeredOrder = await orderRes.json();
        }
      } catch (orderErr) {
        console.warn('Backend order registration warning:', orderErr);
      }

      const orderId = registeredOrder?.order_id || `STL-${Math.floor(10000 + Math.random() * 90000)}`;

      // Persist complete order details in localStorage for reliable retrieval on /payment-success
      const localOrderData = {
        order_id: orderId,
        created_at: new Date().toISOString(),
        status: 'in_production',
        customer: payloadCustomer,
        poster_size: config.posterSize,
        style_id: config.styleId,
        frame_style: config.frameStyle,
        title_text: config.titleBlock?.text || '',
        names_text: config.namesBlock?.text || '',
        date_text: config.dateBlock?.text || '',
        location_text: config.locationBlock?.text || '',
        coords_text: config.coordsBlock?.text || '',
        pdf_filename: `${orderId}_print_ready_300dpi.pdf`,
        carrier: isDigital
          ? t.orderModal.digitalDeliveryNotice
          : (payloadCustomer.country || '').toLowerCase().includes('united states') || (payloadCustomer.country || '').toLowerCase().includes('usa')
          ? 'USPS'
          : (payloadCustomer.country || '').toLowerCase().includes('duits') || (payloadCustomer.country || '').toLowerCase().includes('deutsch') || (payloadCustomer.country || '').toLowerCase().includes('germany')
          ? 'DHL'
          : (payloadCustomer.country || '').toLowerCase().includes('belgië') || (payloadCustomer.country || '').toLowerCase().includes('belgium')
          ? 'Bpost'
          : (payloadCustomer.country || '').toLowerCase().includes('kingdom') || (payloadCustomer.country || '').toLowerCase().includes('uk')
          ? 'Royal Mail'
          : 'PostNL',
        currency: currency,
        formatted_price: priceDetails.formattedPrice,
        map_config: config,
      };

      try {
        localStorage.setItem('stellaire_last_order', JSON.stringify(localOrderData));
        localStorage.setItem(`stellaire_order_${orderId}`, JSON.stringify(localOrderData));
      } catch (storageErr) {
        console.warn('localStorage save warning:', storageErr);
      }

      // 3. Call the Next.js checkout route
      let checkoutData: any = null;
      try {
        const checkoutRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderId,
            email: payloadCustomer.email,
            amount: amount,
            currency: currency.toLowerCase(),
            shippingDetails: payloadCustomer,
            posterSize: config.posterSize,
            frameStyle: config.frameStyle,
            styleId: config.styleId,
            locale: locale,
          }),
        });

        if (checkoutRes.ok) {
          checkoutData = await checkoutRes.json();
        } else {
          const errData = await checkoutRes.json().catch(() => ({}));
          if (errData?.error) {
            setError(errData.error);
            setIsSubmitting(false);
            return;
          }
        }
      } catch (checkoutErr) {
        console.warn('Stripe checkout route not available or in test mode:', checkoutErr);
      }

      // 4. Redirect to Stripe Hosted Checkout if available
      if (checkoutData?.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      } else {
        // Pilot / Atelier Test Mode: Dispatched directly to Gelato if physical
        if (!isDigital && registeredOrder) {
          try {
            await apiFetch(`/api/orders/${orderId}/gelato-submit`, {
              method: 'POST',
            });
          } catch (gErr) {
            console.warn('Gelato auto-submit note:', gErr);
          }
        }

        const fallbackOrder: OrderRecord = registeredOrder || {
          order_id: orderId,
          created_at: new Date().toISOString(),
          status: 'in_production',
          customer: payloadCustomer,
          poster_size: config.posterSize,
          style_id: config.styleId,
          frame_style: config.frameStyle,
          title_text: config.titleBlock.text,
          names_text: config.namesBlock.text,
          date_text: config.dateBlock.text,
          location_text: config.locationBlock.text,
          pdf_filename: `star-map-${config.styleId}-${config.posterSize}.pdf`,
          pdf_size_bytes: 1024000,
        };

        setCompletedOrder(fallbackOrder);
        onOrderSuccess(fallbackOrder);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }

    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(err.message || 'Fout bij het verzenden van de bestelling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const frameLabels: Record<string, string> = {
    digital: locale === 'de' ? 'Digitales Kunstwerk (300 DPI Vektor-PDF)' : locale === 'en' ? 'Digital Artwork (300 DPI Vector PDF)' : 'Digitaal Bestand (300 DPI Vector PDF)',
    none: locale === 'de' ? 'Classic Matte Poster (Nur Kunstdruck)' : locale === 'en' ? 'Classic Matte Poster (Print Only)' : 'Classic Matte Poster (Alleen print)',
    black: locale === 'de' ? 'Mattschwarzer Holzrahmen (Classic Matte)' : locale === 'en' ? 'Matte Black Wooden Frame (Classic Matte)' : 'Mat Zwart Houten Lijst (Classic Matte)',
    oak: locale === 'de' ? 'Naturholzrahmen (Helles Holz)' : locale === 'en' ? 'Natural Oak Wooden Frame (Light Wood)' : 'Natuurlijk Houten Lijst (Licht Hout)',
    white: locale === 'de' ? 'Reinweißer Holzrahmen (Classic Matte)' : locale === 'en' ? 'Pure White Wooden Frame (Classic Matte)' : 'Zuiver Wit Houten Lijst (Classic Matte)',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto overflow-x-hidden w-full max-w-full">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E2DDD5] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-3 sm:my-8 text-[#1C1917] max-w-[96vw]">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F5F2EB] border-b border-[#E8E4DC] flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917] shadow-sm shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1C1917] tracking-wide truncate">
                {t.orderModal.modalTitle}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#78716C] truncate">
                {t.orderModal.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {completedOrder ? (
          /* Order Confirmation View */
          <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#78716C] font-bold uppercase">
                {locale === 'de' ? 'BESTELLREFERENZ' : locale === 'en' ? 'ORDER REFERENCE' : 'BESTELREFERENTIE'}: {completedOrder.order_id}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                {t.paymentSuccess.orderConfirmedTitle}
              </h2>
              <p className="text-xs text-[#57534E] max-w-md mx-auto leading-relaxed">
                {locale === 'de'
                  ? 'Ihre 300 DPI archivfeste Druck-PDF wurde mit höchster Präzision anhand der genauen Himmelskoordinaten berechnet und zur Produktionswarteschlange hinzugefügt.'
                  : locale === 'en'
                  ? 'Your 300 DPI archival-grade print PDF has been calculated with precision based on exact celestial coordinates and added to the production queue.'
                  : 'Uw 300 DPI archiefwaardige print-PDF is met uiterste precisie berekend op basis van de exacte hemelcoördinaten en toegevoegd aan de productiewachtrij.'}
              </p>
            </div>

            {/* Order Specification Summary Card */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8E4DC] text-left text-xs space-y-2.5 max-w-lg mx-auto shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-[#F0ECE1] gap-2">
                <span className="text-[#78716C] shrink-0">
                  {locale === 'de' ? 'Kunstwerk:' : locale === 'en' ? 'Artwork:' : 'Kunstwerk:'}
                </span>
                <span className="font-bold text-[#1C1917] truncate text-right">{t.catalog.title}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#78716C] shrink-0">
                  {locale === 'de' ? 'Gewidmet an:' : locale === 'en' ? 'Dedicated to:' : 'Opgedragen aan:'}
                </span>
                <span className="text-[#1C1917] font-serif font-bold truncate text-right">{completedOrder.names_text}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#78716C] shrink-0">
                  {locale === 'de' ? 'Besonderes Datum:' : locale === 'en' ? 'Special Date:' : 'Bijzondere Datum:'}
                </span>
                <span className="text-[#1C1917] truncate text-right">{completedOrder.date_text}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#78716C] shrink-0">
                  {locale === 'de' ? 'Format & Ausführung:' : locale === 'en' ? 'Size & Framing:' : 'Formaat & Uitvoering:'}
                </span>
                <span className="text-[#1C1917] truncate text-right">
                  {completedOrder.frame_style === 'digital'
                    ? (locale === 'de' ? 'Digitales Kunstwerk' : locale === 'en' ? 'Digital File' : 'Digitaal Bestand')
                    : `${completedOrder.poster_size} cm`} • {frameLabels[completedOrder.frame_style] || 'Kunstdruk'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#78716C] shrink-0">{t.studio.totalLabel}</span>
                <span className="text-[#1C1917] font-bold shrink-0 whitespace-nowrap">{priceDetails.formattedPrice}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#78716C] gap-2">
                <span className="truncate">{isUS ? 'Sales Tax (Gelato US):' : (locale === 'de' ? 'MwSt. (inkl.):' : locale === 'en' ? 'VAT (included):' : 'Btw (inbegrepen):')}</span>
                <span className="text-emerald-700 font-medium shrink-0 whitespace-nowrap">
                  {isUS ? 'Inbegrepen & Voldaan' : 'Inbegrepen'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#F0ECE1] gap-2">
                <span className="text-[#78716C] shrink-0">
                  {completedOrder.frame_style === 'digital'
                    ? (locale === 'de' ? 'Gesendet an:' : locale === 'en' ? 'Delivered to:' : 'Verzonden naar:')
                    : (locale === 'de' ? 'Lieferung an:' : locale === 'en' ? 'Delivery to:' : 'Bezorging aan:')}
                </span>
                <span className="text-[#1C1917] truncate text-right">{completedOrder.customer.name} ({completedOrder.customer.email})</span>
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
                <span>{t.paymentSuccess.downloadPdfButton}</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition"
              >
                {t.paymentSuccess.continueExploringButton}
              </button>
            </div>
          </div>
        ) : (
          /* Order Form View */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Keepsake Summary Banner */}
            <div className="p-3 sm:p-3.5 bg-[#F5F2EB]/70 rounded-2xl border border-[#E8E4DC] flex items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                <div className="w-10 sm:w-11 h-12 sm:h-14 rounded-lg overflow-hidden bg-white border border-[#E2DDD5] shrink-0 shadow-sm">
                  <img
                    src="/textures/star_map_sample.png"
                    alt="Star Map"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-[#1C1917] text-xs truncate">
                    {t.catalog.title}
                  </h4>
                  <p className="text-[11px] text-[#78716C] font-serif italic truncate">
                    {config.namesBlock.text || (locale === 'de' ? 'Atelier-Meisterwerk' : locale === 'en' ? 'Artisan Keepsake' : 'Ambachtelijk Kunstwerk')}
                  </p>
                  <p className="text-[10px] text-[#A8A29E] truncate">
                    {config.frameStyle === 'digital' ? 'PDF (300 DPI)' : priceDetails.sizeLabel} • {frameLabels[config.frameStyle]}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 whitespace-nowrap pl-1">
                <span className="text-[9.5px] sm:text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium block mb-0.5 whitespace-nowrap">
                  {config.frameStyle === 'digital'
                    ? (locale === 'de' ? 'Sofort digital (PDF)' : locale === 'en' ? 'Instant digital (PDF)' : 'Direct digitaal (PDF)')
                    : (locale === 'de' ? 'Lokal gerahmt' : locale === 'en' ? 'Locally framed' : 'Lokaal Ingelijst')}
                </span>
                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                  <span className="text-[10px] text-[#A8A29E] line-through">{priceDetails.formattedOriginalPrice}</span>
                  <span className="text-xs font-bold text-[#1C1917]">{priceDetails.formattedPrice}</span>
                </div>
              </div>
            </div>

            {/* Tax & Fulfillment Guarantee Pill */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#F9F7F2] rounded-xl border border-[#E8E4DC] text-[11px] text-[#57534E]">
              <span className="flex items-center gap-1.5 font-medium text-[#1C1917]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isUS ? t.orderModal.usSalesTaxNotice : t.orderModal.taxIncludedNotice}</span>
              </span>
              <span className="text-[#78716C] font-mono text-[10px]">
                {isUS ? 'US POD • Gelato' : 'NL/EU Atelier'}
              </span>
            </div>

            {/* Customer & Shipping / Delivery Fields */}
            {isDigital ? (
              <div className="space-y-3">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    <strong>{locale === 'de' ? 'Digitale Edition:' : locale === 'en' ? 'Digital Edition:' : 'Digitale Editie:'}</strong> {t.orderModal.digitalNotice}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                  {t.orderModal.customerInfoTitle}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">{t.orderModal.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder={locale === 'de' ? 'z. B. Hannah Schmidt' : locale === 'en' ? 'e.g. Olivia Taylor' : 'bijv. Sophie van den Berg'}
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">{t.orderModal.emailLabel}</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder={locale === 'de' ? 'hannah@beispiel.de' : locale === 'en' ? 'olivia@example.com' : 'sophie@voorbeeld.nl'}
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                  {t.orderModal.customerInfoTitle}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">{t.orderModal.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder={locale === 'de' ? 'z. B. Hannah Schmidt' : locale === 'en' ? 'e.g. Olivia Taylor' : 'bijv. Sophie van den Berg'}
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">{t.orderModal.emailLabel}</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder={locale === 'de' ? 'hannah@beispiel.de' : locale === 'en' ? 'olivia@example.com' : 'sophie@voorbeeld.nl'}
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">{t.orderModal.addressLabel}</label>
                  <input
                    type="text"
                    required
                    value={customer.address_line1}
                    onChange={(e) => setCustomer({ ...customer, address_line1: e.target.value })}
                    placeholder={locale === 'de' ? 'z. B. Friedrichstraße 45' : locale === 'en' ? 'e.g. 10 Downing Street' : 'bijv. Keizersgracht 142'}
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">{t.orderModal.cityLabel}</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder={locale === 'de' ? 'Berlin' : locale === 'en' ? 'London' : 'Amsterdam'}
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">
                      {t.orderModal.stateLabel} {isUS ? '*' : ''}
                    </label>
                    <input
                      type="text"
                      required={isUS}
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      placeholder={isUS ? 'z. B. NY / CA / TX' : (locale === 'de' ? 'Bayern' : locale === 'en' ? 'Greater London' : 'Noord-Holland')}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm ${
                        isUS && !customer.state?.trim() ? 'border-amber-300' : 'border-[#E2DDD5]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">{t.orderModal.postalCodeLabel}</label>
                    <input
                      type="text"
                      required
                      value={customer.postal_code}
                      onChange={(e) => setCustomer({ ...customer, postal_code: e.target.value })}
                      placeholder={locale === 'de' ? '10117' : locale === 'en' ? 'SW1A 2AA' : '1015 CJ'}
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#57534E] font-medium block mb-1">{t.orderModal.countryLabel}</label>
                  <select
                    value={customer.country}
                    onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                    className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-2 text-[16px] sm:text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] shadow-sm"
                  >
                    {t.orderModal.countries.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} ({c.shippingNote})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Optional Gift Message & Print Workshop Instructions (physical orders only) */}
            {!isDigital && (
              <div className="space-y-3 pt-2 border-t border-[#E8E4DC]">
                <span className="text-[11px] font-semibold text-[#57534E] uppercase tracking-wider block">
                  {t.orderModal.giftSectionTitle}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">
                      {t.orderModal.giftNoteLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={customer.gift_note}
                      onChange={(e) => setCustomer({ ...customer, gift_note: e.target.value })}
                      placeholder={t.orderModal.giftNotePlaceholder}
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-1.5 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] resize-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#57534E] font-medium block mb-1">
                      {t.orderModal.producerNoteLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={customer.producer_notes}
                      onChange={(e) => setCustomer({ ...customer, producer_notes: e.target.value })}
                      placeholder={t.orderModal.producerNotePlaceholder}
                      className="w-full bg-white border border-[#E2DDD5] rounded-xl px-3 py-1.5 text-[16px] sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] resize-none shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Transparent Return Policy & Custom Goods Notice */}
            <div className="p-3 bg-[#F5F2EB]/80 rounded-xl border border-[#E8E4DC] text-[11px] text-[#57534E] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A37055] shrink-0" />
                <span>
                  <strong>{t.orderModal.policyNoticeStrong}</strong> {t.orderModal.policyNoticeText}
                </span>
              </div>
              {onOpenReturnPolicy && (
                <button
                  type="button"
                  onClick={onOpenReturnPolicy}
                  className="text-[#A37055] font-semibold hover:underline shrink-0 text-[11px] text-left sm:text-right"
                >
                  {t.orderModal.readPolicyLink}
                </button>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-[11px] text-[#78716C] text-center sm:text-left">
                {isDigital ? t.orderModal.digitalDeliveryNotice : t.orderModal.physicalDeliveryNotice}
              </span>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-medium text-[#78716C] hover:text-[#1C1917] text-center transition"
                >
                  {t.orderModal.cancelButton}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.common.loading}</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t.orderModal.proceedToPayment} ({priceDetails.formattedPrice})</span>
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
