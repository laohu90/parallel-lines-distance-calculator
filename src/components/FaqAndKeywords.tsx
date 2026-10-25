import React, { useState } from 'react';
import { TranslationDictionary, SupportedLanguage } from '../i18n/translations';
import { ChevronDown, ChevronUp, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { MathView } from './MathView';

interface FaqAndKeywordsProps {
  t: TranslationDictionary;
  lang: SupportedLanguage;
}

export const FaqAndKeywords: React.FC<FaqAndKeywordsProps> = ({ t, lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
  ];

  return (
    <div className="space-y-6">
      {/* FAQ Accordion */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
            {t.faqTitle}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-left transition"
                >
                  <span className="font-semibold text-slate-900 text-[15px] sm:text-base">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-2">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Analytical Geometry Theorem Reference Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100">
          <Layers className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
            {lang === 'zh'
              ? '解析几何核心公式与几何判定速查表'
              : lang === 'es'
              ? 'Tabla Resumen de Fórmulas y Criterios Geométricos'
              : lang === 'fr'
              ? 'Tableau Synthétique des Formules et Critères Géométriques'
              : lang === 'pt'
              ? 'Tabela Resumo de Fórmulas e Critérios Geométricos'
              : 'Analytic Geometry Formulas & Criteria Reference'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-sm">
          {/* Card 1: 2D Parallel */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>{lang === 'zh' ? '2D 平面平行线距离' : '2D Plane Parallel Lines'}</span>
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'zh'
                ? '方程系数统一为 A, B 后：'
                : 'After unifying coefficients to A and B:'}
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-semibold text-slate-900">
              <MathView math="d = \frac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}" />
            </div>
          </div>

          {/* Card 2: 3D Parallel */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>{lang === 'zh' ? '3D 空间平行直线' : '3D Space Parallel Lines'}</span>
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'zh'
                ? '方向向量外积为 0 时：'
                : 'When direction vectors cross product is 0:'}
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-semibold text-slate-900">
              <MathView math="d = \frac{\|\vec{P_1 P_2} \times \vec{v_1}\|}{\|\vec{v_1}\|}" />
            </div>
          </div>

          {/* Card 3: 3D Skew */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>{lang === 'zh' ? '3D 空间异面直线' : '3D Space Skew Lines'}</span>
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'zh'
                ? '两直线不平行且不相交（混合积非零）：'
                : 'When lines are non-parallel & non-coplanar:'}
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-semibold text-slate-900">
              <MathView math="d = \frac{|\vec{P_1 P_2} \cdot (\vec{v_1} \times \vec{v_2})|}{\|\vec{v_1} \times \vec{v_2}\|}" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
