// src/core/errors.js

// ─────────────────────────────────────────────────────────────
// Error code registry
// Each code knows: its phase, a message template, and a hint template.
// Templates receive the `details` object passed to createError.
// ─────────────────────────────────────────────────────────────

export const CODES = {
  // Dispatch
  E001: {
    phase: 'dispatch',
    message: ({ name }) => `Unknown command "${name}".`,
    hint: ({ suggestion }) =>
      suggestion
        ? `Did you mean "${suggestion}"?`
        : 'Check the command name for typos.',
  },

  // Parse
  E002: {
    phase: 'parse',
    message: ({ attribute }) => `Invalid JSON in "${attribute}" attribute.`,
    hint: 'Verify the attribute value is valid JSON (quotes, commas, brackets).',
  },
  E003: {
    phase: 'parse',
    message: ({ expr }) => `Invalid expression: "${expr}".`,
    hint: 'Check parentheses and operators.',
  },
  E004: {
    phase: 'parse',
    message: ({ position }) =>
      `Unexpected token in expression at position ${position}.`,
    hint: 'Review the expression around that position.',
  },
  E005: {
    phase: 'parse',
    message: () => 'Unexpected end of expression.',
    hint: 'A bracket, parenthesis, or quote is missing.',
  },

  // Resolve / validate
  E010: {
    phase: 'validate',
    message: ({ name, index, expected, got }) =>
      `Command "${name}": argument ${index + 1} must be ${expected}, got ${got}.`,
    hint: 'Check the command documentation for argument types.',
  },
  E011: {
    phase: 'resolve',
    message: ({ name }) =>
      `Command "${name}" cannot be used as an argument (it is not a source).`,
    hint: 'Only source-type commands (getText, getAttr, ajax, ...) can be nested.',
  },
  E012: {
    phase: 'resolve',
    message: ({ name }) => `Source command "${name}" failed to produce a value.`,
    hint: 'Check that the selector matches an element and that the value exists.',
  },

  // Flow
  E020: {
    phase: 'flow',
    message: () => '"elif" used without a preceding "if".',
    hint: 'An "elif" must follow an "if" that is still open.',
  },
  E021: {
    phase: 'flow',
    message: () => '"else" used without a preceding "if".',
    hint: 'An "else" must follow an "if" or "elif".',
  },
  E022: {
    phase: 'flow',
    message: () => 'Nested "if" is not supported.',
    hint: 'Refactor the conditions into a single "if" with "and"/"or", or use separate event attributes.',
  },

  // Security
  E030: {
    phase: 'security',
    message: ({ detail }) =>
      `Unsafe expression${detail ? `: ${detail}` : ''}.`,
    hint: 'Only whitelisted identifiers, operators, and functions are allowed.',
  },
  E031: {
    phase: 'security',
    message: ({ capability, name }) =>
      `Command "${name}" requires capability "${capability}" which is not allowed.`,
    hint: 'Enable the capability in the policy configuration.',
  },

  // Network
  E040: {
    phase: 'network',
    message: ({ url }) => `Request to "${url}" failed.`,
    hint: 'Check the URL and network connection.',
  },

  // Command runtime
  E050: {
    phase: 'execute',
    message: ({ name, cause }) =>
      `Command "${name}" failed: ${cause?.message ?? 'unknown error'}.`,
    hint: 'Check the command arguments and the target element.',
  },
};

// ─────────────────────────────────────────────────────────────
// QEError
// A single structured error type. Commands never build these
// directly — the interpreter/reporter does. But anyone may throw one.
// ─────────────────────────────────────────────────────────────

export class QEError extends Error {
  constructor(code, details = {}) {
    const entry = CODES[code];
    const message = entry
      ? entry.message(details)
      : `Unknown error code: ${code}`;

    super(message);

    this.name = 'QEError';
    this.code = code;
    this.phase = entry?.phase ?? 'unknown';
    this.hint = typeof entry?.hint === 'function'
  ? entry.hint(details)
  : entry?.hint ?? null;
    this.severity = details.severity ?? 'error';

    // Execution context (filled by the interpreter)
    this.command = details.command ?? null; // { name, index, args }
    this.element = details.element ?? null;
    this.attribute = details.attribute ?? null;
    this.event = details.event ?? null;
    this.cause = details.cause ?? null;

    // Raw details for custom handling
    this.details = details;
    this.timestamp = Date.now();
  }

  toJSON() {
    return {
      code: this.code,
      phase: this.phase,
      severity: this.severity,
      message: this.message,
      hint: this.hint,
      command: this.command
        ? { name: this.command.name, index: this.command.index }
        : null,
      element: this.element
        ? {
            tag: this.element.tagName?.toLowerCase(),
            id: this.element.id || null,
            classes: this.element.classList
              ? Array.from(this.element.classList)
              : [],
          }
        : null,
      attribute: this.attribute,
      event: this.event,
      cause: this.cause
        ? { message: this.cause.message, stack: this.cause.stack }
        : null,
      timestamp: this.timestamp,
    };
  }
}

// ─────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────

export function createError(code, details = {}) {
  return new QEError(code, details);
}

// ─────────────────────────────────────────────────────────────
// Normalize any thrown value into a QEError
// Preserves context fields if they were passed via ctx.
// ─────────────────────────────────────────────────────────────

export function normalizeError(err, ctx = {}) {
  if (err instanceof QEError) {
    if (ctx.command && !err.command) err.command = ctx.command;
    if (ctx.element && !err.element) err.element = ctx.element;
    if (ctx.attribute && !err.attribute) err.attribute = ctx.attribute;
    if (ctx.event && !err.event) err.event = ctx.event;
    return err;
  }

  return new QEError('E050', {
    name: ctx.command?.name ?? 'unknown',
    cause: err,
    command: ctx.command,
    element: ctx.element,
    attribute: ctx.attribute,
    event: ctx.event,
  });
}

// ─────────────────────────────────────────────────────────────
// nearMatch — Levenshtein-based suggestion for typos
// Returns the closest candidate, or null if nothing is close enough.
// ─────────────────────────────────────────────────────────────

export function nearMatch(input, candidates) {
  if (!input || !candidates?.length) return null;

  let best = null;
  let bestScore = Infinity;

  for (const candidate of candidates) {
    const d = levenshtein(input.toLowerCase(), candidate.toLowerCase());
    // Suggest only when the typo is small relative to the word
    if (d < bestScore && d <= Math.max(2, Math.floor(input.length / 3))) {
      best = candidate;
      bestScore = d;
    }
  }

  return best;
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1, // insert
        prev[j] + 1, // delete
        prev[j - 1] + cost // substitute
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}


