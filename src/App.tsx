import React, { useState, useMemo, useEffect } from 'react';
import {
  LineEquation,
  calculateParallelDistance,
  EXAM_PRESETS,
  ExamPreset,
  formatLineLatex,
} from './utils/parallelGeometry';
import {
  Line3D,
  calculateSpaceDistance,
} from './utils/spaceGeometry';
import { MathView } from './components/MathView';
import { StepCard } from './components/StepCard';
import { GeometryCanvas } from './components/GeometryCanvas';
import { GeometryCanvas3D } from './components/GeometryCanvas3D';
import { ParamSolver } from './components/ParamSolver';
import { SignTrapAlert } from './components/SignTrapAlert';
import { PracticeQuiz } from './components/PracticeQuiz';
import { FaqAndKeywords } from './components/FaqAndKeywords';
import { RelatedCalculators } from './components/RelatedCalculators';
import { InteractiveToolModal, ToolType } from './components/InteractiveToolModal';
import { parseLinearEquation } from './utils/equationParser';
import { translations, SupportedLanguage } from './i18n/translations';
import {
  Calculator,
  Compass,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Copy,
  Check,
  Globe,
  Share2,
  Printer,
  Box,
  Repeat,
  Info,
} from 'lucide-react';

export default function App() {
  // Language state (default English)
  const [lang, setLang] = useState<SupportedLanguage>('en');

  const t = translations[lang] || translations.en;

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Dimension: 2D Plane vs 3D Space
  const [dimension, setDimension] = useState<'2D' | '3D'>('2D');

  // Input mode: standard (Ax + By + C = 0), slope (y = mx + b), smartParse
  const [inputMode, setInputMode] = useState<'standard' | 'slope' | 'smartParse'>('standard');

  // Unified 2D State
  const [l1, setL1] = useState<LineEquation>({ a: 3, b: -4, c: -1 });
  const [l2, setL2] = useState<LineEquation>({ a: 3, b: -4, c: 9 });

  // Unified Smart text state
  const [smartTextL1, setSmartTextL1] = useState<string>('3x - 4y - 1 = 0');
  const [smartTextL2, setSmartTextL2] = useState<string>('3x - 4y + 9 = 0');

  // 3D Space Lines state
  const [l1_3d, setL1_3d] = useState<Line3D>({
    p: { x: 1, y: 0, z: 0 },
    v: { x: 0, y: 1, z: 0 },
  });
  const [l2_3d, setL2_3d] = useState<Line3D>({
    p: { x: 0, y: 0, z: 1 },
    v: { x: 1, y: 0, z: 0 },
  });

  // Active method tab in 2D
  const [activeMethod, setActiveMethod] = useState<'standard' | 'completingSquare' | 'pointToLine' | 'normalVector'>('standard');

  // Preset selector
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-1');

  // Modals & Panels
  const [showParamSolver, setShowParamSolver] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [activeToolModal, setActiveToolModal] = useState<ToolType | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<boolean>(false);

  // Bi-directional slope-intercept synchronization values
  const currentSlopeK = useMemo(() => {
    if (l1.b !== 0) return Math.round((-l1.a / l1.b) * 1000) / 1000;
    return 1;
  }, [l1]);

  const currentB1 = useMemo(() => {
    if (l1.b !== 0) return Math.round((-l1.c / l1.b) * 1000) / 1000;
    return 0;
  }, [l1]);

  const currentB2 = useMemo(() => {
    if (l2.b !== 0) return Math.round((-l2.c / l2.b) * 1000) / 1000;
    return 0;
  }, [l2]);

  // Handle Slope-Intercept edits and sync back to standard form
  const handleSlopeChange = (k: number, newB1: number, newB2: number) => {
    // y = kx + b => kx - y + b = 0
    const newL1: LineEquation = { a: k, b: -1, c: newB1 };
    const newL2: LineEquation = { a: k, b: -1, c: newB2 };
    setL1(newL1);
    setL2(newL2);
    setSmartTextL1(formatLineLatex(newL1.a, newL1.b, newL1.c));
    setSmartTextL2(formatLineLatex(newL2.a, newL2.b, newL2.c));
  };

  // Handle Standard Form changes and update smart text
  const handleStandardChange = (newLine1: LineEquation, newLine2: LineEquation) => {
    setL1(newLine1);
    setL2(newLine2);
    setSmartTextL1(formatLineLatex(newLine1.a, newLine1.b, newLine1.c));
    setSmartTextL2(formatLineLatex(newLine2.a, newLine2.b, newLine2.c));
  };

  // Handle Smart Text changes and sync to standard form
  const handleSmartTextL1Change = (text: string) => {
    setSmartTextL1(text);
    const parsed = parseLinearEquation(text);
    if (parsed) {
      setL1(parsed);
    }
  };

  const handleSmartTextL2Change = (text: string) => {
    setSmartTextL2(text);
    const parsed = parseLinearEquation(text);
    if (parsed) {
      setL2(parsed);
    }
  };

  // 2D Calculations
  const calcResult2D = useMemo(
    () => calculateParallelDistance(l1, l2, lang),
    [l1, l2, lang]
  );

  // 3D Calculations
  const calcResult3D = useMemo(
    () => calculateSpaceDistance(l1_3d, l2_3d, lang),
    [l1_3d, l2_3d, lang]
  );

  // Load Exam Preset
  const handleSelectPreset = (preset: ExamPreset) => {
    setDimension('2D');
    setInputMode('standard');
    setSelectedPresetId(preset.id);
    handleStandardChange(preset.l1, preset.l2);
  };

  // Load question from practice quiz into main calculator
  const handleLoadQuizQuestion = (qL1: LineEquation, qL2: LineEquation) => {
    setDimension('2D');
    setInputMode('standard');
    handleStandardChange(qL1, qL2);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Copy full solution
  const copyWithFallback = (textToCopy: string, onSuccess: () => void) => {
    const fallback = () => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        onSuccess();
      } catch (err) {}
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(() => fallback());
    } else {
      fallback();
    }
  };

  const handleCopyFullSolution = () => {
    let text = '';
    if (dimension === '2D') {
      text = `[${t.appName}]\n${t.line1Title}: ${formatLineLatex(l1.a, l1.b, l1.c)}\n${t.line2Title}: ${formatLineLatex(l2.a, l2.b, l2.c)}\n${t.resultTitle}: d = ${calcResult2D.exactDistance.latex} (≈ ${calcResult2D.exactDistance.decimal.toFixed(4)})\n${t.normalizedCoefficients}: A=${calcResult2D.unifiedA}, B=${calcResult2D.unifiedB}, C₁=${calcResult2D.unifiedC1}, C₂'=${calcResult2D.unifiedC2Fraction.toString()}\n${calcResult2D.check.message}`;
    } else {
      text = `[${t.appName} (3D Space)]\nLine 1: P₁(${l1_3d.p.x}, ${l1_3d.p.y}, ${l1_3d.p.z}) + t·(${l1_3d.v.x}, ${l1_3d.v.y}, ${l1_3d.v.z})\nLine 2: P₂(${l2_3d.p.x}, ${l2_3d.p.y}, ${l2_3d.p.z}) + s·(${l2_3d.v.x}, ${l2_3d.v.y}, ${l2_3d.v.z})\nDistance: d ≈ ${calcResult3D.distance.decimal.toFixed(4)}\nRelation: ${calcResult3D.message}`;
    }

    copyWithFallback(text, () => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  // URL hash sync on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('a1=')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const a1 = Number(params.get('a1'));
      const b1 = Number(params.get('b1'));
      const c1 = Number(params.get('c1'));
      const a2 = Number(params.get('a2'));
      const b2 = Number(params.get('b2'));
      const c2 = Number(params.get('c2'));
      const dim = params.get('dim');
      const urlLang = params.get('lang');

      if (!isNaN(a1) && !isNaN(b1) && !isNaN(c1) && !isNaN(a2) && !isNaN(b2) && !isNaN(c2)) {
        setL1({ a: a1, b: b1, c: c1 });
        setL2({ a: a2, b: b2, c: c2 });
        setSmartTextL1(formatLineLatex(a1, b1, c1));
        setSmartTextL2(formatLineLatex(a2, b2, c2));
      }
      if (dim === '2D' || dim === '3D') {
        setDimension(dim);
      }
      if (urlLang && ['en', 'es', 'fr', 'pt', 'zh'].includes(urlLang)) {
        setLang(urlLang as SupportedLanguage);
      }
    }
  }, []);

  // Share Problem URL
  const handleShareProblem = () => {
    const hash = `#a1=${l1.a}&b1=${l1.b}&c1=${l1.c}&a2=${l2.a}&b2=${l2.b}&c2=${l2.c}&dim=${dimension}&lang=${lang}`;
    window.location.hash = hash;
    const url = window.location.origin + window.location.pathname + hash;
    copyWithFallback(url, () => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    });
  };

  const currentSteps2D = useMemo(() => {
    switch (activeMethod) {
      case 'completingSquare':
        return calcResult2D.steps.completingSquareMethod;
      case 'pointToLine':
        return calcResult2D.steps.pointToLineMethod;
      case 'normalVector':
        return calcResult2D.steps.normalVectorMethod;
      case 'standard':
      default:
        return calcResult2D.steps.standardMethod;
    }
  }, [activeMethod, calcResult2D]);

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-20 text-[15px] sm:text-base leading-relaxed">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                  {t.appName}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 hidden sm:inline-block">
                  {t.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action buttons & Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Related Tools link (Visible on md+ screens) */}
            <a
              href="#related-calculators"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.relatedToolsNav}</span>
            </a>

            {/* Language Selector */}
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 transition">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer pr-0.5 text-xs sm:text-sm"
              >
                <option value="en">English (Default)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="pt">Português</option>
                <option value="zh">中文 (简体)</option>
              </select>
            </div>

            {/* Share problem */}
            <button
              type="button"
              onClick={handleShareProblem}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              title={t.shareBtn}
            >
              {shareToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-700 font-semibold">{t.shareCopied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">{t.shareBtn}</span>
                </>
              )}
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              title={t.printBtn}
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">{t.printBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Dimension Mode Switcher: 2D Plane vs 3D Space */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setDimension('2D')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
                dimension === '2D'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t.dim2DTitle}</span>
            </button>

            <button
              type="button"
              onClick={() => setDimension('3D')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
                dimension === '3D'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{t.dim3DTitle}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
            {dimension === '2D' ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                <Repeat className="w-3.5 h-3.5" />
                {t.syncNotice}
              </span>
            ) : (
              <span className="text-slate-600 font-medium">
                {t.dim3DDesc}
              </span>
            )}
          </div>
        </div>

        {/* Practice Quiz Panel (Collapsible) */}
        {showQuiz && (
          <section className="transition">
            <PracticeQuiz t={t} onLoadQuestion={handleLoadQuizQuestion} />
          </section>
        )}

        {/* Inverse Parameter Solver Panel (Collapsible) */}
        {showParamSolver && (
          <section className="transition">
            <ParamSolver t={t} />
          </section>
        )}

        {/* 2D Presets Row (Only visible in 2D mode) */}
        {dimension === '2D' && (
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  {t.presetsTitle}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowParamSolver(!showParamSolver)}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  {showParamSolver ? t.paramSolverCloseBtn : t.paramSolverBtn}
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setShowQuiz(!showQuiz)}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  {t.quizTitle}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {EXAM_PRESETS.map((p, idx) => {
                const isSelected = selectedPresetId === p.id;
                const presetLoc = t.presets[idx] || p;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`text-left p-2.5 rounded-lg border transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-slate-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] text-blue-600 font-bold mb-0.5 truncate">
                        {presetLoc.category}
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">
                        {presetLoc.title}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">
                      {formatLineLatex(p.l1.a, p.l1.b, p.l1.c)}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* 3D Presets Row (Only visible in 3D mode) */}
        {dimension === '3D' && (
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Box className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {lang === 'zh' ? '空间几何典型题目预设（平行与异面直线）' : '3D Spatial Line Presets (Parallel & Skew)'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setL1_3d({ p: { x: 1, y: 0, z: 0 }, v: { x: 0, y: 1, z: 0 } });
                  setL2_3d({ p: { x: 0, y: 0, z: 1 }, v: { x: 1, y: 0, z: 0 } });
                }}
                className="p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition"
              >
                <div className="text-xs font-bold text-indigo-700 mb-0.5">
                  {lang === 'zh' ? '典题 1：空间异面直线距离' : 'Case 1: Standard Skew Lines'}
                </div>
                <div className="text-xs text-slate-600">
                  L₁ 沿 Y 轴，L₂ 沿 X 轴 (Z=1 平移)，公垂线距离 d=1
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setL1_3d({ p: { x: 1, y: 2, z: 0 }, v: { x: 2, y: 1, z: -1 } });
                  setL2_3d({ p: { x: 3, y: 0, z: 1 }, v: { x: 2, y: 1, z: -1 } });
                }}
                className="p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition"
              >
                <div className="text-xs font-bold text-indigo-700 mb-0.5">
                  {lang === 'zh' ? '典题 2：空间平行直线距离' : 'Case 2: 3D Parallel Lines'}
                </div>
                <div className="text-xs text-slate-600">
                  方向向量同为 (2, 1, -1)，外积为 0
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setL1_3d({ p: { x: 0, y: 0, z: 0 }, v: { x: 1, y: 1, z: 1 } });
                  setL2_3d({ p: { x: 0, y: 0, z: 0 }, v: { x: 1, y: -1, z: 0 } });
                }}
                className="p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition"
              >
                <div className="text-xs font-bold text-indigo-700 mb-0.5">
                  {lang === 'zh' ? '典题 3：空间相交直线' : 'Case 3: Intersecting at Origin'}
                </div>
                <div className="text-xs text-slate-600">
                  共面相交于原点 (0, 0, 0)，距离 d=0
                </div>
              </button>
            </div>
          </section>
        )}

        {/* DIMENSION 1: 2D PLANE MODE */}
        {dimension === '2D' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Equations Input & Result */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      {t.inputSectionTitle}
                    </h3>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold gap-0.5">
                    <button
                      type="button"
                      onClick={() => setInputMode('standard')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        inputMode === 'standard'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.modeStandard}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('slope')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        inputMode === 'slope'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.modeSlope}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('smartParse')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        inputMode === 'smartParse'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.modeSmartParse}
                    </button>
                  </div>
                </div>

                {/* Mode 1: Standard Form Inputs */}
                {inputMode === 'standard' && (
                  <div className="space-y-4">
                    {/* Line 1 */}
                    <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="font-bold text-blue-700 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                          {t.line1Title}
                        </span>
                        <span className="font-mono text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-200 font-semibold">
                          <MathView math={`l_1: ${formatLineLatex(l1.a, l1.b, l1.c)}`} />
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                        <div className="min-w-0">
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            {t.coefA}
                          </label>
                          <input
                            type="number"
                            value={l1.a}
                            onChange={(e) =>
                              handleStandardChange({ ...l1, a: Number(e.target.value) || 0 }, l2)
                            }
                            className="w-full min-h-[44px] px-2.5 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                          />
                        </div>
                        <div className="min-w-0">
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            {t.coefB}
                          </label>
                          <input
                            type="number"
                            value={l1.b}
                            onChange={(e) =>
                              handleStandardChange({ ...l1, b: Number(e.target.value) || 0 }, l2)
                            }
                            className="w-full min-h-[44px] px-2.5 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                          />
                        </div>
                        <div className="min-w-0">
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            {t.constC}
                          </label>
                          <input
                            type="number"
                            value={l1.c}
                            onChange={(e) =>
                              handleStandardChange({ ...l1, c: Number(e.target.value) || 0 }, l2)
                            }
                            className="w-full min-h-[44px] px-2.5 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Line 2 */}
                    <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                          {t.line2Title}
                        </span>
                        <span className="font-mono text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-200 font-semibold">
                          <MathView math={`l_2: ${formatLineLatex(l2.a, l2.b, l2.c)}`} />
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                        <div className="min-w-0">
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            {t.coefA}
                          </label>
                          <input
                            type="number"
                            value={l2.a}
                            onChange={(e) =>
                              handleStandardChange(l1, { ...l2, a: Number(e.target.value) || 0 })
                            }
                            className="w-full min-h-[44px] px-2.5 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                          />
                        </div>
                        <div className="min-w-0">
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            {t.coefB}
                          </label>
                          <input
                            type="number"
                            value={l2.b}
                            onChange={(e) =>
                              handleStandardChange(l1, { ...l2, b: Number(e.target.value) || 0 })
                            }
                            className="w-full min-h-[44px] px-2.5 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                          />
                        </div>
                        <div className="min-w-0">
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            {t.constC}
                          </label>
                          <input
                            type="number"
                            value={l2.c}
                            onChange={(e) =>
                              handleStandardChange(l1, { ...l2, c: Number(e.target.value) || 0 })
                            }
                            className="w-full min-h-[44px] px-2.5 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode 2: Slope-Intercept Inputs (Auto-Synced!) */}
                {inputMode === 'slope' && (
                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.slopeK}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={currentSlopeK}
                          onChange={(e) =>
                            handleSlopeChange(Number(e.target.value) || 0, currentB1, currentB2)
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.interceptB1}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={currentB1}
                          onChange={(e) =>
                            handleSlopeChange(currentSlopeK, Number(e.target.value) || 0, currentB2)
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.interceptB2}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={currentB2}
                          onChange={(e) =>
                            handleSlopeChange(currentSlopeK, currentB1, Number(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap gap-4 font-mono">
                      <span>
                        <strong>l₁:</strong> <MathView math={`y = ${currentSlopeK}x ${currentB1 >= 0 ? `+ ${currentB1}` : `${currentB1}`}`} />
                      </span>
                      <span>
                        <strong>l₂:</strong> <MathView math={`y = ${currentSlopeK}x ${currentB2 >= 0 ? `+ ${currentB2}` : `${currentB2}`}`} />
                      </span>
                    </div>
                  </div>
                )}

                {/* Mode 3: Smart Text Parser */}
                {inputMode === 'smartParse' && (
                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-blue-700 mb-1">
                          {t.line1Title}
                        </label>
                        <input
                          type="text"
                          value={smartTextL1}
                          onChange={(e) => handleSmartTextL1Change(e.target.value)}
                          placeholder={t.parsePlaceholder}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-700 mb-1">
                          {t.line2Title}
                        </label>
                        <input
                          type="text"
                          value={smartTextL2}
                          onChange={(e) => handleSmartTextL2Change(e.target.value)}
                          placeholder={t.parsePlaceholder}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Status and Diagnostics Alert */}
                <SignTrapAlert calcResult={calcResult2D} t={t} />
              </div>

              {/* Core Distance Quick Result Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t.resultTitle}
                  </span>
                  <span
                    className={`text-xs sm:text-sm px-3 py-1 rounded-full font-bold border ${
                      !calcResult2D.check.isLine1Valid || !calcResult2D.check.isLine2Valid
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : calcResult2D.check.isParallel && !calcResult2D.check.isCoincident
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : calcResult2D.check.isCoincident
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {!calcResult2D.check.isLine1Valid || !calcResult2D.check.isLine2Valid
                      ? (lang === 'zh' ? '方程无效' : 'Invalid Equation')
                      : calcResult2D.check.isParallel && !calcResult2D.check.isCoincident
                      ? t.statusStrictlyParallel
                      : calcResult2D.check.isCoincident
                      ? t.statusCoincident
                      : t.statusIntersecting}
                  </span>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div>
                    <div className="text-xs sm:text-sm text-slate-500 mb-1 font-medium">
                      {t.exactValueLabel}
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      <MathView math={`d = ${!calcResult2D.check.isLine1Valid || !calcResult2D.check.isLine2Valid ? '\\text{N/A}' : calcResult2D.exactDistance.latex}`} />
                    </div>
                  </div>

                  <div className="sm:border-l sm:border-slate-100 sm:pl-6 text-left sm:text-right">
                    <div className="text-xs sm:text-sm text-slate-500 mb-1 font-medium">
                      {t.decimalLabel}
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-blue-600">
                      {!calcResult2D.check.isLine1Valid || !calcResult2D.check.isLine2Valid ? 'N/A' : `≈ ${calcResult2D.exactDistance.decimal.toFixed(4)}`}
                    </div>
                  </div>
                </div>

                {/* Formula reference */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600">
                  <span>
                    {t.formulaLabel}: <MathView math="d = \frac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}" />
                  </span>
                  <span>
                    {t.normalizedCoefficients}: <MathView math={`A=${calcResult2D.unifiedA}, B=${calcResult2D.unifiedB}`} />
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Coordinate Canvas */}
            <div className="lg:col-span-6 space-y-6">
              <GeometryCanvas l1={l1} l2={l2} calcResult={calcResult2D} t={t} />
            </div>
          </div>
        )}

        {/* DIMENSION 2: 3D SPACE MODE (Parallel & Skew Lines) */}
        {dimension === '3D' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: 3D Inputs & Result */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Box className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    {lang === 'zh' ? '输入三维空间两直线参数' : 'Input 3D Lines Parameters'}
                  </h3>
                </div>

                {/* 3D Line 1 */}
                <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                  <div className="font-bold text-blue-700 text-sm">
                    {t.line3DP1}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">X₁</label>
                      <input
                        type="number"
                        value={l1_3d.p.x}
                        onChange={(e) =>
                          setL1_3d({ ...l1_3d, p: { ...l1_3d.p, x: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Y₁</label>
                      <input
                        type="number"
                        value={l1_3d.p.y}
                        onChange={(e) =>
                          setL1_3d({ ...l1_3d, p: { ...l1_3d.p, y: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Z₁</label>
                      <input
                        type="number"
                        value={l1_3d.p.z}
                        onChange={(e) =>
                          setL1_3d({ ...l1_3d, p: { ...l1_3d.p, z: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="font-bold text-blue-700 text-sm pt-1">
                    {t.line3DV1}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">m₁</label>
                      <input
                        type="number"
                        value={l1_3d.v.x}
                        onChange={(e) =>
                          setL1_3d({ ...l1_3d, v: { ...l1_3d.v, x: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">n₁</label>
                      <input
                        type="number"
                        value={l1_3d.v.y}
                        onChange={(e) =>
                          setL1_3d({ ...l1_3d, v: { ...l1_3d.v, y: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">p₁</label>
                      <input
                        type="number"
                        value={l1_3d.v.z}
                        onChange={(e) =>
                          setL1_3d({ ...l1_3d, v: { ...l1_3d.v, z: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3D Line 2 */}
                <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                  <div className="font-bold text-emerald-700 text-sm">
                    {t.line3DP2}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">X₂</label>
                      <input
                        type="number"
                        value={l2_3d.p.x}
                        onChange={(e) =>
                          setL2_3d({ ...l2_3d, p: { ...l2_3d.p, x: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Y₂</label>
                      <input
                        type="number"
                        value={l2_3d.p.y}
                        onChange={(e) =>
                          setL2_3d({ ...l2_3d, p: { ...l2_3d.p, y: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Z₂</label>
                      <input
                        type="number"
                        value={l2_3d.p.z}
                        onChange={(e) =>
                          setL2_3d({ ...l2_3d, p: { ...l2_3d.p, z: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="font-bold text-emerald-700 text-sm pt-1">
                    {t.line3DV2}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">m₂</label>
                      <input
                        type="number"
                        value={l2_3d.v.x}
                        onChange={(e) =>
                          setL2_3d({ ...l2_3d, v: { ...l2_3d.v, x: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">n₂</label>
                      <input
                        type="number"
                        value={l2_3d.v.y}
                        onChange={(e) =>
                          setL2_3d({ ...l2_3d, v: { ...l2_3d.v, y: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">p₂</label>
                      <input
                        type="number"
                        value={l2_3d.v.z}
                        onChange={(e) =>
                          setL2_3d({ ...l2_3d, v: { ...l2_3d.v, z: Number(e.target.value) || 0 } })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Result Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === 'zh' ? '空间两直线最短距离' : '3D Shortest Distance'}
                  </span>
                  <span
                    className={`text-xs sm:text-sm px-3 py-1 rounded-full font-bold border ${
                      calcResult3D.relation === 'skew'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : calcResult3D.relation === 'parallel'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {calcResult3D.relation === 'skew'
                      ? t.statusSkew
                      : calcResult3D.relation === 'parallel'
                      ? t.statusStrictlyParallel
                      : calcResult3D.relation === 'coincident'
                      ? t.statusCoincident
                      : t.statusIntersecting}
                  </span>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-medium">
                      {lang === 'zh' ? '空间解析解' : '3D Exact Distance'}
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      <MathView math={`d = ${calcResult3D.distance.latex}`} />
                    </div>
                  </div>

                  <div className="sm:border-l sm:border-slate-100 sm:pl-6 text-left sm:text-right">
                    <div className="text-xs text-slate-500 mb-1 font-medium">
                      {t.decimalLabel}
                    </div>
                    <div className="text-2xl font-mono font-bold text-indigo-600">
                      ≈ {calcResult3D.distance.decimal.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <strong>{lang === 'zh' ? '几何判定：' : 'Relation: '}</strong>
                  {calcResult3D.message}
                </div>
              </div>
            </div>

            {/* Right Column: 3D Isometric Canvas */}
            <div className="lg:col-span-6 space-y-6">
              <GeometryCanvas3D l1={l1_3d} l2={l2_3d} calcResult={calcResult3D} t={t} />
            </div>
          </div>
        )}

        {/* DETAILED STEPS SECTION (2D & 3D) */}
        <section id="steps-section" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {dimension === '2D'
                    ? t.tabsTitle
                    : lang === 'zh'
                    ? '3D 空间直线几何向量逐步推导'
                    : '3D Spatial Vector Step-by-Step Derivation'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.tabsSubtitle}
              </p>
            </div>

            {/* 2D Tab switchers (only in 2D mode) */}
            {dimension === '2D' && (
              <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold gap-1">
                <button
                  type="button"
                  onClick={() => setActiveMethod('standard')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeMethod === 'standard'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.methodStandard}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMethod('completingSquare')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeMethod === 'completingSquare'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.methodCompletingSquare}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMethod('pointToLine')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeMethod === 'pointToLine'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.methodPointToLine}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMethod('normalVector')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeMethod === 'normalVector'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.methodNormalVector}
                </button>
              </div>
            )}
          </div>

          {/* Steps rendered with light gray border cards */}
          <div className="space-y-4">
            {dimension === '2D'
              ? currentSteps2D.map((step) => (
                  <StepCard key={step.id} step={step} totalSteps={currentSteps2D.length} t={t} />
                ))
              : calcResult3D.steps.map((step) => (
                  <StepCard key={step.id} step={step} totalSteps={calcResult3D.steps.length} t={t} />
                ))}
          </div>

          {/* Bottom Summary Bar */}
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {lang === 'zh'
                  ? '所有推导步骤均已根据 LaTeX 解析几何规范严格验证，排版整洁，适用于做题复习与笔记整理。'
                  : 'All derivations verified with exact mathematical rigor and clean typography.'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyFullSolution}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold transition shadow-xs"
            >
              {copiedAll ? t.copiedAll : t.copyAll}
            </button>
          </div>
        </section>

        {/* RELATED CALCULATORS DIRECT ENTRIES */}
        <RelatedCalculators
          t={t}
          lang={lang}
          onOpenTool={(tool) => setActiveToolModal(tool)}
          onSwitchTo3D={() => {
            setDimension('3D');
            window.scrollTo({ top: 320, behavior: 'smooth' });
          }}
        />

        {/* FAQ & Theorem Reference Section */}
        <FaqAndKeywords t={t} lang={lang} />
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 text-center text-xs sm:text-sm text-slate-400">
        <p>{t.footerText}</p>
      </footer>

      {/* Mobile Floating Sticky Quick Bar */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-30 bg-white/95 backdrop-blur-md border border-slate-300/90 rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 truncate">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            d
          </div>
          <div className="truncate">
            <div className="text-[10px] text-slate-500 font-medium">
              {dimension === '2D' ? (lang === 'zh' ? '两平行线间距' : '2D Distance') : (lang === 'zh' ? '空间线间距' : '3D Distance')}
            </div>
            <div className="font-extrabold text-slate-900 truncate font-mono text-sm">
              {dimension === '2D'
                ? `d ≈ ${calcResult2D.exactDistance.decimal.toFixed(3)}`
                : `d ≈ ${calcResult3D.distance.decimal.toFixed(3)}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('steps-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 transition"
          >
            {t.mobileViewDerivations}
          </button>
          <a
            href="#related-calculators"
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition"
          >
            {t.relatedToolsNav}
          </a>
        </div>
      </div>

      {/* Interactive Companion Tool Modal */}
      {activeToolModal && (
        <InteractiveToolModal
          toolType={activeToolModal}
          onClose={() => setActiveToolModal(null)}
          onSwitchTo3D={() => {
            setDimension('3D');
            window.scrollTo({ top: 320, behavior: 'smooth' });
          }}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}
