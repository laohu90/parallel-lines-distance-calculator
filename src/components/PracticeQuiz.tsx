import React, { useState } from 'react';
import { LineEquation, formatLineLatex } from '../utils/parallelGeometry';
import { MathView } from './MathView';
import { TranslationDictionary } from '../i18n/translations';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface PracticeQuestion {
  l1: LineEquation;
  l2: LineEquation;
  correctDecimal: number;
  correctLatex: string;
}

const QUIZ_BANK: PracticeQuestion[] = [
  {
    l1: { a: 3, b: 4, c: -5 },
    l2: { a: 3, b: 4, c: 10 },
    correctDecimal: 3,
    correctLatex: '3',
  },
  {
    l1: { a: 5, b: -12, c: 7 },
    l2: { a: 5, b: -12, c: -19 },
    correctDecimal: 2,
    correctLatex: '2',
  },
  {
    l1: { a: 1, b: -1, c: 2 },
    l2: { a: 2, b: -2, c: -6 }, // 2x - 2y - 6 = 0 => x - y - 3 = 0, dist = |2 - (-3)| / sqrt(2) = 5/sqrt(2) approx 3.5355
    correctDecimal: 3.54,
    correctLatex: '\\frac{5\\sqrt{2}}{2}',
  },
  {
    l1: { a: 6, b: 8, c: -2 },
    l2: { a: 3, b: 4, c: 9 }, // l1 / 2 => 3x + 4y - 1 = 0, dist = |-1 - 9| / 5 = 2
    correctDecimal: 2,
    correctLatex: '2',
  },
  {
    l1: { a: 0, b: 1, c: -4 },
    l2: { a: 0, b: 1, c: 3 },
    correctDecimal: 7,
    correctLatex: '7',
  },
];

interface PracticeQuizProps {
  t: TranslationDictionary;
  onLoadQuestion: (l1: LineEquation, l2: LineEquation) => void;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({ t, onLoadQuestion }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userVal, setUserVal] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const q = QUIZ_BANK[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % QUIZ_BANK.length);
    setUserVal('');
    setFeedback('idle');
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(userVal);
    if (isNaN(val)) return;

    if (Math.abs(val - q.correctDecimal) < 0.05) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm md:text-base">
              {t.quizTitle}
            </h3>
            <p className="text-xs text-slate-500">{t.quizSubtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-medium transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.quizNewQuestion}</span>
        </button>
      </div>

      {/* Question prompt */}
      <div className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-lg text-sm text-slate-800 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {t.quizTitle} #{currentIndex + 1}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-base font-medium">
          <span>
            <MathView math={`l_1: ${formatLineLatex(q.l1.a, q.l1.b, q.l1.c)}`} />
          </span>
          <span className="text-slate-400">|</span>
          <span>
            <MathView math={`l_2: ${formatLineLatex(q.l2.a, q.l2.b, q.l2.c)}`} />
          </span>
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleCheck} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="number"
            step="any"
            value={userVal}
            onChange={(e) => {
              setUserVal(e.target.value);
              setFeedback('idle');
            }}
            placeholder={t.quizYourAnswer}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-blue-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={!userVal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition shadow-xs"
        >
          {t.quizSubmit}
        </button>

        <button
          type="button"
          onClick={() => onLoadQuestion(q.l1, q.l2)}
          className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition"
        >
          {t.quizViewSteps}
        </button>
      </form>

      {/* Feedback Banner */}
      {feedback === 'correct' && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            {t.quizCorrect} 正确答案为 <MathView math={`d = ${q.correctLatex}`} /> (≈ {q.correctDecimal})。
          </span>
        </div>
      )}

      {feedback === 'incorrect' && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{t.quizIncorrect}</span>
        </div>
      )}
    </div>
  );
};
