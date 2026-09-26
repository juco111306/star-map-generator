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
import { CustomerTrackingModal } from '../components/CustomerTrackingModal';
import { ProducerPortal } from '../components/ProducerPortal';
import { PilotNotice } from '../components/PilotNotice';
import { AppView, CelestialData, FrameStyle, MapConfig, OrderRecord } from '../types';
import { apiFetch } from '../utils/api';
import { SAMPLE_STARS, SAMPLE_CONSTELLATION_LINES } from '../constants/sampleCelestialData';

const INITIAL_CELESTIAL_DATA: CelestialData = {
  stars: SAMPLE_STARS.map((s) => ({
    x: s.x,
    y: s.y,
    mag: s.bright ? 1.5 : 4.0,
    size: s.r * 1.3,
    is_constellation: s.bright,
  })),
  lines: SAMPLE_CONSTELLATION_LINES.map((l) => ({
    constellation: 'Major Constellations',
    p1: [l.x1, l.y1],
    p2: [l.x2, l.y2],
  })),
  constellation_stars: SAMPLE_STARS.filter((s) => s.bright).map((s) => ({
    x: s.x,
    y: s.y,
    mag: 1.5,
    size: s.r * 1.8,
    is_constellation: true,
  })),
  total_visible_stars: SAMPLE_STARS.length,
  total_visible_lines: SAMPLE_CONSTELLATION_LINES.length,
};

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const [config, setConfig] = useState<MapConfig>({
    posterSize: '50x70',
    styleId: 'midnight_classic',
    locationName: 'Amsterdam, Nederland',
    latitude: 52.3676,
    longitude: 4.9041,
    date: '2026-09-22',
    time: '21:00',

    // Fully customizable text blocks
    titleBlock: {
      text: 'DE NACHT WAARIN WE ELKAAR VONDEN',
      font: 'Cinzel',
      size: 38,
      tracking: 3,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    namesBlock: {
      text: 'Emma & Daan',
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
      text: '22 SEPTEMBER 2026',
      font: 'Montserrat',
      size: 27,
      tracking: 2.5,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    locationBlock: {
      text: 'AMSTERDAM, NEDERLAND',
      font: 'Montserrat',
      size: 21,
      tracking: 2,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    coordsBlock: {
      text: '52.3676° N • 4.9041° E',
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
    frameStyle: 'digital',
  });

  const [celestialData, setCelestialData] = useState<CelestialData | null>(INITIAL_CELESTIAL_DATA);
  const [isLoadingStars, setIsLoadingStars] = useState(false);

  // Fetch initial orders count for the producer queue
  const fetchOrdersQueue = async () => {
    try {
      const res = await apiFetch('/api/orders');
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
      const res = await apiFetch('/api/star-data', {
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
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
      />

      {/* Main Content Router */}
      {currentView === 'landing' && (
        <main className="flex-1">
          <LandingHero onNavigate={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <ProductCatalog
            onCustomizeStarMap={() => {
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onSelectStyle={(styleId) => {
              setConfig((prev) => ({ ...prev, styleId }));
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
          />
          <HowItWorks onStartCustomizing={() => {
            setCurrentView('customizer');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <SocialProof />
          <PilotNotice />
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
            onBackToProducts={() => setCurrentView('products')}
          />

          {/* Right: Floating Sticky Live Preview */}
          <StarMapPreview
            config={config}
            celestialData={celestialData}
            isLoading={isLoadingStars}
          />

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

      {/* Customer Order Tracking & History Dashboard Modal */}
      <CustomerTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </div>
  );
}
