import { Fraction, gcd, simplifySqrt, formatExactDistance } from './fraction';
import { SupportedLanguage } from '../i18n/translations';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Line3D {
  p: Point3D; // Point on the line (x0, y0, z0)
  v: Vector3D; // Direction vector (m, n, p)
}

export type LineRelation3D = 'parallel' | 'coincident' | 'intersecting' | 'skew';

export interface DetailedStep3D {
  id: string;
  stepNumber: number;
  title: string;
  badgeText: string;
  description: string;
  latexFormula: string;
  keyTakeaway: string;
  trapWarning?: string;
}

export interface CalculationResult3D {
  relation: LineRelation3D;
  isParallel: boolean;
  isSkew: boolean;
  distance: {
    latex: string;
    decimal: number;
  };
  crossProduct: Vector3D;
  crossMagnitude: number;
  displacement: Vector3D;
  scalarTripleProduct: number;
  p1: Point3D;
  p2: Point3D;
  steps: DetailedStep3D[];
  message: string;
}

export function crossProduct3D(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export function dotProduct3D(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function vectorNorm3D(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function calculateSpaceDistance(
  l1: Line3D,
  l2: Line3D,
  lang: SupportedLanguage = 'en'
): CalculationResult3D {
  const p1 = l1.p;
  const p2 = l2.p;
  const v1 = l1.v;
  const v2 = l2.v;

  const v1Norm = vectorNorm3D(v1);
  const v2Norm = vectorNorm3D(v2);

  if (v1Norm < 1e-7 || v2Norm < 1e-7) {
    return {
      relation: 'parallel',
      isParallel: false,
      isSkew: false,
      distance: { latex: '0', decimal: 0 },
      crossProduct: { x: 0, y: 0, z: 0 },
      crossMagnitude: 0,
      displacement: { x: 0, y: 0, z: 0 },
      scalarTripleProduct: 0,
      p1,
      p2,
      steps: [],
      message: lang === 'zh' ? '方向向量不能为零向量！' : 'Direction vectors cannot be zero vectors!',
    };
  }

  // Cross product of direction vectors: w = v1 x v2
  const w = crossProduct3D(v1, v2);
  const crossMag = vectorNorm3D(w);
  const isParallel = crossMag < 1e-7;

  // Displacement vector P1P2 = P2 - P1
  const p1p2: Vector3D = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
    z: p2.z - p1.z,
  };

  let relation: LineRelation3D = 'parallel';
  let distDecimal = 0;
  let distLatex = '0';
  const steps: DetailedStep3D[] = [];

  const scalarTriple = dotProduct3D(p1p2, w);

  if (isParallel) {
    // Parallel in 3D: d = ||P1P2 x v1|| / ||v1||
    const pCrossV1 = crossProduct3D(p1p2, v1);
    const numMag = vectorNorm3D(pCrossV1);
    const isCoincident = numMag < 1e-7;

    if (isCoincident) {
      relation = 'coincident';
      distDecimal = 0;
      distLatex = '0';
    } else {
      relation = 'parallel';
      const numSq = pCrossV1.x * pCrossV1.x + pCrossV1.y * pCrossV1.y + pCrossV1.z * pCrossV1.z;
      const denSq = Math.round(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
      const dSq = new Fraction(numSq, denSq);
      const exact = simplifyRadicalFraction(dSq);
      distLatex = exact.latex;
      distDecimal = exact.decimal;
    }

    // Step 1: Parallel Check
    steps.push({
      id: '3d-1',
      stepNumber: 1,
      title: lang === 'zh' ? '检验空间方向向量平行性' : 'Verify 3D Direction Vector Parallelism',
      badgeText: lang === 'zh' ? '平行检验' : 'Parallel Check',
      description:
        lang === 'zh'
          ? '计算两直线方向向量的外积 \\vec{v_1} \\times \\vec{v_2}。若外积为零向量，说明两向量共线，两直线在空间中平行。'
          : 'Compute cross product v₁ × v₂. Since it equals zero, the lines share the same spatial direction and are parallel.',
      latexFormula: `\\vec{v_1} \\times \\vec{v_2} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${v1.x} & ${v1.y} & ${v1.z} \\\\ ${v2.x} & ${v2.y} & ${v2.z} \\end{vmatrix} = (${w.x},\\; ${w.y},\\; ${w.z}) = \\vec{0}`,
      keyTakeaway:
        lang === 'zh'
          ? '外积模长为 0，确认两空间直线平行。'
          : 'Cross product is zero; lines are parallel in 3D space.',
    });

    // Step 2: Displacement & Area
    steps.push({
      id: '3d-2',
      stepNumber: 2,
      title: lang === 'zh' ? '构造空间位移向量与平行四边形面积' : 'Construct Displacement & Geometric Area',
      badgeText: lang === 'zh' ? '几何投影' : 'Geometric Area',
      description:
        lang === 'zh'
          ? '连接直线 l₁ 上的定点 P₁ 和直线 l₂ 上的定点 P₂，构造位移向量 \\vec{P_1 P_2}，并计算与方向向量 \\vec{v_1} 的外积模长。'
          : 'Connect point P₁ on L₁ and P₂ on L₂ to get vector P₁P₂. The norm ||P₁P₂ × v₁|| represents the area of the parallelogram formed by them.',
      latexFormula: `\\vec{P_1 P_2} = (${p1p2.x},\\; ${p1p2.y},\\; ${p1p2.z}), \\quad \\vec{P_1 P_2} \\times \\vec{v_1} = (${pCrossV1.x},\\; ${pCrossV1.y},\\; ${pCrossV1.z})`,
      keyTakeaway:
        lang === 'zh'
          ? `外积模长为 ||\\vec{P_1 P_2} \\times \\vec{v_1}|| = \\sqrt{${Math.round(numMag * numMag)}} \\approx ${numMag.toFixed(4)}`
          : `Area magnitude: ||P₁P₂ × v₁|| ≈ ${numMag.toFixed(4)}`,
    });

    // Step 3: Distance formula
    steps.push({
      id: '3d-3',
      stepNumber: 3,
      title: lang === 'zh' ? '求出空间平行线垂直距离' : 'Calculate Perpendicular Distance',
      badgeText: lang === 'zh' ? '高斯公式' : 'Distance Formula',
      description:
        lang === 'zh'
          ? '平行直线间的距离等于平行四边形面积除以底边模长：d = \\frac{||\\vec{P_1 P_2} \\times \\vec{v_1}||}{||\\vec{v_1}||}。'
          : 'Perpendicular distance equals the parallelogram area divided by base length: d = ||P₁P₂ × v₁|| / ||v₁||.',
      latexFormula: `d = \\frac{\\|\\vec{P_1 P_2} \\times \\vec{v_1}\\|}{\\|\\vec{v_1}\\|} = \\frac{\\sqrt{${Math.round(numMag * numMag)}}}{\\sqrt{${Math.round(v1Norm * v1Norm)}}} \\approx ${distDecimal.toFixed(4)}`,
      keyTakeaway:
        lang === 'zh'
          ? `两空间平行直线间距离为 ${distDecimal.toFixed(4)}。`
          : `Distance between 3D parallel lines is ${distDecimal.toFixed(4)}.`,
    });
  } else {
    // Non-parallel: check coplanarity via scalar triple product
    if (Math.abs(scalarTriple) < 1e-7) {
      // Coplanar and not parallel => Intersecting
      relation = 'intersecting';
      distDecimal = 0;
      distLatex = '0';

      steps.push({
        id: '3d-int-1',
        stepNumber: 1,
        title: lang === 'zh' ? '混合积检验空间共面性' : 'Scalar Triple Product Coplanarity Check',
        badgeText: lang === 'zh' ? '共面检验' : 'Coplanarity',
        description:
          lang === 'zh'
            ? '计算标量混合积 [\\vec{P_1 P_2}, \\vec{v_1}, \\vec{v_2}] = \\vec{P_1 P_2} \\cdot (\\vec{v_1} \\times \\vec{v_2})。结果为 0，说明两直线共面。'
            : 'Scalar triple product is 0, which proves the lines lie on the same 3D plane.',
        latexFormula: `[\\vec{P_1 P_2}, \\vec{v_1}, \\vec{v_2}] = (${p1p2.x})(${w.x}) + (${p1p2.y})(${w.y}) + (${p1p2.z})(${w.z}) = 0`,
        keyTakeaway:
          lang === 'zh'
            ? '两直线在空间中共面且方向不平行，因此必相交于一点，距离为 0。'
            : 'Lines are coplanar and non-parallel: they intersect at a single point, distance is 0.',
      });
    } else {
      // Skew Lines (异面直线)
      relation = 'skew';
      const numSq = scalarTriple * scalarTriple;
      const denSq = Math.round(crossMag * crossMag);
      const dSq = new Fraction(numSq, denSq);
      const exact = simplifyRadicalFraction(dSq);
      distLatex = exact.latex;
      distDecimal = exact.decimal;

      // Step 1: Normal vector to both lines
      steps.push({
        id: '3d-sk-1',
        stepNumber: 1,
        title: lang === 'zh' ? '求解两异面直线的公垂线法向量' : 'Compute Common Perpendicular Normal Vector',
        badgeText: lang === 'zh' ? '公垂线方向' : 'Normal Vector',
        description:
          lang === 'zh'
            ? '两异面直线的公垂线方向同时垂直于 \\vec{v_1} 和 \\vec{v_2}，通过外积 \\vec{n} = \\vec{v_1} \\times \\vec{v_2} 求出：'
            : 'The common perpendicular vector is orthogonal to both line directions, obtained via cross product n = v₁ × v₂:',
        latexFormula: `\\vec{n} = \\vec{v_1} \\times \\vec{v_2} = (${w.x},\\; ${w.y},\\; ${w.z}), \\quad \\|\\vec{n}\\| = \\sqrt{(${w.x})^2 + (${w.y})^2 + (${w.z})^2} \\approx ${crossMag.toFixed(4)}`,
        keyTakeaway:
          lang === 'zh'
            ? `公垂线法向量模长为 ||\\vec{n}|| = ${crossMag.toFixed(4)}。`
            : `Common normal vector magnitude: ||n|| ≈ ${crossMag.toFixed(4)}.`,
      });

      // Step 2: Displacement vector
      steps.push({
        id: '3d-sk-2',
        stepNumber: 2,
        title: lang === 'zh' ? '建立两直线定点连线向量' : 'Construct Connecting Displacement Vector',
        badgeText: lang === 'zh' ? '连线向量' : 'Displacement',
        description:
          lang === 'zh'
            ? '在 l₁ 上取定点 P₁(${p1.x}, ${p1.y}, ${p1.z})，在 l₂ 上取定点 P₂(${p2.x}, ${p2.y}, ${p2.z})，求向量 \\vec{P_1 P_2}：'
            : `Connect point P₁(${p1.x}, ${p1.y}, ${p1.z}) on L₁ to P₂(${p2.x}, ${p2.y}, ${p2.z}) on L₂:`,
        latexFormula: `\\vec{P_1 P_2} = P_2 - P_1 = (${p1p2.x},\\; ${p1p2.y},\\; ${p1p2.z})`,
        keyTakeaway:
          lang === 'zh'
            ? '任何连接两直线的向量在公垂线方向上的投影，就是两异面直线的最短距离。'
            : 'The projection of this vector onto the unit common normal vector equals the minimum distance.',
      });

      // Step 3: Scalar projection
      steps.push({
        id: '3d-sk-3',
        stepNumber: 3,
        title: lang === 'zh' ? '投影法计算异面直线间距离' : 'Calculate Skew Lines Minimum Distance',
        badgeText: lang === 'zh' ? '异面距离' : 'Skew Distance',
        description:
          lang === 'zh'
            ? '异面直线距离公式：d = \\frac{|\\vec{P_1 P_2} \\cdot \\vec{n}|}{\\|\\vec{n}\\|}，即平行六面体体积除以底面积。'
            : 'Skew lines distance formula: d = |P₁P₂ · n| / ||n|| (parallelepiped volume divided by base area).',
        latexFormula: `d = \\frac{|(${p1p2.x})(${w.x}) + (${p1p2.y})(${w.y}) + (${p1p2.z})(${w.z})|}{\\sqrt{${Math.round(crossMag * crossMag)}}} = \\frac{|${scalarTriple.toFixed(2)}|}{${crossMag.toFixed(4)}} \\approx ${distDecimal.toFixed(4)}`,
        keyTakeaway:
          lang === 'zh'
            ? `两空间异面直线的最短垂直距离为 ${distDecimal.toFixed(4)}。`
            : `Shortest perpendicular distance between skew lines is ${distDecimal.toFixed(4)}.`,
      });
    }
  }

  let msg = '';
  if (relation === 'parallel') {
    msg = lang === 'zh' ? '两直线在空间中严格平行，垂直距离恒定。' : 'Lines are strictly parallel in 3D space.';
  } else if (relation === 'coincident') {
    msg = lang === 'zh' ? '两直线完全重合，距离为 0。' : 'Lines are coincident in 3D space (d = 0).';
  } else if (relation === 'intersecting') {
    msg = lang === 'zh' ? '两直线在空间中共面相交，最短距离为 0。' : 'Lines intersect in 3D space (d = 0).';
  } else {
    msg = lang === 'zh' ? '两直线为空间异面直线，存在唯一的公垂线段距离。' : 'Lines are skew lines in 3D space with a unique shortest distance.';
  }

  return {
    relation,
    isParallel,
    isSkew: relation === 'skew',
    distance: {
      latex: distLatex,
      decimal: distDecimal,
    },
    crossProduct: w,
    crossMagnitude: crossMag,
    displacement: p1p2,
    scalarTripleProduct: scalarTriple,
    p1,
    p2,
    steps,
    message: msg,
  };
}
