import React, { useState, useMemo, useEffect } from 'react';
import {
  LineEquation,
  calculateParallelDistance,
  EXAM_PRESETS,
  ExamPreset,
  formatLineLatex,
} from './utils/parallelGeometry';
import { MathView } from './components/MathView';
import { StepCard } from './components/StepCard';
import { GeometryCanvas } from './components/GeometryCanvas';
import { ParamSolver } from './components/ParamSolver';
import { SignTrapAlert } from './components/SignTrapAlert';
import { PracticeQuiz } from './components/PracticeQuiz';
import { FaqAndKeywords } from './components/FaqAndKeywords';
import { parseLinearEquation } from './utils/equationParser';
import { translations, SupportedLanguage } from './i18n/translations';
import {
  Calculator,
  Compass,
  BookOpen,
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
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export default function App() {
  // Language state (default English as required)
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved && ['en', 'es', 'fr', 'pt', 'zh'].includes(saved)) {
      return saved as SupportedLanguage;
    }
    return 'en';
  });

  const t = translations[lang] || translations.en;

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Input mode: standard (Ax + By + C = 0), slope (y = mx + b), smartParse
  const [inputMode, setInputMode] = useState<'standard' | 'slope' | 'smartParse'>('standard');

  // Standard form inputs
  const [l1, setL1] = useState<LineEquation>({ a: 3, b: -4, c: -1 });
  const [l2, setL2] = useState<LineEquation>({ a: 3, b: -4, c: 9 });

  // Slope-intercept inputs
  const [slopeK, setSlopeK] = useState<number>(2);
  const [b1, setB1] = useState<number>(3);
  const [b2, setB2] = useState<number>(-7);

  // Smart text parser inputs
  const [smartTextL1, setSmartTextL1] = useState<string>('3x - 4y - 1 = 0');
  const [smartTextL2, setSmartTextL2] = useState<string>('3x - 4y + 9 = 0');

  // Active method tab
  const [activeMethod, setActiveMethod] = useState<'standard' | 'completingSquare' | 'pointToLine' | 'normalVector'>('standard');

  // Preset selector
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-1');

  // Inverse parameter solver toggle
  const [showParamSolver, setShowParamSolver] = useState<boolean>(false);

  // Practice Quiz toggle
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // Copy state
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<boolean>(false);

  // Read URL Hash on initial mount
  useEffect(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const params = new URLSearchParams(hash);
        const a1 = params.get('a1');
        const b1Val = params.get('b1');
        const c1Val = params.get('c1');
        const a2 = params.get('a2');
        const b2Val = params.get('b2');
        const c2Val = params.get('c2');
        const l = params.get('lang');

        if (a1 && b1Val && c1Val && a2 && b2Val && c2Val) {
          setL1({ a: Number(a1) || 0, b: Number(b1Val) || 0, c: Number(c1Val) || 0 });
          setL2({ a: Number(a2) || 0, b: Number(b2Val) || 0, c: Number(c2Val) || 0 });
        }
        if (l && ['en', 'es', 'fr', 'pt', 'zh'].includes(l)) {
          setLang(l as SupportedLanguage);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync active equations based on input mode
  const activeL1 = useMemo(() => {
    if (inputMode === 'slope') {
      return { a: slopeK, b: -1, c: b1 };
    }
    if (inputMode === 'smartParse') {
      const parsed = parseLinearEquation(smartTextL1);
      if (parsed) return parsed;
    }
    return l1;
  }, [inputMode, l1, slopeK, b1, smartTextL1]);

  const activeL2 = useMemo(() => {
    if (inputMode === 'slope') {
      return { a: slopeK, b: -1, c: b2 };
    }
    if (inputMode === 'smartParse') {
      const parsed = parseLinearEquation(smartTextL2);
      if (parsed) return parsed;
    }
    return l2;
  }, [inputMode, l2, slopeK, b2, smartTextL2]);

  // Compute full analytics with current language
  const calcResult = useMemo(
    () => calculateParallelDistance(activeL1, activeL2, lang),
    [activeL1, activeL2, lang]
  );

  // Load Exam Preset
  const handleSelectPreset = (preset: ExamPreset) => {
    setInputMode('standard');
    setSelectedPresetId(preset.id);
    setL1(preset.l1);
    setL2(preset.l2);
    setSmartTextL1(formatLineLatex(preset.l1.a, preset.l1.b, preset.l1.c));
    setSmartTextL2(formatLineLatex(preset.l2.a, preset.l2.b, preset.l2.c));
  };

  // Load question from practice quiz into main calculator
  const handleLoadQuizQuestion = (qL1: LineEquation, qL2: LineEquation) => {
    setInputMode('standard');
    setL1(qL1);
    setL2(qL2);
    setSmartTextL1(formatLineLatex(qL1.a, qL1.b, qL1.c));
    setSmartTextL2(formatLineLatex(qL2.a, qL2.b, qL2.c));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Copy full solution
  const handleCopyFullSolution = () => {
    const text = `【${t.appName}】
${t.line1Title}: ${formatLineLatex(activeL1.a, activeL1.b, activeL1.c)}
${t.line2Title}: ${formatLineLatex(activeL2.a, activeL2.b, activeL2.c)}
${t.resultTitle}: d = ${calcResult.exactDistance.latex} (≈ ${calcResult.exactDistance.decimal.toFixed(4)})
${t.normalizedCoefficients}: A=${calcResult.unifiedA}, B=${calcResult.unifiedB}, C₁=${calcResult.unifiedC1}, C₂'=${calcResult.unifiedC2Fraction.toString()}
${calcResult.check.message}`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Share Problem URL
  const handleShareProblem = () => {
    const hash = `#a1=${activeL1.a}&b1=${activeL1.b}&c1=${activeL1.c}&a2=${activeL2.a}&b2=${activeL2.b}&c2=${activeL2.c}&lang=${lang}`;
    const url = window.location.origin + window.location.pathname + hash;
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const currentSteps = useMemo(() => {
    switch (activeMethod) {
      case 'completingSquare':
        return calcResult.steps.completingSquareMethod;
      case 'pointToLine':
        return calcResult.steps.pointToLineMethod;
      case 'normalVector':
        return calcResult.steps.normalVectorMethod;
      case 'standard':
      default:
        return calcResult.steps.standardMethod;
    }
  }, [activeMethod, calcResult]);

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-20 text-[15px] sm:text-base leading-relaxed">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t.appName}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 hidden md:inline-block">
                  {t.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action buttons & Language Switcher */}
          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 transition">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="en">English (Default)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                  <option value="zh">中文 (简体)</option>
                </select>
              </div>
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
        {/* Banner Tagline & Quick Tools Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-900">{t.tagline}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowParamSolver(!showParamSolver)}
              className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                showParamSolver
                  ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showParamSolver ? t.paramSolverCloseBtn : t.paramSolverBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQuiz(!showQuiz)}
              className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                showQuiz
                  ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.quizTitle}</span>
            </button>
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

        {/* Curriculum Presets */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {t.presetsTitle}
              </h2>
            </div>
            <span className="text-xs text-slate-500">{t.presetsSubtitle}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {EXAM_PRESETS.map((p, idx) => {
              const isSelected = selectedPresetId === p.id;
              const presetLoc = t.presets[idx] || p;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-left p-3 rounded-xl border transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-slate-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-[11px] text-blue-600 font-bold mb-1 truncate">
                      {presetLoc.category}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                      {presetLoc.title}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    {p.l1.a}x+{p.l1.b}y+{p.l1.c}=0
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Calculation & Geometry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Equations Input & Result */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
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

                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.coefA}
                        </label>
                        <input
                          type="number"
                          value={l1.a}
                          onChange={(e) => setL1({ ...l1, a: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.coefB}
                        </label>
                        <input
                          type="number"
                          value={l1.b}
                          onChange={(e) => setL1({ ...l1, b: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.constC}
                        </label>
                        <input
                          type="number"
                          value={l1.c}
                          onChange={(e) => setL1({ ...l1, c: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
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

                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.coefA}
                        </label>
                        <input
                          type="number"
                          value={l2.a}
                          onChange={(e) => setL2({ ...l2, a: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.coefB}
                        </label>
                        <input
                          type="number"
                          value={l2.b}
                          onChange={(e) => setL2({ ...l2, b: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {t.constC}
                        </label>
                        <input
                          type="number"
                          value={l2.c}
                          onChange={(e) => setL2({ ...l2, c: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Slope-Intercept Inputs */}
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
                        value={slopeK}
                        onChange={(e) => setSlopeK(Number(e.target.value) || 0)}
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
                        value={b1}
                        onChange={(e) => setB1(Number(e.target.value) || 0)}
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
                        value={b2}
                        onChange={(e) => setB2(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap gap-4 font-mono">
                    <span>
                      <strong>l₁:</strong> <MathView math={`y = ${slopeK}x ${b1 >= 0 ? `+ ${b1}` : `${b1}`}`} />
                    </span>
                    <span>
                      <strong>l₂:</strong> <MathView math={`y = ${slopeK}x ${b2 >= 0 ? `+ ${b2}` : `${b2}`}`} />
                    </span>
                  </div>
                </div>
              )}

              {/* Mode 3: Smart Text Parser */}
              {inputMode === 'smartParse' && (
                <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-xs text-slate-600">
                    {t.parseTip}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-blue-700 mb-1">
                        {t.line1Title} ({t.modeSmartParse})
                      </label>
                      <input
                        type="text"
                        value={smartTextL1}
                        onChange={(e) => setSmartTextL1(e.target.value)}
                        placeholder={t.parsePlaceholder}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                      />
                      <div className="text-xs text-slate-500 mt-1">
                        {parseLinearEquation(smartTextL1) ? (
                          <span className="text-emerald-600 font-medium">✓ {t.parsedSuccess}: {formatLineLatex(parseLinearEquation(smartTextL1)!.a, parseLinearEquation(smartTextL1)!.b, parseLinearEquation(smartTextL1)!.c)}</span>
                        ) : (
                          <span className="text-rose-500">{t.parseError}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-700 mb-1">
                        {t.line2Title} ({t.modeSmartParse})
                      </label>
                      <input
                        type="text"
                        value={smartTextL2}
                        onChange={(e) => setSmartTextL2(e.target.value)}
                        placeholder={t.parsePlaceholder}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 font-mono focus:outline-blue-500 font-semibold"
                      />
                      <div className="text-xs text-slate-500 mt-1">
                        {parseLinearEquation(smartTextL2) ? (
                          <span className="text-emerald-600 font-medium">✓ {t.parsedSuccess}: {formatLineLatex(parseLinearEquation(smartTextL2)!.a, parseLinearEquation(smartTextL2)!.b, parseLinearEquation(smartTextL2)!.c)}</span>
                        ) : (
                          <span className="text-rose-500">{t.parseError}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status and Diagnostics Alert */}
              <SignTrapAlert calcResult={calcResult} t={t} />
            </div>

            {/* Core Distance Quick Result Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.resultTitle}
                </span>
                <span
                  className={`text-xs sm:text-sm px-3 py-1 rounded-full font-bold border ${
                    calcResult.check.isParallel && !calcResult.check.isCoincident
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : calcResult.check.isCoincident
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {calcResult.check.isParallel && !calcResult.check.isCoincident
                    ? t.statusStrictlyParallel
                    : calcResult.check.isCoincident
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
                    <MathView math={`d = ${calcResult.exactDistance.latex}`} />
                  </div>
                </div>

                <div className="sm:border-l sm:border-slate-100 sm:pl-6 text-left sm:text-right">
                  <div className="text-xs sm:text-sm text-slate-500 mb-1 font-medium">
                    {t.decimalLabel}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-blue-600">
                    ≈ {calcResult.exactDistance.decimal.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Formula reference */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600">
                <span>
                  {t.formulaLabel}: <MathView math="d = \frac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}" />
                </span>
                <span>
                  {t.normalizedCoefficients}: <MathView math={`A=${calcResult.unifiedA}, B=${calcResult.unifiedB}`} />
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Coordinate Canvas & Quick Rules */}
          <div className="lg:col-span-6 space-y-6">
            <GeometryCanvas l1={activeL1} l2={activeL2} calcResult={calcResult} t={t} />
          </div>
        </div>

        {/* Detailed Step-by-Step Problem Solving & Derivations */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* Method Selection Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t.tabsTitle}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.tabsSubtitle}
              </p>
            </div>

            {/* Tab switchers */}
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
          </div>

          {/* Method description banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              {activeMethod === 'standard' && t.methodStandardDesc}
              {activeMethod === 'completingSquare' && t.methodCompletingSquareDesc}
              {activeMethod === 'pointToLine' && t.methodPointToLineDesc}
              {activeMethod === 'normalVector' && t.methodNormalVectorDesc}
            </div>
          </div>

          {/* Steps rendered with light gray border cards */}
          <div className="space-y-4">
            {currentSteps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                totalSteps={currentSteps.length}
                t={t}
              />
            ))}
          </div>

          {/* Bottom Summary Bar */}
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {lang === 'zh'
                  ? '所有推导步骤均已根据 LaTeX 解析几何规范严格验证，排版整洁，适用于做题复习与笔记整理。'
                  : 'All steps verified with exact LaTeX mathematical rigor, clean typography, ready for homework and review.'}
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

        {/* FAQ & Keywords Section */}
        <FaqAndKeywords t={t} lang={lang} />
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 text-center text-xs sm:text-sm text-slate-400">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}
