import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { MathView } from './MathView';
import { CalculationResult } from '../utils/parallelGeometry';
import { TranslationDictionary } from '../i18n/translations';

interface SignTrapAlertProps {
  calcResult: CalculationResult;
  t?: TranslationDictionary;
}

export const SignTrapAlert: React.FC<SignTrapAlertProps> = ({ calcResult, t }) => {
  const { check, unifiedC1, unifiedC2Fraction } = calcResult;
  const k = check.k;

  if (!check.isLine1Valid || !check.isLine2Valid) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm space-y-1">
          <p className="font-semibold text-rose-900">
            {t?.parseError || 'Degenerate Equation Error'}
          </p>
          <p>
            {check.message || 'Coefficients A and B cannot both be zero.'}
          </p>
        </div>
      </div>
    );
  }

  if (!check.isParallel) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm space-y-1">
          <p className="font-semibold text-rose-900">
            {t?.notParallelWarningTitle || 'Lines are NOT Parallel!'}
          </p>
          <p>
            {t?.notParallelWarningDesc ||
              'The normal vectors cross product is non-zero. The lines intersect at a single point (d = 0).'}
          </p>
        </div>
      </div>
    );
  }

  const isScaleNeeded = k !== undefined && Math.abs(k - 1) > 1e-5;
  const isC2Negative = unifiedC2Fraction.toNumber() < 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
          {t?.trapRadarTitle || 'Exam Sign & Scaling Trap Radar'}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Item 1: Scaling Check */}
        <div
          className={`p-3 rounded-lg border text-xs ${
            isScaleNeeded
              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            {isScaleNeeded ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{t?.trapCheckScaling || '1. Coefficient Homogenization Check'}</span>
          </div>
          {isScaleNeeded ? (
            <p>
              {t?.trapCheckScalingTriggered || `Warning: Coefficients are unaligned! Line 2 is scaled by factor k = ${k?.toFixed(2)}. You must divide Line 2 by k first!`}
            </p>
          ) : (
            <p>
              {t?.trapCheckScalingPassed || 'Passed: Coefficients of x and y are identical. Formula is directly applicable.'}
            </p>
          )}
        </div>

        {/* Item 2: Sign Check */}
        <div
          className={`p-3 rounded-lg border text-xs ${
            isC2Negative
              ? 'bg-blue-50/80 border-blue-200 text-blue-900'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              ±
            </span>
            <span>{t?.trapCheckSign || '2. Subtraction & Double Negative Check'}</span>
          </div>
          {isC2Negative ? (
            <div className="space-y-1">
              <p>
                {t?.trapCheckSignTriggered || 'Caution: Constant term is negative. Subtracting a negative becomes addition.'}
              </p>
            </div>
          ) : (
            <p>
              {t?.trapCheckSignPassed || 'Normal: Direct subtraction with absolute value ensuring non-negativity.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
