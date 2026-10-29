// src/core/schema.js
import { createError } from './errors.js';

// ─────────────────────────────────────────────────────────────
// Validators
// Each validator returns true or false.
// A type may be followed by "?" to mark it optional.
// ─────────────────────────────────────────────────────────────

const VALIDATORS = {
  any: () => true,
  string: v => typeof v === 'string',
  number: v => typeof v === 'number' && !Number.isNaN(v),
  boolean: v => typeof v === 'boolean',
  selector: v =>
    (typeof v === 'string' && v.length > 0) ||
    (typeof Element !== 'undefined' && v instanceof Element),
  object: v => v != null && typeof v === 'object' && !Array.isArray(v),
  array: v => Array.isArray(v),
  function: v => typeof v === 'function',
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function parseType(raw) {
  if (typeof raw !== 'string' || !raw) {
    throw new Error('schema: each entry must be a non-empty string');
  }
  const optional = raw.endsWith('?');
  const base = optional ? raw.slice(0, -1) : raw;
  return { base, optional };
}

function describe(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function check(name, schema, args) {
  if (!Array.isArray(schema)) return null;

  // Too many args
  if (args.length > schema.length) {
    return createError('E010', {
      name,
      index: schema.length,
      expected: 'no extra arguments',
      got: describe(args[schema.length]),
    });
  }

  for (let i = 0; i < schema.length; i++) {
    const { base, optional } = parseType(schema[i]);
    const value = args[i];

    if (value === undefined) {
      if (optional) continue;
      return createError('E010', {
        name,
        index: i,
        expected: base,
        got: 'undefined (missing)',
      });
    }

    const validator = VALIDATORS[base];
    if (!validator) {
      throw new Error(`schema: unknown type "${base}" in "${name}"`);
    }

    if (!validator(value)) {
      return createError('E010', {
        name,
        index: i,
        expected: base,
        got: describe(value),
      });
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

export function validate(name, schema, args) {
  const err = check(name, schema, args);
  if (err) throw err;
  return true;
}

// For interpreter use: returns an error object or null (never throws
// for schema mismatch; it throws only for programming errors in schema).
export function validateSafe(name, schema, args) {
  return check(name, schema, args);
}

// Extend allowed types at runtime (commands may add their own).
export function registerValidator(name, fn) {
  if (typeof name !== 'string' || typeof fn !== 'function') {
    throw new Error('registerValidator: invalid arguments');
  }
  VALIDATORS[name] = fn;
}