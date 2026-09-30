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
import { Locale } from '../locales';

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

const LOCALE_DEFAULTS: Record<
  Locale,
  {
    title: string;
    names: string;
    locationName: string;
    lat: number;
    lng: number;
    dateStr: string;
    coords: string;
  }
> = {
  nl: {
    title: 'DE NACHT WAARIN WE ELKAAR VONDEN',
    names: 'Sophie & Daan',
    locationName: 'Amsterdam, Nederland',
    lat: 52.3676,
    lng: 4.9041,
    dateStr: '22 SEPTEMBER 2026',
    coords: '52.3676° N • 4.9041° E',
  },
  de: {
    title: 'DIE NACHT, IN DER WIR UNS TRAFEN',
    names: 'Hannah & Maximilian',
    locationName: 'Berlin, Deutschland',
    lat: 52.5200,
    lng: 13.4050,
    dateStr: '22. SEPTEMBER 2026',
    coords: '52.5200° N • 13.4050° O',
  },
  en: {
    title: 'THE NIGHT WE MET',
    names: 'Olivia & James',
    locationName: 'London, United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    dateStr: 'SEPTEMBER 22, 2026',
    coords: '51.5074° N • 0.1278° W',
  },
};

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

export default function Home({ initialLocale, initialView, initialSearchParams }: HomeProps = {}) {
  const { locale } = useLanguage();

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

    // Fully customizable text blocks
    titleBlock: {
      text: activeDef.title,
      font: 'Cinzel',
      size: 38,
      tracking: 3,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    namesBlock: {
      text: activeDef.names,
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
      text: activeDef.dateStr,
      font: 'Montserrat',
      size: 27,
      tracking: 2.5,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    locationBlock: {
      text: activeDef.locationName.toUpperCase(),
      font: 'Montserrat',
      size: 21,
      tracking: 2,
      uppercase: true,
      italic: false,
      enabled: true,
    },
    coordsBlock: {
      text: activeDef.coords,
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
  }));

  // Track locale changes to translate default poster sample text seamlessly
  const prevLocaleRef = useRef<Locale>(locale);
  useEffect(() => {
    const prev = prevLocaleRef.current;
    if (prev !== locale) {
      prevLocaleRef.current = locale;
      const prevDef = LOCALE_DEFAULTS[prev] || LOCALE_DEFAULTS.nl;
      const nextDef = LOCALE_DEFAULTS[locale] || LOCALE_DEFAULTS.nl;

      setConfig((prevConfig) => {
        const allTitles = Object.values(LOCALE_DEFAULTS).map((d) => d.title);
        const allNames = Object.values(LOCALE_DEFAULTS).map((d) => d.names);
        const allLocs = Object.values(LOCALE_DEFAULTS).map((d) => d.locationName);
        const allDates = Object.values(LOCALE_DEFAULTS).map((d) => d.dateStr);

        const isDefaultTitle = allTitles.includes(prevConfig.titleBlock.text);
        const isDefaultNames = allNames.includes(prevConfig.namesBlock.text);
        const isDefaultLoc = allLocs.includes(prevConfig.locationName);
        const isDefaultDate = allDates.includes(prevConfig.dateBlock.text);

        return {
          ...prevConfig,
          locationName: isDefaultLoc ? nextDef.locationName : prevConfig.locationName,
          latitude: isDefaultLoc ? nextDef.lat : prevConfig.latitude,
          longitude: isDefaultLoc ? nextDef.lng : prevConfig.longitude,
          titleBlock: {
            ...prevConfig.titleBlock,
            text: isDefaultTitle ? nextDef.title : prevConfig.titleBlock.text,
          },
          namesBlock: {
            ...prevConfig.namesBlock,
            text: isDefaultNames ? nextDef.names : prevConfig.namesBlock.text,
          },
          dateBlock: {
            ...prevConfig.dateBlock,
            text: isDefaultDate ? nextDef.dateStr : prevConfig.dateBlock.text,
          },
          locationBlock: {
            ...prevConfig.locationBlock,
            text: isDefaultLoc ? nextDef.locationName.toUpperCase() : prevConfig.locationBlock.text,
          },
          coordsBlock: {
            ...prevConfig.coordsBlock,
            text: isDefaultLoc ? nextDef.coords : prevConfig.coordsBlock.text,
          },
        };
      });
    }
  }, [locale]);

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
              setCurrentView(v);
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            onStartWithPreset={(preset) => {
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
          <FAQ
            onOpenReturnPolicy={() => setIsReturnPolicyOpen(true)}
            onCustomizeStarMap={() => {
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
          <ProductCatalog onCustomizeStarMap={() => {
            setCurrentView('customizer');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }} />
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
        <main className="flex-1 flex flex-col lg:flex-row overflow-x-hidden lg:overflow-hidden relative w-full max-w-full">
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
