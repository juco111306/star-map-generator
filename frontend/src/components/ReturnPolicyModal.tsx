'use client';

import React from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Truck,
  AlertCircle,
  X,
  Mail,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ReturnPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReturnPolicyModal: React.FC<ReturnPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const pol = t.returnPolicy;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E2DDD5] rounded-3xl shadow-2xl overflow-hidden my-8 text-[#1C1917] animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#F5F2EB] border-b border-[#E8E4DC] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DDD5] flex items-center justify-center text-[#1C1917] shadow-sm">
              <RotateCcw className="w-4 h-4 text-[#A37055]" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1C1917] tracking-wide flex items-center gap-2">
                <span>{pol.modalTitle}</span>
              </h3>
              <p className="text-[11px] text-[#78716C]">
                {pol.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white transition"
            aria-label="Sluiten"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Guarantee Summary Banner */}
          <div className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#DDD6C8] flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#1C1917] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#E6C285]" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-semibold text-[#1C1917]">
                {pol.designRefundTitle}
              </h4>
              <p className="text-[#57534E] leading-relaxed">
                {pol.designRefundText}
              </p>
            </div>
          </div>

          {/* Policy Articles */}
          <div className="space-y-5 text-xs text-[#57534E]">
            {/* Article 1: Personalized Custom Goods */}
            <div className="space-y-2 pb-4 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#A37055]" />
                <span>{pol.customGoodsTitle}</span>
              </div>
              <p className="leading-relaxed font-light">
                {pol.customGoodsText}
              </p>
            </div>

            {/* Article 2: Damaged Goods & Quality Guarantee */}
            <div className="space-y-3 pb-4 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-xs uppercase tracking-wider">
                <Truck className="w-4 h-4 text-[#A37055]" />
                <span>{pol.damageGuaranteeTitle}</span>
              </div>
              <p className="leading-relaxed font-light">
                {pol.damageGuaranteeText}
              </p>

              <div className="space-y-3">
                {/* 1. Atelier covers it */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E8E4DC] space-y-1.5">
                  <h5 className="font-semibold text-[#1C1917] text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{pol.damageGuaranteeTitle}</span>
                  </h5>
                  <ul className="space-y-1 list-disc list-inside text-[11px] text-[#57534E] pl-1">
                    <li>{pol.damageCoverage1}</li>
                    <li>{pol.damageCoverage2}</li>
                  </ul>
                </div>

                {/* 2. What you need to do */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E2DDD5] space-y-2">
                  <h5 className="font-semibold text-[#1C1917] text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#A37055]" />
                    <span>{pol.claimStepsTitle}</span>
                  </h5>
                  <div className="space-y-2 text-[11px] text-[#57534E]">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#1C1917] min-w-[70px]">{pol.claimTimeframe}:</span>
                      <span>{pol.claimTimeframeText}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#1C1917] min-w-[70px]">{pol.claimPhotosTitle}:</span>
                      <div className="space-y-1">
                        <ul className="list-disc list-inside space-y-0.5 text-[#1C1917] font-medium pt-0.5">
                          <li>{pol.claimPhotosText1}</li>
                          <li>{pol.claimPhotosText2}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article 3: Contact Procedure */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-xs uppercase tracking-wider">
                <Mail className="w-4 h-4 text-[#A37055]" />
                <span>{pol.claimHowToTitle}</span>
              </div>
              <p className="leading-relaxed font-light">
                {pol.claimHowToText}
              </p>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E8E4DC]">
                <div className="flex items-center gap-2 font-medium text-[#1C1917]">
                  <Mail className="w-4 h-4 text-[#A37055]" />
                  <span>{t.footer.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F5F2EB] border-t border-[#E8E4DC] flex items-center justify-between">
          <p className="text-[11px] text-[#78716C] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A37055]" />
            <span>100% Ambachtelijke Kwaliteitsgarantie</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1C1917] text-white hover:bg-[#332F2B] text-xs font-semibold transition shadow-sm"
          >
            {pol.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
};
