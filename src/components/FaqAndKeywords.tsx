import React, { useState } from 'react';
import { TranslationDictionary, SupportedLanguage } from '../i18n/translations';
import { ChevronDown, ChevronUp, BookOpen, Tag, Compass } from 'lucide-react';
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

  // Language specific high-ranking search keywords
  const keywordsByLang: Record<SupportedLanguage, string[]> = {
    en: [
      'distance between parallel lines',
      'parallel lines distance formula',
      'completing the square analytic geometry',
      'distance between two lines calculator',
      'perpendicular distance between lines',
      'Ax + By + C1 = 0 distance',
      'high school math step-by-step',
      'point to line reduction',
      'vector projection parallel lines',
      'find parameter m given distance',
    ],
    es: [
      'distancia entre dos rectas paralelas',
      'fórmula distancia rectas paralelas',
      'completando el cuadrado geometría analítica',
      'calculadora de rectas paso a paso',
      'distancia perpendicular entre rectas',
      'geometría analítica bachillerato',
      'hallar parámetro m con distancia',
      'rectas coincidentes y secantes',
    ],
    fr: [
      'distance entre deux droites parallèles',
      'formule distance droites parallèles',
      'géométrie analytique lycée',
      'forme canonique optimisation',
      'projection vecteur normal',
      'calculateur pas à pas droites',
      'équation cartésienne distance',
      'paramètre m inconnu distance',
    ],
    pt: [
      'distância entre retas paralelas',
      'fórmula distância entre retas',
      'completar quadrados geometria analítica',
      'calculadora de retas passo a passo',
      'geometria analítica ensino médio enem',
      'achar parâmetro m dada distância',
      'vetor normal e projeção',
      'retas concorrentes e coincidentes',
    ],
    zh: [
      '两平行直线间距离计算器',
      '两平行线距离公式在线',
      '高二解析几何填空选择题',
      '配方法求两直线距离证明',
      '系数同化避坑技巧',
      '已知距离求未知参数m双解',
      '点到直线距离转化法',
      '高考解析几何经典题库',
    ],
  };

  const currentKeywords = keywordsByLang[lang];

  return (
    <div className="space-y-6">
      {/* FAQ Accordion */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base md:text-lg">
            {t.faqTitle}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-4 py-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-left transition"
                >
                  <span className="font-semibold text-slate-800 text-sm md:text-base">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 text-xs md:text-sm text-slate-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Real World Applications & Keyword Hub */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Tag className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            {lang === 'zh'
              ? '相关知识索引与工程应用关键字'
              : lang === 'es'
              ? 'Índice de Conceptos y Palabras Clave'
              : lang === 'fr'
              ? 'Index des Notions et Mots-Clés'
              : lang === 'pt'
              ? 'Índice de Conceitos e Palavras-Chave'
              : 'Keywords Index & Real-World Engineering Applications'}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentKeywords.map((kw, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition font-medium"
            >
              #{kw}
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
          {lang === 'zh'
            ? '实际工程应用：高铁铁轨轨距标定、公路车道平行隔离带设计、PCB 印刷电路板差分走线间距计算，以及电磁学平行板电容器电场距离建模。'
            : lang === 'es'
            ? 'Aplicaciones reales: Calibración del ancho de vías ferroviarias, diseño de carriles de autopista, espaciado de pistas diferenciales en circuitos impresos (PCB) y cálculo de condensadores de placas paralelas.'
            : lang === 'fr'
            ? 'Applications concrètes: Écartement des voies ferrées à grande vitesse, tracé des voies de circulation, routage de pistes différentielles sur circuits imprimés (PCB) et condensateurs plans.'
            : lang === 'pt'
            ? 'Aplicações no mundo real: Calibração da bitola de trilhos ferroviários, dimensionamento de faixas de rodovias, espaçamento de trilhas diferenciais em PCB e capacitores de placas paralelas.'
            : 'Real-world applications: High-speed railway track gauge calibration, highway lane safety spacing, PCB differential microstrip clearance, and parallel-plate capacitor field calculations.'}
        </p>
      </section>
    </div>
  );
};
