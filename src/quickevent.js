// src/quickevent.js
import { version } from './version.js';
import './core/sanitize.js';
import { init } from './setup.js';

// Re-export public API.
export { version };
export { init };
export { Registry } from './core/registry.js';
export { Reporter, consoleSink, memorySink } from './core/reporter.js';
export { createContext, Scheduler } from './core/context.js';
export { configureSecurity, policy } from './core/security.js';
export { attachEvents } from './events/delegate.js';
export { parse as parseExpr } from './expr/parser.js';
export { evaluate as evaluateExpr } from './expr/evaluator.js';
export { renderTemplate } from './expr/template.js';

// Default export: the QE instance (available after init()).
let defaultInstance = null;

if (typeof window !== 'undefined') {
  // setup.js already auto-inits and sets window.QE.
  // We grab a reference for the default export.
  queueMicrotask(() => {
    defaultInstance = window.QE ?? null;
  });
}

export default {
  get version() { return version; },
  get instance() { return defaultInstance; },
  init,
};

console.log(
  `%c[QuickEvent] v${version} loaded.`,
  'color: #0f0; font-weight: bold;'
);