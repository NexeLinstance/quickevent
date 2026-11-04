// src/core/security.js

export const policy = {
  allowedModuleOrigins: [],  // Default: same-origin only
  maxCallDepth: 32,
};

export function configureSecurity(p = {}) {
  Object.assign(policy, p);
}