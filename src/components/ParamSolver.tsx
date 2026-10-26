import React, { useState } from 'react';
import { MathView } from './MathView';
import { AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Fraction, simplifyRadicalFraction } from '../utils/fraction';
import { TranslationDictionary } from '../i18n/translations';

interface ParamSolverProps {
  t?: TranslationDictionary;
}

export const ParamSolver: React.FC<ParamSolverProps> = ({ t }) => {
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(4);
  const [c1, setC1] = useState<number>(-2);
  const [dist, setDist] = useState<number>(3);

  const fracA = Fraction.fromNumber(a);
  const fracB = Fraction.fromNumber(b);
  const sumSqFrac = fracA.mul(fracA).add(fracB.mul(fracB));
  const sumSq = a * a + b * b;
  const sqrtSum = Math.sqrt(sumSq);

  const fracDist = Fraction.fromNumber(dist);
  const rhsSq = fracDist.mul(fracDist).mul(sumSqFrac);
  const rhsRadical = simplifyRadicalFraction(rhsSq);

  // |C1 - m| = dist * sqrt(A^2 + B^2)
  const rhsNum = dist * sqrtSum;
  const m1 = c1 + rhsNum;
  const m2 = c1 - rhsNum;

  // Exact representation
  const isRational = !rhsRadical.latex.includes('\\sqrt');
  let m1Exact = '';
  let m2Exact = '';
  if (isRational) {
    const fracC1 = Fraction.fromNumber(c1);
    const fracRhs = Fraction.fromNumber(rhsNum);
    m1Exact = fracC1.add(fracRhs).toLatex();
    m2Exact = fracC1.sub(fracRhs).toLatex();
  } else {
    m1Exact = `${c1} + ${rhsRadical.latex}`;
    m2Exact = `${c1} - ${rhsRadical.latex}`;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            {t?.paramSolverTitle || '高二压轴必考：已知两平行线距离 d，反求未知参数 m'}
          </h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-semibold">
          {t?.paramSolverBadge || '常考易漏解（双解）'}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">
        {t?.paramSolverModel || '题目模型：已知直线'} <MathView math={`l_1: ${a}x + (${b})y + (${c1}) = 0`} /> 与{' '}
        <MathView math={`l_2: ${a}x + (${b})y + m = 0`} /> 距离为{' '}
        <MathView math={`d = ${dist}`} />，求参数 <MathView math="m" />。
      </p>

      {/* Input parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">系数 A</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-blue-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">系数 B</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(Number(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-blue-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">常数项 C₁</label>
          <input
            type="number"
            value={c1}
            onChange={(e) => setC1(Number(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            {t?.paramSolverGivenDist || '给定距离 d'}
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={dist}
            onChange={(e) => setDist(Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Solving steps */}
      <div className="space-y-3.5 pt-1">
        <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm space-y-2.5">
          <div className="text-slate-900 font-semibold">
            {t?.paramSolverStep1 || '步骤 1：列出绝对值等式'}
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
            <MathView
              math={`d = \\frac{|${c1} - m|}{\\sqrt{(${a})^2 + (${b})^2}} = ${dist} \\implies |${c1} - m| = ${dist} \\times \\sqrt{${sumSq}} = ${rhsRadical.latex}`}
            />
          </div>

          <div className="text-slate-900 font-semibold pt-2">
            {t?.paramSolverStep2 || '步骤 2：解绝对值方程（注意正负双解！）'}
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
            <MathView
              math={`${c1} - m = \\pm (${rhsRadical.latex}) \\implies m = ${c1} \\mp (${rhsRadical.latex})`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl text-emerald-950 mt-3">
            <span className="font-bold text-sm sm:text-base">
              {t?.paramSolverResult || '参数 m 最终结果：'}
            </span>
            <div className="text-base sm:text-lg font-bold">
              <MathView math={`m_1 = ${m1Exact}, \\quad m_2 = ${m2Exact}`} />
              <span className="text-xs sm:text-sm text-emerald-700 font-medium ml-2">
                (≈ {m1.toFixed(2)} / {m2.toFixed(2)})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-900 bg-amber-50/90 border border-amber-200 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>{t?.examTrapWarning || '高分避坑'}：</strong>
            {t?.paramSolverWarning ||
              '在填空题中，平行线分布在 l₁ 的两侧各有一条，因此参数 m 必须有两个解！千万不要只写一个正解导致扣掉整道题的分数！'}
          </span>
        </div>
      </div>
    </div>
  );
};
