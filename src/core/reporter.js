// src/core/reporter.js
import { normalizeError } from './errors.js';

// ─────────────────────────────────────────────────────────────
// Sinks
// ─────────────────────────────────────────────────────────────

export function consoleSink(error) {
  const label = `[QE ${error.code}] ${error.phase}`;

  console.error(`${label} — ${error.message}`);

  if (error.hint) {
    console.info(`  hint: ${error.hint}`);
  }

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

  if (error.cause) {
    console.groupCollapsed('  cause:');
    console.error(error.cause);
    console.groupEnd();
  }
}

export function memorySink(error) {
  if (typeof window !== 'undefined') {
    window.__QE_ERRORS__ = window.__QE_ERRORS__ || [];
    window.__QE_ERRORS__.push(error);
  }
}

// ─────────────────────────────────────────────────────────────
// Reporter
// ─────────────────────────────────────────────────────────────

export class Reporter {
  constructor({ sinks = [consoleSink], dedupWindow = 3000, maxSeen = 1000 } = {}) {
    this.sinks = sinks;
    this.dedupWindow = dedupWindow;
    this.maxSeen = maxSeen;
    this._seen = new Map(); // key → lastTimestamp
    this._reportCount = 0;
  }

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

    this._reportCount++;
    // Clean up expired entries periodically, or when the map grows too large.
    if (this._reportCount % 100 === 0 || this._seen.size > this.maxSeen) {
      this._cleanup();
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

  _cleanup() {
    const cutoff = Date.now() - this.dedupWindow;
    for (const [key, timestamp] of this._seen) {
      if (timestamp < cutoff) {
        this._seen.delete(key);
      }
    }
  }

  clear() {
    this._seen.clear();
    this._reportCount = 0;
    if (typeof window !== 'undefined') {
      window.__QE_ERRORS__ = [];
    }
  }
}