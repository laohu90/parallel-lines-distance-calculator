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
    // Handle floating numbers if input was decimal
    if (!Number.isInteger(num) || !Number.isInteger(den)) {
      const precision = 10000;
      num = Math.round(num * precision);
      den = Math.round(den * precision);
    }

    const g = gcd(num, den);
    const sign = den < 0 ? -1 : 1;
    this.num = (sign * Math.round(num)) / g;
    this.den = Math.abs(Math.round(den)) / g;
  }

  static fromNumber(val: number): Fraction {
    if (Number.isInteger(val)) return new Fraction(val, 1);
    const precision = 100000;
    const num = Math.round(val * precision);
    return new Fraction(num, precision);
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
 */
export function simplifySqrt(n: number): { outside: number; inside: number } {
  const roundN = Math.round(n);
  if (roundN <= 0) return { outside: 0, inside: 1 };
  
  let outside = 1;
  let inside = roundN;

  for (let i = 2; i * i <= inside; i++) {
    while (inside % (i * i) === 0) {
      outside *= i;
      inside = Math.round(inside / (i * i));
    }
  }

  return { outside, inside };
}

/**
 * Rationalizes expression: (|deltaC|) / sqrt(sumSq)
 * Where deltaC is a Fraction, and sumSq is an integer.
 * returns exact LaTeX string and decimal value.
 */
export function formatExactDistance(absDeltaC: Fraction, sumSq: number): {
  latex: string;
  decimal: number;
  simplifiedNum: string;
  simplifiedDen: string;
} {
  const dec = absDeltaC.toNumber() / Math.sqrt(sumSq);
  if (absDeltaC.num === 0) {
    return {
      latex: '0',
      decimal: 0,
      simplifiedNum: '0',
      simplifiedDen: '1',
    };
  }

  const { outside, inside } = simplifySqrt(sumSq);

  // If sumSq is a perfect square (inside === 1)
  if (inside === 1) {
    // Distance = absDeltaC / outside
    const resFrac = absDeltaC.div(outside);
    return {
      latex: resFrac.toLatex(),
      decimal: dec,
      simplifiedNum: `${resFrac.num}`,
      simplifiedDen: `${resFrac.den}`,
    };
  }

  // absDeltaC = P / Q
  // Distance = P / (Q * outside * sqrt(inside))
  // Rationalizing by multiplying sqrt(inside):
  // Distance = (P * sqrt(inside)) / (Q * outside * inside)
  const P = absDeltaC.num;
  const Q = absDeltaC.den;
  const rawDen = Q * outside * inside;
  const g = gcd(P, rawDen);

  const finalNumCoef = P / g;
  const finalDen = rawDen / g;

  let numLatex = '';
  if (finalNumCoef === 1) {
    numLatex = `\\sqrt{${inside}}`;
  } else {
    numLatex = `${finalNumCoef}\\sqrt{${inside}}`;
  }

  let finalLatex = '';
  if (finalDen === 1) {
    finalLatex = numLatex;
  } else {
    finalLatex = `\\frac{${numLatex}}{${finalDen}}`;
  }

  return {
    latex: finalLatex,
    decimal: dec,
    simplifiedNum: numLatex,
    simplifiedDen: `${finalDen}`,
  };
}
