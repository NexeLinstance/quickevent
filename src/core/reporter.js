// src/core/reporter.js
import { normalizeError } from './errors.js';

// ─────────────────────────────────────────────────────────────
// Sinks
// A sink is a function that receives a reported QEError.
// Sinks never throw; if they do, the reporter swallows it.
// ─────────────────────────────────────────────────────────────

export function consoleSink(error) {
  const label = `[QE ${error.code}] ${error.phase}`;

  // خط اصلی
  console.error(`${label} — ${error.message}`);

  // پیشنهاد (hint)
  if (error.hint) {
    console.info(`  hint: ${error.hint}`);
  }

  // کانتکست
  if (error.command) {
    console.info(`  command: "${error.command.name}" (index ${error.command.index})`);
  }
  if (error.element) {
    const el = error.element;
    console.info(`  element: <${el.tagName?.toLowerCase()}>`);
  }
  if (error.attribute) {
    console.info(`  attribute: ${error.attribute}`);
  }

  // خطای اصلی در صورت وجود
  if (error.cause) {
    console.groupCollapsed('  cause:');
    console.error(error.cause);
    console.groupEnd();
  }
}

export function memorySink(error) {
  // فقط برای تست: خطاها در آرایه‌ای روی window ذخیره می‌شوند
  if (typeof window !== 'undefined') {
    window.__QE_ERRORS__ = window.__QE_ERRORS__ || [];
    window.__QE_ERRORS__.push(error);
  }
}

// ─────────────────────────────────────────────────────────────
// Reporter
// ─────────────────────────────────────────────────────────────

export class Reporter {
  constructor({ sinks = [consoleSink], dedupWindow = 3000 } = {}) {
    this.sinks = sinks;
    this.dedupWindow = dedupWindow;
    this._seen = new Map(); // key → lastTimestamp
  }

  /**
   * 
   * @param {QEError|Error|unknown} err
   * @param {object} ctx  
   */
  report(err, ctx = {}) {
    const qeError = normalizeError(err, ctx);

    if (this._isDuplicate(qeError)) return;

    for (const sink of this.sinks) {
      try {
        sink(qeError);
      } catch (sinkErr) {
    
        console.warn('[QE] Sink failed:', sinkErr);
      }
    }
  }

  _isDuplicate(error) {
    const key = [
      error.code,
      error.command?.name ?? '',
      error.attribute ?? '',
      error.element?.id ?? '',
      error.element?.tagName ?? '',
    ].join('|');

    const now = Date.now();
    const last = this._seen.get(key);

    if (last != null && now - last < this.dedupWindow) {
      return true;
    }

    this._seen.set(key, now);
    return false;
  }

  clear() {
    this._seen.clear();
    if (typeof window !== 'undefined') {
      window.__QE_ERRORS__ = [];
    }
  }
}