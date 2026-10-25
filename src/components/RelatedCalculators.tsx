import React from 'react';
import { TranslationDictionary, SupportedLanguage } from '../i18n/translations';
import { MathView } from './MathView';
import {
  Compass,
  Layers,
  Box,
  Split,
  CornerDownRight,
  ExternalLink,
  Target,
  Maximize2,
} from 'lucide-react';
import { ToolType } from './InteractiveToolModal';

interface RelatedCalculatorsProps {
  t: TranslationDictionary;
  lang: SupportedLanguage;
  onOpenTool: (tool: ToolType) => void;
  onSwitchTo3D: () => void;
}

export const RelatedCalculators: React.FC<RelatedCalculatorsProps> = ({
  t,
  lang,
  onOpenTool,
  onSwitchTo3D,
}) => {
  const tools = [
    {
      id: 'point-to-line',
      type: 'pointToLine' as ToolType,
      title: lang === 'zh'
        ? '点到直线距离计算器'
        : lang === 'es'
        ? 'Calculadora de Distancia Punto a Recta'
        : lang === 'fr'
        ? 'Calculateur Distance Point-Droite'
        : lang === 'pt'
        ? 'Calculadora de Distância Ponto a Reta'
        : 'Point to Line Distance Calculator',
      desc: lang === 'zh'
        ? '计算平面任意一点 P(x₀, y₀) 到直线 Ax+By+C=0 的精确垂线段距离与化简二次根式。'
        : 'Compute exact perpendicular distance from point P(x₀, y₀) to line Ax+By+C=0 with radical fractions.',
      formula: 'd = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}',
      badge: '2D Plane',
      icon: Target,
      tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      id: 'two-lines-intersection',
      type: 'intersection' as ToolType,
      title: lang === 'zh'
        ? '两直线交点计算器'
        : lang === 'es'
        ? 'Calculadora de Intersección de Rectas'
        : lang === 'fr'
        ? 'Calculateur d\'Intersection de Droites'
        : lang === 'pt'
        ? 'Calculadora de Interseção de Retas'
        : 'Two Lines Intersection Calculator',
      desc: lang === 'zh'
        ? '基于二阶克莱姆行列式 (Cramer\'s Rule) 求解两直线唯一交点坐标，或诊断平行与重合。'
        : 'Solve unique intersection point (x*, y*) via Cramer\'s determinant or verify parallelism.',
      formula: '\\begin{cases} A_1 x + B_1 y + C_1 = 0 \\\\ A_2 x + B_2 y + C_2 = 0 \\end{cases}',
      badge: 'Algebra & 2D',
      icon: Split,
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'angle-between-lines',
      type: 'angle' as ToolType,
      title: lang === 'zh'
        ? '两直线夹角与斜率计算器'
        : lang === 'es'
        ? 'Calculadora de Ángulo Entre Dos Rectas'
        : lang === 'fr'
        ? 'Calculateur d\'Angle Entre Deux Droites'
        : lang === 'pt'
        ? 'Calculadora de Ângulo Entre Duas Retas'
        : 'Angle Between Two Lines Calculator',
      desc: lang === 'zh'
        ? '根据斜率 m₁, m₂ 计算两直线锐夹角 θ、垂直判定条件 (m₁·m₂ = -1) 以及平行判定。'
        : 'Calculate acute angle θ, slope relation m₁·m₂ = -1 for perpendicularity, and parallelism.',
      formula: '\\tan \\theta = \\left| \\frac{m_1 - m_2}{1 + m_1 m_2} \\right|',
      badge: 'Trigonometry',
      icon: Compass,
      tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    {
      id: 'parallel-planes-distance',
      type: 'parallelPlanes' as ToolType,
      title: lang === 'zh'
        ? '空间两平行平面间距离计算器'
        : lang === 'es'
        ? 'Distancia Entre Planos Paralelos 3D'
        : lang === 'fr'
        ? 'Distance Entre Deux Plans Parallèles 3D'
        : lang === 'pt'
        ? 'Distância Entre Planos Paralelos 3D'
        : 'Parallel Planes Distance Calculator (3D)',
      desc: lang === 'zh'
        ? '求解三维立体几何中两平行平面 Ax+By+Cz+D₁=0 与 Ax+By+Cz+D₂=0 间的垂直最短距离。'
        : 'Compute distance between parallel planes Ax+By+Cz+D₁=0 and Ax+By+Cz+D₂=0 in 3D space.',
      formula: 'd = \\frac{|D_1 - D_2|}{\\sqrt{A^2 + B^2 + C^2}}',
      badge: '3D Solid',
      icon: Layers,
      tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      id: 'point-to-plane-distance',
      type: 'pointToPlane' as ToolType,
      title: lang === 'zh'
        ? '空间点到平面距离计算器'
        : lang === 'es'
        ? 'Distancia Punto a Plano 3D'
        : lang === 'fr'
        ? 'Distance Point-Plan 3D'
        : lang === 'pt'
        ? 'Distância de Ponto a Plano 3D'
        : 'Point to Plane Distance Calculator (3D)',
      desc: lang === 'zh'
        ? '计算三维空间中点 P(x₀, y₀, z₀) 到平面 Ax+By+Cz+D=0 的垂直投影距离与模长推导。'
        : 'Find perpendicular distance from point P(x₀, y₀, z₀) to plane Ax+By+Cz+D=0 using normal vector.',
      formula: 'd = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}',
      badge: '3D Vector',
      icon: Box,
      tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      id: 'skew-lines-distance',
      type: 'skewLines' as ToolType,
      title: lang === 'zh'
        ? '空间异面直线距离计算器'
        : lang === 'es'
        ? 'Distancia Entre Rectas Alabeadas 3D'
        : lang === 'fr'
        ? 'Distance Droites Gauches 3D'
        : lang === 'pt'
        ? 'Distância Entre Retas Reversas 3D'
        : '3D Skew Lines Distance Calculator',
      desc: lang === 'zh'
        ? '三维立体空间非共面两直线的公垂线长度与向量外积叉乘（Cross Product）严格求解。'
        : 'Determine shortest distance between non-coplanar lines in 3D using cross product direction vectors.',
      formula: 'd = \\frac{|\\vec{P_1 P_2} \\cdot (\\vec{v_1} \\times \\vec{v_2})|}{\\|\\vec{v_1} \\times \\vec{v_2}\\|}',
      badge: '3D Advanced',
      icon: CornerDownRight,
      tagColor: 'text-teal-700 bg-teal-50 border-teal-200',
    },
  ];

  return (
    <section
      id="related-calculators"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'zh'
                ? '相关解析几何与代数计算器矩阵'
                : lang === 'es'
                ? 'Calculadoras de Geometría Analítica Relacionadas'
                : lang === 'fr'
                ? 'Calculateurs de Géométrie Analytique Connexes'
                : lang === 'pt'
                ? 'Calculadoras de Geometria Analítica Relacionadas'
                : 'Related Analytic Geometry & Algebra Calculators'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'zh'
                ? '包含点线距离、两线交点、夹角、空间面面与异面直线等配套公式与交互式工具'
                : 'Explore interactive companion tools for point-to-line, line intersections, angles, and 3D planes.'}
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          6 {lang === 'zh' ? '款专项工具' : 'Tools Available'}
        </span>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              id={`calc-${tool.id}`}
              className="bg-slate-50/60 border border-slate-200 hover:border-blue-400 hover:bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between transition group shadow-2xs"
            >
              <div className="space-y-2.5">
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-blue-600 group-hover:border-blue-200 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${tool.tagColor}`}
                  >
                    {tool.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition">
                    <a href={`#calc-${tool.id}`} className="hover:underline focus:outline-hidden">
                      {tool.title}
                    </a>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {tool.desc}
                  </p>
                </div>

                {/* Formula Preview Box */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-semibold text-slate-800 text-xs sm:text-sm">
                  <MathView math={tool.formula} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 mt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <a
                  href={`#calc-${tool.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (tool.type === 'skewLines') {
                      onSwitchTo3D();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      onOpenTool(tool.type);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 group-hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'zh'
                      ? '直接使用 / 验算'
                      : lang === 'es'
                      ? 'Abrir Calculadora'
                      : lang === 'fr'
                      ? 'Ouvrir l\'Outil'
                      : lang === 'pt'
                      ? 'Abrir Calculadora'
                      : 'Open Calculator'}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (tool.type === 'skewLines') {
                      onSwitchTo3D();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      onOpenTool(tool.type);
                    }
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 transition flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                  <span className="hidden xs:inline">
                    {lang === 'zh' ? '交互求解' : 'Try Now'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
