'use client';

import React, { useState, useEffect } from 'react';
import { Globe, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Locale } from '../locales';

export const GeoLanguageBanner: React.FC = () => {
  const { locale, changeLocale } = useLanguage();
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // 1. If user has ever manually chosen a language or dismissed the prompt, NEVER show banner
    if (typeof window !== 'undefined') {
      if (
        sessionStorage.getItem('stellaire_geo_dismissed') ||
        localStorage.getItem('stellaire_user_manual_locale')
      ) {
        return;
      }
    }

    // Check client browser language
    const browserLang = navigator.language?.toLowerCase() || '';
    let detected: Locale | null = null;

    if (browserLang.startsWith('de') && locale !== 'de') {
      detected = 'de';
    } else if (browserLang.startsWith('nl') && locale !== 'nl') {
      detected = 'nl';
    } else if (browserLang.startsWith('en') && locale !== 'en') {
      detected = 'en';
    }

    if (detected) {
      setSuggestedLocale(detected);
      setDismissed(false);
    }
  }, [locale]);

  if (dismissed || !suggestedLocale || suggestedLocale === locale) {
    return null;
  }

  const messages: Record<Locale, { prompt: string; action: string }> = {
    de: {
      prompt: 'Sie besuchen derzeit eine andere Sprachversion. Möchten Sie zu Deutsch wechseln?',
      action: 'Zu Deutsch wechseln (DE)',
    },
    nl: {
      prompt: 'Je bezoekt een andere taalversie. Wil je overschakelen naar het Nederlands?',
      action: 'Naar Nederlands (NL)',
    },
    en: {
      prompt: 'You are viewing another regional version. Would you like to switch to English?',
      action: 'Switch to English (EN)',
    },
  };

  const currentMsg = messages[suggestedLocale];

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('stellaire_geo_dismissed', 'true');
      localStorage.setItem('stellaire_user_manual_locale', 'true');
    } catch {}
  };

  const handleSwitch = () => {
    if (suggestedLocale) {
      changeLocale(suggestedLocale);
    }
    handleDismiss();
  };

  return (
    <div className="bg-[#1C1917] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#38332E] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#E6C285] shrink-0" />
          <span className="font-light text-[11px] sm:text-xs text-[#E8E2D7]">
            {currentMsg.prompt}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSwitch}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E6C285] text-[#1C1917] font-semibold text-[11px] hover:bg-white transition-colors"
          >
            <span>{currentMsg.action}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-[#A8A29E] hover:text-white transition-colors"
            title="Sluiten"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
