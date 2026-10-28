import { Fraction, gcd, simplifySqrt, formatExactDistance } from './fraction';
import { SupportedLanguage } from '../i18n/translations';
import { STEP_TEXTS } from './stepTexts';

export interface LineEquation {
  a: number; // A in Ax + By + C = 0
  b: number; // B in Ax + By + C = 0
  c: number; // C in Ax + By + C = 0
  label?: string;
}

export interface ParallelCheckResult {
  isLine1Valid: boolean;
  isLine2Valid: boolean;
  isParallel: boolean;
  isCoincident: boolean;
  k?: number; // scaling factor such that (A2, B2) = k * (A1, B1)
  kFraction?: Fraction;
  intersectionPoint?: { x: number; y: number };
  angleDegrees?: number;
  message?: string;
}

export interface DetailedStep {
  id: string;
  stepNumber: number;
  title: string;
  badgeText: string;
  description: string;
  latexFormula: string;
  keyTakeaway: string;
  trapWarning?: string;
}

export interface CalculationResult {
  check: ParallelCheckResult;
  normalizedLine1: { A: number; B: number; C: number };
  normalizedLine2: { A: number; B: number; C: Fraction };
  unifiedA: number;
  unifiedB: number;
  unifiedC1: number;
  unifiedC2Fraction: Fraction;
  cDiffFraction: Fraction;
  sumSq: number;
  exactDistance: {
    latex: string;
    decimal: number;
    simplifiedNum: string;
    simplifiedDen: string;
  };
  samplePointL1: { x: number; y: number };
  closestPointL2: { x: number; y: number };
  steps: {
    standardMethod: DetailedStep[];
    completingSquareMethod: DetailedStep[];
    pointToLineMethod: DetailedStep[];
    normalVectorMethod: DetailedStep[];
  };
}

/**
 * Checks if two lines are parallel and valid
 */
