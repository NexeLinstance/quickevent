// src/expr/builtins.js
// Pure functions callable from expressions. No side effects.

export const BUILTINS = {
  // Math
  sum:   (...a) => a.flat().reduce((s, x) => s + Number(x), 0),
  sub:   (...a) => a.flat().map(Number).reduce((s, x) => s - x),
  min:   (...a) => Math.min(...a.flat().map(Number)),
  max:   (...a) => Math.max(...a.flat().map(Number)),
  avg:   (...a) => { const v = a.flat().map(Number); return v.reduce((s, x) => s + x, 0) / v.length; },
  count: (...a) => a.flat().length,
  abs:   x => Math.abs(x),
  floor: x => Math.floor(x),
  ceil:  x => Math.ceil(x),
  round: x => Math.round(x),
  sqrt:  x => Math.sqrt(x),
  pow:   (x, n) => Math.pow(x, n),

  // String
  replace:   (s, a, b) => String(s).split(String(a)).join(String(b)),
  upperCase: s => String(s).toUpperCase(),
  lowerCase: s => String(s).toLowerCase(),
  trim:      s => String(s).trim(),
  slice:     (s, a, b) => String(s).slice(a, b),
  length:    s => (Array.isArray(s) ? s.length : String(s).length),
  startsWith:(s, p) => String(s).startsWith(String(p)),
  endsWith:  (s, p) => String(s).endsWith(String(p)),
  indexOf:   (s, p) => String(s).indexOf(String(p)),
  split:     (s, sep) => String(s).split(sep ?? /\s+/),
};