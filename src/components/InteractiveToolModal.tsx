import React, { useState, useMemo } from 'react';
import { MathView } from './MathView';
import { X, Calculator, ArrowRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Fraction, formatExactDistance } from '../utils/fraction';
import { TranslationDictionary, SupportedLanguage } from '../i18n/translations';

export type ToolType =
  | 'pointToLine'
  | 'intersection'
  | 'angle'
  | 'parallelPlanes'
  | 'pointToPlane'
  | 'skewLines';

interface InteractiveToolModalProps {
  toolType: ToolType;
  onClose: () => void;
  onSwitchTo3D: () => void;
  t: TranslationDictionary;
  lang: SupportedLanguage;
}

export const InteractiveToolModal: React.FC<InteractiveToolModalProps> = ({
  toolType,
  onClose,
  onSwitchTo3D,
  t,
  lang,
}) => {
  // 1. Point to Line state
  const [ptX, setPtX] = useState<number>(2);
  const [ptY, setPtY] = useState<number>(3);
  const [lineA, setLineA] = useState<number>(3);
  const [lineB, setLineB] = useState<number>(4);
  const [lineC, setLineC] = useState<number>(-8);

  // 2. Line Intersection state
  const [intA1, setIntA1] = useState<number>(2);
  const [intB1, setIntB1] = useState<number>(1);
  const [intC1, setIntC1] = useState<number>(-4);
  const [intA2, setIntA2] = useState<number>(1);
  const [intB2, setIntB2] = useState<number>(-1);
  const [intC2, setIntC2] = useState<number>(-2);

  // 3. Angle between lines state
  const [m1, setM1] = useState<number>(2);
  const [m2, setM2] = useState<number>(-0.5);

  // 4. Parallel planes state
  const [plA, setPlA] = useState<number>(2);
  const [plB, setPlB] = useState<number>(-1);
  const [plC, setPlC] = useState<number>(2);
  const [plD1, setPlD1] = useState<number>(4);
  const [plD2, setPlD2] = useState<number>(-8);

  // 5. Point to plane state
  const [pPtX, setPPtX] = useState<number>(1);
  const [pPtY, setPPtY] = useState<number>(2);
  const [pPtZ, setPPtZ] = useState<number>(3);
  const [ppA, setPpA] = useState<number>(2);
  const [ppB, setPpB] = useState<number>(-2);
  const [ppC, setPpC] = useState<number>(1);
  const [ppD, setPpD] = useState<number>(-5);

  // Compute Point to Line
  const pointToLineResult = useMemo(() => {
    const numerator = Math.abs(lineA * ptX + lineB * ptY + lineC);
    const rad = lineA * lineA + lineB * lineB;
    const radSimp = formatExactDistance(new Fraction(numerator), rad);
    const decimal = rad > 0 ? numerator / Math.sqrt(rad) : 0;
    return { numerator, rad, radSimp, decimal };
  }, [ptX, ptY, lineA, lineB, lineC]);

  // Compute Intersection
  const intersectionResult = useMemo(() => {
    const D = intA1 * intB2 - intA2 * intB1;
    if (D === 0) {
      const isCoincident = intA1 * intC2 === intA2 * intC1 && intB1 * intC2 === intB2 * intC1;
      return { status: isCoincident ? 'coincident' : 'parallel', point: null, D };
    }
    const Dx = -intC1 * intB2 - -intC2 * intB1;
    const Dy = intA1 * -intC2 - intA2 * -intC1;
    const xFrac = new Fraction(Dx, D);
    const yFrac = new Fraction(Dy, D);
    return {
      status: 'intersecting',
      point: { x: xFrac, y: yFrac, xDec: Dx / D, yDec: Dy / D },
      D,
    };
  }, [intA1, intB1, intC1, intA2, intB2, intC2]);

  // Compute Angle
  const angleResult = useMemo(() => {
    const denom = 1 + m1 * m2;
    if (Math.abs(denom) < 1e-7) {
      return { deg: 90, rad: Math.PI / 2, isPerpendicular: true };
    }
    const tanVal = Math.abs((m1 - m2) / denom);
    const radVal = Math.atan(tanVal);
    const degVal = (radVal * 180) / Math.PI;
    return { deg: degVal, rad: radVal, isPerpendicular: false, tanVal };
  }, [m1, m2]);

  // Compute Parallel Planes
  const parallelPlanesResult = useMemo(() => {
    const diff = Math.abs(plD1 - plD2);
    const rad = plA * plA + plB * plB + plC * plC;
    const radSimp = formatExactDistance(new Fraction(diff), rad);
    const decimal = rad > 0 ? diff / Math.sqrt(rad) : 0;
    return { diff, rad, radSimp, decimal };
  }, [plA, plB, plC, plD1, plD2]);

  // Compute Point to Plane
  const pointToPlaneResult = useMemo(() => {
    const numerator = Math.abs(ppA * pPtX + ppB * pPtY + ppC * pPtZ + ppD);
    const rad = ppA * ppA + ppB * ppB + ppC * ppC;
    const radSimp = formatExactDistance(new Fraction(numerator), rad);
    const decimal = rad > 0 ? numerator / Math.sqrt(rad) : 0;
    return { numerator, rad, radSimp, decimal };
  }, [pPtX, pPtY, pPtZ, ppA, ppB, ppC, ppD]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {toolType === 'pointToLine' && (lang === 'zh' ? '点到直线距离计算器' : 'Point to Line Distance Calculator')}
                {toolType === 'intersection' && (lang === 'zh' ? '两直线交点计算器' : 'Two Lines Intersection Calculator')}
                {toolType === 'angle' && (lang === 'zh' ? '两直线夹角与垂直/平行判定' : 'Angle Between Two Lines Calculator')}
                {toolType === 'parallelPlanes' && (lang === 'zh' ? '空间两平行平面距离计算器' : 'Distance Between Parallel Planes (3D)')}
                {toolType === 'pointToPlane' && (lang === 'zh' ? '空间点到平面距离计算器' : 'Point to Plane Distance Calculator (3D)')}
                {toolType === 'skewLines' && (lang === 'zh' ? '空间异面直线距离计算器' : '3D Skew Lines Distance Calculator')}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'zh' ? '实时交互数值计算与 LaTeX 步骤推导' : 'Interactive computation with step-by-step LaTeX derivation'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* TOOL 1: Point to Line */}
          {toolType === 'pointToLine' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-900">
                <strong>{lang === 'zh' ? '核心公式：' : 'Core Formula: '}</strong>
                <MathView math="d = \frac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}" block />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-700">
                    {lang === 'zh' ? '点 P(x₀, y₀)' : 'Point P(x₀, y₀)'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">x₀</label>
                      <input
                        type="number"
                        value={ptX}
                        onChange={(e) => setPtX(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">y₀</label>
                      <input
                        type="number"
                        value={ptY}
                        onChange={(e) => setPtY(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-700">
                    {lang === 'zh' ? '直线 l: Ax + By + C = 0' : 'Line l: Ax + By + C = 0'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">A</label>
                      <input
                        type="number"
                        value={lineA}
                        onChange={(e) => setLineA(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">B</label>
                      <input
                        type="number"
                        value={lineB}
                        onChange={(e) => setLineB(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">C</label>
                      <input
                        type="number"
                        value={lineC}
                        onChange={(e) => setLineC(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Result & Steps */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    {lang === 'zh' ? '计算结果与步骤' : 'Result & Derivation'}
                  </span>
                  <span className="text-sm font-mono font-bold text-blue-700">
                    d ≈ {pointToLineResult.decimal.toFixed(4)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-800">
                  <p>
                    {lang === 'zh'
                      ? `1. 将 P(${ptX}, ${ptY}) 代入点线距离公式分子：`
                      : `1. Substitute P(${ptX}, ${ptY}) into numerator: `}
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-mono">
                    <MathView
                      math={`|(${lineA})(${ptX}) + (${lineB})(${ptY}) + (${lineC})| = |${lineA * ptX + lineB * ptY + lineC}| = ${pointToLineResult.numerator}`}
                    />
                  </div>
                  <p>
                    {lang === 'zh' ? '2. 计算法向量模长分母：' : '2. Compute normal vector norm denominator: '}
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-mono">
                    <MathView math={`\\sqrt{(${lineA})^2 + (${lineB})^2} = \\sqrt{${pointToLineResult.rad}}`} />
                  </div>
                  <p>
                    {lang === 'zh' ? '3. 化简为最简二次根式：' : '3. Final exact radical value: '}
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center font-bold text-emerald-900 text-base">
                    <MathView math={`d = ${pointToLineResult.radSimp.latex} \\approx ${pointToLineResult.decimal.toFixed(4)}`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: Two Lines Intersection */}
          {toolType === 'intersection' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-900">
                <strong>{lang === 'zh' ? '克莱姆法则 (Cramer\'s Rule)：' : 'Cramer\'s Determinant: '}</strong>
                <MathView math="D = A_1 B_2 - A_2 B_1, \quad x^* = \frac{-C_1 B_2 - (-C_2) B_1}{D}, \quad y^* = \frac{A_1 (-C_2) - A_2 (-C_1)}{D}" block />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-blue-700">
                    {lang === 'zh' ? '直线 1 (l₁)' : 'Line 1 (l₁)'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">A₁</label>
                      <input
                        type="number"
                        value={intA1}
                        onChange={(e) => setIntA1(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">B₁</label>
                      <input
                        type="number"
                        value={intB1}
                        onChange={(e) => setIntB1(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">C₁</label>
                      <input
                        type="number"
                        value={intC1}
                        onChange={(e) => setIntC1(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-700">
                    {lang === 'zh' ? '直线 2 (l₂)' : 'Line 2 (l₂)'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">A₂</label>
                      <input
                        type="number"
                        value={intA2}
                        onChange={(e) => setIntA2(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">B₂</label>
                      <input
                        type="number"
                        value={intB2}
                        onChange={(e) => setIntB2(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">C₂</label>
                      <input
                        type="number"
                        value={intC2}
                        onChange={(e) => setIntC2(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    {lang === 'zh' ? '交点状态与精确坐标' : 'Intersection Status & Coordinates'}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      intersectionResult.status === 'intersecting'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {intersectionResult.status === 'intersecting'
                      ? lang === 'zh'
                        ? '唯一交点'
                        : 'Unique Intersection'
                      : intersectionResult.status === 'coincident'
                      ? lang === 'zh'
                        ? '两直线重合 (无数交点)'
                        : 'Coincident'
                      : lang === 'zh'
                      ? '两直线平行 (无交点)'
                      : 'Parallel (No Intersection)'}
                  </span>
                </div>

                {intersectionResult.point ? (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-1">
                    <div className="text-base font-bold text-slate-900">
                      <MathView
                        math={`(x^*, y^*) = \\left( ${intersectionResult.point.x.toLatex()}, ${intersectionResult.point.y.toLatex()} \\right)`}
                      />
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      ≈ ({intersectionResult.point.xDec.toFixed(3)}, {intersectionResult.point.yDec.toFixed(3)})
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">
                    {lang === 'zh'
                      ? '行列式 D = 0，直线平行或重合，可使用本站主计算器求出两平行线间的垂距。'
                      : 'Determinant D = 0. Use our main calculator above to get the parallel distance.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TOOL 3: Angle Between Lines */}
          {toolType === 'angle' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs sm:text-sm text-purple-900">
                <strong>{lang === 'zh' ? '直线夹角正切公式：' : 'Tangent Angle Formula: '}</strong>
                <MathView math="\tan \theta = \left|\frac{m_1 - m_2}{1 + m_1 m_2}\right|, \quad \theta \in [0^\circ, 90^\circ]" block />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {lang === 'zh' ? '直线 l₁ 斜率 (m₁)' : 'Line 1 Slope (m₁)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={m1}
                    onChange={(e) => setM1(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                  />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {lang === 'zh' ? '直线 l₂ 斜率 (m₂)' : 'Line 2 Slope (m₂)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={m2}
                    onChange={(e) => setM2(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    {lang === 'zh' ? '夹角计算结果' : 'Angle Calculation'}
                  </span>
                  {angleResult.isPerpendicular && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {lang === 'zh' ? '互相垂直 (m₁·m₂ = -1)' : 'Perpendicular (m₁·m₂ = -1)'}
                    </span>
                  )}
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-1">
                  <div className="text-2xl font-extrabold text-purple-700">
                    θ = {angleResult.deg.toFixed(2)}°
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    ≈ {angleResult.rad.toFixed(4)} rad
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 4: Distance Between Parallel Planes */}
          {toolType === 'parallelPlanes' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-900">
                <strong>{lang === 'zh' ? '空间两平行平面距离公式：' : 'Parallel Planes Distance: '}</strong>
                <MathView math="d = \frac{|D_1 - D_2|}{\sqrt{A^2 + B^2 + C^2}}" block />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-700">
                  {lang === 'zh' ? '共同法向量 (A, B, C)' : 'Common Normal Vector (A, B, C)'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={plA}
                    onChange={(e) => setPlA(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={plB}
                    onChange={(e) => setPlB(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={plC}
                    onChange={(e) => setPlC(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="block text-xs font-bold text-slate-700">平面 1 常数 (D₁)</label>
                  <input
                    type="number"
                    value={plD1}
                    onChange={(e) => setPlD1(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="block text-xs font-bold text-slate-700">平面 2 常数 (D₂)</label>
                  <input
                    type="number"
                    value={plD2}
                    onChange={(e) => setPlD2(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-1">
                <div className="text-xs text-emerald-800 font-semibold">两平行平面垂直间距</div>
                <div className="text-2xl font-extrabold text-emerald-900">
                  <MathView math={`d = ${parallelPlanesResult.radSimp.latex}`} />
                </div>
                <div className="text-xs font-mono text-emerald-700">
                  ≈ {parallelPlanesResult.decimal.toFixed(4)}
                </div>
              </div>
            </div>
          )}

          {/* TOOL 5: Point to Plane */}
          {toolType === 'pointToPlane' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-900">
                <strong>{lang === 'zh' ? '空间点到平面垂距公式：' : 'Point to Plane Formula: '}</strong>
                <MathView math="d = \frac{|Ax_0 + By_0 + Cz_0 + D|}{\sqrt{A^2 + B^2 + C^2}}" block />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-700">点 P(x₀, y₀, z₀)</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={pPtX}
                    onChange={(e) => setPPtX(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={pPtY}
                    onChange={(e) => setPPtY(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={pPtZ}
                    onChange={(e) => setPPtZ(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-700">平面 Ax + By + Cz + D = 0</span>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    value={ppA}
                    onChange={(e) => setPpA(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={ppB}
                    onChange={(e) => setPpB(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={ppC}
                    onChange={(e) => setPpC(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={ppD}
                    onChange={(e) => setPpD(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-1">
                <div className="text-xs text-emerald-800 font-semibold">空间点面垂直距离</div>
                <div className="text-2xl font-extrabold text-emerald-900">
                  <MathView math={`d = ${pointToPlaneResult.radSimp.latex}`} />
                </div>
                <div className="text-xs font-mono text-emerald-700">
                  ≈ {pointToPlaneResult.decimal.toFixed(4)}
                </div>
              </div>
            </div>
          )}

          {/* TOOL 6: Skew Lines */}
          {toolType === 'skewLines' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-indigo-950">
                <h4 className="font-bold text-sm">
                  {lang === 'zh' ? '空间异面直线公垂线距离' : '3D Skew Lines Common Perpendicular'}
                </h4>
                <p className="text-xs leading-relaxed">
                  {lang === 'zh'
                    ? '本网站已原生集成三维空间立体几何求解引擎！支持空间任意两直线（平行、相交、异面、重合）判定与方向向量外积推导。'
                    : 'Our site has built-in 3D spatial geometry solver support with interactive rotation and vector proofs.'}
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-indigo-200 text-center font-bold">
                  <MathView math="d = \frac{|\vec{P_1 P_2} \cdot (\vec{v_1} \times \vec{v_2})|}{\|\vec{v_1} \times \vec{v_2}\|}" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchTo3D();
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <span>{lang === 'zh' ? '直接进入 3D 空间直线计算器' : 'Switch to 3D Space Calculator Mode'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {lang === 'zh' ? 'FormulaCalcKit 解析几何工具矩阵' : 'FormulaCalcKit Geometry Suite'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
          >
            {lang === 'zh' ? '关闭窗口' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