export function analyzeParallelism(l1: LineEquation, l2: LineEquation, lang: SupportedLanguage = 'en'): ParallelCheckResult {
  const isLine1Valid = !(Math.abs(l1.a) < 1e-9 && Math.abs(l1.b) < 1e-9);
  const isLine2Valid = !(Math.abs(l2.a) < 1e-9 && Math.abs(l2.b) < 1e-9);

  if (!isLine1Valid || !isLine2Valid) {
    const invalidName = !isLine1Valid ? (lang === 'zh' ? '直线 1 (l₁)' : 'Line 1') : (lang === 'zh' ? '直线 2 (l₂)' : 'Line 2');
    const msg =
      lang === 'zh'
        ? `【方程无效错误】${invalidName} 的 x 和 y 系数不能同时为 0（这并不是一条直线，方程无意义）！`
        : lang === 'es'
        ? `¡Ecuación no válida! Los coeficientes A y B de ${invalidName} no pueden ser ambos cero.`
        : lang === 'fr'
        ? `Équation invalide ! Les coefficients de ${invalidName} ne peuvent pas être tous les deux nuls.`
        : lang === 'pt'
        ? `Equação inválida! Os coeficientes de ${invalidName} não podem ser ambos nulos.`
        : `Invalid Equation Error: Coefficients A and B of ${invalidName} cannot both be zero! This is not a line.`;

    return {
      isLine1Valid,
      isLine2Valid,
      isParallel: false,
      isCoincident: false,
      message: msg,
    };
  }

  // Cross product of normal vectors: A1 * B2 - A2 * B1
  const cross = l1.a * l2.b - l2.a * l1.b;
  const isParallel = Math.abs(cross) < 1e-9;

  if (!isParallel) {
    // Intersecting lines: solve system A1 x + B1 y = -C1, A2 x + B2 y = -C2
    const det = cross;
    const x = ((-l1.c) * l2.b - (-l2.c) * l1.b) / det;
    const y = (l1.a * (-l2.c) - l2.a * (-l1.c)) / det;

    const dot = l1.a * l2.a + l1.b * l2.b;
    const mag1 = Math.sqrt(l1.a * l1.a + l1.b * l1.b);
    const mag2 = Math.sqrt(l2.a * l2.a + l2.b * l2.b);
    const cosTheta = Math.abs(dot) / (mag1 * mag2);
    const angleRad = Math.acos(Math.min(1, Math.max(-1, cosTheta)));
    const angleDeg = (angleRad * 180) / Math.PI;

    const msg =
      lang === 'zh'
        ? '两直线不平行，在平面上相交！相交直线之间的距离为 0。'
        : lang === 'es'
        ? '¡Las rectas no son paralelas, se cortan en un punto! La distancia es 0.'
        : lang === 'fr'
        ? 'Les droites ne sont pas parallèles, elles sont sécantes ! Distance = 0.'
        : lang === 'pt'
        ? 'As retas não são paralelas, elas se cruzam! A distância é 0.'
        : 'Lines are not parallel; they intersect at a point! Distance is 0.';

    return {
      isLine1Valid,
      isLine2Valid,
      isParallel: false,
      isCoincident: false,
      intersectionPoint: { x, y },
      angleDegrees: angleDeg,
      message: msg,
    };
  }

  // Determine scaling ratio k = A2 / A1 (or B2 / B1)
  let k = 1;
  if (Math.abs(l1.a) > 1e-7) {
    k = l2.a / l1.a;
  } else {
    k = l2.b / l1.b;
  }
  const kFraction = Fraction.fromNumber(k);

  // Check coincidence: C2 == k * C1
  const isCoincident = Math.abs(l2.c - k * l1.c) < 1e-7;

  let msg = '';
  if (isCoincident) {
    msg =
      lang === 'zh'
        ? '两直线完全重合，平行直线间距离为 0。'
        : lang === 'es'
        ? 'Las rectas coinciden exactamente, la distancia es 0.'
        : lang === 'fr'
        ? 'Les droites sont confondues, la distance est 0.'
        : lang === 'pt'
        ? 'As retas são coincidentes, a distância é 0.'
        : 'Lines are coincident, distance is 0.';
  } else {
    msg =
      lang === 'zh'
        ? '两直线严格平行，存在唯一恒定的垂线段距离。'
        : lang === 'es'
        ? 'Las rectas son estrictamente paralelas; existe una distancia constante.'
        : lang === 'fr'
        ? 'Les droites sont strictement parallèles; distance constante.'
        : lang === 'pt'
        ? 'As retas são estritamente paralelas; distância constante.'
        : 'Lines are strictly parallel; unique constant perpendicular distance.';
  }

  return {
    isLine1Valid,
    isLine2Valid,
    isParallel: true,
    isCoincident,
    k,
    kFraction,
    message: msg,
  };
}

/**
 * Format linear equation in LaTeX Ax + By + C = 0
 */
export function formatLineLatex(A: number, B: number, C: number | Fraction): string {
  let res = '';
  // A term
  if (A !== 0) {
    if (A === 1) res += 'x';
    else if (A === -1) res += '-x';
    else res += `${A}x`;
  }

  // B term
  if (B !== 0) {
    const sign = B > 0 ? (res ? '+' : '') : '-';
    const absB = Math.abs(B);
    const coef = absB === 1 ? '' : `${absB}`;
    res += `${sign}${coef}y`;
  }

  // C term
  if (typeof C === 'number') {
    if (C !== 0 || res === '') {
      const sign = C > 0 ? (res ? '+' : '') : '-';
      const absC = Math.abs(C);
      res += `${sign}${absC}`;
    }
  } else {
    if (!C.isZero() || res === '') {
      res += C.toLatex(res !== '');
    }
  }

  return `${res} = 0`;
}

/**
 * Finds a neat rational sample point on Ax + By + C = 0
 */
export function getSamplePoint(A: number, B: number, C: number): { x: number; y: number } {
  // Try integer search near origin
  if (B !== 0) {
    for (let tryX = 0; tryX <= 5; tryX++) {
      const candidates = [tryX, -tryX];
      for (const x of candidates) {
        const rem = -(A * x + C);
        if (Math.abs(rem % B) < 1e-7) {
          return { x, y: rem / B };
        }
      }
    }
    // Default to x=0
    return { x: 0, y: -C / B };
  } else {
    // Vertical line x = -C / A
    return { x: -C / A, y: 0 };
  }
}

