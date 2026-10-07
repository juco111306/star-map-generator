'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { FAQ } from '../components/FAQ';
import { ReturnPolicyModal } from '../components/ReturnPolicyModal';
import { GeoLanguageBanner } from '../components/GeoLanguageBanner';
import { AppView, CelestialData, FrameStyle, MapConfig, OrderRecord } from '../types';
import { apiFetch } from '../utils/api';
import { SAMPLE_STARS, SAMPLE_CONSTELLATION_LINES } from '../constants/sampleCelestialData';
import { useLanguage } from '../context/LanguageContext';
import { Locale, isValidLocale } from '../locales';

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

import {
  LOCALE_DEFAULTS,
  ALL_KNOWN_TITLES,
  ALL_KNOWN_NAMES,
  ALL_KNOWN_LOCATIONS,
  ALL_KNOWN_DATES,
} from '../constants/defaults';

function SearchParamsWatcher({ onViewChange }: { onViewChange: (view: AppView) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const admin = searchParams.get('admin');
    const view = searchParams.get('view');
    if (admin === '1' || admin === 'true' || view === 'producer') {
      onViewChange('producer');
    }
  }, [searchParams, onViewChange]);
  return null;
}

interface HomeProps {
  initialLocale?: Locale;
  initialView?: AppView;
  initialSearchParams?: { [key: string]: string | string[] | undefined };
}

