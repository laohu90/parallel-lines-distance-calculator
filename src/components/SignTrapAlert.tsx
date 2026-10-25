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

  if (!check.isParallel) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm space-y-1">
          <p className="font-semibold text-rose-900">
            {t?.notParallelWarningTitle || '注意：当前两直线并不平行！'}
          </p>
          <p>
            {t?.notParallelWarningDesc ||
              '检测到法向量交叉积不为零，两直线在平面上相交于一点，不存在固定的平行线垂直间距。'}
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
          {t?.trapRadarTitle || '高二易错点防丢分自查雷达（符号与倍数诊断）'}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Item 1: 系数统一诊断 */}
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
            <span>1. 系数同化检查</span>
          </div>
          {isScaleNeeded ? (
            <p>
              <strong>触发陷阱：</strong> <MathView math="l_2" /> 的系数是 <MathView math="l_1" /> 的 {k?.toFixed(2)}{' '}
              倍。手算时若直接代入原常数项必错，必须先化同系数！
            </p>
          ) : (
            <p>
              <strong>通过：</strong> 两方程中 <MathView math="x, y" /> 系数完全对齐，可直接套用公式 <MathView math="d = \frac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}" />。
            </p>
          )}
        </div>

        {/* Item 2: 符号诊断 */}
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
            <span>2. 分子减法与符号拆解</span>
          </div>
          {isC2Negative ? (
            <div className="space-y-1">
              <p>
                <strong>防错提示：</strong> 常数项 <MathView math={`C_2' = ${unifiedC2Fraction.toLatex()}`} /> 为负数。
              </p>
              <p>
                计算时 <MathView math={`|${unifiedC1} - (${unifiedC2Fraction.toLatex()})| = |${unifiedC1} + ${Math.abs(unifiedC2Fraction.toNumber()).toFixed(2)}|`} />，切记负负得正！
              </p>
            </div>
          ) : (
            <p>
              <strong>正常：</strong> 分子直接相减 <MathView math={`|${unifiedC1} - (${unifiedC2Fraction.toLatex()})|`} />，加绝对值保证非负。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