/**
 * Complete step-by-step solver with Completing-the-Square breakdown
 */
export function calculateParallelDistance(
  l1: LineEquation,
  l2: LineEquation,
  lang: SupportedLanguage = 'en'
): CalculationResult {
  const check = analyzeParallelism(l1, l2, lang);
  const st = STEP_TEXTS[lang] || STEP_TEXTS.en;

  // If invalid equation
  if (!check.isLine1Valid || !check.isLine2Valid) {
    const defaultDist = formatExactDistance(new Fraction(0), 1);
    return {
      check,
      normalizedLine1: { A: l1.a, B: l1.b, C: l1.c },
      normalizedLine2: { A: l2.a, B: l2.b, C: new Fraction(l2.c) },
      unifiedA: l1.a,
      unifiedB: l1.b,
      unifiedC1: l1.c,
      unifiedC2Fraction: new Fraction(l2.c),
      cDiffFraction: new Fraction(0),
      sumSq: 1,
      exactDistance: { latex: '\\text{Undefined}', decimal: 0, simplifiedNum: '0', simplifiedDen: '1' },
      samplePointL1: { x: 0, y: 0 },
      closestPointL2: { x: 0, y: 0 },
      steps: {
        standardMethod: [
          {
            id: 'inv-1',
            stepNumber: 1,
            title: lang === 'zh' ? '方程有效性检验失败（非直线）' : 'Equation Validity Check Failed',
            badgeText: lang === 'zh' ? '方程无效' : 'Invalid Equation',
            description: check.message || 'Equation is invalid',
            latexFormula: 'A = 0 \\text{ and } B = 0 \\implies \\text{Not a line}',
            keyTakeaway: lang === 'zh' ? '一次方程 Ax + By + C = 0 中系数 A 和 B 不能同时为 0。' : 'Coefficients A and B in linear equation cannot both be zero.',
          },
        ],
        completingSquareMethod: [],
        pointToLineMethod: [],
        normalVectorMethod: [],
      },
    };
  }

  // If not parallel
  if (!check.isParallel) {
    const defaultDist = formatExactDistance(new Fraction(0), 1);
    return {
      check,
      normalizedLine1: { A: l1.a, B: l1.b, C: l1.c },
      normalizedLine2: { A: l2.a, B: l2.b, C: new Fraction(l2.c) },
      unifiedA: l1.a,
      unifiedB: l1.b,
      unifiedC1: l1.c,
      unifiedC2Fraction: new Fraction(l2.c),
      cDiffFraction: new Fraction(0),
      sumSq: l1.a * l1.a + l1.b * l1.b,
      exactDistance: defaultDist,
      samplePointL1: getSamplePoint(l1.a, l1.b, l1.c),
      closestPointL2: { x: 0, y: 0 },
      steps: {
        standardMethod: [
          {
            id: 'not-par-1',
            stepNumber: 1,
            title: lang === 'zh' ? '检验直线平行性失败' : 'Parallelism Check Failed',
            badgeText: lang === 'zh' ? '相交直线' : 'Intersecting',
            description: check.message || 'Lines are not parallel',
            latexFormula: `A_1 B_2 - A_2 B_1 = (${l1.a})(${l2.b}) - (${l2.a})(${l1.b}) = ${l1.a * l2.b - l2.a * l1.b} \\neq 0`,
            keyTakeaway: lang === 'zh' ? '两直线不平行，在平面上相交于一点，不存在固定的平行线距离。' : 'Lines are not parallel; they intersect at a single point.',
          },
        ],
        completingSquareMethod: [],
        pointToLineMethod: [],
        normalVectorMethod: [],
      },
    };
  }

  // Unified A and B from L1
  const k = check.k || 1;
  const kFrac = check.kFraction || new Fraction(1);
  const unifiedA = l1.a;
  const unifiedB = l1.b;
  const unifiedC1 = l1.c;
  const unifiedC2Fraction = Fraction.fromNumber(l2.c).div(kFrac);

  const cDiffFraction = Fraction.fromNumber(unifiedC1).sub(unifiedC2Fraction);
  const absDeltaC = cDiffFraction.abs();
  const fracA = Fraction.fromNumber(unifiedA);
  const fracB = Fraction.fromNumber(unifiedB);
  const sumSqFrac = fracA.mul(fracA).add(fracB.mul(fracB));
  const sumSq = unifiedA * unifiedA + unifiedB * unifiedB;
  const exactDistance = formatExactDistance(absDeltaC, sumSqFrac);
  const dSq = absDeltaC.mul(absDeltaC).div(sumSqFrac);

  const sampleP = getSamplePoint(unifiedA, unifiedB, unifiedC1);
  const l2ValAtP = unifiedA * sampleP.x + unifiedB * sampleP.y + unifiedC2Fraction.toNumber();
  const qX = sampleP.x - (l2ValAtP * unifiedA) / sumSq;
  const qY = sampleP.y - (l2ValAtP * unifiedB) / sumSq;
  const closestQ = { x: qX, y: qY };

  // Helper to format step 4 formula with step-by-step radical reduction
  const step4Formula = (() => {
    if (absDeltaC.isZero()) {
      return `d = \\frac{0}{\\sqrt{${sumSq}}} = 0`;
    }
    if (sumSqFrac.den === 1) {
      const sumSqInt = sumSqFrac.num;
      const { outside, inside } = simplifySqrt(sumSqInt);
      if (inside === 1) {
        return `d = \\frac{${absDeltaC.toLatex()}}{\\sqrt{${sumSqInt}}} = \\frac{${absDeltaC.toLatex()}}{${outside}} = ${exactDistance.latex} \\approx ${exactDistance.decimal.toFixed(4)}`;
      } else {
        const denStr = outside === 1 ? `\\sqrt{${inside}}` : `${outside}\\sqrt{${inside}}`;
        return `d = \\frac{${absDeltaC.toLatex()}}{\\sqrt{${sumSqInt}}} = \\frac{${absDeltaC.toLatex()}}{${denStr}} = ${exactDistance.latex} \\approx ${exactDistance.decimal.toFixed(4)}`;
      }
    } else {
      return `d = \\frac{${absDeltaC.toLatex()}}{\\sqrt{${sumSq}}} = \\frac{${absDeltaC.toLatex()}}{\\sqrt{${sumSqFrac.toLatex()}}} = \\sqrt{${dSq.toLatex()}} = ${exactDistance.latex} \\approx ${exactDistance.decimal.toFixed(4)}`;
    }
  })();

  // ==========================================
  // METHOD 1: Standard Formula (Unified Coefficients)
  // ==========================================
  const standardMethod: DetailedStep[] = [
    {
      id: 'std-1',
      stepNumber: 1,
      title: st.std1Title,
      badgeText: st.std1Badge,
      description: st.std1Desc,
      latexFormula: `A_1 B_2 - A_2 B_1 = (${l1.a}) \\times (${l2.b}) - (${l2.a}) \\times (${l1.b}) = ${l1.a * l2.b - l2.a * l1.b} = 0`,
      keyTakeaway: st.std1Takeaway,
    },
    {
      id: 'std-2',
      stepNumber: 2,
      title: st.std2Title,
      badgeText: st.std2Badge,
      description: k === 1 ? st.std2DescEqual : st.std2DescScaled(kFrac.toLatex()),
      latexFormula:
        k === 1
          ? `l_1: ${formatLineLatex(unifiedA, unifiedB, unifiedC1)}, \\quad l_2: ${formatLineLatex(unifiedA, unifiedB, unifiedC2Fraction)}`
          : `l_2: ${formatLineLatex(l2.a, l2.b, l2.c)} \\xrightarrow{\\div (${kFrac.toLatex()})} ${formatLineLatex(unifiedA, unifiedB, unifiedC2Fraction)}`,
      keyTakeaway: st.std2Takeaway(unifiedA, unifiedB, unifiedC1, unifiedC2Fraction.toLatex()),
      trapWarning: k !== 1 ? st.std2Trap(l1.c, l2.c) : undefined,
    },
    {
      id: 'std-3',
      stepNumber: 3,
      title: st.std3Title,
      badgeText: st.std3Badge,
      description: st.std3Desc,
      latexFormula: `d = \\frac{|C_1 - C_2'|}{\\sqrt{A^2 + B^2}} = \\frac{|${unifiedC1} - (${unifiedC2Fraction.toLatex()})|}{\\sqrt{(${unifiedA})^2 + (${unifiedB})^2}}`,
      keyTakeaway: st.std3Takeaway(
        unifiedC1,
        unifiedC2Fraction.toLatex(),
        cDiffFraction.toLatex(),
        absDeltaC.toLatex()
      ),
      trapWarning: unifiedC2Fraction.toNumber() < 0 ? st.std3Trap : undefined,
    },
    {
      id: 'std-4',
      stepNumber: 4,
      title: st.std4Title,
      badgeText: st.std4Badge,
      description: st.std4Desc,
      latexFormula: step4Formula,
      keyTakeaway: st.std4Takeaway(exactDistance.latex, exactDistance.decimal),
    },
  ];

  // ==========================================
  // METHOD 2: Completing the Square Proof
  // ==========================================
  const completingSquareMethod: DetailedStep[] = [];
  if (unifiedB !== 0) {
    const x0 = sampleP.x;
    const y0 = sampleP.y;
    const deltaNum = unifiedC2Fraction.sub(unifiedC1);

    const partA = unifiedA !== 0 ? `${unifiedA}(${x0})` : '';
    const partB = unifiedB !== 0 ? `${unifiedB >= 0 && partA ? ' + ' : (unifiedB < 0 ? ' - ' : '')}${Math.abs(unifiedB)}(${y0})` : '';
    const partC = unifiedC1 !== 0 ? `${unifiedC1 >= 0 && (partA || partB) ? ' + ' : (unifiedC1 < 0 ? ' - ' : '')}${Math.abs(unifiedC1)}` : '';
    const substLatex = `${partA}${partB}${partC} = 0`;

    completingSquareMethod.push({
      id: 'sq-1',
      stepNumber: 1,
      title: st.sq1Title,
      badgeText: st.sq1Badge,
      description: st.sq1Desc(formatLineLatex(unifiedA, unifiedB, unifiedC1)),
      latexFormula: `P(${x0},\\; ${y0}) \\in l_1 \\implies ${substLatex}`,
      keyTakeaway: st.sq1Takeaway(x0, y0),
    });

    completingSquareMethod.push({
      id: 'sq-2',
      stepNumber: 2,
      title: st.sq2Title,
      badgeText: st.sq2Badge,
      description: st.sq2Desc,
      latexFormula: `S(x) = (x - (${x0}))^2 + \\left(\\frac{${unifiedA}x + ${unifiedB}y + ${unifiedC2Fraction.toLatex()}}{B}\\right)^2`,
      keyTakeaway: st.sq2Takeaway,
    });

    completingSquareMethod.push({
      id: 'sq-3',
      stepNumber: 3,
      title: st.sq3Title,
      badgeText: st.sq3Badge,
      description: st.sq3Desc(x0),
      latexFormula: `S(u) = \\frac{A^2 + B^2}{B^2} u^2 + \\frac{2A(${deltaNum.toLatex()})}{B^2} u + \\frac{(${deltaNum.toLatex()})^2}{B^2} = \\frac{${sumSq}}{${unifiedB * unifiedB}} u^2 + \\frac{2(${unifiedA})(${deltaNum.toLatex()})}{${unifiedB * unifiedB}} u + \\frac{(${deltaNum.toLatex()})^2}{${unifiedB * unifiedB}}`,
      keyTakeaway: st.sq3Takeaway(sumSq, unifiedB * unifiedB),
    });

    completingSquareMethod.push({
      id: 'sq-4',
      stepNumber: 4,
      title: st.sq4Title,
      badgeText: st.sq4Badge,
      description: st.sq4Desc,
      latexFormula: `S(u) = \\frac{A^2+B^2}{B^2} \\left( u + \\frac{A(C_2' - C_1)}{A^2+B^2} \\right)^2 + \\frac{(C_1 - C_2')^2}{A^2+B^2}`,
      keyTakeaway: st.sq4Takeaway,
    });

    completingSquareMethod.push({
      id: 'sq-5',
      stepNumber: 5,
      title: st.sq5Title,
      badgeText: st.sq5Badge,
      description: st.sq5Desc,
      latexFormula: `\\min S = \\frac{(C_1 - C_2')^2}{A^2+B^2} \\implies d = \\sqrt{\\min S} = \\frac{|C_1 - C_2'|}{\\sqrt{A^2+B^2}} = ${exactDistance.latex}`,
      keyTakeaway: st.sq5Takeaway(exactDistance.latex, closestQ.x, closestQ.y),
    });
  } else {
    completingSquareMethod.push({
      id: 'sq-v1',
      stepNumber: 1,
      title: 'Vertical Line Case: B = 0',
      badgeText: 'Vertical',
      description: `Vertical lines: x = -C₁/A and x = -C₂'/A. Distance is purely horizontal:`,
      latexFormula: `d = \\left|-\\frac{C_1}{A} - \\left(-\\frac{C_2'}{A}\\right)\\right| = \\frac{|C_1 - C_2'|}{|A|} = ${exactDistance.latex}`,
      keyTakeaway: `Distance is the absolute difference between x-intercepts: ${exactDistance.latex}.`,
    });
  }

  // ==========================================
  // METHOD 3: Point-to-Line Reduction
  // ==========================================
  const pointToLineMethod: DetailedStep[] = [
    {
      id: 'pt-1',
      stepNumber: 1,
      title: st.pt1Title,
      badgeText: st.pt1Badge,
      description: st.pt1Desc,
      latexFormula: `P(x_0, y_0) = (${sampleP.x},\\; ${sampleP.y}) \\in l_1`,
      keyTakeaway: st.pt1Takeaway(unifiedA, unifiedB, unifiedC1, sampleP.x, sampleP.y),
    },
    {
      id: 'pt-2',
      stepNumber: 2,
      title: st.pt2Title,
      badgeText: st.pt2Badge,
      description: st.pt2Desc,
      latexFormula: `d = \\frac{|(${l2.a}) \\times (${sampleP.x}) + (${l2.b}) \\times (${sampleP.y}) + (${l2.c})|}{\\sqrt{(${l2.a})^2 + (${l2.b})^2}} = \\frac{|${l2.a * sampleP.x + l2.b * sampleP.y + l2.c}|}{\\sqrt{${l2.a * l2.a + l2.b * l2.b}}} = ${exactDistance.latex}`,
      keyTakeaway: st.pt2Takeaway,
    },
  ];

  // ==========================================
  // METHOD 4: Normal Vector & Projection
  // ==========================================
  const normalVectorMethod: DetailedStep[] = [
    {
      id: 'vec-1',
      stepNumber: 1,
      title: st.vec1Title,
      badgeText: st.vec1Badge,
      description: st.vec1Desc,
      latexFormula: `\\vec{n} = (${unifiedA},\\; ${unifiedB}), \\quad |\\vec{n}| = \\sqrt{(${unifiedA})^2 + (${unifiedB})^2} = \\sqrt{${sumSq}}`,
      keyTakeaway: st.vec1Takeaway,
    },
    {
      id: 'vec-2',
      stepNumber: 2,
      title: st.vec2Title,
      badgeText: st.vec2Badge,
      description: st.vec2Desc(sampleP.x, sampleP.y, closestQ.x, closestQ.y),
      latexFormula: `d = \\frac{|\\vec{PQ} \\cdot \\vec{n}|}{|\\vec{n}|} = \\frac{|C_1 - C_2'|}{|\\vec{n}|} = ${exactDistance.latex}`,
      keyTakeaway: st.vec2Takeaway,
    },
  ];

  return {
    check,
    normalizedLine1: { A: unifiedA, B: unifiedB, C: unifiedC1 },
    normalizedLine2: { A: unifiedA, B: unifiedB, C: unifiedC2Fraction },
    unifiedA,
    unifiedB,
    unifiedC1,
    unifiedC2Fraction,
    cDiffFraction,
    sumSq,
    exactDistance,
    samplePointL1: sampleP,
    closestPointL2: closestQ,
    steps: {
      standardMethod,
      completingSquareMethod,
      pointToLineMethod,
      normalVectorMethod,
    },
  };
}


