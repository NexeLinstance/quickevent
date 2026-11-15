// src/core/security.js

export const RESERVED_VARS = new Set([
  'response', 'status_code', 'status_message', 'content_type', 'index', 'tick',
]);

const BAD_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;

export const policy = {
  maxCallDepth: 32,
  allowedModuleOrigins: [],
};

export function configureSecurity(p = {}) {
  Object.assign(policy, p);
}

export function safeVarName(name) {
  const n = String(name);
  if (!IDENT.test(n) || BAD_KEYS.has(n)) {
    throw new Error(`invalid variable name: ${n}`);
  }
  return n;
}

export function setVar(ctx, name, val, { allowReserved = false } = {}) {
  const n = safeVarName(name);
  if (!allowReserved && RESERVED_VARS.has(n)) {
    throw new Error(`reserved variable: ${n}`);
  }
  ctx.vars[n] = val;
}