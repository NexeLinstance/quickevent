// src/core/registry.js
import { createError } from './errors.js';
import { nearMatch } from './errors.js';

// ─────────────────────────────────────────────────────────────
// Registry
// Keeps a Map of command descriptors by name.
// ─────────────────────────────────────────────────────────────

export class Registry {
  constructor(descriptors = []) {
    this._map = new Map();

    for (const desc of descriptors) {
      this.register(desc);
    }
  }

  /**
   * ثبت یک کامند.
   * descriptor باید حداقل name و kind داشته باشد.
   */
  register(desc) {
    if (!desc || typeof desc !== 'object') {
      throw new Error('Registry: descriptor must be an object');
    }

    if (typeof desc.name !== 'string' || !desc.name) {
      throw new Error('Registry: descriptor.name must be a non-empty string');
    }

    if (!['effect', 'source', 'flow', 'preflight'].includes(desc.kind)) {
      throw new Error(
        `Registry: "${desc.name}" has invalid kind "${desc.kind}" (must be effect|source|flow|preflight)`
      );
    }

    if (this._map.has(desc.name)) {
      throw new Error(`Registry: duplicate command "${desc.name}"`);
    }

    this._map.set(desc.name, desc);
  }

  has(name) {
    return this._map.has(name);
  }

  get(name) {
    return this._map.get(name) ?? null;
  }

  /**
   * گرفتن یک کامند یا پرتاب QEError با پیشنهاد نام درست.
   * این تابع جایی است که interpreter از آن استفاده می‌کند.
   */
  require(name, ctx = {}) {
    const desc = this._map.get(name);
    if (desc) return desc;

    const suggestion = nearMatch(name, [...this._map.keys()]);
    throw createError('E001', {
      name,
      suggestion,
      severity: 'error',
      ...ctx,
    });
  }

  names() {
    return [...this._map.keys()];
  }

  /**
   * برگرداندن همهٔ کامندهای یک kind (مثلاً همهٔ sourceها).
   * این تابع را بعداً در resolver استفاده می‌کنیم.
   */
  byKind(kind) {
    const out = [];
    for (const desc of this._map.values()) {
      if (desc.kind === kind) out.push(desc);
    }
    return out;
  }
}