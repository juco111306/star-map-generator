'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Calendar,
  Type,
  Maximize2,
  Sliders,
  Sparkles,
  Search,
  Check,
  RefreshCw,
  Compass,
  Star,
  Quote,
  Eye,
  EyeOff,
  ChevronDown,
  Wand2,
  Palette,
  Frame,
  Layers,
  Printer,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Circle,
  Heart,
} from 'lucide-react';
import { GOOGLE_FONTS, POPULAR_LOCATIONS } from '../constants/styles';
import { TYPOGRAPHY_PRESETS } from '../constants/presets';
import { DividerStyle, FrameStyle, GeocodeResult, LayoutVariation, MapConfig, PosterSize, TextBlockConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { apiFetch } from '../utils/api';
import { StyleSelector } from './StyleSelector';
import {
  calculatePrice,
  getLocalizedFrameOptions,
  getLocalizedMetricSizes,
  getLocalizedImperialSizes,
} from '../utils/pricing';

interface ConfigPanelProps {
  config: MapConfig;
  onChange: (updates: Partial<MapConfig>) => void;
  onRefreshStars: () => void;
  isLoadingStars: boolean;
  onOpenOrderModal: () => void;
  onInstantExport?: () => void;
  isExporting?: boolean;
  onBackToProducts: () => void;
}

export type StudioTab = 'location' | 'text' | 'font' | 'design' | 'format';

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onChange,
  onRefreshStars,
  isLoadingStars,
  onOpenOrderModal,
  onInstantExport,
  isExporting,
  onBackToProducts,
}) => {
  const { locale, t, formatDate, currency, setCurrency } = useLanguage();
  const [activeTab, setActiveTab] = useState<StudioTab>('location');
  const [searchQuery, setSearchQuery] = useState(config.locationName);
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCustomizingTypography, setIsCustomizingTypography] = useState(false);

  const regionalPopularLocations = React.useMemo(() => {
    if (locale === 'de') {
      return [
        { name: 'Berlin, Deutschland', lat: 52.5200, lon: 13.4050 },
        { name: 'München, Deutschland', lat: 48.1351, lon: 11.5820 },
        { name: 'Hamburg, Deutschland', lat: 53.5511, lon: 9.9937 },
        { name: 'Köln, Deutschland', lat: 50.9375, lon: 6.9603 },
        { name: 'Wien, Österreich', lat: 48.2082, lon: 16.3738 },
        { name: 'Zürich, Schweiz', lat: 47.3769, lon: 8.5417 },
      ];
    }
    if (locale === 'en') {
      return [
        { name: 'London, United Kingdom', lat: 51.5074, lon: -0.1278 },
        { name: 'New York, United States', lat: 40.7128, lon: -74.0060 },
        { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
        { name: 'Amsterdam, Netherlands', lat: 52.3676, lon: 4.9041 },
        { name: 'Dublin, Ireland', lat: 53.3498, lon: -6.2603 },
        { name: 'Edinburgh, United Kingdom', lat: 55.9533, lon: -3.1883 },
      ];
    }
    return POPULAR_LOCATIONS;
  }, [locale]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setGeocodeResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiFetch(`/api/geocode?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setGeocodeResults(data);
          if (data.length > 0) {
            setShowDropdown(true);
          }
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: { name: string; lat: number; lon: number; display_name?: string }) => {
    setSearchQuery(loc.name);
    setShowDropdown(false);

    const latStr = `${Math.abs(loc.lat).toFixed(4)}° ${loc.lat >= 0 ? t.studio.cardinalPoints.n : t.studio.cardinalPoints.s}`;
    const lonStr = `${Math.abs(loc.lon).toFixed(4)}° ${loc.lon >= 0 ? t.studio.cardinalPoints.e : t.studio.cardinalPoints.w}`;

    onChange({
      locationName: loc.name,
      latitude: loc.lat,
      longitude: loc.lon,
      locationBlock: {
        ...config.locationBlock,
        text: loc.name.toUpperCase(),
      },
      coordsBlock: {
        ...config.coordsBlock,
        text: `${latStr} • ${lonStr}`,
      },
    });
  };

  const handleKeyDownSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (geocodeResults.length > 0) {
        handleSelectLocation(geocodeResults[0]);
      }
    }
  };

  const handleApplyPreset = (presetId: string) => {
    const p = TYPOGRAPHY_PRESETS.find((item) => item.id === presetId);
    if (!p) return;

    onChange({
      titleBlock: { ...config.titleBlock, ...p.title },
      namesBlock: { ...config.namesBlock, ...p.names },
      taglineBlock: { ...config.taglineBlock, ...p.tagline },
      dateBlock: { ...config.dateBlock, ...p.date },
      locationBlock: { ...config.locationBlock, ...p.location },
      coordsBlock: { ...config.coordsBlock, ...p.coords },
      dividerStyle: p.divider,
    });
  };

  const updateBlock = (
    key: 'titleBlock' | 'namesBlock' | 'taglineBlock' | 'dateBlock' | 'locationBlock' | 'coordsBlock',
    updates: Partial<TextBlockConfig>
  ) => {
    onChange({
      [key]: {
        ...config[key],
        ...updates,
      },
    });
  };

  const frameOptions = getLocalizedFrameOptions(locale);

  // Region-aware Unit System (Metric vs Imperial)
  const [unitPreference, setUnitPreference] = useState<'cm' | 'in'>('cm');
  const [isUK, setIsUK] = useState(false);

  useEffect(() => {
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        if (data.unit === 'in') {
          setUnitPreference('in');
          if (!['12x18', '18x24', '24x36'].includes(config.posterSize)) {
            onChange({ posterSize: '18x24' });
          }
        }
        if (data.isUK) {
          setIsUK(true);
        }
        if (data.currency && ['USD', 'GBP', 'EUR'].includes(data.currency)) {
          setCurrency(data.currency);
        }
      })
      .catch(() => {
        if (typeof Intl !== 'undefined') {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          if (tz.includes('America') || tz.includes('US') || tz.includes('Canada')) {
            setUnitPreference('in');
            if (!['12x18', '18x24', '24x36'].includes(config.posterSize)) {
              onChange({ posterSize: '18x24' });
            }
          }
          if (tz.includes('London') || tz.includes('Europe/Belfast')) {
            setIsUK(true);
          }
        }
      });
  }, []);

  const handleUnitToggle = (unit: 'cm' | 'in') => {
    setUnitPreference(unit);
    if (unit === 'in' && !['12x18', '18x24', '24x36'].includes(config.posterSize)) {
      onChange({ posterSize: '18x24' });
    } else if (unit === 'cm' && !['30x40', '40x50', '50x70'].includes(config.posterSize)) {
      onChange({ posterSize: '50x70' });
    }
  };

  const activeSizes = unitPreference === 'in'
    ? getLocalizedImperialSizes(locale)
    : getLocalizedMetricSizes(locale, isUK);

  const dividers: { id: DividerStyle; label: string; symbol: string }[] = [
    { id: 'diamond', label: locale === 'de' ? 'Diamant' : locale === 'en' ? 'Diamond' : 'Diamant', symbol: '— ◆ —' },
    { id: 'star', label: locale === 'de' ? 'Stern' : locale === 'en' ? 'Star' : 'Ster', symbol: '— ✦ —' },
    { id: 'heart', label: locale === 'de' ? 'Herz' : locale === 'en' ? 'Heart' : 'Hart', symbol: '— ♥ —' },
    { id: 'dot', label: locale === 'de' ? 'Punkt' : locale === 'en' ? 'Dot' : 'Punt', symbol: '— • —' },
    { id: 'line', label: locale === 'de' ? 'Minimalistische Linie' : locale === 'en' ? 'Minimalist Line' : 'Minimalistische Lijn', symbol: '———' },
    { id: 'none', label: locale === 'de' ? 'Kein' : locale === 'en' ? 'None' : 'Geen', symbol: '—' },
  ];

  const currentPriceDetails = calculatePrice(config.posterSize, config.frameStyle, locale, isUK, currency);

  const layoutVariations: { id: LayoutVariation; label: string; desc: string; badge?: string }[] = [
    {
      id: 'standard_stack',
      label: locale === 'de' ? 'Die Standard-Galerie' : locale === 'en' ? 'The Standard Gallery' : 'De Standaard Galerij',
      desc: t.studio.standardStackDesc,
      badge: locale === 'de' ? 'Beliebt' : locale === 'en' ? 'Popular' : 'Populair',
    },
    {
      id: 'top_title',
      label: locale === 'de' ? 'Titel Oben' : locale === 'en' ? 'Top Title' : 'Titel Bovenaan',
      desc: t.studio.topTitleDesc,
    },
    {
      id: 'curved_border',
      label: locale === 'de' ? 'Gebogene Randschrift' : locale === 'en' ? 'Curved Border' : 'Gebogen Randschrift',
      desc: t.studio.curvedBorderDesc,
    },
    {
      id: 'moon_phases',
      label: locale === 'de' ? 'Die Mondphasen' : locale === 'en' ? 'The Moon Phases' : 'De Maanfasen',
      desc: t.studio.moonPhasesDesc,
      badge: locale === 'de' ? 'Beliebt' : locale === 'en' ? 'Popular' : 'Populair',
    },
    {
      id: 'framed',
      label: locale === 'de' ? 'Galerierahmen (Keyline)' : locale === 'en' ? 'Gallery Frame (Keyline)' : 'Galerijkader (Keyline)',
      desc: t.studio.framedDesc,
    },
  ];

  const stepsList: { id: StudioTab; num: number; title: string; label: string; icon: any }[] = [
    { id: 'location', num: 1, title: t.studio.stepperLocation, label: t.studio.stepperLocation, icon: MapPin },
    { id: 'design', num: 2, title: t.studio.stepperShapeStyle, label: t.studio.stepperShapeStyle, icon: Sparkles },
    { id: 'text', num: 3, title: t.studio.stepperText, label: t.studio.stepperText, icon: Type },
    { id: 'font', num: 4, title: t.studio.stepperTypography, label: t.studio.stepperTypography, icon: Sliders },
    { id: 'format', num: 5, title: t.studio.stepperFormat, label: t.studio.stepperFormat, icon: Maximize2 },
  ];

  const currentStepIdx = stepsList.findIndex((s) => s.id === activeTab);
  const handlePrevStep = () => {
    if (currentStepIdx > 0) setActiveTab(stepsList[currentStepIdx - 1].id);
  };
  const handleNextStep = () => {
    if (currentStepIdx < stepsList.length - 1) setActiveTab(stepsList[currentStepIdx + 1].id);
  };

  return (
    <div className="order-2 lg:order-1 w-full lg:w-[490px] xl:w-[530px] shrink-0 h-auto lg:h-[calc(100vh-65px)] flex flex-col justify-between overflow-y-auto bg-[#FAF8F5] border-r border-[#EAE5DC] p-3.5 sm:p-5 lg:p-6 space-y-6 text-[#1C1917]">
      <div className="space-y-5">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-[#78716C]">
            <button onClick={onBackToProducts} className="hover:text-[#1C1917] transition-colors">
              {t.studio.breadcrumbHome}
            </button>
            <span>/</span>
            <span className="text-[#1C1917] font-medium">{t.studio.breadcrumbProduct}</span>
          </div>

          <button
            onClick={onBackToProducts}
            className="text-xs text-[#A37055] hover:text-[#1C1917] font-medium transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.studio.backToHome}</span>
          </button>
        </div>

        {/* Studio 5-Step Stepper Tabs */}
        <div>
          <div className="grid grid-cols-5 p-1.5 rounded-2xl bg-[#EDE7DE] border border-[#DDD5C7] gap-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
            {stepsList.map((step) => {
              const isCurrent = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveTab(step.id)}
                  className={`group relative py-2.5 px-1 rounded-xl transition-all duration-200 flex flex-col items-center justify-center text-center gap-1.5 min-h-[58px] ${
                    isCurrent
                      ? 'bg-white text-[#1C1917] shadow-sm ring-1 ring-black/5 font-semibold'
                      : 'text-[#6B655F] hover:text-[#1C1917] hover:bg-white/60 font-medium'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold transition-all duration-200 ${
                      isCurrent
                        ? 'bg-[#1C1917] text-[#FAF8F5] shadow-xs'
                        : 'bg-[#DDD5C7] text-[#57534E] group-hover:bg-[#D0C7B9] group-hover:text-[#1C1917]'
                    }`}
                  >
                    {step.num}
                  </span>
                  <span
                    className={`text-[10.5px] sm:text-[11px] leading-tight text-center tracking-tight truncate max-w-full px-0.5 ${
                      isCurrent ? 'font-semibold text-[#1C1917]' : 'font-medium text-[#6B655F]'
                    }`}
                  >
                    {step.title}
                  </span>
                  {/* Active indicator pill at bottom */}
                  {isCurrent && (
                    <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[#A37055]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= STEP 1: LOCATION & TIME ================= */}
        {activeTab === 'location' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Location Search Input */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>{t.studio.stepLocationTitle}</span>
                </span>
                <span className="text-[10px] text-[#A8A29E] font-mono">
                  {config.latitude.toFixed(2)}°, {config.longitude.toFixed(2)}°
                </span>
              </label>

              <div className="relative" ref={dropdownRef}>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDownSearch}
                    placeholder={t.studio.locationSearchPlaceholder}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] transition"
                  />
                  {isSearching && (
                    <RefreshCw className="w-3.5 h-3.5 text-[#A37055] animate-spin absolute right-3.5" />
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && geocodeResults.length > 0 && (
                  <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-[#E2DDD5] rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-[#F2EFE9]">
                    {geocodeResults.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectLocation(r)}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#FAF8F5] text-[#44403C] hover:text-[#1C1917] flex items-center justify-between transition"
                      >
                        <span className="truncate pr-2">{r.display_name}</span>
                        <span className="text-[10px] text-[#A8A29E] font-mono shrink-0">
                          {r.lat.toFixed(2)}°, {r.lon.toFixed(2)}°
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular quick picks */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] text-[#78716C] block font-medium">{t.studio.popularCitiesTitle}</span>
                <div className="flex flex-wrap gap-1.5">
                  {regionalPopularLocations.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => handleSelectLocation(loc)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                        config.locationName.includes(loc.name.split(',')[0])
                          ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917] font-medium'
                          : 'bg-[#FAF8F5] text-[#57534E] border-[#E2DDD5] hover:border-[#1C1917]'
                      }`}
                    >
                      {loc.name.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date and Time Picker */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#A37055]" />
                <span>{t.studio.dateTimeTitle}</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#78716C] block mb-1">{t.studio.dateLabel}</label>
                  <input
                    type="date"
                    value={config.date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      const formattedDate = formatDate(newDate);

                      onChange({
                        date: newDate,
                        dateBlock: {
                          ...config.dateBlock,
                          text: formattedDate ? formattedDate.toUpperCase() : newDate,
                        },
                      });
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#78716C] block mb-1">{t.studio.timeLabel}</label>
                  <input
                    type="time"
                    value={config.time}
                    onChange={(e) => onChange({ time: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#78716C] font-light pt-1">
                {locale === 'de'
                  ? 'Das Skyfield-Astronomiemodell berechnet die exakte Position der Sterne für diesen Zeitpunkt und diese Koordinaten.'
                  : locale === 'en'
                  ? 'The Skyfield astronomy model calculates the exact celestial positions for this moment and coordinates.'
                  : 'Het Skyfield astronomiemodel berekent de exacte stand van de sterren voor dit tijdstip en deze coördinaten.'}
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 2: FORM, ELEMENTS & STYLES ================= */}
        {activeTab === 'design' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 1. Form (Circle or Heart) */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center justify-between">
                <span>1. {t.studio.maskShapeTitle}</span>
                <span className="text-[10px] text-[#A37055]">{locale === 'de' ? 'Kreis oder Herz' : locale === 'en' ? 'Circle or Heart' : 'Cirkel of Hart'}</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onChange({ maskShape: 'circle' })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    (config.maskShape || 'circle') === 'circle'
                      ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                      : 'bg-[#FAF8F5] text-[#1C1917] border-[#E2DDD5] hover:border-[#1C1917]'
                  }`}
                >
                  <Circle className="w-4 h-4 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-semibold block">{t.studio.maskCircle}</span>
                    <span className={`text-[10px] block ${(config.maskShape || 'circle') === 'circle' ? 'text-white/80' : 'text-[#78716C]'}`}>
                      {locale === 'de' ? 'Zeitlose Himmelssphäre' : locale === 'en' ? 'Timeless celestial sphere' : 'Tijdloze hemelbol'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ maskShape: 'heart' })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    config.maskShape === 'heart'
                      ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                      : 'bg-[#FAF8F5] text-[#1C1917] border-[#E2DDD5] hover:border-[#1C1917]'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-semibold block">{t.studio.maskHeart}</span>
                    <span className={`text-[10px] block ${config.maskShape === 'heart' ? 'text-white/80' : 'text-[#78716C]'}`}>
                      {locale === 'de' ? 'Romantische Erinnerung' : locale === 'en' ? 'Romantic keepsake' : 'Romantische herinnering'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Astronomical Elements Toggles */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#A37055]" />
                <span>2. {t.studio.celestialTogglesTitle}</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] cursor-pointer hover:border-[#1C1917] transition">
                  <div>
                    <span className="text-xs font-medium text-[#1C1917] block">
                      {t.studio.toggleMilkyWay}
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      {locale === 'de' ? 'Subtiler kosmischer Sternenstaub' : locale === 'en' ? 'Subtle cosmic stardust' : 'Subtiel kosmisch sterrenstof'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showMilkyWay}
                    onChange={(e) => onChange({ showMilkyWay: e.target.checked })}
                    className="rounded accent-[#1C1917] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] cursor-pointer hover:border-[#1C1917] transition">
                  <div>
                    <span className="text-xs font-medium text-[#1C1917] block">
                      {t.studio.toggleConstellations}
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      {locale === 'de' ? '88 offizielle IAU Sternbilder' : locale === 'en' ? '88 official IAU constellations' : '88 officiële IAU sterrenbeelden'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showConstellationLines}
                    onChange={(e) => onChange({ showConstellationLines: e.target.checked })}
                    className="rounded accent-[#1C1917] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] cursor-pointer hover:border-[#1C1917] transition">
                  <div>
                    <span className="text-xs font-medium text-[#1C1917] block">
                      {t.studio.toggleGrid}
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      {locale === 'de' ? `Äquatoriales Gitter & Himmelsrichtungen (${t.studio.cardinalPoints.n}, ${t.studio.cardinalPoints.s}, ${t.studio.cardinalPoints.w}, ${t.studio.cardinalPoints.e})` : locale === 'en' ? `Equatorial grid & cardinal directions (${t.studio.cardinalPoints.n}, ${t.studio.cardinalPoints.s}, ${t.studio.cardinalPoints.w}, ${t.studio.cardinalPoints.e})` : 'Equatoriaal raster en windrichtingen (N, Z, O, W)'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showCelestialGrid}
                    onChange={(e) => onChange({ showCelestialGrid: e.target.checked })}
                    className="rounded accent-[#1C1917] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 3. Poster Layout Variations */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>3. {locale === 'de' ? 'Poster-Layout Variationen' : locale === 'en' ? 'Poster Layout Variations' : 'Poster Layout Variaties'}</span>
                </span>
                <span className="text-[10px] text-[#A37055] font-medium">5 {locale === 'de' ? 'Stile' : locale === 'en' ? 'Styles' : 'Stijlen'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {layoutVariations.map((lv) => {
                  const isSelected = (config.layoutVariation || 'standard_stack') === lv.id;
                  return (
                    <button
                      key={lv.id}
                      type="button"
                      onClick={() => onChange({ layoutVariation: lv.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                          : 'bg-[#FAF8F5] text-[#1C1917] border-[#E2DDD5] hover:border-[#A37055]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#1C1917]'}`}>
                          {lv.label}
                        </span>
                        {lv.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#A37055]/15 text-[#A37055]'
                          }`}>
                            {lv.badge}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] block leading-tight ${isSelected ? 'text-[#FAF8F5]/80' : 'text-[#78716C]'}`}>
                        {lv.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Art Style & Color Palette */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C]">
                4. {locale === 'de' ? 'Kunststil & Farbpalette' : locale === 'en' ? 'Art Style & Color Palette' : 'Kunststijl & Kleurenpalet'}
              </label>

              <StyleSelector
                selectedStyleId={config.styleId}
                onSelectStyle={(id) => onChange({ styleId: id })}
              />
            </div>
          </div>
        )}

        {/* ================= STEP 3: TEXT & INSCRIPTIONS ================= */}
        {activeTab === 'text' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 1. Main Title */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                  1. {t.studio.titleBlockLabel}
                </span>
                <span className="text-[10px] text-[#A37055]">{locale === 'de' ? 'Primär' : locale === 'en' ? 'Primary' : 'Primair'}</span>
              </div>
              <input
                type="text"
                value={config.titleBlock.text}
                onChange={(e) => updateBlock('titleBlock', { text: e.target.value })}
                placeholder={locale === 'de' ? 'z.B. DIE NACHT, IN DER WIR UNS TRAFEN' : locale === 'en' ? 'e.g. THE NIGHT WE MET' : 'bijv. DE NACHT WAARIN WE ELKAAR VONDEN'}
                className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />

              {/* Suggestions */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-[#78716C] font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>{t.studio.titleSuggestionsTitle}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.studio.titleSuggestions.map((suggestion) => {
                    const isSelected =
                      config.titleBlock.text.trim().toLowerCase() === suggestion.toLowerCase();
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          const formatted = config.titleBlock.uppercase
                            ? suggestion.toUpperCase()
                            : suggestion;
                          updateBlock('titleBlock', { text: formatted });
                        }}
                        className={`text-[10.5px] px-2.5 py-1 rounded-full border transition-all text-left ${
                          isSelected
                            ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917] font-medium shadow-sm'
                            : 'bg-[#FAF8F5] text-[#57534E] border-[#E2DDD5] hover:border-[#1C1917] hover:text-[#1C1917]'
                        }`}
                      >
                        {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Names / Calligraphy (Optional toggle) */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                  2. {t.studio.namesBlockLabel}
                </span>
                <label className="text-[10.5px] font-medium text-[#A37055] flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.namesBlock.enabled}
                    onChange={(e) => updateBlock('namesBlock', { enabled: e.target.checked })}
                    className="rounded accent-[#1C1917] w-3.5 h-3.5"
                  />
                  <span>{locale === 'de' ? 'Namen hinzufügen' : locale === 'en' ? 'Add names' : 'Namen toevoegen'}</span>
                </label>
              </div>

              {config.namesBlock.enabled ? (
                <input
                  type="text"
                  value={config.namesBlock.text}
                  onChange={(e) => updateBlock('namesBlock', { text: e.target.value })}
                  placeholder={t.studio.namesPlaceholder}
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                />
              ) : (
                <p className="text-[11px] text-[#78716C] italic font-light">
                  {locale === 'de' ? 'Namen sind deaktiviert. Aktivieren Sie das Kontrollkästchen für eine elegante Kalligraphie-Inschrift.' : locale === 'en' ? 'Names are disabled. Check the box for an elegant calligraphy inscription.' : 'Namen zijn uitgeschakeld. Vink het vakje aan voor een elegante kalligrafie-inscriptie.'}
                </p>
              )}
            </div>

            {/* 3. Significant Date */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                  3. {t.studio.dateBlockLabel}
                </span>
              </div>
              <input
                type="text"
                value={config.dateBlock.text}
                onChange={(e) => updateBlock('dateBlock', { text: e.target.value })}
                placeholder={locale === 'de' ? 'z.B. 22. SEPTEMBER 2026' : locale === 'en' ? 'e.g. SEPTEMBER 22, 2026' : 'bijv. 22 SEPTEMBER 2026'}
                className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            {/* 4. Location & GPS Coordinates */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide block">
                4. {t.studio.locationBlockLabel} &amp; {t.studio.coordsBlockLabel}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#78716C] block mb-1">{locale === 'de' ? 'Stadt / Ort' : locale === 'en' ? 'City / Location' : 'Stad / Locatie'}</label>
                  <input
                    type="text"
                    value={config.locationBlock.text}
                    onChange={(e) => updateBlock('locationBlock', { text: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#78716C] block mb-1">{locale === 'de' ? 'Koordinaten' : locale === 'en' ? 'Coordinates' : 'Coördinaten'}</label>
                  <input
                    type="text"
                    value={config.coordsBlock.text}
                    onChange={(e) => updateBlock('coordsBlock', { text: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>
            </div>

            {/* 5. Decorative Divider (Style selection only, size adjusted in Step 3) */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                  5. {t.studio.dividerTitle}
                </span>
                <span className="text-[10px] text-[#78716C]">{locale === 'de' ? 'Ornament' : locale === 'en' ? 'Ornament' : 'Ornament'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {dividers.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onChange({ dividerStyle: d.id })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      config.dividerStyle === d.id
                        ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#57534E] border-[#E2DDD5] hover:border-[#1C1917]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{d.symbol}</span>
                    <span className="text-[9px] opacity-75">{d.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10.5px] text-[#78716C] font-light pt-0.5">
                {locale === 'de' ? 'Die Größe des Trennelements kann in Schritt 4 (Typografie) angepasst werden.' : locale === 'en' ? 'The divider size can be adjusted in Step 4 (Typography).' : 'De grootte van het scheidingselement kan worden aangepast in Stap 4 (Typografie).'}
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 4: TYPOGRAPHY & SIZES ================= */}
        {activeTab === 'font' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 1-Click Artisan Presets */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>{t.studio.presetsTitle}</span>
                </span>
                <span className="text-[10px] text-[#A37055]">{locale === 'de' ? '1-Klick' : locale === 'en' ? '1-Click' : '1-Klik'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {TYPOGRAPHY_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p.id)}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E2DDD5] hover:border-[#A37055] text-left transition-all"
                  >
                    <span className="text-xs font-semibold text-[#1C1917] block">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-[#78716C] block mt-0.5 font-light">
                      {p.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ask user before opening detailed font and size controls */}
            {!isCustomizingTypography ? (
              <>
                {/* Studio Curated Pairing Card */}
                <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
                      <span>{locale === 'de' ? 'Atelier Typografie-Harmonie' : locale === 'en' ? 'Atelier Typography Harmony' : 'Atelier Typografie Harmonie'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2EB] text-[#78716C] font-medium">
                      {locale === 'de' ? 'Ausgewogene Proportionen' : locale === 'en' ? 'Balanced Proportions' : 'Gebalanceerde Proporties'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">{locale === 'de' ? 'Titel Schriftart' : locale === 'en' ? 'Title Font' : 'Titel Lettertype'}</span>
                      <span className="font-medium text-[#1C1917] truncate block">{config.titleBlock.font} ({config.titleBlock.size} pt)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">{locale === 'de' ? 'Namen Handschrift' : locale === 'en' ? 'Names Calligraphy' : 'Namen Schrijfletter'}</span>
                      <span className="font-medium text-[#1C1917] truncate block">{config.namesBlock.font} ({config.namesBlock.size} pt)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">{locale === 'de' ? 'Datum Schriftart' : locale === 'en' ? 'Date Font' : 'Datum Lettertype'}</span>
                      <span className="font-medium text-[#1C1917] truncate block">{config.dateBlock.font} ({config.dateBlock.size} pt)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">{locale === 'de' ? 'Trennelement' : locale === 'en' ? 'Divider' : 'Scheidingselement'}</span>
                      <span className="font-medium text-[#1C1917] truncate block">{config.dividerSize || 34} pt</span>
                    </div>
                  </div>
                </div>

                {/* Question / Prompt Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EB] border border-[#E2DDD5] space-y-3.5 shadow-sm text-center">
                  <div className="w-10 h-10 rounded-full bg-[#EFE9DF] text-[#A37055] mx-auto flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-sm font-semibold text-[#1C1917]">
                      {locale === 'de' ? 'Möchten Sie Schriftarten & Größen manuell anpassen?' : locale === 'en' ? 'Would you like to manually customize fonts & sizes?' : 'Wil je lettertypes & groottes handmatig aanpassen?'}
                    </h4>
                    <p className="text-[11.5px] text-[#78716C] font-light max-w-xs mx-auto leading-relaxed">
                      {locale === 'de' ? 'Unsere Atelier-Voreinstellungen sind perfekt abgestimmt für Galeriequalität. Sie können individuelle Regler für Schriftarten, Textgrößen bis 100 pt, Abstände und die Skalierung des Trennelements öffnen.' : locale === 'en' ? 'Our atelier presets are calibrated for gallery quality. You can open individual sliders for fonts, text sizes up to 100 pt, spacing and divider scale.' : 'Onze atelier-instellingen zijn perfect afgestemd voor museumkwaliteit. Je kunt individuele regelaars openen voor lettertypes, tekstgroottes tot 100 pt, spatiëring en de schaal van het scheidingselement.'}
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCustomizingTypography(true)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-xs font-medium hover:bg-[#2C2825] transition-all shadow-sm inline-flex items-center justify-center gap-2"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#D4B59D]" />
                      <span>{locale === 'de' ? 'Ja, Schriften & Größen anpassen' : locale === 'en' ? 'Yes, customize fonts & sizes' : 'Ja, pas lettertypes & groottes aan'}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Active Controls Banner */}
                <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#E2DDD5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#44403C]">
                    <Sliders className="w-4 h-4 text-[#A37055]" />
                    <span className="font-medium">{locale === 'de' ? 'Manuelle Typografie-Regler aktiv' : locale === 'en' ? 'Manual typography controls active' : 'Handmatige typografie-regelaars actief'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomizingTypography(false)}
                    className="text-[11px] text-[#78716C] hover:text-[#1C1917] underline decoration-[#A8A29E] transition"
                  >
                    {locale === 'de' ? 'Regler verbergen' : locale === 'en' ? 'Hide controls' : 'Regelaars verbergen'}
                  </button>
                </div>

                {/* Main Title Typography */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                      {locale === 'de' ? 'Haupttitel Schriftart & Größe' : locale === 'en' ? 'Main Title Font & Size' : 'Hoofdtitel Lettertype & Grootte'}
                    </span>
                    <label className="text-[10px] text-[#78716C] flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.titleBlock.uppercase}
                        onChange={(e) => updateBlock('titleBlock', { uppercase: e.target.checked })}
                        className="rounded accent-[#1C1917] w-3 h-3"
                      />
                      <span>{locale === 'de' ? 'GROSSBUCHSTABEN' : locale === 'en' ? 'UPPERCASE' : 'HOOFDLETTERS'}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#78716C] block mb-1">{locale === 'de' ? 'Schriftart' : locale === 'en' ? 'Font' : 'Lettertype'}</label>
                      <select
                        value={config.titleBlock.font}
                        onChange={(e) => updateBlock('titleBlock', { font: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-lg px-2 py-1.5 text-xs text-[#1C1917] focus:outline-none"
                      >
                        {GOOGLE_FONTS.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#78716C] mb-1">
                        <span>{locale === 'de' ? 'Größe' : locale === 'en' ? 'Size' : 'Grootte'}</span>
                        <span className="text-[#A37055] font-mono">{config.titleBlock.size} pt</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="100"
                        value={config.titleBlock.size}
                        onChange={(e) => updateBlock('titleBlock', { size: Number(e.target.value) })}
                        className="w-full accent-[#1C1917] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#78716C] mb-1">
                        <span>{locale === 'de' ? 'Abstand' : locale === 'en' ? 'Spacing' : 'Spatiëring'}</span>
                        <span className="text-[#A37055] font-mono">{config.titleBlock.tracking} px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        step="0.5"
                        value={config.titleBlock.tracking}
                        onChange={(e) => updateBlock('titleBlock', { tracking: Number(e.target.value) })}
                        className="w-full accent-[#1C1917] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Names Typography (If enabled) */}
                {config.namesBlock.enabled && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                        {locale === 'de' ? 'Namen Schriftart & Größe' : locale === 'en' ? 'Names Font & Size' : 'Namen Lettertype & Grootte'}
                      </span>
                      <label className="text-[10px] text-[#78716C] flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.namesBlock.uppercase}
                          onChange={(e) => updateBlock('namesBlock', { uppercase: e.target.checked })}
                          className="rounded accent-[#1C1917] w-3 h-3"
                        />
                        <span>{locale === 'de' ? 'GROSSBUCHSTABEN' : locale === 'en' ? 'UPPERCASE' : 'HOOFDLETTERS'}</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[#78716C] block mb-1">{locale === 'de' ? 'Schriftart' : locale === 'en' ? 'Font' : 'Lettertype'}</label>
                        <select
                          value={config.namesBlock.font}
                          onChange={(e) => updateBlock('namesBlock', { font: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-lg px-2 py-1.5 text-xs text-[#1C1917] focus:outline-none"
                        >
                          {GOOGLE_FONTS.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-[#78716C] mb-1">
                          <span>{locale === 'de' ? 'Größe' : locale === 'en' ? 'Size' : 'Grootte'}</span>
                          <span className="text-[#A37055] font-mono">{config.namesBlock.size} pt</span>
                        </div>
                        <input
                          type="range"
                          min="16"
                          max="100"
                          value={config.namesBlock.size}
                          onChange={(e) => updateBlock('namesBlock', { size: Number(e.target.value) })}
                          className="w-full accent-[#1C1917] cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-[#78716C] mb-1">
                          <span>{locale === 'de' ? 'Abstand' : locale === 'en' ? 'Spacing' : 'Spatiëring'}</span>
                          <span className="text-[#A37055] font-mono">{config.namesBlock.tracking} px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={config.namesBlock.tracking}
                          onChange={(e) => updateBlock('namesBlock', { tracking: Number(e.target.value) })}
                          className="w-full accent-[#1C1917] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Typography */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                      {locale === 'de' ? 'Datum Schriftart & Größe' : locale === 'en' ? 'Date Font & Size' : 'Datum Lettertype & Grootte'}
                    </span>
                    <label className="text-[10px] text-[#78716C] flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.dateBlock.uppercase}
                        onChange={(e) => updateBlock('dateBlock', { uppercase: e.target.checked })}
                        className="rounded accent-[#1C1917] w-3 h-3"
                      />
                      <span>{locale === 'de' ? 'GROSSBUCHSTABEN' : locale === 'en' ? 'UPPERCASE' : 'HOOFDLETTERS'}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#78716C] block mb-1">{locale === 'de' ? 'Schriftart' : locale === 'en' ? 'Font' : 'Lettertype'}</label>
                      <select
                        value={config.dateBlock.font}
                        onChange={(e) => updateBlock('dateBlock', { font: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-lg px-2 py-1.5 text-xs text-[#1C1917] focus:outline-none"
                      >
                        {GOOGLE_FONTS.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#78716C] mb-1">
                        <span>{locale === 'de' ? 'Größe' : locale === 'en' ? 'Size' : 'Grootte'}</span>
                        <span className="text-[#A37055] font-mono">{config.dateBlock.size} pt</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={config.dateBlock.size}
                        onChange={(e) => updateBlock('dateBlock', { size: Number(e.target.value) })}
                        className="w-full accent-[#1C1917] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#78716C] mb-1">
                        <span>{locale === 'de' ? 'Abstand' : locale === 'en' ? 'Spacing' : 'Spatiëring'}</span>
                        <span className="text-[#A37055] font-mono">{config.dateBlock.tracking} px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={config.dateBlock.tracking}
                        onChange={(e) => updateBlock('dateBlock', { tracking: Number(e.target.value) })}
                        className="w-full accent-[#1C1917] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Decorative Divider Size (Independently adjustable or match date, middle: 34 pt) */}
                {config.dividerStyle !== 'none' && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                        {locale === 'de' ? 'Größe Trennelement' : locale === 'en' ? 'Divider Size' : 'Grootte Scheidingselement'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#A37055] font-mono text-[10px]">{config.dividerSize || 34} pt</span>
                        <button
                          type="button"
                          onClick={() => onChange({ dividerSize: config.dateBlock.size })}
                          className="text-[9.5px] px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E2DDD5] text-[#57534E] hover:text-[#1C1917] hover:border-[#1C1917] transition"
                          title="Stel scheidingselement gelijk aan de datumgrootte"
                        >
                          {locale === 'de' ? 'Wie Datum' : locale === 'en' ? 'Match date' : 'Gelijk aan datum'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <input
                        type="range"
                        min="8"
                        max="60"
                        value={config.dividerSize || 34}
                        onChange={(e) => onChange({ dividerSize: Number(e.target.value) })}
                        className="w-full accent-[#1C1917] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-[#A8A29E]">
                        <span>8 pt ({locale === 'de' ? 'Fein' : locale === 'en' ? 'Fine' : 'Fijn'})</span>
                        <span className="text-[#A37055] font-medium">34 pt ({locale === 'de' ? 'Standard' : locale === 'en' ? 'Standard' : 'Standaard'})</span>
                        <span>60 pt ({locale === 'de' ? 'Groß' : locale === 'en' ? 'Large' : 'Groot'})</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location & Coordinates Typography */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                      {locale === 'de' ? 'Ort & Koordinaten Typografie' : locale === 'en' ? 'Location & Coordinates Typography' : 'Locatie & Coördinaten Typografie'}
                    </span>
                    <label className="text-[10px] text-[#78716C] flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.coordsBlock.uppercase}
                        onChange={(e) => {
                          updateBlock('locationBlock', { uppercase: e.target.checked });
                          updateBlock('coordsBlock', { uppercase: e.target.checked });
                        }}
                        className="rounded accent-[#1C1917] w-3 h-3"
                      />
                      <span>{locale === 'de' ? 'GROSSBUCHSTABEN' : locale === 'en' ? 'UPPERCASE' : 'HOOFDLETTERS'}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#78716C] block mb-1">{locale === 'de' ? 'Schriftart' : locale === 'en' ? 'Font' : 'Lettertype'}</label>
                      <select
                        value={config.coordsBlock.font}
                        onChange={(e) => {
                          updateBlock('locationBlock', { font: e.target.value });
                          updateBlock('coordsBlock', { font: e.target.value });
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-lg px-2 py-1.5 text-xs text-[#1C1917] focus:outline-none"
                      >
                        {GOOGLE_FONTS.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#78716C] mb-1">
                        <span>{locale === 'de' ? 'Koordinaten-Größe' : locale === 'en' ? 'Coordinates Size' : 'Coördinaten Grootte'}</span>
                        <span className="text-[#A37055] font-mono">{config.coordsBlock.size} pt</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="80"
                        value={config.coordsBlock.size}
                        onChange={(e) => updateBlock('coordsBlock', { size: Number(e.target.value) })}
                        className="w-full accent-[#1C1917] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#78716C] mb-1">
                        <span>{locale === 'de' ? 'Ort-Größe' : locale === 'en' ? 'Location Size' : 'Locatie Grootte'}</span>
                        <span className="text-[#A37055] font-mono">{config.locationBlock.size} pt</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="80"
                        value={config.locationBlock.size}
                        onChange={(e) => updateBlock('locationBlock', { size: Number(e.target.value) })}
                        className="w-full accent-[#1C1917] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= STEP 5: FORMAT & PICTURE FRAMING ================= */}
        {activeTab === 'format' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 1. Fulfillment & Framing: Digital, Print Only, or Gelato Wooden Framed */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>
                    {locale === 'de'
                      ? 'Ausführung & Rahmung (Erfahrener Partner)'
                      : locale === 'en'
                      ? 'Crafting & Picture Framing (Master Partner)'
                      : 'Uitvoering & Inlijsting (Ervaren Partner)'}
                  </span>
                </label>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                  {config.frameStyle === 'digital'
                    ? (locale === 'de' ? 'Sofort Digital' : locale === 'en' ? 'Instant Digital' : 'Digitaal Direct')
                    : 'Classic Matte & FSC® Hout'}
                </span>
              </div>

              <p className="text-[11px] text-[#78716C] font-light">
                {locale === 'de'
                  ? 'Gedruckt und mit größter Sorgfalt gerahmt von unserem Partner mit jahrelanger Erfahrung in hochwertigen Qualitätsrahmen auf 200 g/m² Classic Matte Papier, oder wählen Sie eine sofort druckfertige digitale PDF-Datei.'
                  : locale === 'en'
                  ? 'Printed and carefully framed by our master partner with years of framing expertise on 200 gsm Classic Matte paper, or choose an instant print-ready digital vector PDF.'
                  : 'Geprint en met zorg ingelijst door onze partner met jarenlange ervaring en prachtige kwaliteitslijsten op 200 gsm Classic Matte papier, of kies voor een direct print-klaar digitaal PDF bestand.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {frameOptions.map((f) => {
                  const isSelected = config.frameStyle === f.id;
                  const itemPrice = calculatePrice(config.posterSize, f.id, locale, isUK, currency);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onChange({ frameStyle: f.id })}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#F7F4EE] border-[#1C1917] shadow-sm ring-1 ring-[#1C1917]'
                          : 'bg-[#FAF8F5] border-[#E2DDD5] hover:border-[#1C1917]'
                      } ${f.id === 'digital' ? 'sm:col-span-2' : ''}`}
                    >
                      {/* Top Header: Frame Material Swatch & Typography */}
                      <div className="flex items-center gap-2.5 mb-2 min-w-0">
                        {/* Consistent Luxury Atelier Frame & Media Swatch */}
                        <div className="w-9 h-9 rounded-xl bg-[#F0EBE1] border border-[#DDD5C7] flex items-center justify-center shrink-0 shadow-2xs">
                          {f.id === 'digital' ? (
                            <Printer className="w-4 h-4 text-sky-600" />
                          ) : f.id === 'none' ? (
                            <div className="w-4.5 h-6 rounded-[2px] bg-[#0E1526] border border-dashed border-[#A8A29E] flex items-center justify-center shadow-xs">
                              <span className="text-[7px] text-[#A8A29E] leading-none">✦</span>
                            </div>
                          ) : f.id === 'black' ? (
                            <div className="w-5 h-6.5 rounded-[2px] bg-[#0E1526] border-[2.5px] border-[#18181B] flex items-center justify-center shadow-xs">
                              <span className="text-[7px] text-white/90 leading-none">✦</span>
                            </div>
                          ) : f.id === 'oak' ? (
                            <div className="w-5 h-6.5 rounded-[2px] bg-[#0E1526] border-[2.5px] border-[#C8A882] flex items-center justify-center shadow-xs">
                              <span className="text-[7px] text-[#E8DAC3] leading-none">✦</span>
                            </div>
                          ) : (
                            <div className="w-5 h-6.5 rounded-[2px] bg-[#0E1526] border-[2.5px] border-white ring-1 ring-[#D0CAC0] flex items-center justify-center shadow-xs">
                              <span className="text-[7px] text-white/90 leading-none">✦</span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="font-serif font-bold text-xs block text-[#1C1917] truncate leading-tight">
                            {f.label}
                          </span>
                          <span className="text-[10px] text-[#A37055] font-medium block truncate mt-0.5">
                            {f.sub}
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-[#78716C] font-light leading-snug my-1.5 line-clamp-2">
                        {f.desc}
                      </p>

                      {/* Bottom Footer: Badge & Safe Contained Pricing (Never overflows) */}
                      <div className="mt-2 pt-2 border-t border-[#ECE7DE] flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white border border-[#E2DDD5] text-[#57534E] shrink-0 truncate max-w-[110px]">
                            {f.badge || (locale === 'de' ? 'Verfügbar' : locale === 'en' ? 'Available' : 'Beschikbaar')}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-semibold text-[#1C1917] flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3 text-[#1C1917]" />
                              <span className="hidden sm:inline text-[9.5px]">
                                {locale === 'de' ? 'Ausgewählt' : locale === 'en' ? 'Selected' : 'Geselecteerd'}
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0 whitespace-nowrap pl-1">
                          <span className="text-xs font-bold text-[#1C1917]">{itemPrice.formattedPrice}</span>
                          {itemPrice.formattedOriginalPrice && (
                            <span className="text-[9px] text-[#A8A29E] line-through ml-1">{itemPrice.formattedOriginalPrice}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Region-Aware Sizing with cm / in Toggle */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>
                    {unitPreference === 'in'
                      ? (locale === 'de' ? 'Postergröße (Zoll)' : locale === 'en' ? 'Poster Size (Inches)' : 'Posterformaat (Inches)')
                      : (locale === 'de' ? 'Postergröße (Metrisch)' : locale === 'en' ? 'Poster Size (Metric)' : 'Posterformaat (Metrisch)')}
                  </span>
                </label>

                {/* Subtle Luxury Unit Switcher */}
                <div className="inline-flex items-center p-0.5 rounded-lg bg-[#EFECE6] border border-[#E2DDD5] text-[10.5px] font-medium">
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('cm')}
                    className={`px-2.5 py-0.5 rounded-md transition-all ${
                      unitPreference === 'cm'
                        ? 'bg-white text-[#1C1917] shadow-xs font-bold'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('in')}
                    className={`px-2.5 py-0.5 rounded-md transition-all ${
                      unitPreference === 'in'
                        ? 'bg-white text-[#1C1917] shadow-xs font-bold'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    in
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#78716C] font-light">
                {config.frameStyle === 'digital'
                  ? (locale === 'de'
                      ? 'Die druckfertige Vektor-PDF-Datei ist ohne Qualitätsverlust auf jedes Format skalierbar.'
                      : locale === 'en'
                      ? 'The print-ready vector PDF file is scalable to any format without loss of quality.'
                      : 'Het print-klare vector PDF bestand is schaalbaar naar elk formaat zonder kwaliteitsverlies.')
                  : unitPreference === 'in'
                  ? (locale === 'de'
                      ? 'Standardmäßige US-Galeriegrößen in Zoll, passgenau für gängige Rahmen in den USA & Kanada.'
                      : locale === 'en'
                      ? 'Standard North American gallery sizes in inches, fitting US frames (Target, Michaels, Amazon US).'
                      : 'Standaard Noord-Amerikaanse formaten in inches, passend voor universele lijsten.')
                  : isUK
                  ? 'Standard UK gallery sizes (cm & inches), fitting IKEA and UK high-street frames.'
                  : (locale === 'de'
                      ? 'Standardmäßige europäische Galeriegrößen in cm, passgenau für Rahmen (z. B. IKEA) und Wände.'
                      : locale === 'en'
                      ? 'Standard European gallery sizes in cm, fitting frames (e.g. IKEA) and wall spaces perfectly.'
                      : 'Standaard Europese galerijmaten in cm, perfect passend voor lijsten (zoals IKEA) en muren.')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeSizes.map((fo) => {
                  const isSelected = config.posterSize === fo.id;
                  const sizePrice = calculatePrice(fo.id, config.frameStyle, locale, isUK, currency);
                  return (
                    <button
                      key={fo.id}
                      type="button"
                      onClick={() => onChange({ posterSize: fo.id })}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917] shadow-sm'
                          : 'bg-[#FAF8F5] text-[#57534E] border-[#E2DDD5] hover:border-[#1C1917]'
                      }`}
                    >
                      {/* Top Row: Dimensions and Price firmly contained */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-serif font-bold text-xs block truncate min-w-0 flex-1">{fo.label}</span>
                        <span className={`text-xs font-bold shrink-0 whitespace-nowrap pl-1 ${isSelected ? 'text-[#FAF8F5]' : 'text-[#1C1917]'}`}>
                          {sizePrice.formattedPrice}
                        </span>
                      </div>

                      {/* Bottom Row: Subtitle & Popular Badge */}
                      <div className="flex items-center justify-between gap-1 mt-1 pt-1.5 border-t border-current/10">
                        <span className="text-[10px] opacity-80 truncate block">{fo.sub}</span>
                        {fo.popular && (
                          <span className={`text-[8.5px] px-1 py-0.5 rounded font-medium shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#A37055]/15 text-[#A37055]'
                          }`}>
                            {locale === 'de' ? 'Beliebt' : locale === 'en' ? 'Popular' : 'Populair'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Passe-Partout Matting */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] shadow-sm">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-[#1C1917] block">
                    {locale === 'de' ? 'Museums-Passepartout-Rand' : locale === 'en' ? 'Museum Passe-Partout Border' : 'Museum Passe-Partout Rand'}
                  </span>
                  <span className="text-[10px] text-[#78716C]">
                    {locale === 'de'
                      ? 'Reinweißer Galerierand mit verfeinerter, subtiler Innenlinie'
                      : locale === 'en'
                      ? 'Crisp white gallery border with a refined, subtle inner line'
                      : 'Helderwitte galerierand met verfijnde subtiele binnenlijn'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showMattedBorder}
                  onChange={(e) => onChange({ showMattedBorder: e.target.checked })}
                  className="rounded accent-[#1C1917] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          {currentStepIdx > 0 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="py-2 px-3 rounded-xl border border-[#D6D0C7] text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-white transition flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{t.studio.prevStep}</span>
            </button>
          ) : <div />}

          {currentStepIdx < stepsList.length - 1 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="py-2 px-3.5 rounded-xl bg-[#1C1917] text-white text-xs font-medium hover:bg-[#2E2A27] transition flex items-center gap-1 shadow-sm"
            >
              <span>{t.studio.nextStep}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Card */}
      <div className="pt-4 border-t border-[#EAE5DC] space-y-3 bg-[#FAF8F5]">
        <div className="flex items-center justify-between text-xs text-[#78716C] px-1 gap-2">
          <div className="flex items-center gap-1.5 truncate min-w-0 flex-1">
            <span className="font-semibold text-[#1C1917] truncate">{currentPriceDetails.typeLabel}</span>
            <span className="shrink-0">•</span>
            <span className="text-[#57534E] truncate shrink-0">{config.frameStyle === 'digital' ? 'PDF 300 DPI' : `${config.posterSize.replace('x', ' × ')} cm`}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span className="text-[11px] text-[#A8A29E] line-through">{currentPriceDetails.formattedOriginalPrice}</span>
            <strong className="text-sm font-bold text-[#1C1917]">{currentPriceDetails.formattedPrice}</strong>
          </div>
        </div>

        <div>
          {/* Primary Order Action Button */}
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="w-full py-3.5 px-3 rounded-xl bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-semibold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 truncate"
          >
            <span className="truncate">{t.studio.orderButton} ({currentPriceDetails.formattedPrice})</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
