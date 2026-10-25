import { LineEquation } from './parallelGeometry';

/**
 * Robust linear equation parser in 2 variables (x, y)
 * Supports:
 * - Standard form: Ax + By + C = 0 (e.g. "3x - 4y + 5 = 0")
 * - RHS Constant form: Ax + By = C (e.g. "2x + 3y = 8" -> 2x + 3y - 8 = 0)
 * - Slope-intercept: y = mx + b (e.g. "y = 2x - 3" -> 2x - y - 3 = 0 or -2x + y + 3 = 0)
 * - Pure vertical: x = 5, 2x - 6 = 0
 * - Pure horizontal: y = -4, 3y + 9 = 0
 * - Fractions: 1/2x + 3/4y - 1 = 0
 */
export function parseLinearEquation(input: string): LineEquation | null {
  if (!input || typeof input !== 'string') return null;

  let str = input.trim().replace(/\s+/g, '');
  if (!str.includes('=')) {
    // If no '=', assume '= 0'
    str = str + '=0';
  }

  const parts = str.split('=');
  if (parts.length !== 2) return null;

  const leftStr = parts[0];
  const rightStr = parts[1];

  // Helper to parse side expression into { a, b, c }
  // ax + by + c
  const parseSide = (expr: string): { a: number; b: number; c: number } | null => {
    let a = 0;
    let b = 0;
    let c = 0;

    // Normalize +/-
    let s = expr;
    if (!s) return { a: 0, b: 0, c: 0 };
    if (s[0] !== '+' && s[0] !== '-') {
      s = '+' + s;
    }

    // Match terms: (+/-)(optional number/fraction)(optional variable x or y)
    const regex = /([+-])(?:([0-9]+(?:\.[0-9]+)?(?:\/[0-9]+(?:\.[0-9]+)?)?))?([xy])?/gi;
    let match: RegExpExecArray | null;

    let cursor = 0;
    while ((match = regex.exec(s)) !== null) {
      if (match.index !== cursor) {
        // Unmatched character
        return null;
      }
      cursor = regex.lastIndex;
      if (match[0] === '') break;

      const sign = match[1] === '-' ? -1 : 1;
      const numStr = match[2];
      const variable = match[3]?.toLowerCase();

      let val = 1;
      if (numStr) {
        if (numStr.includes('/')) {
          const fracParts = numStr.split('/');
          val = parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
        } else {
          val = parseFloat(numStr);
        }
      }

      const signedVal = sign * val;

      if (variable === 'x') {
        a += signedVal;
      } else if (variable === 'y') {
        b += signedVal;
      } else {
        // constant term
        c += signedVal;
      }
    }

    if (cursor !== s.length) return null;
    return { a, b, c };
  };

  const left = parseSide(leftStr);
  const right = parseSide(rightStr);

  if (!left || !right) return null;

  // Equation is Left = Right => (Left.a - Right.a)x + (Left.b - Right.b)y + (Left.c - Right.c) = 0
  let finalA = left.a - right.a;
  let finalB = left.b - right.b;
  let finalC = left.c - right.c;

  // Cannot have both A and B zero
  if (Math.abs(finalA) < 1e-7 && Math.abs(finalB) < 1e-7) {
    return null;
  }

  // Convention: if leading coefficient is negative, multiply entire equation by -1
  if (finalA < -1e-7 || (Math.abs(finalA) < 1e-7 && finalB < -1e-7)) {
    finalA = -finalA;
    finalB = -finalB;
    finalC = -finalC;
  }

  return {
    a: Math.round(finalA * 10000) / 10000,
    b: Math.round(finalB * 10000) / 10000,
    c: Math.round(finalC * 10000) / 10000,
  };
}
