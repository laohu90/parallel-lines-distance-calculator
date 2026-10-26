/**
 * Exact fractional arithmetic and radical simplification helper
 * for high school analytic geometry.
 */

export function gcd(a: number, b: number): number {
  let x = Math.round(Math.abs(a));
  let y = Math.round(Math.abs(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export class Fraction {
  readonly num: number;
  readonly den: number;

  constructor(num: number, den: number = 1) {
    if (den === 0) {
      throw new Error('Denominator cannot be zero');
    }

    let n = num;
    let d = den;

    // Handle floating numbers if input was decimal
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
      const fn = Fraction.fromNumber(n);
      const fd = Fraction.fromNumber(d);
      const res = fn.div(fd);
      n = res.num;
      d = res.den;
    }

    const g = gcd(n, d);
    const sign = d < 0 ? -1 : 1;
    this.num = (sign * Math.round(n)) / g;
    this.den = Math.abs(Math.round(d)) / g;
  }

  static fromNumber(val: number): Fraction {
    if (Number.isInteger(val)) return new Fraction(val, 1);
    if (Math.abs(val) < 1e-12) return new Fraction(0, 1);

    const sign = val < 0 ? -1 : 1;
    const absVal = Math.abs(val);

    // If it has clean decimal representation (e.g. 0.5, 1.25, 2.5, 0.75, 0.125)
    const str = absVal.toFixed(6).replace(/\.?0+$/, '');
    const parts = str.split('.');
    if (parts.length === 2 && parts[1].length <= 6) {
      const decimals = parts[1].length;
      const den = Math.pow(10, decimals);
      const num = Math.round(absVal * den);
      return new Fraction(sign * num, den);
    }

    // Otherwise use continued fraction approximation (up to denominator 10000)
    let p0 = 0, p1 = 1;
    let q0 = 1, q1 = 0;
    let x = absVal;
    for (let iter = 0; iter < 15; iter++) {
      const a = Math.floor(x);
      const p2 = a * p1 + p0;
      const q2 = a * q1 + q0;
      if (q2 > 10000) break;
      p0 = p1; p1 = p2;
      q0 = q1; q1 = q2;
      const rem = x - a;
      if (rem < 1e-9) break;
      x = 1 / rem;
    }
    return new Fraction(sign * p1, q1);
  }

  add(other: Fraction | number): Fraction {
    const o = typeof other === 'number' ? Fraction.fromNumber(other) : other;
    return new Fraction(this.num * o.den + o.num * this.den, this.den * o.den);
  }

  sub(other: Fraction | number): Fraction {
    const o = typeof other === 'number' ? Fraction.fromNumber(other) : other;
    return new Fraction(this.num * o.den - o.num * this.den, this.den * o.den);
  }

  mul(other: Fraction | number): Fraction {
    const o = typeof other === 'number' ? Fraction.fromNumber(other) : other;
    return new Fraction(this.num * o.num, this.den * o.den);
  }

  div(other: Fraction | number): Fraction {
    const o = typeof other === 'number' ? Fraction.fromNumber(other) : other;
    if (o.num === 0) throw new Error('Division by zero');
    return new Fraction(this.num * o.den, this.den * o.num);
  }

  abs(): Fraction {
    return new Fraction(Math.abs(this.num), this.den);
  }

  isZero(): boolean {
    return this.num === 0;
  }

  isOne(): boolean {
    return this.num === this.den;
  }

  toNumber(): number {
    return this.num / this.den;
  }

  toLatex(showSign: boolean = false): string {
    if (this.num === 0) return '0';
    const isNeg = this.num < 0;
    const absNum = Math.abs(this.num);
    const signPrefix = isNeg ? '-' : (showSign ? '+' : '');

    if (this.den === 1) {
      return `${signPrefix}${absNum}`;
    }
    return `${signPrefix}\\frac{${absNum}}{${this.den}}`;
  }

  toString(): string {
    if (this.den === 1) return `${this.num}`;
    return `${this.num}/${this.den}`;
  }
}

/**
 * Simplifies square root of integer N: sqrt(N) = outside * sqrt(inside)
 * e.g., sqrt(25) = 5 * sqrt(1) -> 5
 * sqrt(52) = 2 * sqrt(13)
 * sqrt(90) = 3 * sqrt(10)
 */
export function simplifyIntegerSqrt(n: number): { outside: number; inside: number } {
  const roundN = Math.round(n);
  if (roundN <= 0) return { outside: 0, inside: 1 };
  
  let outside = 1;
  let inside = roundN;

  for (let i = 2; i * i <= inside; i++) {
    const iSq = i * i;
    while (inside % iSq === 0) {
      outside *= i;
      inside = Math.round(inside / iSq);
    }
  }

  return { outside, inside };
}

/**
 * Polymorphic sqrt simplifier for integers or rational fractions
 */
export function simplifySqrt(n: number | Fraction): { outside: number; inside: number } {
  if (typeof n === 'object' && n !== null && 'num' in n && 'den' in n) {
    const frac = n as Fraction;
    const M = frac.num * frac.den;
    const { outside: u, inside: v } = simplifyIntegerSqrt(M);
    return { outside: u / frac.den, inside: v };
  }
  if (typeof n === 'number' && !Number.isInteger(n)) {
    const frac = Fraction.fromNumber(n);
    const M = frac.num * frac.den;
    const { outside: u, inside: v } = simplifyIntegerSqrt(M);
    return { outside: u / frac.den, inside: v };
  }
  return simplifyIntegerSqrt(Math.round(n as number));
}

/**
 * Simplifies the square root of a rational fraction d^2 = P / Q
 * d = sqrt(P / Q) = sqrt(P * Q) / Q = (u * sqrt(v)) / Q = (k * sqrt(v)) / m
 * Produces standard irreducible LaTeX radical and exact decimal.
 */
export function simplifyRadicalFraction(dSq: Fraction): {
  latex: string;
  decimal: number;
  simplifiedNum: string;
  simplifiedDen: string;
} {
  if (dSq.isZero()) {
    return {
      latex: '0',
      decimal: 0,
      simplifiedNum: '0',
      simplifiedDen: '1',
    };
  }

  const P = Math.abs(dSq.num);
  const Q = Math.abs(dSq.den);
  const dec = Math.sqrt(P / Q);

  const M = P * Q;
  const { outside, inside } = simplifyIntegerSqrt(M);

  const g = gcd(outside, Q);
  const k = outside / g;
  const m = Q / g;
  const v = inside;

  let numLatex = '';
  if (v === 1) {
    numLatex = `${k}`;
  } else if (k === 1) {
    numLatex = `\\sqrt{${v}}`;
  } else {
    numLatex = `${k}\\sqrt{${v}}`;
  }

  let finalLatex = '';
  if (v === 1) {
    if (m === 1) {
      finalLatex = `${k}`;
    } else {
      finalLatex = `\\frac{${k}}{${m}}`;
    }
  } else {
    if (m === 1) {
      finalLatex = numLatex;
    } else {
      finalLatex = `\\frac{${numLatex}}{${m}}`;
    }
  }

  return {
    latex: finalLatex,
    decimal: dec,
    simplifiedNum: numLatex,
    simplifiedDen: `${m}`,
  };
}

/**
 * Rationalizes expression: (|deltaC|) / sqrt(sumSq)
 * Where deltaC is a Fraction or number, and sumSq is a Fraction or number.
 * Returns exact LaTeX string and decimal value.
 */
export function formatExactDistance(
  absDeltaC: Fraction | number,
  sumSq: Fraction | number
): {
  latex: string;
  decimal: number;
  simplifiedNum: string;
  simplifiedDen: string;
} {
  const deltaFrac = typeof absDeltaC === 'number' ? Fraction.fromNumber(absDeltaC).abs() : absDeltaC.abs();
  const sumSqFrac = typeof sumSq === 'number' ? Fraction.fromNumber(sumSq) : sumSq;

  if (deltaFrac.isZero()) {
    return {
      latex: '0',
      decimal: 0,
      simplifiedNum: '0',
      simplifiedDen: '1',
    };
  }

  if (sumSqFrac.isZero()) {
    return {
      latex: '\\infty',
      decimal: Infinity,
      simplifiedNum: '\\infty',
      simplifiedDen: '1',
    };
  }

  // d^2 = (deltaC)^2 / sumSq
  const dSq = deltaFrac.mul(deltaFrac).div(sumSqFrac);
  return simplifyRadicalFraction(dSq);
}
