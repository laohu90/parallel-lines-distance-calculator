import React, { useState } from 'react';
import { DetailedStep } from '../utils/parallelGeometry';
import { MathView } from './MathView';
import { AlertTriangle, CheckCircle2, Copy, Check } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';

interface StepCardProps {
  step: DetailedStep;
  totalSteps: number;
  t?: TranslationDictionary;
}

export const StepCard: React.FC<StepCardProps> = ({ step, totalSteps, t }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `[${step.title}]\n${step.description}\n${t?.latexDerivation || 'Formula'}: ${step.latexFormula}\n${t?.coreConclusion || 'Takeaway'}: ${step.keyTakeaway}`;
    
    const fallbackCopy = () => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {}
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  };

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs transition hover:border-slate-300">
      {/* Step Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs font-bold">
            {step.stepNumber}
          </span>
          <h4 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
            {step.title}
          </h4>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            {step.badgeText}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-400">
            {t?.stepOf || 'Step'} {step.stepNumber} / {totalSteps}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 text-xs font-medium"
            title={t?.copyStep || 'Copy Step'}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">{t?.copiedStep || 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">{t?.copyStep || 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description with larger comfortable typography */}
      <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed mb-4 font-normal">
        {step.description}
      </p>

      {/* LaTeX Formula Highlight Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 text-slate-900">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>{t?.latexDerivation || 'LaTeX Step'}</span>
        </div>
        <MathView math={step.latexFormula} block className="text-base sm:text-lg text-slate-900 font-medium py-1" />
      </div>

      {/* Key Takeaway */}
      <div className="flex items-start gap-2.5 text-sm sm:text-[15px] text-slate-800 font-medium bg-emerald-50/70 border border-emerald-200/90 rounded-lg p-3 mt-3.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">{step.keyTakeaway}</span>
      </div>

      {/* Trap Warning if applicable */}
      {step.trapWarning && (
        <div className="flex items-start gap-2.5 text-sm sm:text-[15px] text-amber-900 bg-amber-50/90 border border-amber-200 rounded-lg p-3 mt-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="font-bold text-amber-950">{t?.examTrapWarning || 'Caution'}: </strong>
            {step.trapWarning}
          </span>
        </div>
      )}
    </div>
  );
};
