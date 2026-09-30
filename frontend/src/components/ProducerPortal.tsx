'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  Package,
  Calendar,
  MapPin,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowLeft,
  FileText,
  Truck,
  Check,
  Send,
  Lock,
} from 'lucide-react';
import { OrderRecord } from '../types';
import { apiFetch } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { generateStarMapPdfBlob } from '../utils/pdfGenerator';

const ADMIN_PIN = '1991';

interface ProducerPortalProps {
  onBackToStudio: () => void;
}

export const ProducerPortal: React.FC<ProducerPortalProps> = ({ onBackToStudio }) => {
  const { locale } = useLanguage();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication state (persisted in sessionStorage for the browser session)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('lock') === '1' || p.get('logout') === '1') {
        sessionStorage.removeItem('stellaire_admin_auth');
        return false;
      }
      return sessionStorage.getItem('stellaire_admin_auth') === 'true';
    }
    return false;
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        throw new Error('Could not fetch orders queue');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('stellaire_admin_auth', 'true');
      }
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('stellaire_admin_auth');
    }
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string,
    carrier?: string,
    trackingNumber?: string
  ) => {
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          carrier: carrier || 'PostNL',
          tracking_number: trackingNumber || '',
        }),
      });
      if (res.ok) {
        const updated: OrderRecord = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.order_id === orderId ? { ...o, ...updated } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '1.1 MB';
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const lockTexts = {
    nl: {
      badge: 'Beveiligd Atelier Portaal',
      title: 'Atelier Beheer',
      desc: 'Dit beheerdersportaal is strikt beveiligd voor het atelier en de drukkerij. Voer het beheerderswachtwoord / pincode in om toegang te krijgen tot de productiewachtrij.',
      label: 'Atelier Wachtwoord / Pincode',
      placeholder: '••••',
      pinHint: 'Standaard pincode: 1991',
      button: 'Ontgrendel Wachtrij →',
      error: 'Onjuiste pincode. Probeer het opnieuw.',
      back: 'Terug naar Atelier & Winkel',
      authBadge: 'Beheerderssessie Actief',
      lockButton: 'Vergrendelen',
    },
    en: {
      badge: 'Secure Workshop Portal',
      title: 'Atelier & Workshop Admin',
      desc: 'This admin portal is restricted to atelier staff and the master print workshop. Please enter the administrator password / PIN code to access the production queue.',
      label: 'Admin Password / PIN Code',
      placeholder: '••••',
      pinHint: 'Default PIN: 1991',
      button: 'Unlock Production Queue →',
      error: 'Incorrect PIN code. Please try again.',
      back: 'Back to Atelier & Store',
      authBadge: 'Admin Session Active',
      lockButton: 'Lock Portal',
    },
    de: {
      badge: 'Geschütztes Atelier-Portal',
      title: 'Atelier-Verwaltung',
      desc: 'Dieses Verwaltungsportal ist ausschließlich für das Atelier und die Druckerei geschützt. Bitte geben Sie das Passwort / die PIN ein, um auf die Produktionswarteschlange zuzugreifen.',
      label: 'Atelier-Passwort / PIN',
      placeholder: '••••',
      pinHint: 'Standard-PIN: 1991',
      button: 'Warteschlange entsperren →',
      error: 'Falsche PIN. Bitte versuchen Sie es erneut.',
      back: 'Zurück zum Atelier & Shop',
      authBadge: 'Admin-Sitzung Aktiv',
      lockButton: 'Sperren',
    },
  };
  const tLock = lockTexts[locale] || lockTexts.en;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#EBE7DF] p-8 sm:p-10 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F2EB] border border-[#E2DDD5] mx-auto flex items-center justify-center text-[#A37055] shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#E2DDD5] text-[10px] font-bold tracking-widest uppercase text-[#A37055]">
              {tLock.badge}
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1C1917] tracking-wide">
              {tLock.title}
            </h1>
            <p className="text-xs text-[#78716C] leading-relaxed">
              {tLock.desc}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#57534E] mb-1.5 text-center">
                {tLock.label}
              </label>
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder={tLock.placeholder}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full text-center tracking-[0.6em] font-mono text-2xl py-3 px-4 rounded-2xl bg-[#FAF8F5] border focus:outline-none transition ${
                  pinError
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:border-red-500'
                    : 'border-[#E2DDD5] text-[#1C1917] focus:border-[#1C1917]'
                }`}
              />
              <p className="text-[11px] text-[#A8A29E] text-center mt-1.5 font-mono">
                {tLock.pinHint}
              </p>
              {pinError && (
                <p className="text-xs text-red-600 mt-2 font-medium text-center">
                  {tLock.error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-semibold text-xs shadow-md transition"
            >
              {tLock.button}
            </button>
          </form>

          <div className="pt-2 border-t border-[#F0ECE1]">
            <button
              onClick={onBackToStudio}
              className="text-xs text-[#78716C] hover:text-[#1C1917] flex items-center justify-center gap-1.5 font-medium mx-auto transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{tLock.back}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
          <div className="space-y-1">
            <button
              onClick={onBackToStudio}
              className="text-xs text-[#78716C] hover:text-[#1C1917] flex items-center gap-1.5 font-medium mb-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Terug naar Atelier & Winkel</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917] shadow-sm">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#1C1917] tracking-wide">
                  Drukkerij Productiewachtrij
                </h1>
                <p className="text-xs text-[#78716C] font-light">
                  Archiefwaardige 300 DPI drukklare PDF&apos;s gereed voor overdracht aan de meester-drukker
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#F5F2EB] border border-[#E2DDD5] text-xs font-medium text-[#1C1917] flex items-center gap-2 shadow-sm transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1C1917]' : ''}`} />
              <span>Vernieuwen</span>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium font-mono">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{tLock.authBadge}</span>
            </span>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-rose-50 hover:border-rose-200 border border-[#E2DDD5] text-xs font-medium text-[#78716C] hover:text-rose-700 flex items-center gap-1.5 shadow-sm transition"
              title="Lock portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{tLock.lockButton}</span>
            </button>

            <button
              onClick={onBackToStudio}
              className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition"
            >
              + Nieuwe Sterrenkaart Ontwerpen
            </button>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-white border border-[#EBE7DF] p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#78716C] font-medium uppercase tracking-wider">
              Totaal Aantal Bestellingen
            </span>
            <div className="font-serif text-3xl font-bold text-[#1C1917]">
              {orders.length}
            </div>
            <p className="text-[11px] text-emerald-800 flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" />
              <span>300 DPI PDF&apos;s Gegenereerd & Beheerd</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#EBE7DF] p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#78716C] font-medium uppercase tracking-wider">
              Drukwerk Kwaliteitsnorm
            </span>
            <div className="font-serif text-2xl font-bold text-[#1C1917]">
              300 DPI Archiefkwaliteit
            </div>
            <p className="text-[11px] text-[#78716C] mt-1">
              Exacte astronomische hemelprojectie + 285 gsm katoenpapier
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#EBE7DF] p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#78716C] font-medium uppercase tracking-wider">
              Status Drukkerij & Bezorging
            </span>
            <div className="font-serif text-2xl font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Wachtrij & Track & Trace Actief</span>
            </div>
            <p className="text-[11px] text-[#78716C] mt-1">
              Koppeling voor PostNL & Bpost gereed
            </p>
          </div>
        </div>

        {/* Orders Queue List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#57534E]">
              Actieve Bestellingen voor Productie & Verzending ({orders.length})
            </h2>
            <span className="text-xs text-[#78716C]">
              Klik op &ldquo;Download 300 DPI PDF&rdquo; of beheer de verzendstatus hieronder
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-[#78716C] bg-white rounded-3xl border border-[#EBE7DF] shadow-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1C1917] mb-2" />
              <p className="text-xs">Productiewachtrij laden...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-[#78716C] bg-white rounded-3xl border border-[#EBE7DF] space-y-3 shadow-sm">
              <Package className="w-10 h-10 text-[#A8A29E] mx-auto" />
              <h3 className="font-serif text-lg text-[#1C1917] font-bold">Nog geen bestellingen ingediend</h3>
              <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                Ontwerp een sterrenkaart in de studio en klik op &ldquo;Bestellen & Drukken&rdquo; om een testbestelling te plaatsen.
              </p>
              <button
                onClick={onBackToStudio}
                className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md"
              >
                Maak Eerste Bestelling &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <ProducerOrderCard
                  key={order.order_id}
                  order={order}
                  formatFileSize={formatFileSize}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ProducerOrderCardProps {
  order: OrderRecord;
  formatFileSize: (bytes: number) => string;
  onUpdateStatus: (
    orderId: string,
    status: string,
    carrier?: string,
    trackingNumber?: string
  ) => Promise<void>;
}

const ProducerOrderCard: React.FC<ProducerOrderCardProps> = ({
  order,
  formatFileSize,
  onUpdateStatus,
}) => {
  const [currentStatus, setCurrentStatus] = useState(order.status || 'in_production');
  const [carrier, setCarrier] = useState(order.carrier || 'PostNL');
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSendingGelato, setIsSendingGelato] = useState(false);
  const [gelatoMessage, setGelatoMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // 1. Try to fetch PDF from API
      const res = await apiFetch(`/api/orders/${order.order_id}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 1000) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${order.order_id}_print_ready_300dpi.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return;
        }
      }
    } catch (err) {
      console.warn('API PDF download failed, using client-side 300 DPI engine:', err);
    }

    // 2. High-precision vector PDF generator directly in browser
    try {
      const pdfBytes = await generateStarMapPdfBlob(
        {
          posterSize: order.poster_size as any,
          styleId: order.style_id,
          frameStyle: order.frame_style as any,
          titleBlock: {
            text: order.title_text || 'The Night We Met',
            font: 'Cinzel',
            size: 38,
            tracking: 3,
            uppercase: true,
            italic: false,
            enabled: true,
          },
          namesBlock: {
            text: order.names_text || '',
            font: 'Great Vibes',
            size: 51,
            tracking: 1,
            uppercase: false,
            italic: true,
            enabled: !!order.names_text,
          },
          dateBlock: {
            text: order.date_text || '',
            font: 'Cinzel',
            size: 15,
            tracking: 2,
            uppercase: true,
            italic: false,
            enabled: true,
          },
          locationBlock: {
            text: order.location_text || '',
            font: 'Cinzel',
            size: 14,
            tracking: 2,
            uppercase: true,
            italic: false,
            enabled: true,
          },
          showCelestialGrid: true,
          showConstellationLines: true,
          showMilkyWay: true,
          showMattedBorder: false,
          dividerStyle: 'diamond',
        },
        order.order_id,
        'nl'
      );

      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${order.order_id}_print_ready_300dpi.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Client PDF generation error:', err);
      window.open(`/api/orders/${order.order_id}/pdf`, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    setCurrentStatus(order.status || 'in_production');
    setCarrier(order.carrier || 'PostNL');
    setTrackingNumber(order.tracking_number || '');
  }, [order]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateStatus(order.order_id, currentStatus, carrier, trackingNumber);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendToGelato = async () => {
    setIsSendingGelato(true);
    setGelatoMessage(null);
    try {
      const res = await apiFetch(`/api/orders/${order.order_id}/gelato-submit`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.order) {
        setGelatoMessage('Succesvol verzonden naar Gelato!');
        await onUpdateStatus(order.order_id, data.order.status, data.order.carrier, data.order.tracking_number);
      } else {
        setGelatoMessage(data.error || 'Verzending naar Gelato mislukt');
      }
    } catch (err: any) {
      setGelatoMessage(err.message || 'Verbinding met server mislukt');
    } finally {
      setIsSendingGelato(false);
      setTimeout(() => setGelatoMessage(null), 4000);
    }
  };

  const isDigital = order.frame_style === 'digital';

  const statusBadges: Record<string, { label: string; color: string }> = {
    confirmed: { label: 'Ontvangen', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    in_production: { label: 'In Productie', color: 'bg-sky-50 text-sky-800 border-sky-200' },
    printed: { label: 'Gedrukt & Gecontroleerd', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    shipped: { label: 'Verzonden', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    delivered: { label: 'Bezorgd', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  };

  return (
    <div className="rounded-3xl bg-white border border-[#EBE7DF] hover:border-[#D6D0C4] p-6 flex flex-col gap-5 transition-all shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Info: Product & Specs */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#E2DDD5] text-[#1C1917] font-mono font-bold text-xs tracking-wider">
              {order.order_id}
            </span>
            <span className="text-xs text-[#78716C] flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
              <span>{order.created_at ? new Date(order.created_at).toLocaleString('nl-NL') : 'Recent'}</span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${
                statusBadges[order.status]?.color || 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {statusBadges[order.status]?.label || order.status}
            </span>

            {/* Gelato Print-on-Demand Badge */}
            {isDigital ? (
              <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-medium bg-zinc-50 text-zinc-600 border-zinc-200">
                Digitaal (Geen print)
              </span>
            ) : order.gelato_order_id ? (
              <span
                className="px-2.5 py-0.5 rounded-full border text-[10px] font-medium bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1 font-mono"
                title={`Gelato Status: ${order.gelato_status || 'submitted'}`}
              >
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Gelato: {order.gelato_order_id}</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-medium bg-amber-50 text-amber-800 border-amber-200">
                Gelato: Nog niet verzonden
              </span>
            )}
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              {order.title_text || 'De Gepersonaliseerde Sterrenposter™'}
            </h3>
            <p className="text-xs text-[#78716C] font-serif italic">
              Opgedragen: {order.names_text}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[#57534E] pt-1">
            <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E4DC]">
              Formaat: <strong className="text-[#1C1917]">{
                order.poster_size === '50x70'
                  ? '50 × 70 cm'
                  : order.poster_size === '40x50'
                  ? '40 × 50 cm'
                  : order.poster_size === '30x40'
                  ? '30 × 40 cm'
                  : order.poster_size === '18x24'
                  ? '18 × 24″ (45 × 60 cm)'
                  : order.poster_size === '24x36'
                  ? '24 × 36″ (60 × 90 cm)'
                  : order.poster_size === '12x18'
                  ? '12 × 18″ (30 × 45 cm)'
                  : `${(order.poster_size || '50x70').replace('x', ' × ')} cm`
              }</strong>
            </span>
            <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E4DC] capitalize">
              Stijl: <strong className="text-[#1C1917]">{order.style_id ? order.style_id.replace(/_/g, ' ') : 'Midnight Classic'}</strong>
            </span>
            <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E4DC] capitalize">
              Lijst: <strong className="text-[#1C1917]">{order.frame_style || 'Zonder lijst'}</strong>
            </span>
            <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E4DC]">
              Bestand: <strong className="text-[#1C1917] font-mono">{formatFileSize(order.pdf_size_bytes)}</strong>
            </span>
          </div>

          {/* Customer Shipping Address Box */}
          <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs space-y-1">
            <div className="text-[#78716C] flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>Bezorgen aan:</span>
              <strong className="text-[#1C1917]">{order.customer.name}</strong>
              <span className="text-[#78716C]">({order.customer.email})</span>
            </div>
            <p className="text-[#57534E] text-[11px] pl-5">
              {order.customer.address_line1}
              {order.customer.address_line2 ? `, ${order.customer.address_line2}` : ''},{' '}
              {order.customer.city}, {order.customer.state} {order.customer.postal_code}, {order.customer.country}
            </p>
            {order.customer.gift_note && (
              <p className="text-[11px] text-[#78716C] italic pl-5 pt-0.5">
                Cadeaukaartje: &ldquo;{order.customer.gift_note}&rdquo;
              </p>
            )}
            {order.customer.producer_notes && (
              <p className="text-[11px] text-[#1C1917] pl-5 pt-0.5 font-mono">
                Drukkerij-notitie: {order.customer.producer_notes}
              </p>
            )}
          </div>

          {/* Gelato Fulfillment & Wholesale Tax Details */}
          {!isDigital && (
            <div className="mt-3 p-3.5 rounded-2xl bg-white border border-[#E8E4DC] text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#78716C] border-b border-[#F0ECE1] pb-2">
                <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>Gelato Print-on-Demand Details</span>
                </span>
                <span className="font-mono text-[10px] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E4DC]">
                  Ref: {order.gelato_order_id || 'Nog niet verzonden'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#E8E4DC]">
                  <span className="text-[10px] text-[#78716C] block font-medium">Bestemming / Staat</span>
                  <strong className="text-[#1C1917]">
                    {order.customer.country === 'United States' || order.customer.country === 'US' || order.customer.country === 'Verenigde Staten'
                      ? `VS (${order.customer.state || 'Geen staat'})`
                      : order.customer.country || 'NL'}
                  </strong>
                </div>

                <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#E8E4DC]">
                  <span className="text-[10px] text-[#78716C] block font-medium">Btw / Tax (Gelato)</span>
                  <strong className={order.gelato_total_vat && order.gelato_total_vat > 0 ? "text-emerald-700" : "text-[#1C1917]"}>
                    {order.gelato_total_vat !== undefined && order.gelato_total_vat !== null && order.gelato_total_vat > 0
                      ? `${order.gelato_currency || 'EUR'} ${Number(order.gelato_total_vat).toFixed(2)}`
                      : order.gelato_order_id
                      ? `${order.gelato_currency || 'EUR'} 0.00 (Exempt/Inbegrepen)`
                      : 'Nog niet berekend'}
                  </strong>
                </div>

                <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#E8E4DC]">
                  <span className="text-[10px] text-[#78716C] block font-medium">Inkoopprijs Totaal</span>
                  <strong className="text-[#1C1917]">
                    {order.gelato_total_cost
                      ? `${order.gelato_currency || 'EUR'} ${Number(order.gelato_total_cost).toFixed(2)}`
                      : '—'}
                  </strong>
                </div>

                <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#E8E4DC]">
                  <span className="text-[10px] text-[#78716C] block font-medium">Status</span>
                  <span className="capitalize text-[#1C1917] font-medium">
                    {order.gelato_status || 'In afwachting'}
                  </span>
                </div>
              </div>

              {order.gelato_tax_note && (
                <p className="text-[10px] text-[#78716C] font-mono pl-1">
                  Belastingnotitie: {order.gelato_tax_note}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Download PDF for Producer */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {isDownloading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#FAF8F5]" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading ? 'Genereren 300 DPI PDF...' : 'Download 300 DPI PDF'}</span>
          </button>

          <a
            href={`/api/orders/${order.order_id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] font-medium text-xs border border-[#E2DDD5] flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
            <span>Openen in Browser</span>
          </a>

          {/* Gelato Print-on-Demand Action Section */}
          {!isDigital && (
            order.gelato_order_id ? (
              <div className="w-full p-2.5 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl text-left space-y-1 shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Aangemeld bij Gelato</span>
                </div>
                <p className="text-[10px] text-emerald-700 leading-snug">
                  {order.gelato_status === 'draft' || !order.gelato_status
                    ? 'Staat als Concept in Gelato. Keur de order goed in je Gelato Dashboard om het printen te starten.'
                    : `Gelato status: ${order.gelato_status}`}
                </p>
                <button
                  type="button"
                  onClick={handleSendToGelato}
                  disabled={isSendingGelato}
                  className="text-[10px] text-[#78716C] hover:text-[#1C1917] underline pt-0.5 inline-block transition disabled:opacity-50"
                  title="Alleen gebruiken als je de order opnieuw wilt aanbieden aan Gelato"
                >
                  {isSendingGelato ? 'Opnieuw verzenden...' : 'Handmatig opnieuw aanbieden aan Gelato'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSendToGelato}
                disabled={isSendingGelato}
                className="w-full px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-50"
                title="Stuur 300 DPI PDF en klant bezorgadres direct door naar Gelato"
              >
                {isSendingGelato ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Handmatig naar Gelato Sturen</span>
              </button>
            )
          )}

          {gelatoMessage && (
            <p
              className={`text-[10px] text-center font-medium max-w-[180px] leading-tight ${
                gelatoMessage.includes('Succesvol') ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {gelatoMessage}
            </p>
          )}
        </div>
      </div>

      {/* Workshop Status & Tracking Management Bar */}
      <div className="pt-3 border-t border-[#F0ECE1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[#78716C] font-medium text-[11px]">Status:</span>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-2.5 py-1 text-xs text-[#1C1917] font-medium focus:outline-none focus:border-[#1C1917]"
            >
              <option value="confirmed">Ontvangen</option>
              <option value="in_production">In Atelier Productie</option>
              <option value="printed">Gedrukt & Gecontroleerd</option>
              <option value="shipped">Verzonden</option>
              <option value="delivered">Bezorgd</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#78716C] font-medium text-[11px]">Vervoerder:</span>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-2.5 py-1 text-xs text-[#1C1917] font-medium focus:outline-none focus:border-[#1C1917]"
            >
              <option value="PostNL">PostNL</option>
              <option value="Bpost">Bpost</option>
              <option value="DHL">DHL</option>
              <option value="Digitale Levering per E-mail">Digitale Levering</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <span className="text-[#78716C] font-medium text-[11px]">Track & Trace:</span>
            <input
              type="text"
              placeholder="bijv. 3SABCD123456789"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-2.5 py-1 text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-1.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 shrink-0"
        >
          {isSaving ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saveSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Opgeslagen!</span>
            </>
          ) : (
            <span>Status Opslaan</span>
          )}
        </button>
      </div>
    </div>
  );
};
