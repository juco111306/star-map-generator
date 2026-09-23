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
import { StyleSelector } from './StyleSelector';
import { apiFetch } from '../utils/api';

interface ConfigPanelProps {
  config: MapConfig;
  onChange: (updates: Partial<MapConfig>) => void;
  onRefreshStars: () => void;
  isLoadingStars: boolean;
  onOpenOrderModal: () => void;
  onInstantExport: () => void;
  isExporting: boolean;
  onBackToProducts: () => void;
}

export type StudioTab = 'location' | 'text' | 'font' | 'design' | 'format';

const TITLE_SUGGESTIONS = [
  "The Night We Met",
  "De nacht dat onze sterren samenkwamen",
  "De nacht waarin we 'Ja' zeiden",
  "Toen een ster werd geboren",
  "Het begin van ons avontuur",
  "Onder deze hemel",
];

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
  const [activeTab, setActiveTab] = useState<StudioTab>('location');
  const [searchQuery, setSearchQuery] = useState(config.locationName);
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCustomizingTypography, setIsCustomizingTypography] = useState(false);
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

    const latStr = `${Math.abs(loc.lat).toFixed(4)}° ${loc.lat >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(loc.lon).toFixed(4)}° ${loc.lon >= 0 ? 'E' : 'W'}`;

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

  const dividers: { id: DividerStyle; label: string; symbol: string }[] = [
    { id: 'diamond', label: 'Diamant', symbol: '— ◆ —' },
    { id: 'star', label: 'Ster', symbol: '— ✦ —' },
    { id: 'heart', label: 'Hart', symbol: '— ♥ —' },
    { id: 'dot', label: 'Punt', symbol: '— • —' },
    { id: 'line', label: 'Minimalistische Lijn', symbol: '———' },
    { id: 'none', label: 'Geen', symbol: 'Geen' },
  ];

  const frames: {
    id: FrameStyle;
    label: string;
    sub: string;
    desc: string;
    borderStyle: string;
    bgStyle: string;
    innerBg: string;
  }[] = [
    {
      id: 'none',
      label: 'Zonder Lijst (Print)',
      sub: 'Archiefpapier 285 gsm',
      desc: '300 DPI museumkwaliteit fine-art print, klaar om zelf in te lijsten',
      borderStyle: 'border-dashed border-[#C5BFB5]',
      bgStyle: 'bg-white',
      innerBg: 'bg-[#2E3440]',
    },
    {
      id: 'black',
      label: 'Slank Mat Zwart',
      sub: 'Dun 8 mm Profiel',
      desc: 'Strak galerij-aluminium met ontspiegeld kristalglas',
      borderStyle: 'border-[3px] border-[#181716]',
      bgStyle: 'bg-[#181716]',
      innerBg: 'bg-[#0E1526]',
    },
    {
      id: 'oak',
      label: 'Slank Scandinavisch Eiken',
      sub: 'Dun 8 mm Profiel',
      desc: 'Massief natuurlijk eikenhout met een warme, verfijnde houtnerf',
      borderStyle: 'border-[3px] border-[#A27344]',
      bgStyle: 'bg-[#A27344]',
      innerBg: 'bg-[#0E1526]',
    },
    {
      id: 'white',
      label: 'Slank Galerij Wit',
      sub: 'Dun 8 mm Profiel',
      desc: 'Zacht satijnwit museumprofiel voor lichte en minimalistische interieurs',
      borderStyle: 'border-[3px] border-[#E8E4DC] ring-1 ring-[#D0CAC0]',
      bgStyle: 'bg-white',
      innerBg: 'bg-[#0E1526]',
    },
  ];

  const layoutVariations: { id: LayoutVariation; label: string; desc: string; badge?: string }[] = [
    { id: 'standard_stack', label: 'De Standaard Galerij', desc: 'Klassieke tijdloze tekststapel onder de sterrenkaart', badge: 'Populair' },
    { id: 'top_title', label: 'Titel Bovenaan', desc: 'Hoofdtitel bovenaan, sterrenhemel gecentreerd' },
    { id: 'curved_border', label: 'Gebogen Randschrift', desc: 'Titel buigt sierlijk langs de buitenrand van de cirkel' },
    { id: 'moon_phases', label: 'De Maanfasen', desc: '7 opeenvolgende maanstanden als elegant scheidingselement', badge: 'Populair' },
    { id: 'framed', label: 'Galerijkader (Keyline)', desc: 'Verfijnde dubbele binnenrand en passe-partout belijning' },
  ];

  const formatOptions: { id: PosterSize; label: string; sub: string; aspect: string; popular?: boolean }[] = [
    { id: '20x30', label: '20 × 30 cm', sub: 'Compact Aandenken (2:3)', aspect: '2:3' },
    { id: '30x40', label: '30 × 40 cm', sub: 'Klassieke Galerij (3:4)', aspect: '3:4', popular: true },
    { id: '40x50', label: '40 × 50 cm', sub: 'Medium Statement (4:5)', aspect: '4:5' },
    { id: '50x70', label: '50 × 70 cm', sub: 'Groot Kunstformaat (5:7)', aspect: '5:7', popular: true },
    { id: '18x24', label: '18 × 24 in', sub: '45 × 60 cm (3:4)', aspect: '3:4' },
    { id: '24x36', label: '24 × 36 in', sub: '60 × 90 cm (2:3)', aspect: '2:3' },
  ];

  const stepsList: { id: StudioTab; label: string; icon: any }[] = [
    { id: 'location', label: '1. Locatie & Tijd', icon: MapPin },
    { id: 'design', label: '2. Vorm & Stijl', icon: Sparkles },
    { id: 'text', label: '3. Tekst', icon: Type },
    { id: 'font', label: '4. Typografie', icon: Sliders },
    { id: 'format', label: '5. Formaat & Lijst', icon: Maximize2 },
  ];

  const currentStepIdx = stepsList.findIndex((s) => s.id === activeTab);
  const handlePrevStep = () => {
    if (currentStepIdx > 0) setActiveTab(stepsList[currentStepIdx - 1].id);
  };
  const handleNextStep = () => {
    if (currentStepIdx < stepsList.length - 1) setActiveTab(stepsList[currentStepIdx + 1].id);
  };

  return (
    <div className="order-2 lg:order-1 w-full lg:w-[490px] xl:w-[530px] shrink-0 h-auto lg:h-[calc(100vh-65px)] flex flex-col justify-between overflow-y-auto bg-[#FAF8F5] border-r border-[#EAE5DC] p-5 lg:p-6 space-y-6 text-[#1C1917]">
      <div className="space-y-5">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-[#78716C]">
            <button onClick={onBackToProducts} className="hover:text-[#1C1917] transition-colors">
              Overzicht
            </button>
            <span>/</span>
            <span className="text-[#1C1917] font-medium">Gepersonaliseerde Sterrenposter</span>
          </div>

          <button
            onClick={onBackToProducts}
            className="text-xs text-[#A37055] hover:text-[#1C1917] font-medium transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Terug naar Home</span>
          </button>
        </div>

        {/* Product Heading Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-semibold tracking-widest text-[#A37055]">
                Gepersonaliseerde Sterrenkaart
              </span>
              <h2 className="font-serif text-xl font-normal text-[#1C1917] tracking-wide">
                De Sterrenposter
              </h2>
            </div>
            <div className="text-right">
              <span className="text-base font-semibold text-[#1C1917]">€49,00</span>
              <span className="text-[10px] text-[#78716C] block">300 DPI Archiefkwaliteit</span>
            </div>
          </div>
        </div>

        {/* Studio Step Tabs */}
        <div className="flex p-1 rounded-xl bg-[#F0EBE1] border border-[#E5DFD4] gap-1 text-xs overflow-x-auto">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeTab === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveTab(step.id)}
                className={`flex-1 min-w-[70px] py-2 px-1.5 rounded-lg transition-all font-medium flex items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-white text-[#1C1917] shadow-sm'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-[#A37055]' : ''}`} />
                <span className="truncate text-[11px]">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= STEP 1: LOCATION & TIME ================= */}
        {activeTab === 'location' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Location Search Input */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>Kies Jouw Locatie</span>
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
                    placeholder="Zoek stad, adres of bezienswaardigheid..."
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
                <span className="text-[10.5px] text-[#78716C] block font-medium">Populaire Steden in NL & BE:</span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_LOCATIONS.map((loc) => (
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
                <span>Datum & Tijdstip</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#78716C] block mb-1">Datum</label>
                  <input
                    type="date"
                    value={config.date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      const dObj = new Date(newDate);
                      const monthNames = [
                        'JANUARI', 'FEBRUARI', 'MAART', 'APRIL', 'MEI', 'JUNI',
                        'JULI', 'AUGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DECEMBER',
                      ];
                      const formattedDate = !isNaN(dObj.getTime())
                        ? `${dObj.getUTCDate()} ${monthNames[dObj.getUTCMonth()]} ${dObj.getUTCFullYear()}`
                        : newDate;

                      onChange({
                        date: newDate,
                        dateBlock: {
                          ...config.dateBlock,
                          text: formattedDate,
                        },
                      });
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#78716C] block mb-1">Tijdstip</label>
                  <input
                    type="time"
                    value={config.time}
                    onChange={(e) => onChange({ time: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#78716C] font-light pt-1">
                Het Skyfield astronomiemodel berekent de exacte stand van de sterren voor dit tijdstip en deze coördinaten.
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
                <span>1. Kaartsilhouet & Vorm</span>
                <span className="text-[10px] text-[#A37055]">Cirkel of Hart</span>
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
                    <span className="text-xs font-semibold block">Klassieke Cirkel</span>
                    <span className={`text-[10px] block ${(config.maskShape || 'circle') === 'circle' ? 'text-white/80' : 'text-[#78716C]'}`}>
                      Tijdloze hemelbol
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
                    <span className="text-xs font-semibold block">Hartvormig Silhouet</span>
                    <span className={`text-[10px] block ${config.maskShape === 'heart' ? 'text-white/80' : 'text-[#78716C]'}`}>
                      Romantische herinnering
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Astronomical Elements Toggles */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#A37055]" />
                <span>2. Astronomische Elementen</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] cursor-pointer hover:border-[#1C1917] transition">
                  <div>
                    <span className="text-xs font-medium text-[#1C1917] block">
                      Melkweg Nevel
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      Subtiel kosmisch sterrenstof
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
                      Sterrenbeelden & Lijnen
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      88 officiële IAU sterrenbeelden
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
                      Hemelcoördinaten & Kompas
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      Equatoriaal raster en windrichtingen (N, Z, O, W)
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
                  <span>3. Poster Layout Variaties</span>
                </span>
                <span className="text-[10px] text-[#A37055] font-medium">5 Stijlen</span>
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
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center justify-between">
                <span>4. Kunststijl & Kleurenpalet</span>
                <span className="text-[10px] text-[#A37055]">5 Samengestelde Stijlen</span>
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
                  1. Hoofdtitel Inscriptie
                </span>
                <span className="text-[10px] text-[#A37055]">Primair</span>
              </div>
              <input
                type="text"
                value={config.titleBlock.text}
                onChange={(e) => updateBlock('titleBlock', { text: e.target.value })}
                placeholder="bijv. DE NACHT WAARIN WE ELKAAR VONDEN"
                className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />

              {/* Suggestions */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-[#78716C] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#A37055]" />
                  <span>Populaire Inscriptie Suggesties:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TITLE_SUGGESTIONS.map((suggestion) => {
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
                  2. Namen / Kalligrafie
                </span>
                <label className="text-[10.5px] font-medium text-[#A37055] flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.namesBlock.enabled}
                    onChange={(e) => updateBlock('namesBlock', { enabled: e.target.checked })}
                    className="rounded accent-[#1C1917] w-3.5 h-3.5"
                  />
                  <span>Namen toevoegen</span>
                </label>
              </div>

              {config.namesBlock.enabled ? (
                <input
                  type="text"
                  value={config.namesBlock.text}
                  onChange={(e) => updateBlock('namesBlock', { text: e.target.value })}
                  placeholder="bijv. Emma & Daan"
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                />
              ) : (
                <p className="text-[11px] text-[#78716C] italic font-light">
                  Namen zijn uitgeschakeld. Vink het vakje aan voor een elegante kalligrafie-inscriptie.
                </p>
              )}
            </div>

            {/* 3. Significant Date */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                  3. Betekenisvolle Datum
                </span>
              </div>
              <input
                type="text"
                value={config.dateBlock.text}
                onChange={(e) => updateBlock('dateBlock', { text: e.target.value })}
                placeholder="bijv. 22 SEPTEMBER 2026"
                className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            {/* 4. Location & GPS Coordinates */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
              <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide block">
                4. Locatie & GPS Coördinaten
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#78716C] block mb-1">Stad / Locatie</label>
                  <input
                    type="text"
                    value={config.locationBlock.text}
                    onChange={(e) => updateBlock('locationBlock', { text: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#78716C] block mb-1">Coördinaten</label>
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
                  5. Decoratief Scheidingselement
                </span>
                <span className="text-[10px] text-[#78716C]">Ornament</span>
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
                De grootte van het scheidingselement kan worden aangepast in Stap 4 (Typografie).
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
                  <span>Ambachtelijke Typografie Voorinstellingen</span>
                </span>
                <span className="text-[10px] text-[#A37055]">1-Klik</span>
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
                      <span>Atelier Typografie Harmonie</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2EB] text-[#78716C] font-medium">
                      Gebalanceerde Proporties
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Titel Lettertype</span>
                      <span className="font-medium text-[#1C1917] truncate block">{config.titleBlock.font} ({config.titleBlock.size} pt)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Namen Schrijfletter</span>
                      <span className="font-medium text-[#1C1917] truncate block">{config.namesBlock.font} ({config.namesBlock.size} pt)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Datum Lettertype</span>
                      <span className="font-medium text-[#1C1917] truncate block">{config.dateBlock.font} ({config.dateBlock.size} pt)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Scheidingselement</span>
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
                      Wil je lettertypes & groottes handmatig aanpassen?
                    </h4>
                    <p className="text-[11.5px] text-[#78716C] font-light max-w-xs mx-auto leading-relaxed">
                      Onze atelier-instellingen zijn perfect afgestemd voor museumkwaliteit. Je kunt individuele regelaars openen voor lettertypes, tekstgroottes tot 100 pt, spatiëring en de schaal van het scheidingselement.
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCustomizingTypography(true)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-xs font-medium hover:bg-[#2C2825] transition-all shadow-sm inline-flex items-center justify-center gap-2"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#D4B59D]" />
                      <span>Ja, pas lettertypes & groottes aan</span>
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
                    <span className="font-medium">Handmatige typografie-regelaars actief</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomizingTypography(false)}
                    className="text-[11px] text-[#78716C] hover:text-[#1C1917] underline decoration-[#A8A29E] transition"
                  >
                    Regelaars verbergen
                  </button>
                </div>

                {/* Main Title Typography */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                      Hoofdtitel Lettertype & Grootte
                    </span>
                    <label className="text-[10px] text-[#78716C] flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.titleBlock.uppercase}
                        onChange={(e) => updateBlock('titleBlock', { uppercase: e.target.checked })}
                        className="rounded accent-[#1C1917] w-3 h-3"
                      />
                      <span>HOOFDLETTERS</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#78716C] block mb-1">Lettertype</label>
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
                        <span>Grootte</span>
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
                        <span>Spatiëring</span>
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
                        Namen Lettertype & Grootte
                      </span>
                      <label className="text-[10px] text-[#78716C] flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.namesBlock.uppercase}
                          onChange={(e) => updateBlock('namesBlock', { uppercase: e.target.checked })}
                          className="rounded accent-[#1C1917] w-3 h-3"
                        />
                        <span>HOOFDLETTERS</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[#78716C] block mb-1">Lettertype</label>
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
                          <span>Grootte</span>
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
                          <span>Spatiëring</span>
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
                      Datum Lettertype & Grootte
                    </span>
                    <label className="text-[10px] text-[#78716C] flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.dateBlock.uppercase}
                        onChange={(e) => updateBlock('dateBlock', { uppercase: e.target.checked })}
                        className="rounded accent-[#1C1917] w-3 h-3"
                      />
                      <span>HOOFDLETTERS</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#78716C] block mb-1">Lettertype</label>
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
                        <span>Grootte</span>
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
                        <span>Spatiëring</span>
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
                        Grootte Scheidingselement
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#A37055] font-mono text-[10px]">{config.dividerSize || 34} pt</span>
                        <button
                          type="button"
                          onClick={() => onChange({ dividerSize: config.dateBlock.size })}
                          className="text-[9.5px] px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E2DDD5] text-[#57534E] hover:text-[#1C1917] hover:border-[#1C1917] transition"
                          title="Stel scheidingselement gelijk aan de datumgrootte"
                        >
                          Gelijk aan datum
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
                        <span>8 pt (Fijn)</span>
                        <span className="text-[#A37055] font-medium">34 pt (Standaard)</span>
                        <span>60 pt (Groot)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location & Coordinates Typography */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF] space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">
                      Locatie & Coördinaten Typografie
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
                      <span>HOOFDLETTERS</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#78716C] block mb-1">Lettertype</label>
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
                        <span>Coördinaten Grootte</span>
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
                        <span>Locatie Grootte</span>
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
            {/* Formats: 20x30, 30x40, 40x50, 50x70 cm */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>Posterformaat (Metrische Standaarden)</span>
                </label>
                <span className="text-[10px] text-[#A37055] font-medium">300 DPI Archiefkwaliteit</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {formatOptions.map((fo) => {
                  const isSelected = config.posterSize === fo.id;
                  return (
                    <button
                      key={fo.id}
                      type="button"
                      onClick={() => onChange({ posterSize: fo.id })}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917] shadow-sm'
                          : 'bg-[#FAF8F5] text-[#57534E] border-[#E2DDD5] hover:border-[#1C1917]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs block">{fo.label}</span>
                        {fo.popular && (
                          <span className={`text-[8.5px] px-1 py-0.5 rounded font-medium ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#A37055]/15 text-[#A37055]'
                          }`}>
                            Populair
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] opacity-80 block mt-0.5">{fo.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thin Professional Picture Framing */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE7DF] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
                  <span>Slanke Professionele Wissellijsten</span>
                </label>
                <span className="text-[10px] text-[#A37055] font-medium">8 mm Galerieprofiel</span>
              </div>

              <p className="text-[11px] text-[#78716C] font-light">
                Museumkwaliteit ultra-slanke 8 mm profielen met ontspiegeld mineraalglas, vakkundig met de hand ingelijst.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {frames.map((f) => {
                  const isSelected = config.frameStyle === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onChange({ frameStyle: f.id })}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#F7F4EE] border-[#1C1917] shadow-sm ring-1 ring-[#1C1917]'
                          : 'bg-[#FAF8F5] border-[#E2DDD5] hover:border-[#1C1917]'
                      }`}
                    >
                      {/* Mini Visual Frame Mockup Example */}
                      <div className="flex items-center justify-center py-2.5 mb-2 bg-[#F0ECE1] rounded-lg">
                        <div className={`w-11 h-15 rounded-[3px] shadow-md flex items-center justify-center transition-all ${f.borderStyle}`}>
                          <div className={`w-full h-full flex flex-col items-center justify-center p-1 relative overflow-hidden ${f.innerBg}`}>
                            {/* Visual art representation inside frame */}
                            <div className="w-6 h-6 rounded-full border border-white/35 flex items-center justify-center">
                              <span className="text-[7px] text-white/70">✦</span>
                            </div>
                            <div className="w-5 h-0.5 bg-white/40 mt-1 rounded-full" />
                            <div className="w-3 h-0.5 bg-white/25 mt-0.5 rounded-full" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs block text-[#1C1917]">{f.label}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#1C1917]" />
                          )}
                        </div>
                        <span className="text-[9.5px] font-semibold text-[#A37055] block mt-0.5">{f.sub}</span>
                        <span className="text-[9.5px] text-[#78716C] block leading-tight mt-1">{f.desc}</span>
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
                    Museum Passe-Partout Rand
                  </span>
                  <span className="text-[10px] text-[#78716C]">
                    Helderwitte galerierand met verfijnde subtiele binnenlijn
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
              <span>Vorige stap</span>
            </button>
          ) : <div />}

          {currentStepIdx < stepsList.length - 1 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="py-2 px-3.5 rounded-xl bg-[#1C1917] text-white text-xs font-medium hover:bg-[#2E2A27] transition flex items-center gap-1 shadow-sm"
            >
              <span>Volgende stap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Card */}
      <div className="pt-4 border-t border-[#EAE5DC] space-y-3 bg-[#FAF8F5]">
        <div className="flex items-center justify-between text-xs text-[#78716C] px-1">
          <span>Formaat: <strong className="text-[#1C1917]">{config.posterSize.replace('x', ' × ')} cm</strong></span>
          <span className="text-[#A37055] font-medium">300 DPI Archiefkwaliteit</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick PDF Proof Preview */}
          <button
            type="button"
            onClick={onInstantExport}
            disabled={isExporting}
            className="flex-1 py-3 rounded-xl bg-white hover:bg-[#F2EDE4] border border-[#D6D0C7] text-[#1C1917] font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 shadow-sm"
            title="Download direct een proefdruk PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#A37055]" />
            <span>{isExporting ? 'Genereren...' : 'Proefdruk PDF'}</span>
          </button>

          {/* Primary Order Action Button */}
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="flex-[2] py-3 rounded-xl bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] font-semibold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition transform hover:-translate-y-0.5"
          >
            <span>Bestellen & Drukken</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
