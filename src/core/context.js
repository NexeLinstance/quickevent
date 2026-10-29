// src/core/context.js
import { Reporter, consoleSink } from './reporter.js';
import { Registry } from './registry.js';

// ─────────────────────────────────────────────────────────────
// Scheduler
// Collects pending promises so "then" can await all of them.
// ─────────────────────────────────────────────────────────────

export class Scheduler {
  constructor() {
    this.pending = [];
  }

  push(promise) {
    if (promise instanceof Promise) {
      // Prevent unhandled rejection warnings; errors are handled upstream.
      this.pending.push(promise.catch(() => {}));
    }
  }

  async flush() {
    if (!this.pending.length) return;
    const list = this.pending;
    this.pending = [];
    await Promise.all(list);
  }

  clear() {
    this.pending = [];
  }
}

// ─────────────────────────────────────────────────────────────
// Context
// One object per execution (event fire, tick, loadDom).
// ─────────────────────────────────────────────────────────────

export function createContext(options = {}) {
  const {
    element = null,
    event = null,
    attribute = null,
    registry = null,
    reporter = null,
  } = options;

  const ctx = {
    // Execution target
    element,
    event,
    attribute,

    // Shared services
    registry: registry ?? new Registry([]),
    reporter: reporter ?? new Reporter({ sinks: [consoleSink] }),
    scheduler: new Scheduler(),

    // Execution state
    vars: {},              // alias store (from getters with alias, assignments)
    branch: { ran: false },// shared state for if/elif/else chain
    loop: null,            // set during "for"
    response: null,        // last AJAX response
    ok: true,              // last AJAX success flag
    statusCode: null,      // last AJAX status code
    statusMessage: null,   // last AJAX status message

    // Tick state (filled only inside a tick handler)
    tick: null,

    // ── Convenience API for command authors ──

    report(err, extra = {}) {
      this.reporter.report(err, {
        element: this.element,
        event: this.event,
        attribute: this.attribute,
        ...extra,
      });
    },

    resetBranch() {
      this.branch = { ran: false };
    },

        // ── DOM helpers (commands must not call document directly) ──
    dom: {
      query(selector) {
        if (selector instanceof Element) return [selector];
        if (typeof selector === 'string') return Array.from(document.querySelectorAll(selector));
        return [];
      },
      each(selector, fn, delay = 0) {
        const els = this.query(selector);
        if (delay > 0) {
          return new Promise(resolve => {
            setTimeout(() => {
              els.forEach(fn);
              resolve();
            }, delay);
          });
        }
        els.forEach(fn);
        return Promise.resolve();
      },
    },
    
    // Called by flow commands (if/elif/else) and "for"
    runBody(body, subContext = {}) {
      // Imported lazily to avoid circular dependency at module load time.
      return import('./interpreter.js').then(({ runEffects }) =>
        runEffects(body, { ...this, ...subContext })
      );
    },
  };

  return ctx;
}