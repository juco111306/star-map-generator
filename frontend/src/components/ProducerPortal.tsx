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
} from 'lucide-react';
import { OrderRecord } from '../types';

interface ProducerPortalProps {
  onBackToStudio: () => void;
}

export const ProducerPortal: React.FC<ProducerPortalProps> = ({ onBackToStudio }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders');
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
    fetchOrders();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '1.1 MB';
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

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
              <span>Back to Store & Studio</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917] shadow-sm">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#1C1917] tracking-wide">
                  Print Producer Workshop Queue
                </h1>
                <p className="text-xs text-[#78716C] font-light">
                  Archived 300 DPI print-ready PDFs ready to send to your print manufacturer
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
              <span>Refresh Orders</span>
            </button>

            <button
              onClick={onBackToStudio}
              className="px-5 py-2 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md transition"
            >
              + Create New Gift
            </button>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-white border border-[#EBE7DF] p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#78716C] font-medium uppercase tracking-wider">
              Total Production Orders
            </span>
            <div className="font-serif text-3xl font-bold text-[#1C1917]">
              {orders.length}
            </div>
            <p className="text-[11px] text-emerald-800 flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" />
              <span>All 300 DPI PDFs Compiled & Ready</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#EBE7DF] p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#78716C] font-medium uppercase tracking-wider">
              Print Specification Standard
            </span>
            <div className="font-serif text-2xl font-bold text-[#1C1917]">
              300 DPI Archival
            </div>
            <p className="text-[11px] text-[#78716C] mt-1">
              Exact NASA Celestial Projection + CMYK Golden Ratio
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#EBE7DF] p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#78716C] font-medium uppercase tracking-wider">
              Workshop Status
            </span>
            <div className="font-serif text-2xl font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Queue Active</span>
            </div>
            <p className="text-[11px] text-[#78716C] mt-1">
              Ready to send directly to print supplier
            </p>
          </div>
        </div>

        {/* Orders Queue List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#57534E]">
              Active Orders Awaiting Physical Printing ({orders.length})
            </h2>
            <span className="text-xs text-[#78716C]">
              Click &ldquo;Download 300 DPI PDF&rdquo; to send file to printer
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-[#78716C] bg-white rounded-3xl border border-[#EBE7DF] shadow-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1C1917] mb-2" />
              <p className="text-xs">Loading workshop queue...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-[#78716C] bg-white rounded-3xl border border-[#EBE7DF] space-y-3 shadow-sm">
              <Package className="w-10 h-10 text-[#A8A29E] mx-auto" />
              <h3 className="font-serif text-lg text-[#1C1917] font-bold">No orders submitted yet</h3>
              <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                Customize a star map in the studio and click &ldquo;Send to Print Workshop&rdquo; to test filing orders here.
              </p>
              <button
                onClick={onBackToStudio}
                className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md"
              >
                Create First Gift Order &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="rounded-3xl bg-white border border-[#EBE7DF] hover:border-[#D6D0C4] p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all shadow-sm"
                >
                  {/* Left Info: Product & Specs */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#E2DDD5] text-[#1C1917] font-mono font-bold text-xs tracking-wider">
                        {order.order_id}
                      </span>
                      <span className="text-xs text-[#78716C] flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
                        <span>{order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent'}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                        Ready to Print
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        {order.title_text || 'The Celestial Blueprint™'}
                      </h3>
                      <p className="text-xs text-[#78716C] font-serif italic">
                        Inscribed: {order.names_text}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#57534E] pt-1">
                      <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E4DC]">
                        Size: <strong className="text-[#1C1917]">{order.poster_size}&quot;</strong>
                      </span>
                      <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E4DC] capitalize">
                        Frame: <strong className="text-[#1C1917]">{order.frame_style || 'Unframed'}</strong>
                      </span>
                      <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E4DC]">
                        File: <strong className="text-[#1C1917] font-mono">{formatFileSize(order.pdf_size_bytes)}</strong>
                      </span>
                    </div>

                    {/* Customer Shipping Address Box */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs space-y-1">
                      <div className="text-[#78716C] flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#1C1917]" />
                        <span>Ship To:</span>
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
                          Gift Note: &ldquo;{order.customer.gift_note}&rdquo;
                        </p>
                      )}
                      {order.customer.producer_notes && (
                        <p className="text-[11px] text-[#1C1917] pl-5 pt-0.5 font-mono">
                          Producer Note: {order.customer.producer_notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Download PDF for Producer */}
                  <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-center gap-2.5 shrink-0">
                    <a
                      href={`/api/orders/${order.order_id}/pdf`}
                      download={`${order.order_id}_print_ready_300dpi.pdf`}
                      className="w-full px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-medium text-xs shadow-md flex items-center justify-center gap-2 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download 300 DPI PDF</span>
                    </a>

                    <a
                      href={`/api/orders/${order.order_id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] font-medium text-xs border border-[#E2DDD5] flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
                      <span>View in Browser</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