export default function Home(props: any) {
  const { initialLocale, initialView, initialSearchParams } = props || {};
  const { locale, changeLocale } = useLanguage();

  const isInitialAdmin = Boolean(
    initialView === 'producer' ||
    initialSearchParams?.admin === '1' ||
    initialSearchParams?.admin === 'true' ||
    initialSearchParams?.view === 'producer'
  );

  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (isInitialAdmin) return 'producer';
    if (initialView) return initialView;
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get('admin') === 'true' ||
          params.get('admin') === '1' ||
          params.get('view') === 'producer' ||
          window.location.pathname.endsWith('/admin') ||
          window.location.pathname === '/admin'
        ) {
          return 'producer';
        }
      } catch {}
    }
    return 'landing';
  });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isReturnPolicyOpen, setIsReturnPolicyOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const activeDef = LOCALE_DEFAULTS[locale] || LOCALE_DEFAULTS.nl;

  const [config, setConfig] = useState<MapConfig>(() => ({
    posterSize: '50x70',
    styleId: 'midnight_classic',
    locationName: activeDef.locationName,
    latitude: activeDef.lat,
    longitude: activeDef.lng,
    date: '2026-09-22',
    time: '21:00',

    // Fully customizable text blocks (empty by default for instant zero-backspace typing)
    titleBlock: {
      text: '',
      font: 'Cinzel',
      size: 38,
      tracking: 3,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    namesBlock: {
      text: '',
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
      text: '',
      font: 'Montserrat',
      size: 27,
      tracking: 2.5,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    locationBlock: {
      text: '',
      font: 'Montserrat',
      size: 21,
      tracking: 2,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    coordsBlock: {
      text: '',
      font: 'Montserrat',
      size: 21,
      tracking: 1.8,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    placeholders: {
      title: activeDef.title,
      names: activeDef.names,
      date: activeDef.dateStr,
      location: activeDef.locationName.toUpperCase(),
      coords: activeDef.coords,
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
  }));

  const [hasUserCustomized, setHasUserCustomized] = useState(false);
  const isUserCustomizedRef = useRef(false);

  // Track locale changes: if the user has ALREADY started customizing or is in the studio,
  // NEVER alter the poster, layout, text, coordinates, or placeholders!
  const prevLocaleRef = useRef<Locale>(locale);
  useEffect(() => {
    const prev = prevLocaleRef.current;
    if (prev !== locale) {
      prevLocaleRef.current = locale;

      // Check if user has already started customizing or entered the studio
      const isCustomized = Boolean(
        hasUserCustomized ||
        isUserCustomizedRef.current ||
        currentView === 'customizer' ||
        config.titleBlock?.text?.trim() ||
        config.namesBlock?.text?.trim() ||
        config.dateBlock?.text?.trim() ||
        config.locationBlock?.text?.trim() ||
        config.taglineBlock?.text?.trim() ||
        config.coordsBlock?.text?.trim()
      );

      // Once customized, the user's poster is sacred and must NEVER be modified by language/currency changes
      if (isCustomized) {
        isUserCustomizedRef.current = true;
        setHasUserCustomized(true);
        return;
      }

      // ONLY on initial untouched landing page: update default placeholder labels without touching layout or coordinates
      const nextDef = LOCALE_DEFAULTS[locale] || LOCALE_DEFAULTS.en || LOCALE_DEFAULTS.nl;
      setConfig((prevConfig) => ({
        ...prevConfig,
        placeholders: {
          title: nextDef.title,
          names: nextDef.names,
          date: nextDef.dateStr,
          location: nextDef.locationName.toUpperCase(),
          coords: nextDef.coords,
        },
      }));
    }
  }, [locale, hasUserCustomized, currentView, config]);

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
    const handleUrlCheck = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get('admin') === 'true' ||
          params.get('admin') === '1' ||
          params.get('view') === 'producer' ||
          window.location.pathname.endsWith('/admin') ||
          window.location.pathname === '/admin'
        ) {
          setCurrentView('producer');
        }
      }
    };

    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);
    return () => window.removeEventListener('popstate', handleUrlCheck);
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
    isUserCustomizedRef.current = true;
    setHasUserCustomized(true);
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col font-montserrat w-full max-w-full overflow-x-hidden">
      <Suspense fallback={null}>
        <SearchParamsWatcher onViewChange={setCurrentView} />
      </Suspense>

      {/* Geolocation Regional Language Banner */}
      <GeoLanguageBanner />

      {/* Global Luxury Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          if (v === 'customizer') {
            isUserCustomizedRef.current = true;
            setHasUserCustomized(true);
          }
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        orderCount={orders.length}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
      />

      {/* Main Content Router */}
      {currentView === 'landing' && (
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          <LandingHero
            onNavigate={(v) => {
              if (v === 'customizer') {
                isUserCustomizedRef.current = true;
                setHasUserCustomized(true);
              }
              setCurrentView(v);
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onStartWithPreset={(preset) => {
              isUserCustomizedRef.current = true;
              setHasUserCustomized(true);
              setConfig((prev) => ({
                ...prev,
                ...preset,
              }));
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
          />
          <ProductCatalog
            onCustomizeStarMap={() => {
              isUserCustomizedRef.current = true;
              setHasUserCustomized(true);
              setConfig((prev) => ({ ...prev, frameStyle: 'digital' }));
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onSelectStyle={(styleId) => {
              isUserCustomizedRef.current = true;
              setHasUserCustomized(true);
              setConfig((prev) => ({ ...prev, styleId, frameStyle: 'digital' }));
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onSelectEdition={(frameStyle) => {
              isUserCustomizedRef.current = true;
              setHasUserCustomized(true);
              setConfig((prev) => ({ ...prev, frameStyle }));
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
          />
          <HowItWorks onStartCustomizing={() => {
            isUserCustomizedRef.current = true;
            setHasUserCustomized(true);
            setCurrentView('customizer');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <SocialProof />
          <FAQ
            onOpenReturnPolicy={() => setIsReturnPolicyOpen(true)}
            onCustomizeStarMap={() => {
              isUserCustomizedRef.current = true;
              setHasUserCustomized(true);
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
          />
          <PilotNotice />
          <Footer
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onOpenReturnPolicy={() => setIsReturnPolicyOpen(true)}
          />
        </main>
      )}

      {currentView === 'products' && (
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          <ProductCatalog
            onCustomizeStarMap={() => {
              setConfig((prev) => ({ ...prev, frameStyle: 'digital' }));
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onSelectStyle={(styleId) => {
              setConfig((prev) => ({ ...prev, styleId, frameStyle: 'digital' }));
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onSelectEdition={(frameStyle) => {
              setConfig((prev) => ({ ...prev, frameStyle }));
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
          />
          <HowItWorks onStartCustomizing={() => {
            setCurrentView('customizer');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
          <FAQ
            onOpenReturnPolicy={() => setIsReturnPolicyOpen(true)}
            onCustomizeStarMap={() => {
              setCurrentView('customizer');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
          />
          <Footer
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onOpenReturnPolicy={() => setIsReturnPolicyOpen(true)}
          />
        </main>
      )}

      {currentView === 'customizer' && (
        <main className="flex-1 flex flex-col lg:flex-row min-h-0 lg:h-[calc(100vh-65px)] lg:overflow-hidden relative w-full max-w-full overflow-x-hidden">
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
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          <ProducerPortal onBackToStudio={() => setCurrentView('customizer')} />
          <Footer
            onNavigate={setCurrentView}
            onOpenReturnPolicy={() => setIsReturnPolicyOpen(true)}
          />
        </main>
      )}

      {/* Order & Print Producer Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        config={config}
        onOrderSuccess={handleOrderSuccess}
        onOpenReturnPolicy={() => setIsReturnPolicyOpen(true)}
        onSwitchToDigital={() => setConfig((prev) => ({ ...prev, frameStyle: 'digital' }))}
      />

      {/* Customer Order Tracking & History Dashboard Modal */}
      <CustomerTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* Return Policy & Satisfaction Guarantee Modal */}
      <ReturnPolicyModal
        isOpen={isReturnPolicyOpen}
        onClose={() => setIsReturnPolicyOpen(false)}
      />
    </div>
  );
}
