'use client';

import React from 'react';
import { Sparkles, Download, Loader2, Compass } from 'lucide-react';
import { PosterSize } from '../types';

interface HeaderProps {
  onExport: () => void;
  isExporting: boolean;
  posterSize: PosterSize;
}

export const Header: React.FC<HeaderProps> = ({ onExport, isExporting, posterSize }) => {
  const pixelDimensions = posterSize === '18x24' ? '5,400 × 7,200 px' : '7,200 × 10,800 px';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B132B]/90 backdrop-blur-md px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-amber-300 p-0.5 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base lg:text-lg font-bold tracking-tight text-white">
              StarCraft <span className="text-sky-400 font-light text-sm">Studio</span>
            </h1>
            <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              300 DPI Vector
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Astronomically Accurate Celestial Posters &bull; Skyfield Engine
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-medium text-slate-300">
            {posterSize}&quot; Poster ({pixelDimensions})
          </span>
          <span className="text-[11px] text-slate-500">
            Print-Ready CMYK-Compliant PDF
          </span>
        </div>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="relative inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg shadow-sky-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
              <span>Rendering 300 DPI PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2 text-white" />
              <span>Export PDF ({posterSize}&quot;)</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
