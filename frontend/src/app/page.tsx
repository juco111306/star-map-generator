'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from '../components/Navbar';
import { LandingHero } from '../components/LandingHero';
import { ProductCatalog } from '../components/ProductCatalog';
import { HowItWorks } from '../components/HowItWorks';
import { SocialProof } from '../components/SocialProof';
import { Footer } from '../components/Footer';
import { ConfigPanel } from '../components/ConfigPanel';
import { StarMapPreview } from '../components/StarMapPreview';
import { OrderModal } from '../components/OrderModal';
import { ProducerPortal } from '../components/ProducerPortal';
import { AppView, CelestialData, FrameStyle, MapConfig, OrderRecord } from '../types';

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const [config, setConfig] = useState<MapConfig>({
    posterSize: '50x70',
    styleId: 'midnight_classic',
    locationName: 'New York, USA',
    latitude: 40.7128,
    longitude: -74.006,
    date: '2026-09-22',
    time: '21:00',

    // Fully customizable text blocks
    titleBlock: {
      text: 'THE NIGHT WE MET',
      font: 'Cinzel',
      size: 38,
      tracking: 3,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    namesBlock: {
      text: 'Emma & Noah',
      font: 'Great Vibes',
      size: 51,
      tracking: 1,
      uppercase: false,
      italic: false,
      enabled: true,
    },
    taglineBlock: {
      text: '',
      font: 'Playfair Display',
      size: 13,
      tracking: 1,
      uppercase: false,
      italic: true,
      enabled: false,
    },
    dateBlock: {
      text: 'SEPTEMBER 22, 2026',
      font: 'Montserrat',
      size: 27,
      tracking: 2.5,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    locationBlock: {
      text: 'NEW YORK, NY',
      font: 'Montserrat',
      size: 21,
      tracking: 2,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    coordsBlock: {
      text: '40.7128° N • 74.0060° W',
      font: 'Montserrat',
      size: 21,
      tracking: 1.8,
      uppercase: true,
      italic: false,
      enabled: true,
    },

    // Visual & Celestial Toggles
    maskShape: 'circle',
    layoutVariation: 'standard_stack',
    showMattedBorder: false,
    showCelestialGrid: true,
    showConstellationLines: true,
    showMilkyWay: true,
    dividerStyle: 'diamond',
    dividerSize: 34,
    frameStyle: 'none',
  });

  const [celestialData, setCelestialData] = useState<CelestialData | null>(null);
  const [isLoadingStars, setIsLoadingStars] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Fetch initial orders count for the producer queue
  const fetchOrdersQueue = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchOrdersQueue();
  }, []);

  useEffect(() => {
    if (currentView === 'customizer') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [currentView]);

  // Debounced star data fetch
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStars = useCallback(async (lat: number, lon: number, dateStr: string, timeStr: string) => {
    setIsLoadingStars(true);
    try {
      const isoDateTime = `${dateStr}T${timeStr || '21:00'}:00Z`;
      const res = await fetch('/api/star-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: lat,
          longitude: lon,
          date_time: isoDateTime,
          max_magnitude: 6.0,
        }),
      });

      if (res.ok) {
        const data: CelestialData = await res.json();
        setCelestialData(data);
      } else {
        console.error('Failed to fetch star data:', await res.text());
      }
    } catch (err) {
      console.error('Error contacting celestial API:', err);
    } finally {
      setIsLoadingStars(false);
    }
  }, []);

  // Fetch stars on location / datetime change
  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(() => {
      fetchStars(config.latitude, config.longitude, config.date, config.time);
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [config.latitude, config.longitude, config.date, config.time, fetchStars]);

  const handleConfigChange = (updates: Partial<MapConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Instant PDF proof download
  const handleInstantProofExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const isoDateTime = `${config.date}T${config.time || '21:00'}:00Z`;
      const payload = {
        latitude: config.latitude,
        longitude: config.longitude,
        date_time: isoDateTime,
        poster_size: config.posterSize,
        style_id: config.styleId,
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
        frame_style: config.frameStyle,
      };

      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to generate proof PDF');
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `stellaire-star-map-${config.styleId}-${config.posterSize}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    } catch (err: any) {
      console.error('Export proof error:', err);
      setExportError(err.message || 'Error generating PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col font-montserrat">
      {/* Global Luxury Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        orderCount={orders.length}
      />

      {/* Main Content Router */}
      {currentView === 'landing' && (
        <main className="flex-1">
          <LandingHero onNavigate={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <ProductCatalog onCustomizeStarMap={() => {
            setCurrentView('customizer');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <HowItWorks onStartCustomizing={() => {
            setCurrentView('customizer');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <SocialProof />
          <Footer onNavigate={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
        </main>
      )}

      {currentView === 'products' && (
        <main className="flex-1">
          <ProductCatalog onCustomizeStarMap={() => {
            setCurrentView('customizer');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <HowItWorks onStartCustomizing={() => {
            setCurrentView('customizer');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <Footer onNavigate={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
        </main>
      )}

      {currentView === 'customizer' && (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Left: Redesigned Step-Based Studio Panel */}
          <ConfigPanel
            config={config}
            onChange={handleConfigChange}
            onRefreshStars={() =>
              fetchStars(config.latitude, config.longitude, config.date, config.time)
            }
            isLoadingStars={isLoadingStars}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
            onInstantExport={handleInstantProofExport}
            isExporting={isExporting}
            onBackToProducts={() => setCurrentView('products')}
          />

          {/* Right: Floating Sticky Live Preview with Frame Controls */}
          <StarMapPreview
            config={config}
            celestialData={celestialData}
            isLoading={isLoadingStars}
            onFrameChange={(f: FrameStyle) => handleConfigChange({ frameStyle: f })}
          />

          {/* Export Error Alert if any */}
          {exportError && (
            <div className="absolute top-4 right-4 z-40 bg-red-500/90 backdrop-blur-md border border-red-400 text-white px-4 py-2.5 rounded-2xl text-xs shadow-2xl flex items-center gap-2">
              <span>{exportError}</span>
              <button onClick={() => setExportError(null)} className="ml-2 font-bold">✕</button>
            </div>
          )}
        </main>
      )}

      {currentView === 'producer' && (
        <main className="flex-1">
          <ProducerPortal onBackToStudio={() => setCurrentView('customizer')} />
          <Footer onNavigate={setCurrentView} />
        </main>
      )}

      {/* Order & Print Producer Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        config={config}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