/**
 * High school typical exam question presets
 */
export interface ExamPreset {
  id: string;
  category: string;
  title: string;
  l1: LineEquation;
  l2: LineEquation;
  description: string;
  trapHint: string;
}

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'preset-1',
    category: '高频真题·系数一致',
    title: '标准整系数基础题（3:4:5 勾股数）',
    l1: { a: 3, b: -4, c: -1 },
    l2: { a: 3, b: -4, c: 9 },
    description: '求直线 3x - 4y - 1 = 0 与 3x - 4y + 9 = 0 的距离。',
    trapHint: '最基础题型，A=3, B=-4，分母根号下为 3²+(-4)²=25，开方为 5。分子注意 |-1 - 9| = 10。',
  },
  {
    id: 'preset-2',
    category: '高考易错·倍数同化',
    title: '系数成倍数陷阱题（2倍缩放）',
    l1: { a: 2, b: 3, c: -8 },
    l2: { a: 4, b: 6, c: 5 },
    description: '求直线 2x + 3y - 8 = 0 与 4x + 6y + 5 = 0 的距离。',
    trapHint: '【大坑】4x+6y 是 2x+3y 的 2 倍！直接套公式算 |-8 - 5| 必错！必须将 4x+6y+5=0 同除以 2 得到 C₂\' = 5/2。',
  },
  {
    id: 'preset-3',
    category: '符号陷阱·负号翻转',
    title: '全负号与相反系数陷阱',
    l1: { a: -1, b: 2, c: -4 },
    l2: { a: 2, b: -4, c: 7 },
    description: '求直线 -x + 2y - 4 = 0 与 2x - 4y + 7 = 0 的距离。',
    trapHint: '缩放倍数为 -2！两边同除以 -2 时，C 变为 -7/2，负负得正，极易丢掉负号。',
  },
  {
    id: 'preset-4',
    category: '高考真题·含根号',
    title: '全国卷真题（有理化化简）',
    l1: { a: 1, b: -2, c: 1 },
    l2: { a: 1, b: -2, c: -4 },
    description: '求直线 x - 2y + 1 = 0 与 x - 2y - 4 = 0 的距离。',
    trapHint: '分母为 √(1² + (-2)²) = √5，结果为 5/√5 = √5。考察根号分母有理化能力。',
  },
  {
    id: 'preset-5',
    category: '特殊位置·水平铅垂',
    title: '水平线/铅垂线特例',
    l1: { a: 0, b: 1, c: -3 }, // y - 3 = 0
    l2: { a: 0, b: 1, c: 5 },  // y + 5 = 0
    description: '求水平直线 y = 3 与 y = -5 的距离。',
    trapHint: 'A=0, B=1，距离直接是纵截距之差的绝对值 |3 - (-5)| = 8。',
  },
  {
    id: 'preset-6',
    category: '二次配方·经典证明',
    title: '配方法拆解极值教学经典模型',
    l1: { a: 1, b: 1, c: -2 },
    l2: { a: 1, b: 1, c: 4 },
    description: '求直线 x + y - 2 = 0 与 x + y + 4 = 0 之间的最短距离。',
    trapHint: '用配方法将动点距离平方展开为二次函数，顶点处配方完美消去交叉项，直观感受解析几何的精妙！',
  },
];
